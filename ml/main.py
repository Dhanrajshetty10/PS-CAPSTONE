from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

# Load models and scaler globally
adaboost_model = None
logistic_model = None
mlp_model = None
xgboost_model = None
scaler = None

@app.on_event("startup")
def load_models():
    global adaboost_model, logistic_model, mlp_model, xgboost_model, scaler
    try:
        adaboost_model = joblib.load("adaboost_model.pkl")
        logistic_model = joblib.load("logistic_model.pkl")
        mlp_model = joblib.load("mlp_model.pkl")
        xgboost_model = joblib.load("xgboost_model.pkl")
        scaler = joblib.load("scaler.pkl")
        print("Models and scaler loaded successfully (4 models + scaler).")
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        print("Make sure adaboost, logistic, mlp, xgboost .pkl files and scaler.pkl are in the ml/ directory.")

class PredictionRequest(BaseModel):
    age: int
    study_fail_ratio: float
    parent_edu: float
    social_score: int
    goout: int
    failures: int

@app.post("/predict")
def predict(request: PredictionRequest):
    if not all([adaboost_model, logistic_model, mlp_model, xgboost_model, scaler]):
        raise HTTPException(status_code=500, detail="Models are not loaded.")

    try:
        # Convert to numpy array in strict order:
        # ['age', 'study_fail_ratio', 'parent_edu', 'social_score', 'goout', 'failures']
        features = np.array([[
            request.age,
            request.study_fail_ratio,
            request.parent_edu,
            request.social_score,
            request.goout,
            request.failures
        ]])
        
        # Apply scaler
        scaled_features = scaler.transform(features)
        
        # Build 6-feature DataFrame for XGBoost (needs feature names)
        df_6 = pd.DataFrame(
            features,
            columns=['age', 'study_fail_ratio', 'parent_edu', 'social_score', 'goout', 'failures']
        )

        # Predict using all four models
        adaboost_pred = int(adaboost_model.predict(scaled_features)[0])
        logistic_pred = int(logistic_model.predict(scaled_features)[0])
        mlp_pred = int(mlp_model.predict(scaled_features)[0])
        xgb_pred = int(xgboost_model.predict(df_6)[0])
        
        # Majority voting across all 4 models
        votes = [adaboost_pred, logistic_pred, mlp_pred, xgb_pred]
        pass_count = sum(votes)
        result = "PASS" if pass_count >= 3 else "FAIL"
        
        return {
            "prediction": result,
            "pass_votes": pass_count,
            "total_models": 4,
            "model_outputs": {
                "adaboost": adaboost_pred,
                "logistic": logistic_pred,
                "mlp": mlp_pred,
                "xgboost": xgb_pred
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
