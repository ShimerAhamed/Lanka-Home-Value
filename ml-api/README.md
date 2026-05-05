# LankaHomeValue ML API

This folder contains the Python FastAPI machine learning API and model training scripts.

## Files

- `api.py` - FastAPI prediction API
- `train_model.py` - trains and saves the best model
- `test_prediction.py` - tests a sample prediction using the saved model
- `requirements.txt` - Python packages

## Run Locally

```powershell
cd C:\Users\HP\LankaHomeValue\ml-api
pip install -r requirements.txt
python train_model.py
uvicorn api:app --reload
```

The API uses the trained model from:

```text
C:\Users\HP\LankaHomeValue\models\house_price_model.pkl
```
