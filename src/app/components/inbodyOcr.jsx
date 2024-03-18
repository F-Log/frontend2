import React, { useState } from 'react';
import './InbodyOcr.css';

function InBody() {
    const [weight, setWeight] = useState(0);
    const [muscleMass, setMuscleMass] = useState(0);
    const [bodyFatMass, setBodyFatMass] = useState(0);
    const [bmi, setBmi] = useState(0);
    const [bodyFatPercentage, setBodyFatPercentage] = useState(0);
    const handleWeightChange = (e) => setWeight(parseFloat(e.target.value) || 0);
    const handleMuscleMassChange = (e) => setMuscleMass(parseFloat(e.target.value) || 0);
    const handleBodyFatMassChange = (e) => setBodyFatMass(parseFloat(e.target.value) || 0);
    const handleBmiChange = (e) => setBmi(parseFloat(e.target.value) || 0);
    const handleBodyFatPercentageChange = (e) => setBodyFatPercentage(parseFloat(e.target.value) || 0);
    const [image, setImage] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
  

  
    const formatNumber = (number) => {
        return isNaN(number) ? "0.0" : number.toFixed(1);
      };


  const handleImageChange = (e) => {
    // Assuming only the first file is relevant
    setImage(e.target.files[0]);
  };

  const handleSave = () => {
    // TODO: Add actual saving logic here
    setIsSaved(true);
    alert('The data has been saved.');
  };

  // This is a placeholder function to simulate the OCR processing.
  const handleImageUpload = () => {
    // TODO: Add actual OCR logic here
    // For now, we'll just set random values
    setWeight(Math.random() * 100);
    setMuscleMass(Math.random() * 100);
    setBodyFatMass(Math.random() * 100);
    setBmi(Math.random() * 100);
    setBodyFatPercentage(Math.random() * 100);
  };



  return (
    <div className="inbody-container">
      <div className="image-upload-section">
        <label htmlFor="inbody-image-upload">인바디 표 업로드</label>
        <input
          id="inbody-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button className= "upload-btn" onClick={handleImageUpload}>Upload and Analyze</button>
      </div>

      <div className="analysis-section">
        <h2>Muscle-Fat Analysis</h2>
        <div className="bar-container">
          <div className="bar-label">체중</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${weight}%` }}>
              <span className="bar-text">체중</span>
            </div>
          </div>
          <div className="bar-value">{formatNumber(weight)}</div>
        </div>
        <div className="bar-container">
          <div className="bar-label">골격근량</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${muscleMass}%` }}>
              <span className="bar-text">골격근량</span>
            </div>
          </div>
          <div className="bar-value">{formatNumber(muscleMass)}</div>
        </div>
        <div className="bar-container">
          <div className="bar-label">체지방량</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${bodyFatMass}%` }}>
              <span className="bar-text">체지방량</span>
            </div>
          </div>
          <div className="bar-value">{formatNumber(bodyFatMass)}</div>
        </div>
      </div>

      <div className="analysis-section">
        <h2>Obesity Analysis</h2>
        <div className="bar-container">
          <div className="bar-label">BMI</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${bmi}%` }}>
              <span className="bar-text">BMI</span>
            </div>
          </div>
          <div className="bar-value">{formatNumber(bmi)}</div>
        </div>
        <div className="bar-container">
          <div className="bar-label">체지방률</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${bodyFatPercentage}%` }}>
              <span className="bar-text">체지방률</span>
            </div>
          </div>
          <div className="bar-value">{formatNumber(bodyFatPercentage)}</div>
        </div>
      </div>
      

      <div className="input-section">
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={handleWeightChange}
        />
        <input
          type="number"
          placeholder="Muscle Mass"
          value={muscleMass}
          onChange={handleMuscleMassChange}
        />
        <input
          type="number"
          placeholder="Body Fat Mass"
          value={bodyFatMass}
          onChange={handleBodyFatMassChange}
        />
        <input
          type="number"
          placeholder="BMI"
          value={bmi}
          onChange={handleBmiChange}
        />
        <input
          type="number"
          placeholder="Body Fat Percentage"
          value={bodyFatPercentage}
          onChange={handleBodyFatPercentageChange}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>Save</button>
    </div>
  );
}

export default InBody;