# Step 07 - Final Viva and Presentation Preparation

## 1. Short Viva Answers

### What is your project?

My project is LankaHomeValue, an AI-based house price prediction system for Sri
Lanka. It predicts estimated house selling prices using machine learning.

### What problem does it solve?

It helps users estimate a house selling price quickly. This is useful because
property prices can vary by location, land size, facilities, and condition.

### What is your prediction target?

The prediction target is `house_selling_price_lkr`. It means the final estimated
house selling price in Sri Lankan Rupees.

### What dataset did you use?

I used `Updated House Selling Dataset.csv`. It contains Sri Lankan house details
such as district, area, land size, bedrooms, bathrooms, facilities, and price.

### What ML models did you use?

I trained Linear Regression, Decision Tree Regressor, Random Forest Regressor,
and Gradient Boosting Regressor. Then I compared their MAE, RMSE, and R2 scores.

### Why did you select Gradient Boosting Regressor?

Gradient Boosting gave the best R2 score, about `0.9671`. It handles nonlinear
patterns well, so it was suitable for house price prediction.

### What is MAE, RMSE, R2?

MAE shows the average prediction error. RMSE gives a stronger penalty for large
errors. R2 shows how well the model explains the price variation.

### What technologies did you use?

I used React for frontend, Node.js and Express for backend, MongoDB for database,
and FastAPI with Scikit-learn for the machine learning API.

### Explain system architecture in one sentence.

The user enters data in React, Express sends it to FastAPI, the trained model
predicts the price, and MongoDB stores the prediction history.

### What are limitations?

The result depends on dataset quality and market changes. It is an estimate only,
not an official property valuation.

### What are future improvements?

Future improvements include larger updated datasets, map location features, user
login, admin dashboard, analytics charts, and cloud deployment.

## 2. One-Minute Project Explanation

Good morning. My project is LankaHomeValue, an AI-based house price prediction
system for Sri Lanka.

The main problem is that house prices are difficult to estimate because they
depend on many factors such as district, area, land size, bedrooms, bathrooms,
house size, condition, facilities, and location type.

To solve this, I developed a full-stack web application where users can enter
house details and get an estimated selling price in Sri Lankan Rupees. I trained
and compared several machine learning models, and selected Gradient Boosting
Regressor because it gave the best performance with an R2 score of about 0.9671.

The system uses React for the frontend, Node.js and Express for the backend,
MongoDB for storing prediction history, and FastAPI with Scikit-learn for the ML
prediction service.

The final output is the predicted house selling price, a price category, and a
saved prediction history record.

## 3. Three-Minute Detailed Explanation

Good morning. My final year project is LankaHomeValue, an AI-based house price
prediction system for Sri Lanka.

The problem I focused on is house price estimation. In Sri Lanka, house prices
change based on many features such as district, area, land size, number of rooms,
facilities, road access, distance to town, and property condition. Because of
this, it can be difficult for a user to quickly estimate a reasonable selling
price.

To solve this problem, I created a machine learning based web system. The user
enters house details through a React frontend. The system then predicts the
estimated selling price in Sri Lankan Rupees and also shows a simple price
category such as Low, Medium, High, or Premium.

For the dataset, I used `Updated House Selling Dataset.csv`. It contains Sri
Lankan house-related features including location details, property size,
bedrooms, bathrooms, facilities, condition, and the selling price. The target
column is `house_selling_price_lkr`. I removed leakage columns such as direct
price-related columns before training, so the model learns from proper input
features.

For machine learning, I trained and compared Linear Regression, Decision Tree
Regressor, Random Forest Regressor, and Gradient Boosting Regressor. I evaluated
the models using MAE, RMSE, and R2 score. Gradient Boosting Regressor was
selected as the best model because it achieved the highest R2 score, about
0.9671, and handled nonlinear relationships better than the simpler models.

The system architecture is React frontend, Express backend, FastAPI ML API, ML
model, and MongoDB database. The flow is: user enters data in React, React sends
the request to Express, Express forwards the data to FastAPI, FastAPI loads the
trained model and predicts the price, then Express saves the prediction history
in MongoDB and sends the result back to the frontend.

