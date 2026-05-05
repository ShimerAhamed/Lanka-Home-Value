# LankaHomeValue React Frontend

This is the React frontend for the LankaHomeValue house price prediction system. It sends prediction requests to the Express backend at `http://localhost:5000/api`.

## Required Running Services

Start the services in this order:

1. FastAPI ML API
2. Express backend
3. React frontend

## Run FastAPI

Open PowerShell in the main project folder:

```powershell
cd C:\Users\HP\LankaHomeValue
uvicorn api:app --reload
```

## Run Express Backend

Open a second PowerShell terminal:

```powershell
cd C:\Users\HP\LankaHomeValue\backend
npm install
npm run dev
```

If PowerShell says `npm.ps1 cannot be loaded because running scripts is disabled`, use `npm.cmd install` and `npm.cmd run dev`.

## Run React Frontend

Open a third PowerShell terminal:

```powershell
cd C:\Users\HP\LankaHomeValue\frontend
npm install
npm run dev
```

If PowerShell says `npm.ps1 cannot be loaded because running scripts is disabled`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## Pages

- Home
- Predict House Price
- Prediction History
- About

## Frontend Features

- Required field validation before prediction
- Positive number validation for numeric fields
- Realistic Year Built validation
- Clear backend connection error messages
- LKR price formatting with commas
- Price category badge
- Prediction disclaimer
- Prediction history refresh and delete controls

## API Endpoints Used

```text
GET http://localhost:5000/api/health
POST http://localhost:5000/api/predict
GET http://localhost:5000/api/predictions
DELETE http://localhost:5000/api/predictions/:id
```
