from pathlib import Path
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd
from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


# ------------------------------------------------------------
# How to run this API in Windows PowerShell or PyCharm terminal:
#
#   cd C:\Users\HP\LankaHomeValue
#   uvicorn api:app --reload
#
# Example JSON input for POST /predict:
#
# {
#   "district": "Colombo",
#   "area": "Nugegoda",
#   "perch": 10,
#   "bedrooms": 3,
#   "bathrooms": 2,
#   "kitchen_area_sqft": 180,
#   "parking_spots": 1,
#   "has_garden": "Yes",
#   "has_ac": "Yes",
#   "water_supply": "Yes",
#   "electricity": "Yes",
#   "floors": 1,
#   "year_built": 2015,
#   "nearest_city": "Colombo",
#   "property_type": "House",
#   "house_size_sqft": 1600,
#   "house_age": 9,
#   "condition": "Good",
#   "furnishing_status": "Semi Furnished",
#   "road_access_width_ft": 20,
#   "distance_to_main_road_km": 0.5,
#   "distance_to_town_km": 3,
#   "has_boundary_wall": "Yes",
#   "has_servant_room": "No",
#   "has_hot_water": "Yes",
#   "has_security": "No",
#   "roof_type": "Tile",
#   "floor_type": "Tile",
#   "listed_year": 2026,
#   "bathroom_bedroom_ratio": 0.67,
#   "luxury_score": 4,
#   "location_category": "Urban"
# }
# ------------------------------------------------------------


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "house_price_model.pkl"

app = FastAPI(
    title="LankaHomeValue API",
    description="AI-Based House Price Prediction API for Sri Lanka",
    version="1.0.0",
)

# This allows a React frontend, such as http://localhost:3000 or http://localhost:5173,
# to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_price_category(price_lkr: float) -> str:
    """Convert the predicted price into a simple category."""
    if price_lkr < 10_000_000:
        return "Low"
    if price_lkr <= 30_000_000:
        return "Medium"
    if price_lkr <= 60_000_000:
        return "High"
    return "Premium"


def load_model():
    """Load the trained machine learning model from the models folder."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError("Model file not found. Please run python train_model.py first.")

    return joblib.load(MODEL_PATH)


def get_model_columns(model):
    """
    Read the feature columns saved during training.
    These are the exact columns the model expects for prediction.
    """
    metadata = getattr(model, "lankahomevalue_metadata_", {})
    feature_columns = metadata.get("feature_columns")

    if not feature_columns:
        feature_columns = list(getattr(model, "feature_names_in_", []))

    if not feature_columns:
        raise ValueError(
            "Could not find the training feature columns in the model. "
            "Please retrain the model using python train_model.py."
        )

    numerical_columns = metadata.get("numerical_columns", [])
    categorical_columns = metadata.get("categorical_columns", [])

    return feature_columns, numerical_columns, categorical_columns


def create_input_dataframe(input_data: Dict[str, Any], model) -> pd.DataFrame:
    """
    Convert JSON input into a pandas DataFrame with the same columns used in training.
    Missing fields are set to np.nan, then the model pipeline handles them using SimpleImputer.
    Extra fields from the frontend are ignored.
    """
    feature_columns, numerical_columns, categorical_columns = get_model_columns(model)

    row = {}
    for column in feature_columns:
        value = input_data.get(column, np.nan)

        # Empty strings should be treated as missing values.
        if value == "":
            value = np.nan

        row[column] = value

    input_df = pd.DataFrame([row], columns=feature_columns)

    # Convert expected numerical columns safely.
    # If a value cannot be converted, it becomes NaN and the imputer handles it.
    for column in numerical_columns:
        if column in input_df.columns:
            input_df[column] = pd.to_numeric(input_df[column], errors="coerce")

    # Convert missing categorical values to NaN so SimpleImputer can fill them.
    for column in categorical_columns:
        if column in input_df.columns:
            input_df[column] = input_df[column].replace({None: np.nan})

    return input_df


@app.get("/")
def home():
    """Simple route to check whether the API is running."""
    return {"message": "LankaHomeValue API is running"}


@app.get("/health")
def health_check():
    """Health route for checking whether FastAPI and the trained model are ready."""
    model_status = "loaded" if MODEL_PATH.exists() else "not loaded"

    return {
        "api": "running",
        "model": model_status,
    }


@app.post("/predict")
def predict_price(input_data: Any = Body(...)):
    """
    Receive house details as JSON, predict the selling price in LKR,
    and return the predicted price with a price category.
    """
    if not isinstance(input_data, dict) or not input_data:
        raise HTTPException(
            status_code=400,
            detail="Invalid input. Please send house details as a JSON object.",
        )

    try:
        model = load_model()
        input_df = create_input_dataframe(input_data, model)
        predicted_price = float(model.predict(input_df)[0])
        rounded_price = round(predicted_price)

        return {
            "predicted_price_lkr": rounded_price,
            "price_category": get_price_category(predicted_price),
        }

    except FileNotFoundError as error:
        raise HTTPException(status_code=500, detail=str(error))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed. Please check the input data. Error: {error}",
        )
