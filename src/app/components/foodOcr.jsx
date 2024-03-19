import React, { useState } from 'react';
import './foodOcr.css';

function FoodOcr() {
  const [nutritionData, setNutritionData] = useState({
    아침: { 탄수화물: 0, 단백질: 0, 지방: 0 },
    점심: { 탄수화물: 0, 단백질: 0, 지방: 0 },
    저녁: { 탄수화물: 0, 단백질: 0, 지방: 0 },
    간식: { 탄수화물: 0, 단백질: 0, 지방: 0 },
  });

  const [selectedMeal, setSelectedMeal] = useState('아침'); // 현재 선택된 식사 시간
  const [image, setImage] = useState(null);

  const calculateTotalNutrients = () => {
    return {
      탄수화물: Object.values(nutritionData).reduce((acc, meal) => acc + (meal?.탄수화물 || 0), 0),
      단백질: Object.values(nutritionData).reduce((acc, meal) => acc + (meal?.단백질 || 0), 0),
      지방: Object.values(nutritionData).reduce((acc, meal) => acc + (meal?.지방 || 0), 0),
    };
  };

  const totalIntake = calculateTotalNutrients();

  const dailyLimits = { 탄수화물: 500, 단백질: 500, 지방: 500, totalKcal: 4000 };

  const totalCalories =
    totalIntake.탄수화물 * 4 +
    totalIntake.단백질 * 4 +
    totalIntake.지방 * 9;

  const handleNutrientChange = (e, nutrient) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    setNutritionData(prev => ({
      ...prev,
      [selectedMeal]: {
        ...prev[selectedMeal],
        [nutrient]: value
      }
    }));
  };

  const getBarFill = (nutrientValue, nutrientType) => {
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
          지방: parseInt(data.fat, 10) || 0
        }
      }));
    } catch (error) {
      alert('OCR 처리 중 오류가 발생했습니다: ' + error);
    }
  };

  return (
    <div className="foodlog-container">
      {/* 이미지 업로드 섹션 */}
      <div className="image-upload-section">
        <label htmlFor="food-nutrition-upload">식품성분표 업로드</label>
        <input
          id="food-nutrition-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button onClick={uploadImageAndAnalyze}>업로드 및 분석</button>
      </div>

      {/* 총 섭취량 바 */}
      <div className="total-intake-section">
        <h2>총 섭취 칼로리: {totalCalories} kcal</h2>
        <div className="bar-container">
          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: `${(totalCalories / dailyLimits.totalKcal) * 100}%` }}
            >
              <span className="bar-text">{totalCalories} / {dailyLimits.totalKcal} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 식사 선택 버튼들 */}
      <div className="meal-select-section">
        {Object.keys(nutritionData).map((meal) => (
          <button
            key={meal}
            className={`meal-select-button ${selectedMeal === meal ? 'active' : ''}`}
            onClick={() => setSelectedMeal(meal)}
          >
            {meal}
          </button>
        ))}
      </div>

      {/* 각 식사에 대한 영양소 바 */}
      <div className="meal-nutrition-section">
        {nutritionData[selectedMeal] && Object.keys(nutritionData[selectedMeal]).map(nutrient => (
          <div className="bar-container" key={nutrient}>
            <div className="bar-label">{nutrient}</div>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: getBarFill(nutritionData[selectedMeal]?.[nutrient] || 0, nutrient) }}
              >
                <span className="bar-text">
                  {nutritionData[selectedMeal]?.[nutrient] || 0} / {dailyLimits[nutrient]} g
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 영양소 섭취량 입력 섹션 */}
      <div className="nutrition-input-section">
        <h2>{selectedMeal}의 섭취량 입력</h2>
        {Object.keys(dailyLimits).map((nutrient) => (
          <div className="input-group" key={nutrient}>
            <label>{nutrient}</label>
            <input
              type="number"
              value={nutritionData[selectedMeal]?.[nutrient] || ''}
              onChange={(e) => handleNutrientChange(e, nutrient)}
            />
            <span>g</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodOcr;
