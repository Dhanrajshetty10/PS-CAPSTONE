import React from 'react';
import { ArrowLeft, Cpu, CheckCircle, XCircle } from 'lucide-react';

const MODEL_LABELS = {
  adaboost: 'AdaBoost',
  logistic: 'Logistic',
  mlp: 'MLP',
  xgboost: 'XGBoost'
};

const MODEL_ICONS = {
  adaboost: 'AB',
  logistic: 'LR',
  mlp: 'NN',
  xgboost: 'XG'
};

export default function ResultDashboard({ result, onReset }) {
  const isPass = result.prediction === "PASS";

  return (
    <div>
      <div className="results-header fade-in">
        <h2>Prediction Results</h2>
        <button className="btn-secondary" onClick={onReset}>
          <ArrowLeft size={16} /> New Prediction
        </button>
      </div>

      {/* Hero Result */}
      <div className={`result-hero ${isPass ? 'pass' : 'fail'} fade-in-delay-1`}>
        <div className="result-label">Majority Vote Prediction</div>
        <div className="result-value">{result.prediction}</div>
        <div className="result-votes">
          <strong>{result.pass_votes}</strong> out of <strong>{result.total_models}</strong> models voted PASS
        </div>
      </div>

      {/* Model Cards */}
      <div className="models-section-title fade-in-delay-2">
        <Cpu size={14} />
        Individual Model Predictions
      </div>
      <div className="models-grid">
        {Object.entries(result.model_outputs).map(([modelName, output], index) => {
          const modelPass = output === 1;
          return (
            <div
              key={modelName}
              className={`model-card ${modelPass ? 'pass' : 'fail'} fade-in-delay-${index + 1}`}
            >
              <div className="model-icon">
                {MODEL_ICONS[modelName] || modelName.slice(0, 2).toUpperCase()}
              </div>
              <div className="model-name">
                {MODEL_LABELS[modelName] || modelName.replace('_', ' ')}
              </div>
              <div className="model-result">
                {modelPass ? (
                  <><CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />PASS</>
                ) : (
                  <><XCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />FAIL</>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
