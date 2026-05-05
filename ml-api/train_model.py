from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeRegressor


# Project paths.
# This file lives inside ml-api, while dataset/models/outputs live in the main
# LankaHomeValue project folder.
ML_API_DIR = Path(__file__).resolve().parent
PROJECT_DIR = ML_API_DIR.parent
DATASET_DIR = PROJECT_DIR / "dataset"
MODELS_DIR = PROJECT_DIR / "models"
OUTPUTS_DIR = PROJECT_DIR / "outputs"
DATASET_FILENAMES = [
    "Updated House Selling Dataset.csv",
    "Updated House Selling Dataset(1).csv",
]
MODEL_PATH = MODELS_DIR / "house_price_model.pkl"
RESULTS_PATH = OUTPUTS_DIR / "model_results.csv"

# Prediction target and columns that must not be used as model inputs
TARGET_COLUMN = "house_selling_price_lkr"
LEAKAGE_COLUMNS = ["house_selling_price_lkr", "price_lkr", "price_per_perch"]
BEST_R2_CLOSE_TOLERANCE = 0.001


def find_dataset_path():
    """Find the dataset using the preferred filename or the older alternate filename."""
    for filename in DATASET_FILENAMES:
        dataset_path = DATASET_DIR / filename
        if dataset_path.exists():
            return dataset_path

    return None


def clean_numeric_series(series):
    """
    Convert a column to numeric values.
    This also handles values such as "Rs. 25,000,000" or "25,000,000".
    """
    if pd.api.types.is_numeric_dtype(series):
        return series

    cleaned = (
        series.astype(str)
        .str.replace(",", "", regex=False)
        .str.replace(r"[^0-9.\-]", "", regex=True)
    )
    cleaned = cleaned.mask(cleaned == "", np.nan)
    cleaned = cleaned.mask(cleaned.str.lower() == "nan", np.nan)

    return pd.to_numeric(cleaned, errors="coerce")


def convert_numeric_like_columns(dataframe):
    """
    Some CSV numeric columns may be loaded as text because of commas or symbols.
    This function converts text columns to numeric only when most values look numeric.
    """
    converted_dataframe = dataframe.copy()

    for column in converted_dataframe.columns:
        if converted_dataframe[column].dtype == "object":
            original_non_missing = converted_dataframe[column].notna().sum()

            if original_non_missing == 0:
                continue

            numeric_values = clean_numeric_series(converted_dataframe[column])
            numeric_ratio = numeric_values.notna().sum() / original_non_missing

            if numeric_ratio >= 0.80:
                converted_dataframe[column] = numeric_values

    return converted_dataframe


def create_one_hot_encoder():
    """
    Create OneHotEncoder in a way that works with both newer and older
    scikit-learn versions.
    """
    try:
        return OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    except TypeError:
        return OneHotEncoder(handle_unknown="ignore", sparse=False)


def build_preprocessor(numerical_columns, categorical_columns):
    """Create preprocessing steps for numerical and categorical features."""
    transformers = []

    if numerical_columns:
        numerical_transformer = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]
        )
        transformers.append(("numerical", numerical_transformer, numerical_columns))

    if categorical_columns:
        categorical_transformer = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", create_one_hot_encoder()),
            ]
        )
        transformers.append(("categorical", categorical_transformer, categorical_columns))

    return ColumnTransformer(transformers=transformers, remainder="drop")


def calculate_rmse(y_true, y_pred):
    """Calculate RMSE in a way that works across scikit-learn versions."""
    try:
        return mean_squared_error(y_true, y_pred, squared=False)
    except TypeError:
        return np.sqrt(mean_squared_error(y_true, y_pred))


