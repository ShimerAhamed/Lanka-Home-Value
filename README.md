# LankaHomeValue - House Price Prediction System

LankaHomeValue is an AI-based house price prediction system for Sri Lanka. It trains machine learning regression models to predict `house_selling_price_lkr`, then exposes the trained model through a FastAPI endpoint that can be used by a React or MERN application.

## Technologies Used

- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib
- FastAPI
- Uvicorn
- Node.js
- Express.js
- MongoDB
- Mongoose
- React / MERN Stack integration

## Project Structure

```text
LankaHomeValue/
  dataset/
    Updated House Selling Dataset.csv

  models/
    house_price_model.pkl

  outputs/
    model_results.csv

  backend/
    server.js
    package.json
    routes/
    controllers/
    models/
    README.md

  frontend/
    package.json
    src/
    README.md

  api.py
  train_model.py
  test_prediction.py
  requirements.txt
  README.md
  .gitignore
```

Note: `models/`, `outputs/`, `.venv/`, `__pycache__/`, and `.pkl` files are ignored by Git because they are generated locally.

## Dataset

Place the dataset file in this location:

```text
C:\Users\HP\LankaHomeValue\dataset\Updated House Selling Dataset.csv
```

The training script also accepts:

```text
Updated House Selling Dataset(1).csv
```

The model predicts:

```text
house_selling_price_lkr
```

These columns are not used as input features because they can cause data leakage:

```text
house_selling_price_lkr
price_lkr
price_per_perch
```

## How to Run on Windows PowerShell

Open PowerShell or the PyCharm terminal inside the project folder:

```powershell
cd C:\Users\HP\LankaHomeValue
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Train the machine learning model:

```powershell
python train_model.py
```

Test a sample prediction:

```powershell
python test_prediction.py
```

Run the FastAPI backend:

```powershell
uvicorn api:app --reload
```

Check the API in the browser:

```text
http://127.0.0.1:8000
```

Prediction endpoint:

```text
POST http://127.0.0.1:8000/predict
```

Run the Express backend in a second terminal:

```powershell
cd C:\Users\HP\LankaHomeValue\backend
npm install
npm run dev
```

If PowerShell blocks `npm`, use `npm.cmd install` and `npm.cmd run dev`.

Express backend URL:

```text
http://localhost:5000
```

React should call this Express endpoint:

```text
POST http://localhost:5000/api/predict
```

Prediction history endpoint:

```text
GET http://localhost:5000/api/predictions
```

Run the React frontend in a third terminal:

```powershell
cd C:\Users\HP\LankaHomeValue\frontend
npm install
npm run dev
```

If PowerShell blocks `npm`, use `npm.cmd install` and `npm.cmd run dev`.

Frontend URL:

```text
http://localhost:5173
```

Example API response:

```json
{
  "predicted_price_lkr": 45000000,
  "price_category": "High"
}
```

## Price Categories

- Below 10,000,000 LKR: Low
- 10,000,000 to 30,000,000 LKR: Medium
- 30,000,000 to 60,000,000 LKR: High
- Above 60,000,000 LKR: Premium

## Upload to GitHub

Repository:

```text
https://github.com/ShabeehaSarook/House-Prise
```

Use these commands in Windows PowerShell:

```powershell
cd C:\Users\HP\LankaHomeValue

git init
git branch -M main
git remote add origin https://github.com/ShabeehaSarook/House-Prise.git

git add .
git commit -m "Initial commit for LankaHomeValue"
git push -u origin main
```

If the remote already exists, use:

```powershell
git remote set-url origin https://github.com/ShabeehaSarook/House-Prise.git
git push -u origin main
```
