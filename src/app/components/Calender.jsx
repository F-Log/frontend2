import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 라이브러리를 사용하여 HTTP 요청을 보낼 수 있습니다.
import { useNavigate} from 'react-router-dom';
import CalenderUI from './CalenderUI';
import DietRecord from './DietRecord'; 
import styles from './Calender.module.css';

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
function Popup({ onClose }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="popup">
      <div className="buttons">
        <button onClick={() => navigate('/FoodOcr')} className="button">영양성분표 업로드</button>
        
        <button onClick={() => navigate('/search')} className="button">음식명으로 검색</button>
        </div>
      <div className="buttons">
        <button onClick={onClose}
        className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
        >닫기</button>
      </div>
    </div>
    </>
    
    
  );
}

const RecordView = () => {
  const navigate = useNavigate();
  const [energy, setEnergy] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [maxEntryCalories, setMaxEntryCalories] = useState(5000);
  const [maxEntryCarbs, setMaxEntryCarbs] = useState(500);
  const [maxEntryProtein, setMaxEntryProtein] = useState(500);
  const [maxEntryFat, setMaxEntryFat] = useState(500);
  const [activeMetabolism, setActiveMetabolism] = useState(0);
  const [view, setView] = useState('diet'); // 현재 보고 있는 뷰 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const userUuid = localStorage.getItem("userUuid");
  const mealDate = getFormattedDate(selectedDate);
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
  const handleDateSelect = (date) => {
    console.log('Selected date:', date);
    setSelectedDate(date);
  };
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
  // 이전 달로 이동
  const handlePrevMonth = () => {
    const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate());
    setSelectedDate(newMonth);
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
    setSelectedDate(newMonth);
  };
  // 인바디 피드백 요청을 처리하는 함수
  const handleFeedbackRequest = () => {
    console.log("인바디 피드백 요청");
  };

  // 피드백 생성 로직
  const handleFeedbackGenerated = () => {
    console.log("피드백 생성");
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
    
  };

  const fetchDietData = async (activeMealType) => {
    const formattedDate = getFormattedDate(selectedDate);
    const memberUuid = localStorage.getItem("userUuid");
  
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/diet/date-memberUuid`, {
        params: { date: formattedDate, memberUuid, mealType: activeMealType }
      });
  
      // 식사 유형별로 데이터를 추가합니다.
      setDietRecords(prevRecords => ({
        ...prevRecords,
        [activeMealType]: response.data
      }));
      console.log("음식정보 수령 성공", activeMealType, response.data);
    } catch (error) {
      console.error('식단 정보를 가져오는 데 실패했습니다.', error);
    }
  };
  const handleRecordClick = (mealType) => {
    const records = dietRecords[mealType];
    localStorage.setItem(`records_${mealType}`, JSON.stringify(records));
    localStorage.setItem(`selectedDate`, getFormattedDate(selectedDate));
    navigate(`/HomeDetails/${mealType}`, { state: { records: records } }); // 클릭 시 mealType에 따라 HomeDetails 페이지로 라우팅합니다.
  };
  useEffect(() => {
    getMaxEntryCalories();
  }
  ,[]);
  useEffect(() => {
    fetchEnergys();
    fetchDietData("MORNING");
    fetchDietData("LUNCH");
    fetchDietData("DINNER");
    fetchDietData("SNACK");
  }, [mealDate]);

  // 선택된 뷰에 따라 렌더링할 컴포넌트를 결정하는 함수
  const renderView = () => {
    switch (view) {
      case 'diet':
        return <RecordViewDiet selectedDate={selectedDate} />;
      case 'inbody':
        return <RecordViewInBody selectedDate={selectedDate} onFeedbackRequest={handleFeedbackRequest} />;
      case 'feedback':
        return <RecordViewFeedback selectedDate={selectedDate} onFeedbackGenerated={handleFeedbackGenerated} />;
      default:
        return <div>선택된 뷰가 없습니다.</div>;
    }
  };

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5 flex">
  <div className="">
  {isPopupOpen && (
        <Popup
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    <CalenderUI 
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
    />
    <div>
      {dietRecords.MORNING.length > 0 && dietRecords.MORNING[0].totalCalories > 0 && <MealDetail mealType="아침" records={dietRecords.MORNING} mealType2="MORNING" onRecordClick={handleRecordClick}/>}
    </div><div>
      {dietRecords.LUNCH.length > 0 && dietRecords.LUNCH[0].totalCalories > 0 && <MealDetail mealType="점심" records={dietRecords.LUNCH} mealType2="LUNCH" onRecordClick={handleRecordClick}/>}
    </div><div>
      {dietRecords.DINNER.length > 0 && dietRecords.DINNER[0].totalCalories > 0 && <MealDetail mealType="저녁" records={dietRecords.DINNER} mealType2="DINNER" onRecordClick={handleRecordClick}/>}
    </div><div>
      {dietRecords.SNACK.length > 0 && dietRecords.SNACK[0].totalCalories > 0 && <MealDetail mealType="간식" records={dietRecords.SNACK} mealType2="SNACK" onRecordClick={handleRecordClick}/>}
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <img className="cursor-pointer" src="img/append.png" alt="식단 추가" onClick={() => setIsPopupOpen(true)}/>
    </div>

  </div>
  <div className="flex-1 flex flex-col justify-center items-center">
    {/* <div className="mb-4">
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('diet')}>식단</button>
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('inbody')}>인바디</button>
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('feedback')}>피드백</button>
    </div>
    <div>
      {renderView()}
    </div> */}
    <div className="calories-bars">
          <NutritionBar label={`| 칼로리 `} percentage={(energy / maxEntryCalories * 100).toFixed(1)} label2={`${(energy * 1).toFixed(1)} / ${maxEntryCalories}`} />
    </div>
    
    <div className="nutrition-bars">
        
        
          
          <NutritionBar label={`| 탄수화물 `} percentage={(carbs / maxEntryCarbs * 100).toFixed(1)} label2={`${(carbs * 1).toFixed(1)} / ${maxEntryCarbs}`} />
          
          <NutritionBar label={`| 단백질 `} percentage={(protein / maxEntryProtein * 100).toFixed(1)} label2={`${(protein * 1).toFixed(1)} / ${maxEntryProtein}`}/>
          
          <NutritionBar label={`| 지방 `} percentage={(fat / maxEntryFat * 100).toFixed(1)} label2={`${(fat * 1).toFixed(1)} / ${maxEntryFat}`}/>
    </div>
    <button onClick={() => navigate('/log')} className="red-button">오늘의 결과 확인</button>
  </div>
</section>
  );
};

  const MealDetail = ({ mealType, records, mealType2, onRecordClick }) => {
    
    return (
      <div className='a-record-details p-4 mb-4 bg-gray-100 rounded-lg shadow'>
        <h4>{mealType}</h4>
        {records.map((record) => (
          <div key={record.dietUuid} className="meal-record cursor-pointer"
          onClick={() => onRecordClick(mealType2)}>
            <div className='font-semibold text-lg'>총 {record.totalCalories.toFixed(2)} kcal 섭취</div>
            <div className='aadetails'>상세정보 확인 &gt;</div>
            {/* <div>탄수화물: {record.totalCarbohydrate}g</div>
            <div>단백질: {record.totalProtein}g</div>
            <div>지방: {record.totalFat}g</div>
            {record.dietFoods.map(food => (
              <div key={food.dietfoodUuid}>{food.foodName} - 수량: {food.quantity}</div>
            ))} */}
          </div>
        ))}
      </div>
    );
  };

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  
  const RecordViewDiet = ({ selectedDate }) => {
    const [dietRecords, setDietRecords] = useState([]);
    const [activeMealType, setActiveMealType] = useState('MORNING'); // 기본값으로 '아침' 설정

  
    useEffect(() => {
    if (selectedDate) {
      console.log('Fetching data for date:', selectedDate);
      fetchDietData();
    }
  }, [selectedDate, activeMealType]);

  
    const fetchDietData = async () => {
      const formattedDate = getFormattedDate(selectedDate);
      const memberUuid = localStorage.getItem("userUuid"); // 현재 사용자의 UUID를 가져옵니다.
      
      console.log(`Fetching diet data for ${formattedDate} and member ${memberUuid}`);

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/diet/date-memberUuid`, {
          params: { date: formattedDate, memberUuid, mealType: activeMealType }
        });
        // 상태를 업데이트하여 식단 정보를 저장합니다.
        setDietRecords(response.data);
      } catch (error) {
        console.error('식단 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    const handleMealTypeSelect = (mealType) => {
      setActiveMealType(mealType);
      fetchDietData(mealType); // 변경된 부분
    };
  
    // 식단 데이터를 식사 유형별로 구분합니다.
    const meals = {
      MORNING: [],
      LUNCH: [],
      DINNER: [],
      SNACK: []
    };
  
    dietRecords.forEach(record => {
      if (meals[record.mealType]) {
        meals[record.mealType].push(record);
      }
    });

    return (
      <div className="record-view-diet">
        <h3 className="text-xl font-semibold mb-4">{selectedDate ? `식단 정보: ${selectedDate.toLocaleDateString()}` : '날짜를 선택해주세요'}</h3>
        <div className="meal-type-buttons flex flex-wrap justify-center mb-4">
          {Object.keys(meals).map(mealType => (
            <button
              key={mealType}
              onClick={() => handleMealTypeSelect(mealType)}
              className={`inline-flex items-center bg-[#88d1f9] border-0 py-1 px-5 rounded-2xl focus:outline-none text-white mt-0 mr-2 mb-2 ${activeMealType === mealType ? 'bg-blue-700' : 'bg-[#88d1f9]'}`}
            >
              {mealType === 'MORNING' ? '아침' :
               mealType === 'LUNCH' ? '점심' :
               mealType === 'DINNER' ? '저녁' :
               mealType === 'SNACK' ? '간식' : ''}
            </button>
          ))}
        </div>
        <DietRecord records={meals[activeMealType]} />
      </div>
    );
  };
  
const RecordViewInBody = ({ selectedDate, onFeedbackRequest }) => {
  return (
    <div>
      인바디 뷰입니다. 선택된 날짜: {selectedDate.toDateString()}

      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={onFeedbackRequest}>피드백 요청</button>
    </div>
  );
};

const RecordViewFeedback = ({ selectedDate, onFeedbackGenerated }) => {
  return (
    <div>
      피드백 뷰입니다. 선택된 날짜: {selectedDate.toDateString()}

      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={onFeedbackGenerated}>피드백 생성</button>
    </div>        
  );
};

export default RecordView;
