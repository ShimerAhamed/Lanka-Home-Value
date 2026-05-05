# Final Report Improvement Guide - LankaHomeValue

Use this structure to improve the final report or proposal.

## 1. Introduction

Write about:

- Real estate price prediction
- Importance of house price estimation in Sri Lanka
- How AI and machine learning can support price estimation
- Purpose of LankaHomeValue

Suggested paragraph:

LankaHomeValue is an AI-based house price prediction system designed for the Sri Lankan real estate domain. The system uses machine learning to estimate house selling prices based on property, location, and facility-related features. It provides users with an estimated house price in Sri Lankan Rupees and a price category to support early decision-making.

## 2. Problem Identification

Include:

- House price estimation is difficult for non-experts.
- Manual valuation can take time and cost money.
- Online prices can be inconsistent.
- Buyers and sellers need a quick estimated value.

## 3. Proposed Solution

Explain:

- A web-based system that predicts house selling price.
- React frontend for user input.
- Express backend for API handling and MongoDB history.
- FastAPI ML API for model prediction.
- Scikit-learn model trained on house selling dataset.
- `ml-api` folder contains the machine learning API and training scripts.

Architecture:

```text
React Frontend -> Express Backend -> FastAPI ML API -> Trained ML Model
```

## 4. Feasibility

### Technical Feasibility

- Uses open-source tools.
- Runs locally on Windows PowerShell.
- Can be deployed using Netlify/Vercel, Render/Railway, and MongoDB Atlas.

### Operational Feasibility

- Simple form-based interface.
- Beginner-friendly error messages.
- Prediction history helps users review previous results.

### Economic Feasibility

- Uses free or low-cost technologies.
- MongoDB Atlas, Render, Netlify, Vercel, and Railway have beginner-friendly options.

## 5. Methodology

Include:

1. Dataset collection
2. Data cleaning
3. Target selection: `house_selling_price_lkr`
4. Data leakage prevention
5. Feature preprocessing
6. Model training
7. Model evaluation
8. API development
9. Frontend development
10. Testing and deployment preparation

Preprocessing:

- Numerical missing values: median
- Categorical missing values: most frequent value
- Numerical scaling: StandardScaler
- Categorical encoding: OneHotEncoder
- Pipeline: Scikit-learn Pipeline and ColumnTransformer

## 6. Model Training Results

| Model | MAE | RMSE | R2 Score |
|---|---:|---:|---:|
| Gradient Boosting Regressor | 2,566,958.40 | 4,538,167.73 | 0.9671 |
| Random Forest Regressor | 2,239,615.16 | 4,604,969.46 | 0.9661 |
| Decision Tree Regressor | 3,702,158.50 | 7,009,480.77 | 0.9214 |
| Linear Regression | 4,942,046.80 | 10,315,736.08 | 0.8299 |

Best model:

```text
Gradient Boosting Regressor
```

Reason:

- Highest R2 score
- Strong RMSE performance
- Handles nonlinear patterns better than simple linear models

## 7. System Architecture Diagram

Use this diagram in the report:

```text
User
 |
 v
React Frontend
 |
 v
Express Backend
 |                 MongoDB
 |---------------> Prediction History
 |
 v
FastAPI ML API
 |
 v
house_price_model.pkl
 |
 v
Predicted Price + Category
```

## 8. Gantt Chart

Suggested timeline:

| Task | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Week 7 | Week 8 |
|---|---|---|---|---|---|---|---|---|
| Requirement analysis | X |  |  |  |  |  |  |  |
| Dataset preparation | X | X |  |  |  |  |  |  |
| Model training |  | X | X |  |  |  |  |  |
| FastAPI development |  |  | X | X |  |  |  |  |
| Express backend |  |  |  | X | X |  |  |  |
| React frontend |  |  |  |  | X | X |  |  |
| Testing and debugging |  |  |  |  |  | X | X |  |
| Report and presentation |  |  |  |  |  |  | X | X |

## 9. Screenshots

Include:

- Home page
- Prediction form
- Prediction result
- Prediction history
- FastAPI health check
- Express health check

## 10. Limitations

- Prediction depends on dataset quality.
- Real estate prices change over time.
- Some real-world factors are not included.
- The system is not an official valuation tool.

## 11. Future Improvements

- Add geolocation and map features.
- Add user accounts.
- Add admin dashboard.
- Add more updated real estate data.
- Add charts and analytics.
- Deploy the full system to cloud.

## 12. References - Harvard Style

Example references:

- FastAPI, 2026. FastAPI Documentation. Available at: https://fastapi.tiangolo.com/ [Accessed 5 May 2026].
- MongoDB, 2026. MongoDB Atlas Documentation. Available at: https://www.mongodb.com/docs/atlas/ [Accessed 5 May 2026].
- Pedregosa, F. et al., 2011. Scikit-learn: Machine Learning in Python. Journal of Machine Learning Research, 12, pp.2825-2830.
- React, 2026. React Documentation. Available at: https://react.dev/ [Accessed 5 May 2026].
- Render, 2026. Render Documentation. Available at: https://render.com/docs [Accessed 5 May 2026].
- Vercel, 2026. Vercel Documentation. Available at: https://vercel.com/docs [Accessed 5 May 2026].
