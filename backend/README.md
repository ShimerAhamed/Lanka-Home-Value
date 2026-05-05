# LankaHomeValue Express Backend

This is the Node.js + Express backend for the LankaHomeValue house price prediction system. It receives house details from a React frontend, sends the data to the Python FastAPI ML service, returns the prediction result, and saves prediction history in MongoDB.

## Backend URL

```text
http://localhost:5000
```

## Required Services

Start these services before testing predictions:

1. MongoDB
2. FastAPI ML service
3. Express backend

## Environment Variables

The `.env` file contains:

```env
PORT=5000
PYTHON_API_URL=http://127.0.0.1:8000/predict
MONGO_URI=mongodb://127.0.0.1:27017/lankahomevalue
```

## Setup Commands

Open Windows PowerShell or the VS Code/PyCharm terminal:

```powershell
cd C:\Users\HP\LankaHomeValue\backend
npm install
```

## Run Order

First start the FastAPI ML API from the main project folder:

```powershell
cd C:\Users\HP\LankaHomeValue
uvicorn api:app --reload
```

Then start the Express backend from the backend folder:

```powershell
cd C:\Users\HP\LankaHomeValue\backend
npm run dev
```

For production-style running:

```powershell
npm start
```

## Routes

### Test Backend

```text
GET http://localhost:5000/
```

Response:

```json
{
  "message": "LankaHomeValue Express backend is running"
}
```

### System Health

```text
GET http://localhost:5000/api/health
```

Response:

```json
{
  "backend": "running",
  "pythonApi": "connected",
  "database": "connected"
}
```

If `pythonApi` is `not connected`, start FastAPI first.

If `database` is `not connected`, start MongoDB first.

### Predict House Price

```text
POST http://localhost:5000/api/predict
```

Example request body:

```json
{
  "district": "Colombo",
  "area": "Nugegoda",
  "perch": 10,
  "bedrooms": 3,
  "bathrooms": 2,
  "house_size_sqft": 1600,
  "property_type": "House",
  "condition": "Good",
  "furnishing_status": "Semi Furnished"
}
```

Example response:

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

### Get Prediction History

```text
GET http://localhost:5000/api/predictions
```

Returns all saved predictions from MongoDB, latest first.

### Delete Prediction History Record

```text
DELETE http://localhost:5000/api/predictions/:id
```

Replace `:id` with the MongoDB `_id` of the prediction record.
