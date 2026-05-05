# Deployment Guide - LankaHomeValue

This guide explains how to prepare and deploy the LankaHomeValue system.

## Deployment Architecture

```text
Netlify/Vercel React Frontend
        |
        v
Render/Railway Express Backend
        |
        v
Render FastAPI ML API
        |
        v
models/house_price_model.pkl

MongoDB Atlas stores prediction history.
```

## 1. Frontend Deployment

Frontend folder:

```text
frontend/
```

Build locally:

```powershell
cd C:\Users\HP\LankaHomeValue\frontend
npm install
npm run build
```

The production build is created in:

```text
frontend/dist
```

### Deploy Frontend on Netlify

Recommended Netlify settings:

```text
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

If Netlify asks for publish directory relative to the base directory, use:

```text
dist
```

Environment variable:

```env
VITE_API_BASE_URL=https://your-express-backend.onrender.com/api
```

The file `frontend/public/_redirects` is included so React Router pages work after refresh.

### Deploy Frontend on Vercel

Recommended Vercel settings:

```text
Root directory: frontend
Build command: npm run build
Output directory: dist
```

Environment variable:

```env
VITE_API_BASE_URL=https://your-express-backend.onrender.com/api
```

The file `frontend/vercel.json` is included so React Router routes work correctly.

## 2. Express Backend Deployment

Backend folder:

```text
backend/
```

Local production test:

```powershell
cd C:\Users\HP\LankaHomeValue\backend
npm install
npm start
```

### Deploy Express Backend on Render

Recommended Render settings:

```text
Service type: Web Service
Root directory: backend
Build command: npm install
Start command: npm start
```

Environment variables:

```env
PORT=5000
PYTHON_API_URL=https://your-fastapi-api.onrender.com/predict
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/lankahomevalue?retryWrites=true&w=majority
CLIENT_URL=https://your-frontend-url.netlify.app
```

If using Vercel instead of Netlify, set `CLIENT_URL` to your Vercel frontend URL.

### Deploy Express Backend on Railway

Recommended Railway settings:

```text
Root directory: backend
Install command: npm install
Start command: npm start
```

Add the same environment variables shown above.

## 3. FastAPI ML API Deployment

FastAPI files are in:

```text
ml-api/
```

Local production test:

```powershell
cd C:\Users\HP\LankaHomeValue
cd ml-api
uvicorn api:app --host 0.0.0.0 --port 8000
```

### Deploy FastAPI on Render

Recommended Render settings:

```text
Service type: Web Service
Root directory: ml-api
Build command: pip install -r requirements.txt
Start command: uvicorn api:app --host 0.0.0.0 --port $PORT
```

Optional environment variable:

```env
CORS_ORIGINS=https://your-frontend-url.netlify.app,https://your-express-backend.onrender.com
```

Important:

- The deployed FastAPI service must be able to access `models/house_price_model.pkl`.
- If `models/` is ignored by Git, either temporarily include the model file for deployment or upload the model through your deployment platform.
- For final demonstration, local deployment is acceptable if cloud deployment is not required by the university.

Health check:

```text
GET https://your-fastapi-api.onrender.com/health
```

Expected:

```json
{
  "api": "running",
  "model": "loaded"
}
```

## 4. MongoDB Atlas Setup

Use MongoDB Atlas for the cloud database.

Basic steps:

1. Create a MongoDB Atlas account.
2. Create a free cluster.
3. Create a database user.
4. Allow network access for your deployment platform.
5. Copy the connection string.
6. Add the connection string to backend environment variables.

Example MongoDB Atlas URI:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/lankahomevalue?retryWrites=true&w=majority
```

Do not commit the real username and password to GitHub.

## 5. Deployment Checklist

- React build works with `npm run build`.
- Frontend `VITE_API_BASE_URL` points to deployed Express backend.
- Express `PYTHON_API_URL` points to deployed FastAPI `/predict`.
- Express `MONGO_URI` points to MongoDB Atlas.
- Express `CLIENT_URL` points to deployed frontend.
- FastAPI has `models/house_price_model.pkl`.
- FastAPI `/health` returns model loaded.
- Express `/api/health` returns Python API and database connected.
- React prediction form returns a prediction.
- Prediction history is saved in MongoDB Atlas.

## Official Deployment References

- Netlify Vite documentation: https://docs.netlify.com/frameworks/vite/
- Vercel Vite documentation: https://vercel.com/docs/frameworks/frontend/vite
- Render FastAPI documentation: https://render.com/docs/deploy-fastapi
- Render Express documentation: https://render.com/docs/deploy-node-express-app
- Railway Express guide: https://docs.railway.com/guides/express
- MongoDB Atlas connection strings: https://www.mongodb.com/docs/current/reference/connection-string/
