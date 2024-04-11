import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import useInitializeMealTypes from './Search';

function Home() {
  const navigate = useNavigate();
  const meals = {
    MORNING: [],
    LUNCH: [],
    DINNER: [],
    SNACK: []
  };
  const selectedDate = new Date();
  const [dietRecords, setDietRecords] = useState({
    MORNING: [],
    LUNCH: [],
    DINNER: [],
    SNACK: []
  });
  const userUuid = localStorage.getItem("userUuid");
  // dietRecords.forEach(record => {
  //   if (meals[record.mealType]) {
  //     meals[record.mealType].push(record);
  //   }
  // });

  useInitializeMealTypes(userUuid);

  useEffect(() => {
    if (selectedDate) {
      console.log('Fetching data for date:', selectedDate);
      fetchDietData("MORNING");
      fetchDietData("LUNCH");
      fetchDietData("DINNER");
    }
  }, []);

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchDietData = async (activeMealType) => {
    const formattedDate = getFormattedDate(new Date());
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

  const DietRecord = ({ records }) => {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.
  
    // record 클릭 핸들러 함수
    const handleRecordClick = (mealType) => {
      navigate(`/HomeDetails/${mealType}`); // 클릭 시 mealType에 따라 HomeDetails 페이지로 라우팅합니다.
    };
  
    return (
      <div className="diet-record">
        {records.map((record, index) => (
          <div
            key={index}
            className="record-details p-4 mb-4 bg-gray-100 rounded-lg shadow"
            onClick={() => handleRecordClick(record.mealType)} // div 클릭 시 handleRecordClick 함수 호출
          >
            <h4 className="font-semibold text-lg mb-2">{record.mealType}</h4>
            <p className="mb-1">칼로리: {record.totalCalories} kcal</p>
            <p className="mb-1">탄수화물: {record.totalCarbohydrate} g</p>
            <p className="mb-1">단백질: {record.totalProtein} g</p>
            <p className="mb-3">지방: {record.totalFat} g</p>
            <p className="details"><u>자세히 보기</u></p>
          </div>
        ))}
      </div>
    );
  };

  return (
    
    <div className="home-body">
      <div className="center-text">
        <p>오늘의 식단을 등록하세요!</p>
      </div>
      <div className="buttons-section">
        <button onClick={() => navigate('/FoodOcr')} className="button">영양성분표 업로드</button>
        
        <button onClick={() => navigate('/search')} className="button">음식명으로 검색</button>
        
      </div>
      <div className="lists-section">
        <DietRecord records={dietRecords['MORNING']} />
        <DietRecord records={dietRecords['LUNCH']} />
        <DietRecord records={dietRecords['DINNER']} />
      </div>
      <div className="center-text">
        <p>오늘의 식단 등록이 마무리됐다면?</p>
      </div>
      <button onClick={() => navigate('/log')} className="red-button">오늘의 결과 확인</button>
    </div>
  );
}

export default Home;