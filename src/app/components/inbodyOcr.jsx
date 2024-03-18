import React, { useState } from 'react';
import './inbodyOcr.css';

function InBody() {
    const [data, setData] = useState({
        inbodyUuid: '',
        memberUuid: localStorage.getItem("userUuid") || '',
        bodyWeight: 0,
        height: 0,
        muscleMass: 0,
        bodyFatMass: 0,
        bmi: 0,
        bodyFatPercentage: 0,
        basalMetabolicRate: 0,
        fatFreeMass: 0,
        createdAt: '',
        updatedAt: '',
    });
    const [image, setImage] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const formatNumber = (number) => {
        return isNaN(number) ? "0.0" : number.toFixed(1);
    };

    const handleImageUpload = async () => {
        if (!image) {
            alert('Please select an image for OCR processing.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('/ocr-process', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const ocrData = await response.json();

            setData(prevData => ({
                ...prevData,
                ...ocrData,
                bmi: ocrData.bodyWeight / ((ocrData.height / 100) ** 2),
            }));
            
        } catch (error) {
            console.error('Error during OCR processing:', error);
            alert('An error occurred during OCR processing.');
        }
    };

    const handleSave = async () => {
        if (!image || !data.memberUuid) {
            alert('Please upload an image.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);
        formData.append('memberUuid', data.memberUuid);

        try {
            const response = await fetch('http://127.0.0.1:5000/save-inbody', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const savedData = await response.json();
            setData({ ...data, ...savedData });
            setIsSaved(true);
            alert('The data has been saved.');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the data.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: parseFloat(value) || 0
        }));
    };

    return (
        <div className="inbody-container">
            <div className="image-upload-section">
                <label htmlFor="inbody-image-upload">Upload InBody Report</label>
                <input
                    id="inbody-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <button onClick={handleImageUpload}>Upload and Analyze</button>
            </div>

            <div className="analysis-section">
    <h2>Muscle-Fat Analysis</h2>
    <div className="bar-container">
        <div className="bar-label">체중</div>
        <div className="bar">
            <div className="bar-fill" style={{ width: `${data.bodyWeight}%` }}> {/* 수정됨 */}
                <span className="bar-text">체중</span>
            </div>
        </div>
        <div className="bar-value">{formatNumber(data.bodyWeight)}</div> {/* 수정됨 */}
    </div>
    <div className="bar-container">
        <div className="bar-label">골격근량</div>
        <div className="bar">
            <div className="bar-fill" style={{ width: `${data.muscleMass}%` }}> {/* 수정됨 */}
                <span className="bar-text">골격근량</span>
            </div>
        </div>
        <div className="bar-value">{formatNumber(data.muscleMass)}</div> {/* 수정됨 */}
    </div>
    <div className="bar-container">
        <div className="bar-label">체지방량</div>
        <div className="bar">
            <div className="bar-fill" style={{ width: `${data.bodyFatMass}%` }}> {/* 수정됨 */}
                <span className="bar-text">체지방량</span>
            </div>
        </div>
        <div className="bar-value">{formatNumber(data.bodyFatMass)}</div> {/* 수정됨 */}
    </div>
</div>

<div className="analysis-section">
    <h2>Obesity Analysis</h2>
    <div className="bar-container">
        <div className="bar-label">BMI</div>
        <div className="bar">
            <div className="bar-fill" style={{ width: `${data.bmi}%` }}> {/* 수정됨 */}
                <span className="bar-text">BMI</span>
            </div>
        </div>
        <div className="bar-value">{formatNumber(data.bmi)}</div> {/* 수정됨 */}
    </div>
    <div className="bar-container">
        <div className="bar-label">체지방률</div>
        <div className="bar">
            <div className="bar-fill" style={{ width: `${data.bodyFatPercentage}%` }}> {/* 수정됨 */}
                <span className="bar-text">체지방률</span>
            </div>
        </div>
        <div className="bar-value">{formatNumber(data.bodyFatPercentage)}</div> {/* 수정됨 */}
    </div>
</div>

      <div className="input-section">
                <input
                    type="number"
                    name="bodyWeight"
                    placeholder="Weight"
                    value={data.bodyWeight}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="muscleMass"
                    placeholder="Muscle Mass"
                    value={data.muscleMass}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="bodyFatMass"
                    placeholder="Body Fat Mass"
                    value={data.bodyFatMass}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="bmi"
                    placeholder="BMI"
                    value={data.bmi}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="bodyFatPercentage"
                    placeholder="Body Fat Percentage"
                    value={data.bodyFatPercentage}
                    onChange={handleChange}
                    />
                    <button onClick={handleSave}>Save</button>
                </div>
    
                {/* {isSaved && (
                <div className="saved-data-section">
                    <h3>Saved Data</h3>
                    <p>Member UUID: {data.memberUuid}</p>
                    <p>Body Weight: {formatNumber(data.bodyWeight)}</p>
                    <p>Height: {data.height}</p>
                    <p>Muscle Mass: {formatNumber(data.muscleMass)}</p>
                    <p>Body Fat Mass: {formatNumber(data.bodyFatMass)}</p>
                    <p>BMI: {formatNumber(data.bmi)}</p>
                    <p>Body Fat Percentage: {formatNumber(data.bodyFatPercentage)}</p>
                    <p>Basal Metabolic Rate: {data.basalMetabolicRate}</p>
                    <p>Fat Free Mass: {data.fatFreeMass}</p>
                    <p>Created At: {data.createdAt}</p>
                    <p>Updated At: {data.updatedAt}</p>
                </div>
            )} */}
            {isSaved && <div>Data saved successfully!</div>}
        </div>
    );
}

export default InBody;