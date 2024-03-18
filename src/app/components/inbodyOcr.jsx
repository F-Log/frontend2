import React, { useState } from 'react';
import './InbodyOcr.css';

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
    const [aiAdvice, setAiAdvice] = useState('');

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

    const fetchAIAdvice = async () => {
        // 만약 InBody 엔티티의 UUID가 이미 저장되어 있다면, 그것을 사용합니다.
        // 예시에서는 data.inbodyUuid를 사용하고 있습니다.
        const uuid = data.inbodyUuid;
    
        // 서버로 보낼 요청 본문입니다.
        const requestBody = { inbodyUuid: uuid };
    
        try {
            // 서버에 POST 요청을 보냅니다.
            const response = await fetch('http://localhost:8080/api/v1/gpt/inbody-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const adviceData = await response.json();
            // 서버로부터 받은 피드백을 컴포넌트 상태에 저장합니다.
            setAiAdvice(adviceData.content); // 'content' 필드가 AI 조언을 담고 있습니다.
        } catch (error) {
            console.error('Error fetching AI advice:', error);
            alert('AI advice could not be retrieved.');
        }
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
                        <div className="bar-fill" style={{ width: `${data.bodyWeight}%` }}>
                            <span className="bar-text">체중</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.bodyWeight)}</div>
                </div>
                <div className="bar-container">
                    <div className="bar-label">골격근량</div>
                    <div className="bar">
                        <div className="bar-fill" style={{ width: `${data.muscleMass}%` }}>
                            <span className="bar-text">골격근량</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.muscleMass)}</div>
                </div>
                <div className="bar-container">
                    <div className="bar-label">체지방량</div>
                    <div className="bar">
                        <div className="bar-fill" style={{ width: `${data.bodyFatMass}%` }}>
                            <span className="bar-text">체지방량</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.bodyFatMass)}</div>
                </div>
            </div>
    
            <div className="analysis-section">
                <h2>Obesity Analysis</h2>
                <div className="bar-container">
                    <div className="bar-label">BMI</div>
                    <div className="bar">
                        <div className="bar-fill" style={{ width: `${data.bmi}%` }}>
                            <span className="bar-text">BMI</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.bmi)}</div>
                </div>
                <div className="bar-container">
                    <div className="bar-label">체지방률</div>
                    <div className="bar">
                        <div className="bar-fill" style={{ width: `${data.bodyFatPercentage}%` }}>
                            <span className="bar-text">체지방률</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.bodyFatPercentage)}</div>
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
    
            {isSaved && <div>Data saved successfully!</div>}
    
            <div className="ai-advice-section">
                <div className="ai-advice-header">
                    <h2>AI ADVISE</h2>
                    <button onClick={fetchAIAdvice} className="generate-advice-btn">생성</button>
                </div>
                <textarea 
                    value={aiAdvice}
                    readOnly={true}
                    className="ai-advice-textarea"
                ></textarea>
            </div>
        </div>
    );
}

export default InBody;