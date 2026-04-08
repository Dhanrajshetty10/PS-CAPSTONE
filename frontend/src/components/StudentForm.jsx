import React, { useState } from 'react';
import { Loader2, GraduationCap } from 'lucide-react';

const FIELDS = [
  { name: 'age', label: 'Age', hint: '10–30', min: 10, max: 30, step: 1, icon: '🎂' },
  { name: 'study_fail_ratio', label: 'Study / Fail Ratio', hint: '0+', min: 0, step: 0.01, icon: '📊' },
  { name: 'parent_edu', label: 'Parent Education', hint: '1–4', min: 1, max: 4, step: 0.5, icon: '👨‍🎓' },
  { name: 'social_score', label: 'Social Score', hint: '1–5', min: 1, max: 5, step: 1, icon: '🤝' },
  { name: 'goout', label: 'Going Out', hint: '1–5', min: 1, max: 5, step: 1, icon: '🚶' },
  { name: 'failures', label: 'Past Failures', hint: '0–10', min: 0, max: 10, step: 1, icon: '📉' },
];

export default function StudentForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    age: 18,
    study_fail_ratio: 1.0,
    parent_edu: 2,
    social_score: 3,
    goout: 3,
    failures: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        {FIELDS.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.icon} {field.label}
              <span>{field.hint}</span>
            </label>
            <input
              type="number"
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              min={field.min}
              max={field.max}
              step={field.step}
              required
            />
          </div>
        ))}
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
        ) : (
          <><GraduationCap size={18} /> Predict Performance</>
        )}
      </button>
    </form>
  );
}