The output of the system is the predicted house selling price in LKR, a price
category, and a saved history record. This helps users get a quick estimate, but
the result should not be considered an official property valuation.

In conclusion, LankaHomeValue shows how machine learning can be connected with a
full-stack web application to solve a practical real-world problem in the Sri
Lankan real estate domain.

## 4. Demo Speaking Script

### Step 1 - Open System

I will now open the LankaHomeValue web application. This is the frontend built
using React.

### Step 2 - Explain UI

The home page shows the project name and purpose. The navigation bar allows me to
go to the prediction form, prediction history, and about page.

### Step 3 - Enter Sample Data

Now I will open the prediction form and enter sample house details such as
district, area, land size, bedrooms, bathrooms, house size, facilities, and
location category.

Sample data:

- District: Colombo
- Area: Nugegoda
- Land size: 10 perches
- Bedrooms: 3
- Bathrooms: 2
- House size: 1600 sqft
- Condition: Good
- Furnishing: Semi Furnished
- Location category: Urban

### Step 4 - Click Predict

After entering the details, I click the Predict Price button. The request is sent
from the React frontend to the Express backend.

### Step 5 - Explain Prediction Result

Here, the system shows the predicted house selling price in Sri Lankan Rupees.
It also shows a price category. This result is generated by the trained machine
learning model.

### Step 6 - Show History

Now I will open the prediction history page. This page shows previously saved
predictions from MongoDB, including the location, predicted price, category, and
date.

### Step 7 - Explain Backend Flow

The backend flow is simple: React sends data to Express, Express sends it to
FastAPI, FastAPI uses the trained model to predict the price, and MongoDB stores
the prediction history.

## 5. Difficult Examiner Questions

### Why not deep learning?

Deep learning usually needs a very large dataset and more computing power. For
this structured tabular dataset, traditional machine learning models like
Gradient Boosting are more suitable, faster, and easier to explain.

### What is overfitting?

Overfitting happens when a model learns the training data too closely, including
noise. Then it performs well on training data but poorly on new unseen data.

### How do you improve accuracy?

I can improve accuracy by collecting more updated data, cleaning missing and
wrong values, adding better location features, tuning model hyperparameters, and
testing more advanced regression models.

### What if data is wrong?

If input data is wrong, the prediction can also be wrong. To reduce this risk,
the system uses form validation, and the dataset must be cleaned before model
training.

### Why MERN plus Python combination?

MERN is good for building full-stack web applications, while Python is strong for
machine learning. So I used React, Express, and MongoDB for the web system, and
FastAPI with Scikit-learn for prediction.

### Can this be used in the real world?

Yes, it can be used as an estimation tool. However, for real commercial use it
needs more updated data, expert validation, stronger security, and regular model
retraining.

## 6. Confidence Tips

### How to speak clearly

Speak slowly and use simple words. First explain the problem, then the solution,
then the result.

### How to handle unknown questions

Do not guess. Say, "I am not fully sure, but based on my understanding..." and
then answer honestly.

### How to avoid panic

Pause for two seconds before answering. Breathe, look at the examiner, and answer
only the exact question asked.

### How to explain simply

Use this flow: User enters data, system sends data to model, model predicts
price, result is displayed and saved.

## 7. Final Checklist Before Presentation

- [ ] Laptop charged and charger ready
- [ ] Project folder available
- [ ] `LankaHomeValue_Final.zip` backup available
- [ ] Dataset available in `dataset/`
- [ ] Model file available in `models/house_price_model.pkl`
- [ ] MongoDB running
- [ ] FastAPI running at `http://127.0.0.1:8000`
- [ ] Backend running at `http://localhost:5000`
- [ ] Frontend running at `http://localhost:5173`
- [ ] Prediction form tested
- [ ] Prediction result tested
- [ ] Prediction history tested
- [ ] Screenshots available as backup
- [ ] Internet not required for local demo
- [ ] Presentation file ready
- [ ] Demo sample input written down
- [ ] Viva answers reviewed

