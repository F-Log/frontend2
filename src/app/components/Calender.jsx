import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 라이브러리를 사용하여 HTTP 요청을 보낼 수 있습니다.
import CalenderUI from './CalenderUI';
import DietRecord from './DietRecord'; 


const RecordView = () => {
  const [view, setView] = useState('diet'); // 현재 보고 있는 뷰 상태
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    console.log('Selected date:', date);
    setSelectedDate(date);
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
  <div className="flex-1">
    
    <CalenderUI 
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
    />
  </div>
  <div className="flex-1 flex flex-col justify-center items-center">
    <div className="mb-4">
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('diet')}>식단</button>
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('inbody')}>인바디</button>
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('feedback')}>피드백</button>
    </div>
    <div>
      {renderView()}
    </div>
  </div>
</section>
  );
};

  const MealDetail = ({ mealType, records }) => {
    return (
      <div>
        <h4>{mealType}</h4>
        {records.map((record) => (
          <div key={record.dietUuid} className="meal-record">
            <div>칼로리: {record.totalCalories}</div>
            <div>탄수화물: {record.totalCarbohydrate}g</div>
            <div>단백질: {record.totalProtein}g</div>
            <div>지방: {record.totalFat}g</div>
            {record.dietFoods.map(food => (
              <div key={food.dietfoodUuid}>{food.foodName} - 수량: {food.quantity}</div>
            ))}
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
