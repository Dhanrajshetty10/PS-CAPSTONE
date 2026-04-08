import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import ResultDashboard from './components/ResultDashboard';
import axios from 'axios';
import './index.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      setResult({ ...response.data, formData });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to connect to the server. Make sure all services are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <h1 className="title">Student Performance Predictor</h1>
      <p className="subtitle">Powered by 4 ML models — AdaBoost · Logistic · MLP · XGBoost</p>

      {error && (
        <div className="fade-in" style={{
          background: 'rgba(248, 113, 113, 0.08)',
          color: '#f87171',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          border: '1px solid rgba(248, 113, 113, 0.2)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          ⚠️ {error}
        </div>
      )}

      {!result ? (
        <div className="glass-panel fade-in">
          <StudentForm onSubmit={handlePredict} loading={loading} />
        </div>
      ) : (
        <div className="glass-panel fade-in">
          <ResultDashboard result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}

export default App;
