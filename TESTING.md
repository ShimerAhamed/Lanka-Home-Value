# LankaHomeValue Testing Guide

Use this guide to test the full system before the final demonstration.

## Test Order

Start services in this order:

1. MongoDB
2. FastAPI ML API
3. Express backend
4. React frontend

## Startup Commands

Terminal 1:

```powershell
cd C:\Users\HP\LankaHomeValue
uvicorn api:app --reload
```

Terminal 2:

```powershell
cd C:\Users\HP\LankaHomeValue\backend
npm run dev
```

Terminal 3:

```powershell
cd C:\Users\HP\LankaHomeValue\frontend
npm run dev
```

If PowerShell blocks `npm`, use `npm.cmd run dev`.

## Health Checks

### FastAPI Health

Browser or Postman:

```text
GET http://127.0.0.1:8000/health
```

Expected result:

```json
{
  "api": "running",
  "model": "loaded"
}
```

If `model` is `not loaded`, run:

```powershell
python train_model.py
```

### Express Health

Browser or Postman:

```text
GET http://localhost:5000/api/health
```

Expected result:

```json
{
  "backend": "running",
  "pythonApi": "connected",
  "database": "connected"
}
```

If `pythonApi` is `not connected`, start FastAPI.

If `database` is `not connected`, start MongoDB.

## FastAPI Prediction Test

Postman:

```text
POST http://127.0.0.1:8000/predict
```

Body type: raw JSON

```json
{
  "district": "Colombo",
  "area": "Nugegoda",
  "perch": 10,
  "bedrooms": 3,
  "bathrooms": 2,
  "kitchen_area_sqft": 180,
  "parking_spots": 1,
  "has_garden": "Yes",
  "has_ac": "Yes",
  "water_supply": "Yes",
  "electricity": "Yes",
  "floors": 1,
  "year_built": 2015,
  "nearest_city": "Colombo",
  "property_type": "House",
  "house_size_sqft": 1600,
  "house_age": 9,
  "condition": "Good",
  "furnishing_status": "Semi Furnished",
  "road_access_width_ft": 20,
  "distance_to_main_road_km": 0.5,
  "distance_to_town_km": 3,
  "has_boundary_wall": "Yes",
  "has_servant_room": "No",
  "has_hot_water": "Yes",
  "has_security": "No",
  "roof_type": "Tile",
  "floor_type": "Tile",
  "listed_year": 2026,
  "bathroom_bedroom_ratio": 0.67,
  "luxury_score": 4,
  "location_category": "Urban"
}
```

Expected result:

```json
{
  "predicted_price_lkr": 45000000,
  "price_category": "High"
}
```

The exact predicted price can be different depending on the trained model.

## Express Prediction Test

Postman:

```text
POST http://localhost:5000/api/predict
```

Use the same JSON body from the FastAPI test.

Expected result:

```json
{
  "success": true,
  "message": "Prediction completed successfully",
  "data": {
    "predicted_price_lkr": 45000000,
    "price_category": "High"
  }
}
```

The request should also save one record in MongoDB.

## React Browser Test

Open:

```text
http://localhost:5173
```

What to test:

- Home page loads.
- Navigation links work.
- Prediction form shows validation messages for missing fields.
- Negative numeric values show validation messages.
- Year Built outside 1900 to current year shows a validation message.
- Submit valid data and check the predicted price.
- Prediction result shows LKR formatting and a category badge.
- Prediction result shows the valuation disclaimer.
- History page loads saved records latest first.
- Refresh button reloads history.
- Delete button removes one history record.
- About page explains the architecture.

## Common Errors and Fixes

### React shows backend error

Message:

```text
Backend is not running. Please start the Express backend first.
```

Fix:

```powershell
cd C:\Users\HP\LankaHomeValue\backend
npm run dev
```

### Express says FastAPI is not running

Message:

```text
Prediction service is not running. Please start FastAPI first.
```

Fix:

```powershell
cd C:\Users\HP\LankaHomeValue
uvicorn api:app --reload
```

### Express says MongoDB is not connected

Message:

```text
MongoDB is not connected. Please start MongoDB first.
```

Fix: start MongoDB locally, then reload the backend.

### FastAPI says model file not found

Message:

```text
Model file not found. Please run python train_model.py first.
```

Fix:

```powershell
cd C:\Users\HP\LankaHomeValue
python train_model.py
```

### PowerShell blocks npm

Message:

```text
npm.ps1 cannot be loaded because running scripts is disabled
```

Fix:

```powershell
npm.cmd install
npm.cmd run dev
```

## Final Demonstration Checklist

- MongoDB is running.
- FastAPI health route returns model loaded.
- Express health route returns Python API and database connected.
- React frontend opens at `http://localhost:5173`.
- Prediction form validates bad inputs.
- Valid prediction returns price and category.
- Prediction history saves and displays records.
- Delete history works.
- Screenshots are added to the project report.
