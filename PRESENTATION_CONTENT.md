# PowerPoint Slide Content - LankaHomeValue

Use this content to create the final presentation slides.

## Slide 1 - Title Slide

Title:

```text
LankaHomeValue
AI-Based House Price Prediction System for Sri Lanka
```

Content:

- Final Year Project
- Student Name: [Your Name]
- Registration Number: [Your Registration Number]
- Supervisor: [Supervisor Name]
- Department: [Department Name]
- University: [University Name]

Speaker notes:

Introduce the project as a machine learning web application that predicts Sri Lankan house selling prices.

## Slide 2 - Introduction

- Real estate prices in Sri Lanka vary based on location, land size, house size, facilities, and condition.
- Buyers and sellers often need a quick estimate before making decisions.
- LankaHomeValue provides an AI-based estimated house selling price in Sri Lankan Rupees.

Speaker notes:

Explain that the system supports decision-making by providing a data-driven estimated price.

## Slide 3 - Problem Statement

- House price estimation is difficult without market knowledge.
- Manual valuation can be time-consuming and costly.
- Online property prices may be inconsistent.
- Users need a simple system to estimate house selling price using house features.

Speaker notes:

State clearly that the project does not replace official valuation, but provides an estimated prediction.

## Slide 4 - Objectives

- Build a machine learning model to predict `house_selling_price_lkr`.
- Develop a React frontend for users to enter house details.
- Create an Express backend to manage API requests and prediction history.
- Create a FastAPI service to serve the trained ML model.
- Store prediction history in MongoDB.

## Slide 5 - System Architecture Diagram

Diagram:

```text
User
  |
  v
React Frontend
  |
  v
Express Backend
  |
  v
FastAPI ML API
  |
  v
Trained ML Model

MongoDB stores prediction history from Express Backend.
```

Speaker notes:

Explain each layer and why the system is separated into frontend, backend, ML API, and database.

## Slide 6 - Technologies Used

- React and Vite: frontend user interface
- Node.js and Express: backend API
- FastAPI: Python ML prediction API
- MongoDB and Mongoose: prediction history database
- Scikit-learn: model training
- Pandas and NumPy: data processing
- Joblib: save and load trained model

Project folders:

- `frontend`: React application
- `backend`: Express API and MongoDB history
- `ml-api`: FastAPI and machine learning scripts

## Slide 7 - Dataset Description

- Dataset file: `Updated House Selling Dataset.csv`
- Target column: `house_selling_price_lkr`
- Input features include:
  - district
  - area
  - perch
  - bedrooms
  - bathrooms
  - house size
  - facilities
  - condition
  - location category
- Leakage columns removed:
  - `house_selling_price_lkr`
  - `price_lkr`
  - `price_per_perch`

## Slide 8 - Machine Learning Models Used

- Linear Regression
- Decision Tree Regressor
- Random Forest Regressor
- Gradient Boosting Regressor

Preprocessing:

- Missing numerical values filled with median
- Missing categorical values filled with most frequent value
- Numerical features scaled using StandardScaler
- Categorical features encoded using OneHotEncoder
- Pipeline and ColumnTransformer used

## Slide 9 - Model Evaluation Results

| Model | MAE | RMSE | R2 Score |
|---|---:|---:|---:|
| Gradient Boosting Regressor | 2,566,958.40 | 4,538,167.73 | 0.9671 |
| Random Forest Regressor | 2,239,615.16 | 4,604,969.46 | 0.9661 |
| Decision Tree Regressor | 3,702,158.50 | 7,009,480.77 | 0.9214 |
| Linear Regression | 4,942,046.80 | 10,315,736.08 | 0.8299 |

Speaker notes:

Explain that the best model was selected mainly using the highest R2 score and lower RMSE when models were close.

## Slide 10 - Best Model

Best model:

```text
Gradient Boosting Regressor
```

Reasons:

- Highest R2 score: 0.9671
- Lowest RMSE among models close in R2
- Performs well for nonlinear relationships
- Suitable for mixed real estate features

## Slide 11 - System Features

- House price prediction form
- Input validation
- Predicted price shown in LKR
- Price category badge:
  - Low
  - Medium
  - High
  - Premium
- Prediction history saved in MongoDB
- Delete history records
- Health check endpoints
- Beginner-friendly error messages

## Slide 12 - Screenshots Explanation

Include screenshots:

- Home page: project introduction
- Prediction form: user enters house details
- Prediction result: estimated LKR price and category
- History page: saved MongoDB prediction records
- Health check: backend, FastAPI, and database status

Speaker notes:

Walk through the actual application screens in the same order as the demo.

## Slide 13 - Limitations

- Prediction depends on the quality and coverage of the dataset.
- Market prices can change over time.
- Model does not replace official property valuation.
- Some real-world factors may not be included, such as legal status, exact road quality, neighborhood demand, and recent market trends.

## Slide 14 - Future Improvements

- Add more real property transaction data.
- Add map-based location features.
- Add user login and saved user reports.
- Add admin dashboard for dataset updates.
- Add model retraining from the web interface.
- Deploy the full system on cloud platforms.
- Add charts for market analysis.

## Slide 15 - Conclusion

- LankaHomeValue successfully predicts Sri Lankan house selling prices using machine learning.
- The system integrates React, Express, FastAPI, MongoDB, and a trained ML model.
- It provides estimated price, price category, and prediction history.
- The project demonstrates practical use of AI in the real estate domain.
