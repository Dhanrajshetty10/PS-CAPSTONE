import joblib, json
rf = joblib.load('random_forest_model.pkl')
scaler = joblib.load('scaler.pkl')

info = {
  'scaler_features': getattr(scaler, 'n_features_in_', -1),
  'rf_features': list(rf.feature_names_in_) if hasattr(rf, 'feature_names_in_') else []
}
with open('debug_info.json', 'w') as f:
    json.dump(info, f, indent=2)
