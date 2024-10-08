import React, { useEffect, useState } from 'react';
import './Log.css'; 
import axios from "axios";

const NutritionBar = ({ label, percentage, label2 }) => {
  const barBackground = percentage > 100 ? '#FF8E8E' : 'grey';
  const barFill = percentage > 100 ? '#6B8BFF' : '#6B8BFF';
  const barFillWidth = percentage > 100 ? '100%' : `${percentage}%`;
  const barOverflowWidth = percentage > 200 ? '100%' : `${percentage - 100}%`;

  return (
    <div className="nutrition-bar-container">
      <div className="nutrition-bar-label">{label}</div>
      <div className="nutrition-bar">
        <div className="nutrition-bar-fill" style={{ width: barFillWidth, backgroundColor: barFill }}></div>
        {percentage > 100 && (
          <div className="nutrition-bar-overflow" style={{ width: barOverflowWidth, backgroundColor: barBackground }}></div>
        )}
      </div>
      <div className="nutrition-bar-label">{label2}</div>
    </div>
  );
};

const LogPage = () => {
  const [advice, setAdvice] = useState('');
  const userUuid = localStorage.getItem("userUuid");
  const inbodyfeedbackUuid = localStorage.getItem("inbodyfeedbackUuid");
  const [recommendations, setRecommendations] = useState([]);
  const mealDate = new Date().toISOString().split('T')[0];
  const [dailyFeedback, setDailyFeedback] = useState({});
  const [energy, setEnergy] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [maxEntryCalories, setMaxEntryCalories] = useState(5000);
  const [maxEntryCarbs, setMaxEntryCarbs] = useState(500);
  const [maxEntryProtein, setMaxEntryProtein] = useState(500);
  const [maxEntryFat, setMaxEntryFat] = useState(500);
  const [viewMode, setViewMode] = useState('diet');
  const [activeMetabolism, setActiveMetabolism] = useState(0);
  const [data, setData] = useState({
    inbodyUuid: '',
    memberUuid: localStorage.getItem("userUuid") || '',
    bodyWeight: 0,
    height: 0,
    muscleMass: 0,
    fatMass: 0,
    bmi: 0,
    bodyFatPercentage: 0,
    basalMetabolicRate: 0,
    fatFreeMass: 0,
    createdAt: '',
    updatedAt: '',
  });
  const mealTypes = ['MORNING', 'LUNCH', 'DINNER', 'SNACK'];

  const getMaxEntryCalories = async () => {
    
    try {
      const inbodyResponse = await axios.get(`http://localhost:8080/api/v1/inbody/latest/${userUuid}`, {});
      const basalMetabolicRate = inbodyResponse.data.basalMetabolicRate;
      console.log('Inbody data:', basalMetabolicRate);
      if(basalMetabolicRate){
        try {
        const exercisesResponse = await axios.get(`http://localhost:8080/api/v1/exercises/${userUuid}`, {});
        const exercisesData = exercisesResponse.data;
        console.log('Exercises data:', exercisesData);
        if(exercisesData.exercisePurpose){
          if(exercisesData.exerciseFrequency < 2){
            setActiveMetabolism(basalMetabolicRate * 0.2);
          } else if(exercisesData.exerciseFrequency < 4){
            setActiveMetabolism(basalMetabolicRate * 0.3);
          } else if(exercisesData.exerciseFrequency < 6){
            setActiveMetabolism(basalMetabolicRate * 0.5);
          } else {
            setActiveMetabolism(basalMetabolicRate * 0.7);
          }
          const digestiveMetabolism = (basalMetabolicRate + activeMetabolism) * 0.1;
          let maxCalories = 0;
            if (exercisesData.exercisePurpose === 'WEIGHT_LOSS') {
              maxCalories = (basalMetabolicRate + activeMetabolism + digestiveMetabolism) * 0.8;
            } else if (exercisesData.exercisePurpose === 'MAINTAIN_WEIGHT') {
              maxCalories = (basalMetabolicRate + activeMetabolism + digestiveMetabolism);
            } else if (exercisesData.exercisePurpose === 'MUSCLE_GAIN') {
              maxCalories = (basalMetabolicRate + activeMetabolism + digestiveMetabolism) + 500;
            } else { // GAIN_WEIGHT
              maxCalories = (basalMetabolicRate + activeMetabolism + digestiveMetabolism) * 1.2;
            }
            setMaxEntryCalories(maxCalories.toFixed(2));

          const carbCalories = maxCalories * 0.4;
          const proteinCalories = maxCalories * 0.4;
          const fatCalories = maxCalories * 0.2;

          const carbsGrams = (carbCalories / 4).toFixed(2); // 1g carbohydrate = 4 kcal
          const proteinGrams = (proteinCalories / 4).toFixed(2); // 1g protein = 4 kcal
          const fatGrams = (fatCalories / 9).toFixed(2); // 1g fat = 9 kcal

          setMaxEntryCarbs(carbsGrams);
          setMaxEntryProtein(proteinGrams);
          setMaxEntryFat(fatGrams);

        }
      } catch (error) {
        console.error('Error fetching max entry:', error.response ? error.response.data : error.message);
      }
    }
    } catch (error) {
      console.error('Error fetching max entry:', error.response ? error.response.data : error.message);
    }
    
  };


  const [foodData, setFoodData] = useState('MORNING');
  const handleChangeMealType = (e) => {
    setFoodData(e.target.value);
    //setFoodData(e.target.value === 'MORNING' ? '아침' : e.target.value === 'LUNCH' ? '점심' : e.target.value === 'DINNER' ? '저녁' : '간식');
  };

  const fetchAdvice = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/gpt/daily-diet-feedback", {
        memberUuid: userUuid,
        date: mealDate
      });
      console.log('Food feedback:', response.data);
      setAdvice(response.data.content);
    } catch (error) {
      console.error('Error making daily-feedback:', error.response ? error.response.data : error.message);
      setAdvice('피드백을 받아오는데 실패했습니다.');
    }
  };
  const fetchEnergys = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/diet/daily-intake", {
        params: {
          memberUuid: userUuid,
          date: mealDate,
        }
      });
      console.log('Food daily-intake:', response.data);
      setEnergy(response.data.totalCalories);
      setCarbs(response.data.totalCarbohydrate);
      setProtein(response.data.totalProtein);
      setFat(response.data.totalFat);
    } catch (error) {
      console.error('Error fetching daily intake:', error.response ? error.response.data : error.message);
      // It's better to handle error setting here too if needed
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/inbody/latest/${userUuid}`, {});
/*
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }*/
      
      const savedData = await response.data;
      setData({ ...data, ...savedData });
      //setIsSaved(true);
      console.log('The inbody data has been gotten.');
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the data.');
  }
  };
  useEffect(() => {
    fetchEnergys();
    getMaxEntryCalories();
  }, []);

  const formatNumber = (number) => {
    return isNaN(number) ? "0.0" : number.toFixed(1);
};

  const handleGenerateAdvice = async (type) => {
    if(type ==='today'){
      try {
        const response = await axios.post("http://localhost:8080/api/v1/gpt/daily-diet-feedback", {
          memberUuid: userUuid,
          date: mealDate
        });
        console.log('Food feedback:', response.data);
        setDailyFeedback(response.data.content);
        setAdvice(type === 'today' ? response.data.content : '일주일의 피드백입니다.');
      } catch (error) {
        console.error('Error making daily-feedback:', error.response ? error.response.data : error.message);
      }
    } else if(type === 'inbody') {
      if(!inbodyfeedbackUuid){
        try {
          const response = await axios.post("http://localhost:8080/api/v1/gpt/inbody-feedback", 
            // `"${data.inbodyUuid}"`, // UUID 값을 문자열로 보냅니다.
            {
              // headers: {
              //   'Content-Type': 'application/json' // 서버가 JSON 형식을 요구하므로 헤더 설정에 이를 명시합니다.
              // }
              inbodyUuid: data.inbodyUuid,
            }
          );
        //   const response = await fetch(`http://localhost:8080/api/v1/inbody/${data.inbodyUuid}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(updateData),
        // });
          console.log('Inbody feedback:', response.data);
          setDailyFeedback(response.data.content);
          setAdvice(response.data.content);
        } catch (error) {
          console.error('Error making inbody-feedback:', error.response ? error.response.data : error.message);
        }
      } else {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/inbody-feedback/${inbodyfeedbackUuid}`, {});
        //   const response = await fetch(`http://localhost:8080/api/v1/inbody/${data.inbodyUuid}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(updateData),
        // });
          console.log('Inbody feedback:', response.data);
          setDailyFeedback(response.data.content);
          setAdvice(response.data.content);
        } catch (error) {
          console.error('Error making inbody-feedback:', error.response ? error.response.data : error.message);
        }
      }
      
      
      
    } else {
      try {
        const dietUuid = localStorage.getItem(`${foodData}Uuid`);
        console.log(foodData, 'dietUuid:', dietUuid);
        const response = await axios.post("http://localhost:8080/api/v1/gpt/diet-feedback", {
          dietUuid: dietUuid || localStorage.getItem(`MORNINGUuid`) ,
          memberUuid: userUuid
        });
        console.log(foodData.mealType, 'diet feedback:', response.data);
        setDailyFeedback(response.data.content);
        setAdvice(response.data.content);
      } catch (error) {
        console.error('Error making diet-feedback:', error.response ? error.response.data : error.message);
      }
    }

    
    /*
    setAdvice(type === 'today' ? 
    dailyFeedback : 
    '일주일의 피드백입니다.');*/
  };

  const handleGenerateRecommendations = () => {
    // 가상의 추천 식단 데이터
    const newRecommendations = [
      { name: '꽁치', image: 'kkongchi.jpg' },
      { name: '연어샐러드', image: 'salad.jpg' },
      { name: '견과류', image: 'nuts.jpg' },
      { name: '아보카도', image: 'avocado.jpg' },
      { name: '생선', image: 'fish.jpg' }
    ];
    setRecommendations(newRecommendations);
  };

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
    <div className="log-page">
      <h1>오늘의 결과를 확인하세요!</h1>
      <div className="advice-header">
        <button onClick={() => setViewMode('diet')}
        className='inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5'
        >식단</button>
        <button onClick={() => setViewMode('inbody')}
        className='inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5'
        >인바디</button>
      </div>
      {viewMode === 'diet' &&(
        <>
        <div className="calories-bars">
          <NutritionBar label={`| 칼로리 `} percentage={(energy / maxEntryCalories * 100).toFixed(1)} label2={`${(energy * 1).toFixed(1)} / ${maxEntryCalories}`} />
        </div>
        
        <div className="nutrition-bars">
          <NutritionBar label={`| 탄수화물 `} percentage={(carbs / maxEntryCarbs * 100).toFixed(1)} label2={`${(carbs * 1).toFixed(1)} / ${maxEntryCarbs}`} />
              
          <NutritionBar label={`| 단백질 `} percentage={(protein / maxEntryProtein * 100).toFixed(1)} label2={`${(protein * 1).toFixed(1)} / ${maxEntryProtein}`}/>
              
          <NutritionBar label={`| 지방 `} percentage={(fat / maxEntryFat * 100).toFixed(1)} label2={`${(fat * 1).toFixed(1)} / ${maxEntryFat}`}/>
        </div>
        </>
        
)}
{viewMode === 'inbody' &&(
  <>
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
                        <div className="bar-fill" style={{ width: `${data.fatMass}%` }}>
                            <span className="bar-text">체지방량</span>
                        </div>
                    </div>
                    <div className="bar-value">{formatNumber(data.fatMass)}</div>
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
  </>
)}
      <div className="advice-section">
        <div className="advice-header">
          <h3 className="ai-advice">AI ADVICE</h3>
          <label>
            식사 유형:
            <select value={foodData.mealType} onChange={handleChangeMealType}>
              {mealTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'MORNING' && '아침'}
                  {type === 'LUNCH' && '점심'}
                  {type === 'DINNER' && '저녁'}
                  {type === 'SNACK' && '간식'}
                </option>
              ))}
            </select>
          </label>
          <div className="advice-buttons">
            <button onClick={() => handleGenerateAdvice('today')}>오늘 식단</button>
            <button onClick={() => handleGenerateAdvice('inbody')}>인바디</button>
            <button onClick={() => handleGenerateAdvice('diet')}>식단 추천</button>
          </div>
        </div>
        <div className="advice-text">
          {advice}
        </div>
      </div>
      {/*
      <div className="recommendations-section">
        <button onClick={handleGenerateRecommendations}
        className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
        >추천 식단</button>
        <div className="recommendation-list">
          
        {recommendations.map((item, index) => (
            <div key={index} className="recommendation-item">
              <img src={`${process.env.PUBLIC_URL}/img/${item.image}`} alt={item.name} />
              <div>{item.name}</div>
            </div>
          ))}
        </div>
        </div>*/}
    </div>
    </section>
  );
};

export default LogPage;