def main():
    # Create project folders automatically if they do not already exist.
    DATASET_DIR.mkdir(parents=True, exist_ok=True)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

    dataset_path = find_dataset_path()

    if dataset_path is None:
        print(
            "Dataset file not found. Please place "
            "Updated House Selling Dataset.csv inside the dataset folder."
        )
        print(f"Expected folder: {DATASET_DIR}")
        return

    print(f"Using dataset file: {dataset_path}")

    # Load dataset.
    try:
        df = pd.read_csv(dataset_path)
    except Exception as error:
        print("Could not read the dataset file.")
        print(f"File location: {dataset_path}")
        print(f"Error: {error}")
        return

    print("Dataset shape:", df.shape)
    print("Column names:")
    print(list(df.columns))

    if TARGET_COLUMN not in df.columns:
        print(f"Target column '{TARGET_COLUMN}' was not found in the dataset.")
        print("Please check the CSV column names and run the script again.")
        return

    # Clean target values and remove rows where the target is missing.
    df[TARGET_COLUMN] = clean_numeric_series(df[TARGET_COLUMN])
    df = df.dropna(subset=[TARGET_COLUMN]).copy()

    if len(df) < 2:
        print("The dataset must contain at least 2 rows with valid target values.")
        return

    # Remove data leakage columns from the input features.
    columns_to_remove = [column for column in LEAKAGE_COLUMNS if column in df.columns]
    X = df.drop(columns=columns_to_remove)
    y = df[TARGET_COLUMN]

    if X.empty:
        print("No input feature columns are available after removing leakage columns.")
        return

    # Convert numeric-looking text columns before detecting column types.
    X = convert_numeric_like_columns(X)

    # Automatically detect numerical and categorical columns.
    numerical_columns = X.select_dtypes(include=["number"]).columns.tolist()
    categorical_columns = X.select_dtypes(exclude=["number"]).columns.tolist()

    print("\nTarget column:", TARGET_COLUMN)
    print("Removed leakage columns:", columns_to_remove)
    print("Numerical columns:", numerical_columns)
    print("Categorical columns:", categorical_columns)

    # Split data into training and testing sets.
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )

    models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree Regressor": DecisionTreeRegressor(random_state=42),
        "Random Forest Regressor": RandomForestRegressor(
            n_estimators=200,
            random_state=42,
            n_jobs=1,
        ),
        "Gradient Boosting Regressor": GradientBoostingRegressor(random_state=42),
    }

    results = []
    trained_pipelines = {}

    for model_name, regressor in models.items():
        print(f"\nTraining {model_name}...")

        pipeline = Pipeline(
            steps=[
                ("preprocessor", build_preprocessor(numerical_columns, categorical_columns)),
                ("model", regressor),
            ]
        )

        pipeline.fit(X_train, y_train)
        predictions = pipeline.predict(X_test)

        mae = mean_absolute_error(y_test, predictions)
        rmse = calculate_rmse(y_test, predictions)
        r2 = r2_score(y_test, predictions)

        results.append(
            {
                "model": model_name,
                "mae": mae,
                "rmse": rmse,
                "r2_score": r2,
            }
        )
        trained_pipelines[model_name] = pipeline

        print(f"MAE: {mae:,.2f}")
        print(f"RMSE: {rmse:,.2f}")
        print(f"R2 Score: {r2:.4f}")

    # Select the best model using highest R2 score.
    # If models are very close in R2, choose the one with lower RMSE.
    results_df = pd.DataFrame(results)
    results_df["r2_for_sorting"] = results_df["r2_score"].fillna(-np.inf)
    best_r2_score = results_df["r2_for_sorting"].max()
    close_models_df = results_df[
        results_df["r2_for_sorting"] >= best_r2_score - BEST_R2_CLOSE_TOLERANCE
    ]
    best_row = close_models_df.sort_values(
        by=["rmse", "r2_for_sorting"],
        ascending=[True, False],
    ).iloc[0]

    results_df = results_df.sort_values(
        by=["r2_for_sorting", "rmse"],
        ascending=[False, True],
    ).drop(columns=["r2_for_sorting"])

    best_model_name = best_row["model"]
    best_pipeline = trained_pipelines[best_model_name]

    # Store useful metadata with the pipeline for test_prediction.py.
    best_pipeline.lankahomevalue_metadata_ = {
        "feature_columns": X.columns.tolist(),
        "numerical_columns": numerical_columns,
        "categorical_columns": categorical_columns,
        "target_column": TARGET_COLUMN,
        "best_model_name": best_model_name,
    }

    # Save results and the best model.
    results_df.to_csv(RESULTS_PATH, index=False)
    joblib.dump(best_pipeline, MODEL_PATH)

    print("\nModel comparison:")
    print(results_df)
    print(f"\nBest model: {best_model_name}")
    print(f"Saved best model to: {MODEL_PATH}")
    print(f"Saved model results to: {RESULTS_PATH}")


if __name__ == "__main__":
    main()
