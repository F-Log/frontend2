import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HomeDetails.css';
import axios from 'axios';
import { useUser } from './FoodContext';

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

function DietDetailPage() {
  const { todaysMeals } = useUser();
  const navigate = useNavigate();
  const { mealType } = useParams();
  const recordsData = localStorage.getItem(`records_${mealType}`);
  const records = recordsData ? JSON.parse(recordsData) : null;
  const formattedDateAndMealType = getFormattedDateAndMealType(records[0]);
  const [advice, setAdvice] = useState('');
  const userUuid = localStorage.getItem("userUuid");
  const [recommendations, setRecommendations] = useState([]);
  const mealDate = localStorage.getItem("selectedDate") ? localStorage.getItem("selectedDate") : new Date().toISOString().split('T')[0];
  const [dailyFeedback, setDailyFeedback] = useState({});
  const [energy, setEnergy] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [maxEntryCalories, setMaxEntryCalories] = useState(5000);
  const [maxEntry, setMaxEntry] = useState(500);
  const dietUuid = records[0].dietUuid;
  console.log('dietUuid:', dietUuid);
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
  const [dietRecords, setDietRecords] = useState({
    MORNING: [],
    LUNCH: [],
    DINNER: [],
    SNACK: []
  });
  const foodData = records[0].mealType;
  console.log('foodData:', foodData);
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const fetchEnergys = async () => {
    setEnergy(records[0].totalCalories || 0);
    setCarbs(records[0].totalCarbs || 0);
    setProtein(records[0].totalProtein || 0);
    setFat(records[0].totalFat || 0);
  };
  useEffect(() => {
    fetchEnergys();
  }, []);
  function getFormattedDateAndMealType(record) {
    const { mealDate, mealType } = record;
    const date = new Date(mealDate);
    const koreanDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    
    const mealTypeMap = {
      MORNING: '아침',
      LUNCH: '점심',
      DINNER: '저녁',
      SNACK: '간식'
    };
  
    const koreanMealType = mealTypeMap[mealType] || mealType;
    return `${koreanDate} ${koreanMealType} 식단`;
  }
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
      try {
        const response = await axios.post("http://localhost:8080/api/v1/gpt/inbody-feedback", 
          `"${data.inbodyUuid}"`, // UUID 값을 문자열로 보냅니다.
          {
            headers: {
              'Content-Type': 'application/json' // 서버가 JSON 형식을 요구하므로 헤더 설정에 이를 명시합니다.
            }
          }
        );
        console.log('Inbody feedback:', response.data);
        setDailyFeedback(response.data.content);
        setAdvice(response.data.content);
      } catch (error) {
        console.error('Error making inbody-feedback:', error.response ? error.response.data : error.message);
      }
      
      
    } else {
      try {
        
        console.log(foodData, 'dietUuid:', dietUuid);
        const response = await axios.post("http://localhost:8080/api/v1/gpt/diet-feedback", {
          dietUuid: dietUuid || localStorage.getItem(`MORNINGUuid`) ,
          memberUuid: userUuid
        });
        console.log('diet feedback:', response.data);
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
  const DietRecord = ({ record }) => {
    const [foodDetails, setFoodDetails] = useState([]);
    const {dietFoods} = record;
    const selectedMealType = records[0].mealType;
    const [foodData, setFoodData] = useState([
      {
        foodName: '',
        amount: 0,
        energy: 0,
        carbs: 0,
        protein: 0,
        fat: 0
      }
    ]);
    // record 배열이 비어있지 않은지 확인하고 dietFoods를 추출합니다.
    // const dietFoods = record.length > 0 ? record[0].dietFoods : [];
    console.log('record.length:', record.length);
    console.log('dietFoods:', dietFoods);
    
    
    const deleteHandler = async (dietFoodUuid, index) => {
      // 서버에 DELETE 요청 보내기
      try {
        const response = await axios.delete(`http://localhost:8080/api/v1/dietfoods/${dietFoodUuid}`);
        console.log(response.data); // 응답 로깅
        // 삭제가 성공적이면, 클라이언트 상의 리스트에서도 해당 항목 제거
        setFoodDetails(prevDetails => prevDetails.filter((_, i) => i !== index));
      } catch (error) {
        console.error('삭제 중 오류가 발생했습니다', error.response || error);
      }
    };
    
    useEffect(() => {
      const fetchFoodDetails = async () => {
          console.log('식단 정보를 가져옵니다:', record);
  
          // 첫 번째 API 호출을 모두 수행
          const promises = dietFoods.map(async (dietFood) => {
              try {
                  const dietFoodResponse = await axios.get(`http://localhost:8080/api/v1/dietfoods/${dietFood.dietfoodUuid}`);
                  console.log('3식품 정보를 가져옵니다:', dietFoodResponse.data);
                  
                  // 두 번째 API 호출
                  const foodResponse = await axios.get(`http://localhost:8080/api/v1/food/${dietFoodResponse.data.foodUuid}`);
                  console.log('4식품 정보를 가져옵니다:', foodResponse.data);
  
                  // 음식 정보와 계산된 값들을 객체로 반환
                  return {
                      ...dietFood,
                      dietFoodUuid: dietFoodResponse.data.dietfoodUuid,
                      foodName: foodResponse.data.foodName,
                      calories: (foodResponse.data.calories * dietFood.quantity).toFixed(2),
                      carbohydrate: (foodResponse.data.carbohydrate * dietFood.quantity).toFixed(2),
                      protein: (foodResponse.data.protein * dietFood.quantity).toFixed(2),
                      fat: (foodResponse.data.fat * dietFood.quantity).toFixed(2)
                  };
              } catch (error) {
                  console.error('API 호출 중 에러 발생:', error);
                  return {};  // 실패 시 빈 객체 반환
              }
          });
  
          Promise.all(promises)
              .then(results => {
                  setFoodDetails(results);
                  console.log('식품 정보를 가져옵니다:', results);
              })
              .catch(error => console.error('API 호출 중 에러 발생:', error));
      };
  
      fetchFoodDetails();
  }, [dietFoods]);

  return (
    <>
      <div className="diet-record">
        {foodDetails.map((foodDetail, index) => (
          foodDetail.foodName && (
            <div
              key={index}
              className="a-record-details p-4 mb-4 bg-gray-100 rounded-lg shadow"
            >
              <p className="aadetails" onClick={() => deleteHandler(foodDetail.dietfoodUuid, index)}><u>삭제</u></p>
              <h4 className="font-semibold text-lg mb-2">{foodDetail.foodName}</h4>
              <p className="mb-1">칼로리: {foodDetail.calories} kcal</p>
              <p className="mb-1">탄수화물: {foodDetail.carbohydrate} g</p>
              <p className="mb-1">단백질: {foodDetail.protein} g</p>
              <p className="mb-3">지방: {foodDetail.fat} g</p>
            </div>
          )
        ))}
      </div>
    </>

);
};


  // const fetchDietData = async (activeMealType) => {
  //   const formattedDate = getFormattedDate(new Date());
  //   const memberUuid = localStorage.getItem("userUuid");
  
  //   try {
  //     const response = await axios.get(`http://localhost:8080/api/v1/diet/date-memberUuid`, {
  //       params: { date: formattedDate, memberUuid, mealType: mealType }
  //     });
  
  //     // 식사 유형별로 데이터를 추가합니다.
  //     setDietRecords(prevRecords => ({
  //       ...prevRecords,
  //       [activeMealType]: response.data
  //     }));
  //     console.log("음식정보 수령 성공", activeMealType, response.data);
  //   } catch (error) {
  //     console.error('식단 정보를 가져오는 데 실패했습니다.', error);
  //   }
  // };

  return (
    <>
    
    <div className="inbody-container">
      
      <div className="center-text">
        <p>{formattedDateAndMealType}</p>
      </div>
      <div className="buttons-section">
        {/* <button onClick={() => navigate('/FoodOcr')} className="button">영양성분표 업로드</button>
        
        <button onClick={() => navigate('/search')} className="button">음식명으로 검색</button>
         */}
      </div>
      <div className='ai-advice-section'>
        <div className="ai-advice-header">
          <h2>등록된 식단</h2>
          <button onClick={() => navigate('/search')} className="generate-advice-btn">음식 추가</button>
        </div>
        <div className="lists-section">
          {records.map((record, index) => (
            console.log('record:', record),
            <DietRecord key={index} record={record} />
          ))}
        </div>
      </div>
      <div className="ai-advice-section">
        <div className="ai-advice-header">
          <h2>영양성분 개요</h2>
        </div>
        <div className="calories-bars">
          <NutritionBar label={`| 칼로리 `} percentage={(energy / maxEntryCalories * 100).toFixed(1)} label2={`${(energy * 1).toFixed(1)} / ${maxEntryCalories}`} />
        </div>
        
        <div className="nutrition-bars">
            
            
              
              <NutritionBar label={`| 탄수화물 `} percentage={(carbs / maxEntry * 100).toFixed(1)} label2={`${(carbs * 1).toFixed(1)} / ${maxEntry}`} />
              
              <NutritionBar label={`| 단백질 `} percentage={(protein / maxEntry * 100).toFixed(1)} label2={`${(protein * 1).toFixed(1)} / ${maxEntry}`}/>
              
              <NutritionBar label={`| 지방 `} percentage={(fat / maxEntry * 100).toFixed(1)} label2={`${(fat * 1).toFixed(1)} / ${maxEntry}`}/>
        </div>
      </div>

      
            
      <div className="ai-advice-section">
                <div className="ai-advice-header">
                    <h2>식단 피드백</h2>
                    <button onClick={() => handleGenerateAdvice('diet')} className="generate-advice-btn">생성</button>
                </div>
                <textarea 
                    value={advice}
                    readOnly={true}
                    className="ai-advice-textarea"
                ></textarea>
            </div>
    </div>
    
    </>
  );
}

export default DietDetailPage;
