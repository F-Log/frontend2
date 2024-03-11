import React, { useState, useContext } from 'react';
import { FoodContext } from './FoodContext';

function FoodInputPopup({ selectedFood, onClose, onSave }) {
  const [foodData, setFoodData] = useState({
    foodName: selectedFood,
    amount: 100,
    multiplier: 1,
    energy: 100,
    carbs: 100,
    fat: 100,
    protein: 100
  });

  const handleSave = () => {
    onSave({
      ...foodData,
      amount: foodData.amount * foodData.multiplier
    });
    onClose();
  };

  const handleChange = (name, value) => {
    setFoodData(prevFoodData => ({
      ...prevFoodData,
      [name]: value
    }));
  };

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
    <div className="food-input-popup">
      <h2>식품명: {selectedFood}</h2>
      <input 
        type="text" 
        value={foodData.foodName} 
        onChange={(e) => handleChange('foodName', e.target.value)} 
      />
      <label>
        먹은 양 (g):
        <input
          type="range"
          min="0.1"
          max="5.0"
          step="0.1"
          value={foodData.multiplier}
          onChange={(e) => handleChange('multiplier', e.target.value)}
        />
        {foodData.amount * foodData.multiplier} g
      </label>
      <label>
        에너지 (kcal):
        <input
          type="number"
          value={foodData.energy}
          onChange={(e) => handleChange('energy', e.target.value)}
        />
      </label>
      <label>
        탄수화물 (g):
        <input
          type="number"
          value={foodData.carbs}
          onChange={(e) => handleChange('carbs', e.target.value)}
        />
      </label>
      <label>
        지방 (g):
        <input
          type="number"
          value={foodData.fat}
          onChange={(e) => handleChange('fat', e.target.value)}
        />
      </label>
      <label>
        단백질 (g):
        <input
          type="number"
          value={foodData.protein}
          onChange={(e) => handleChange('protein', e.target.value)}
        />
      </label>
      <div className="buttons">
        <button onClick={handleSave}>확인</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
    </section>
  );
}

function OCR() {
  const [image, setImage] = useState(null);
  const [selectedFood, setSelectedFood] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { recentSearches, setRecentSearches, todaysMeals, setTodaysMeals } = useContext(FoodContext);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleConfirm = () => {
    const analyzedFoodName = 'test';
    setSelectedFood(analyzedFoodName);
    setRecentSearches(prevSearches => [...prevSearches, analyzedFoodName]);
    setIsPopupOpen(true);
  };

  const handleSaveFood = (foodData) => {
    setTodaysMeals(prevMeals => [...prevMeals, foodData]);
    setIsPopupOpen(false);
  };

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleConfirm}
      className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
      >확인</button>

      {isPopupOpen && (
        <FoodInputPopup 
          selectedFood={selectedFood}
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSaveFood}
        />
      )}

      {/* 최근 검색어 목록 */}
      <div>
        <h2>최근 검색어</h2>
        {recentSearches.slice(-10).map((search, index) => (
          <button key={index} 
          className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
          onClick={() => setSelectedFood(search)}>
            {search}
          </button>
        ))}
      </div>

      {/* 오늘의 식단 목록 */}
      
      <div>
        <h2>오늘의 식단</h2>
        {todaysMeals.map((meal, index) => (
          <section className="text-gray-600 body-font relative bg- w-[95%] mx-auto mt-5">
          <div key={index}>
          <div>식품명: {meal.foodName}</div>
          <div>양: {meal.amount}g</div>
          <div>에너지: {meal.energy}kcal</div>
          <div>탄수화물: {meal.carbs}g</div>
          <div>지방: {meal.fat}g</div>
          <div>단백질: {meal.protein}g</div>
        </div>
        </section>
        ))}
      </div>
      
    </div>
    </section>
  );
}

export default OCR;