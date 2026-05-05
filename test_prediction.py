from pathlib import Path

import joblib
import numpy as np
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "house_price_model.pkl"


def get_price_category(price_lkr):
    """Return a simple price category for the predicted house price."""
    if price_lkr < 10_000_000:
        return "Low"
    if price_lkr <= 30_000_000:
        return "Medium"
    if price_lkr <= 60_000_000:
        return "High"
    return "Premium"


def sample_numerical_value(column_name):
    """
    Give realistic sample numeric values for common Sri Lankan house columns.
    Unknown numeric columns use np.nan so the trained median imputer can fill them.
    """
    column = column_name.lower()

    if "bed" in column:
        return 3
    if "bath" in column or "toilet" in column:
        return 2
    if "room" in column:
        return 4
    if "floor" in column or "storey" in column or "story" in column:
        return 1
    if "parking" in column or "garage" in column:
        return 1
    if "perch" in column or "land" in column:
        return 10
    if "sqft" in column or "square" in column or "area" in column:
        return 1600
    if "year" in column:
        return 2015
    if "age" in column:
        return 8
    if "distance" in column:
        return 5
    if "latitude" in column or column == "lat":
        return 6.9271
    if "longitude" in column or column in ["lon", "lng"]:
        return 79.8612

    return np.nan


def sample_categorical_value(column_name):
    """
    Give realistic sample text values for common Sri Lankan house columns.
    Unknown categories use 'Unknown'; OneHotEncoder handles unseen values safely.
    """
    column = column_name.lower()

    if "district" in column:
        return "Colombo"
    if "city" in column or "town" in column or "location" in column or "address" in column:
        return "Colombo"
    if "province" in column:
        return "Western"
    if "type" in column:
        return "House"
    if "condition" in column:
        return "Good"
    if "furnish" in column:
        return "Semi Furnished"
    if "road" in column or "access" in column:
        return "Main Road"

    return "Unknown"


def create_sample_input(model):
    """Create a one-row input DataFrame using the same feature columns used in training."""
    metadata = getattr(model, "lankahomevalue_metadata_", {})

    feature_columns = metadata.get("feature_columns")
    numerical_columns = metadata.get("numerical_columns", [])
    categorical_columns = metadata.get("categorical_columns", [])

    if not feature_columns:
        feature_columns = list(getattr(model, "feature_names_in_", []))

    if not feature_columns:
        print(
            "Could not find saved feature columns in the model. "
            "Please train the model again using python train_model.py."
        )
        return None

    sample_data = {}

    for column in feature_columns:
        if column in numerical_columns:
            sample_data[column] = sample_numerical_value(column)
        elif column in categorical_columns:
            sample_data[column] = sample_categorical_value(column)
        else:
            sample_data[column] = sample_categorical_value(column)

    return pd.DataFrame([sample_data], columns=feature_columns)


def main():
    if not MODEL_PATH.exists():
        print("Model file not found. Please run python train_model.py first.")
        print(f"Expected location: {MODEL_PATH}")
        return

    try:
        model = joblib.load(MODEL_PATH)
    except Exception as error:
        print("Could not load the saved model file.")
        print(f"File location: {MODEL_PATH}")
        print(f"Error: {error}")
        return

    sample_input = create_sample_input(model)
    if sample_input is None:
        return

    predicted_price = float(model.predict(sample_input)[0])
    price_category = get_price_category(predicted_price)

    print("Sample input used for prediction:")
    print(sample_input)
    print(f"\nPredicted house selling price: LKR {predicted_price:,.2f}")
    print(f"Price category: {price_category}")


if __name__ == "__main__":
    main()
