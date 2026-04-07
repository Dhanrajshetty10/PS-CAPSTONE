import sys
import json
import numpy as np
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.joblib"))
mlp = joblib.load(os.path.join(BASE_DIR, "mlp_model.joblib"))
kmeans = joblib.load(os.path.join(BASE_DIR, "kmeans_model.joblib"))
adaboost = joblib.load(os.path.join(BASE_DIR, "adaboost_model.joblib"))

# Handle input safely (fix PowerShell issue)
if len(sys.argv) > 1:
    try:
        data = json.loads(sys.argv[1])
    except:
        data = {
            "study_time": 2,
            "failures": 3,
            "absences": 10,
            "g1": 12,
            "g2": 14
        }
else:
    data = {
        "study_time": 2,
        "failures": 3,
        "absences": 10,
        "g1": 12,
        "g2": 14
    }

# Prepare input
features = np.array([[
    data["study_time"],
    data["failures"],
    data["absences"],
    data["g1"],
    data["g2"]
]])

# Scale
features_scaled = scaler.transform(features)

# Predictions
pred = mlp.predict(features_scaled)[0]
cluster = kmeans.predict(features_scaled)[0]

# Pass/Fail result
result = "Pass" if pred == 1 else "Fail"

# ✅ AUTO CLUSTER LABEL FIX (IMPORTANT CHANGE)
centers = kmeans.cluster_centers_

# Sort clusters based on overall performance (sum of features)
scores = [sum(c) for c in centers]

# Get sorted cluster indices
sorted_indices = np.argsort(scores)

# Map clusters dynamically
cluster_map = {
    sorted_indices[0]: "Weak",
    sorted_indices[1]: "Average",
    sorted_indices[2]: "Excellent"
}

cluster_result = cluster_map.get(cluster, "Average")

# Output
output = {
    "prediction": result,
    "cluster": cluster_result
}

print(json.dumps(output))