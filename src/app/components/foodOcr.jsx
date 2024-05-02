import './foodOcr.css';
import inputOcr from './img/inputOcr.png'; // 이미지 임포트
import React, { useState, useEffect } from 'react';


function FoodOcr() {
  const [nutritionData, setNutritionData] = useState({
    아침: { 탄수화물: 0, 단백질: 0, 지방: 0, 총칼로리: 0 },
    점심: { 탄수화물: 0, 단백질: 0, 지방: 0, 총칼로리: 0 },
    저녁: { 탄수화물: 0, 단백질: 0, 지방: 0, 총칼로리: 0 },
    간식: { 탄수화물: 0, 단백질: 0, 지방: 0, 총칼로리: 0 },
  });

  const [selectedMeal, setSelectedMeal] = useState('아침');
  const [image, setImage] = useState(null);
  

  const dailyLimits = { 탄수화물: 500, 단백질: 500, 지방: 500, totalKcal: 5000 };



  const handleNutrientChange = (e, nutrient) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    setNutritionData(prev => ({
      ...prev,
      [selectedMeal]: {
        ...prev[selectedMeal],
        [nutrient]: value,
        총칼로리: prev[selectedMeal].총칼로리 + (nutrient === '총칼로리' ? value - prev[selectedMeal].총칼로리 : 0)
      }
    }));
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNutritionData(prev => ({
      ...prev,
      [selectedMeal]: {
        ...prev[selectedMeal],
        총칼로리: value
      }
    }));
  };

  const getBarFill = (nutrientValue, nutrientType) => {
    const dailyLimits = { 탄수화물: 500, 단백질: 500, 지방: 500, 총칼로리: 5000 };
    return (nutrientValue / dailyLimits[nutrientType]) * 100 + '%';
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const uploadImageAndAnalyze = async () => {
    if (!image) {
      alert('식품 영양 표 이미지를 업로드해주세요.');
      return;
    }

    const memberUuid = localStorage.getItem("userUuid");
    if (!memberUuid) {
      alert('사용자 식별자가 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('memberUuid', memberUuid);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // carbohydrate, protein, fat 값만 추출하여 nutritionData 업데이트
      setNutritionData(prev => ({
        ...prev,
        [selectedMeal]: {
          탄수화물: parseInt(data.carbohydrate, 10) || 0,
          단백질: parseInt(data.protein, 10) || 0,
          지방: parseInt(data.fat, 10) || 0,
          총칼로리: parseInt(data.calories, 10) || 0, // 서버에서 받아온 칼로리 값을 사용합니다.
        }
      }));
    } catch (error) {
      alert('OCR 처리 중 오류가 발생했습니다: ' + error);
    }
  };

  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    // 모든 식사 시간의 총칼로리를 합산하여 totalCalories 값을 업데이트
    const total = Object.values(nutritionData).reduce((acc, meal) => {
      return acc + meal.총칼로리;
    }, 0);
    setTotalCalories(total);
  }, [nutritionData]);

  return (

    
    <div className="foodlog-container">

      {/* 식사 선택 버튼들 */}
      <div className="meal-select-section">
        <select name="meal-time" value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
          {Object.keys(nutritionData).map((meal) => (
            <option key={meal} value={meal}>
              {meal}
            </option>
          ))}
        </select>
      </div>


      <div className="image-upload-section">
        <input
          id="food-nutrition-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {/* 이미지를 클릭하면 파일 선택 다이얼로그가 나타나도록 설정 */}
        <img src={inputOcr} alt="식품성분표 업로드" className="upload-image" onClick={() => document.getElementById('food-nutrition-upload').click()} />
      </div>
      <div className="analyze-start-button" >
      
      <button onClick={uploadImageAndAnalyze}>분석 시작</button>

      </div>

      <div className="total-intake-section">
        <h2>총 칼로리: {totalCalories} kcal</h2>
        <div className="bar-container">
          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: getBarFill(totalCalories, '총칼로리') }}
            >
              <span className="bar-text">
                {totalCalories} / 5000 kcal
              </span>
            </div>
          </div>
        </div>
      </div>


      

      {/* 각 식사에 대한 영양소 바 */}
      <div className="meal-nutrition-section">
        {nutritionData[selectedMeal] && Object.keys(nutritionData[selectedMeal]).map(nutrient => (
          <div className="bar-container" key={nutrient}>
            <div className="bar-label">{nutrient}</div>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: getBarFill(nutritionData[selectedMeal][nutrient], nutrient) }}
              >
                <span className="bar-text">
                  {nutritionData[selectedMeal][nutrient]} / {nutrient === '총칼로리' ? '5000 kcal' : 'g'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="highlighted">올바르지 않은 분석 결과는 수기로 수정해주세요.</h2>

      {/* 영양소 섭취량 입력 섹션 */}
      <div className="nutrition-input-section">
        {/* <h2>{selectedMeal}의 섭취량 입력</h2> */}
        {Object.keys(nutritionData[selectedMeal]).map((nutrient) => (
          <div className="input-group" key={nutrient}>
            <label>{nutrient}</label>
            <input
              type="number"
              value={nutritionData[selectedMeal][nutrient] || ''}
              onChange={(e) => handleNutrientChange(e, nutrient)}
            />
            <span>{nutrient === '총칼로리' ? 'kcal' : 'g'}</span>
          </div>
        ))}
      </div>

      <h2 className="highlighted">올바르지 않은 분석 결과는 수기로 수정해주세요.</h2>


            {/* 각 식사당 칼로리 조정 슬라이더 */}
            <div className="calories-slider-section">
        <label htmlFor="calories-slider">칼로리 조정</label>
        <input
          id="calories-slider"
          type="range"
          min="0"
          max="5000"
          value={nutritionData[selectedMeal].총칼로리}
          onChange={handleSliderChange}
        />
      </div>

      
    </div>

    
  );
}

export default FoodOcr;
