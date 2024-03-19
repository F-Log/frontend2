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
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            alert("인바디 용지가 첨부됐습니다."); // 사용자에게 알림
        }
    };

    const formatNumber = (number) => {
        return isNaN(number) ? "0.0" : number.toFixed(1);
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
            alert('용지 분석 결과를 확인해주세요.');
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
        if (!data.inbodyUuid) {
            alert('No InBody data to analyze.');
            return;
        }

        const uuid = data.inbodyUuid;
        const requestBody = { inbodyUuid: uuid };
    
        try {
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
            setAiAdvice(adviceData.content);
        } catch (error) {
            console.error('Error fetching AI advice:', error);
            alert('AI advice could not be retrieved.');
        }
    };

    return (
        <div className="inbody-container">
            <div className="buttons-section">
                <label htmlFor="inbody-image-upload" className="upload-btn">인바디 용지 불러오기</label>
                <input
                    id="inbody-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <button onClick={handleSave} className="save-btn">분석 및 저장</button>
            </div>
    
            <div className="analysis-section">
                <h2>주요 신체 지표</h2>
                <div className="bar-container">
                    <div className="bar-label">키</div>
                    <div className="bar">
                        <div className="bar-fill" style={{ width: `${data.height}%` }}>
                            <span className="bar-text">키</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.height)}</div>
                </div>
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
                <h2>기타 분석 지표</h2>
                <div className="bar-container">
                    <div className="bar-label">제지방량</div>
                    <div className="bar">
                        <div className="bar-fill" style={{ width: `${data.fatFreeMass}%` }}>
                            <span className="bar-text">제지방량</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.fatFreeMass)}</div>
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
                <div className="bar-container">
                    <div className="bar-label">기초대사량</div>
                    <div className="bar">
                        <div className="bar-fill" style={{ width: `${data.basalMetabolicRate}%` }}>
                            <span className="bar-text">기초대사량</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.basalMetabolicRate)}</div>
                </div>
            </div>
    
            <div className="input-section">
                <input
                    type="number"
                    name="height"
                    placeholder="Height"
                    value={data.height}
                    onChange={handleChange}
                />
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
                    name="fatFreeMass"
                    placeholder="Fat Free Mass"
                    value={data.fatFreeMass}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="bodyFatPercentage"
                    placeholder="Body Fat Percentage"
                    value={data.bodyFatPercentage}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="basalMetabolicRate"
                    placeholder="Basal Metabolic Rate"
                    value={data.basalMetabolicRate}
                    onChange={handleChange}
                />
                
            </div>
    
            {isSaved && <div>인바디 정보가 저장됐습니다.</div>}
    
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