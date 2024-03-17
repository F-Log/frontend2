import React, { useState, useContext, useEffect } from 'react';
import { FoodContext } from './FoodContext';
import { useUser } from "./FoodContext";
import axios from "axios";

function FoodInputPopup({ foodData, setFoodData, onClose, onSave }) {
  

  const mealTypes = ['MORNING', 'LUNCH', 'DINNER', 'SNACK'];

  const handleChangeMealType = (e) => {
    setFoodData({ ...foodData, mealType: e.target.value });
  };

  const handleSave = () => {
    onSave(foodData); // 변경된 foodData를 onSave를 통해 상위 컴포넌트로 전달
    onClose(); // 팝업 닫기
  };
  
  const handleChange = (name, value) => {
    setFoodData(prev => ({ ...prev, [name]: value }));
  };

  return (
    
    <div className="food-input-popup">
      {/*<h2>식품명: {selectedFood}</h2>*/}
      <input 
        type="text" 
        placeholder='식품명을 입력하세요'
        value={foodData.foodName} 
        onChange={(e) => handleChange('foodName', e.target.value)} 
      />
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
        <button onClick={handleSave}
        className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
        >확인</button>
        <button onClick={onClose}
        className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
        >닫기</button>
      </div>
    </div>
    
  );
}

function Search() {
  const userUuid = localStorage.getItem("userUuid");
  const [searchTerm, setSearchTerm] = useState('');
  const [relatedSearches, setRelatedSearches] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNewPopupOpen, setIsNewPopupOpen] = useState(false);
  const { recentSearches, setRecentSearches, todaysMeals, setTodaysMeals } = useContext(FoodContext);
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [editedMealIndex, setEditedMealIndex] = useState(null);
  const [selectedFoodData, setSelectedFoodData] = useState(null);
  const mealTypes = ['all', 'MORNING', 'LUNCH', 'DINNER', 'SNACK'];
  const [foodData, setFoodData] = useState({
    foodUuid: '',
    foodName: '',
    amount: 100,
    multiplier: 1,
    energy: 100,
    carbs: 100,
    fat: 100,
    protein: 100,
    mealType: 'MORNING',
    dietfoodUuid: ''
  });
  const [newFoodData, setNewFoodData] = useState({
    foodUuid: '',
    foodName: '',
    amount: 100,
    multiplier: 1,
    energy: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    mealType: 'MORNING',
    dietfoodUuid: ''
  });
  const [dietUuids, setDietUuids] = useState({
    MORNING: '',
    LUNCH: '',
    DINNER: '',
    SNACK: ''
  });

  useEffect(() => {
    const mealTypes = ['MORNING', 'LUNCH', 'DINNER', 'SNACK'];
    const mealDate = new Date().toISOString().split('T')[0]; // 현재 날짜를 YYYY-MM-DD 형식으로 가져옴
    const memberUuid = userUuid; // 사용자 UUID

    // 각 식사 유형에 대한 초기화 요청을 보내고 dietUuid를 로그로 출력
    mealTypes.forEach(async (mealType) => {
      try {
        const postData = {
          memberUuid,
          mealType,
          mealDate
        };
        
        const response = await axios.post("http://localhost:8080/api/v1/diet/register", postData);
        const dietUuid = response.data.dietUuid;
        setDietUuids((prevUuids) => ({ ...prevUuids, [mealType]: dietUuid }));
        console.log(`식사 유형 ${mealType}에 대한 dietUuid: `, dietUuid);
      } catch (error) {
        console.error(`식사 유형 ${mealType} 초기화 실패: `, error);
      }
    });
  }, []);
/* 미사용 코드
  const initializeDiet = async (mealType) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/diet/register', {
        memberUuid: userUuid,
        mealType: mealType,
        mealDate: '2024-03-17'
      });
      return response.data.dietUuid;
    } catch (error) {
      console.error(`Failed to initialize diet for ${mealType}:`, error);
    }
  };*/

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchRelatedSearches(term); // 연관 검색어 가져오기
  };

  /*
  const handleMake = (term) => {
    // 사용자 지정 검색어를 최근 검색어 목록에 추가
    setRecentSearches(prevSearches => [term, ...prevSearches.slice(0, 9)]);
    setIsPopupOpen(true); // 팝업 열기
    //fetchRelatedSearches(term);
  };*/
  const handleMake = (term) => {
    setNewFoodData({
      foodUuid: '', // default value
      foodName: term, // keep the term provided by the user
      amount: 100,    // default value
      multiplier: 1,  // default value
      energy: 0,      // default value
      carbs: 0,       // default value
      fat: 0,         // default value
      protein: 0,     // default value
      mealType: 'MORNING', // default value
      dietfoodUuid: '' // default value
    });
    // 사용자 지정 검색어를 최근 검색어 목록에 추가
    setIsNewPopupOpen(true); // 팝업 열기
    //fetchRelatedSearches(term);
  };

  const fetchRelatedSearches = async (searchTerm) => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/food/search", {
        params: { // 'params' 객체를 사용하여 쿼리 매개변수 전달
          foodName: searchTerm,
          size: 100
        }
      });
      // 서버 응답에서 필요한 정보만 추출하여 상태 업데이트
      const relatedSearches = response.data.content.map(item => ({
        foodName: item.foodName,
        foodUuid: item.foodUuid
      }));
      setRelatedSearches(relatedSearches);
    } catch (error) {
      console.error(`연관 검색어를 가져오는 데 실패했습니다: ${searchTerm}`, error);
    }
  };


  const handleSaveFood = async (updatedFoodData) => {
    const dietUuid = dietUuids[updatedFoodData.mealType];
    const foodUuid = updatedFoodData.foodUuid; // 음식의 uuid를 가져옵니다.
  
    if (editedMealIndex !== null) {
      const deletingDietUuid = updatedFoodData.dietfoodUuid;
      // 기존 식단 항목을 업데이트하는 경우
      console.log(`식사 유형 ${updatedFoodData.mealType}에 대한 업데이트 dietUuid: `, dietUuid, `음식 uuid: `, foodUuid);
      setTodaysMeals(prevMeals =>
        prevMeals.map((meal, index) =>
          index === editedMealIndex ? { ...meal, ...updatedFoodData } : meal
        )
      );
      try {
        const response = await axios.post("http://localhost:8080/api/v1/dietfoods/new", { // 실제 요청 URL로 교체해야 합니다.
          memberUuid: userUuid,
          foodUuid: foodUuid,
          dietUuid: dietUuid,
          quantity: updatedFoodData.amount,
          notes: ""
        });
        console.log('Food logged:', response.data);
        updatedFoodData.dietfoodUuid = response.data.dietfoodUuid;
      } catch (error) {
        // Handle the error if the POST request fails
        console.error('Failed to log food:', error);
      }
      try {
        console.log(`식사 딜리트 fooddietUuid: `, deletingDietUuid);
        const response = await axios.delete(`http://localhost:8080/api/v1/dietfoods/${deletingDietUuid}`, {});
        console.log('Food deleted:', response.data);
      } catch (error) {
        // Handle the error if the POST request fails
        console.error('Failed to delete food:', error);
      }
      
    } else {
      // 새 식단 항목을 추가하는 경우
      console.log(`식사 유형 ${updatedFoodData.mealType}에 대한 post dietUuid: `, dietUuid, `음식 uuid: `, foodUuid);
      try {
        const response = await axios.post("http://localhost:8080/api/v1/dietfoods/new", { // 실제 요청 URL로 교체해야 합니다.
          memberUuid: userUuid,
          foodUuid: foodUuid,
          dietUuid: dietUuid,
          quantity: updatedFoodData.amount,
          notes: ""
        });
        console.log('Food logged:', response.data);
        updatedFoodData.dietfoodUuid = response.data.dietfoodUuid;
        // If the POST request is successful, update the meals list
        if (editedMealIndex !== null) {
          // Update an existing meal
          setTodaysMeals(prevMeals =>
            prevMeals.map((meal, index) =>
              index === editedMealIndex ? { ...meal, ...updatedFoodData } : meal
            )
          );
        } else {
          // Add a new meal if none is being edited
          setTodaysMeals(prevMeals => [...prevMeals, { ...updatedFoodData, id: prevMeals.length }]);
        }
      } catch (error) {
        // Handle the error if the POST request fails
        console.error('Failed to log food:', error);
      }

      //setTodaysMeals(prevMeals => [...prevMeals, { ...updatedFoodData, id: prevMeals.length }]);
    }
    // 팝업 닫기 및 편집 인덱스 초기화
    setIsPopupOpen(false);
    setIsNewPopupOpen(false);
    setEditedMealIndex(null);
  };
  /*
  const handleSaveFood = async (updatedFoodData) => {
    const dietUuid = dietUuids[updatedFoodData.mealType];
    // Create an object with data you want to send
    const postData = {
      userUuid: userUuid, // assuming you have the user's UUID
      foodUuid: updatedFoodData.uuid, // make sure updatedFoodData contains uuid
      amount: updatedFoodData.amount,
    };
  
    try {
      // Send a POST request to the server
      const response = await axios.post('http://localhost:8080/api/v1/food/new', postData);
      console.log('Food logged:', response.data);
      // If the POST request is successful, update the meals list
      if (editedMealIndex !== null) {
        // Update an existing meal
        setTodaysMeals(prevMeals =>
          prevMeals.map((meal, index) =>
            index === editedMealIndex ? { ...meal, ...updatedFoodData } : meal
          )
        );
      } else {
        // Add a new meal if none is being edited
        setTodaysMeals(prevMeals => [...prevMeals, { ...updatedFoodData, id: prevMeals.length }]);
      }
    } catch (error) {
      // Handle the error if the POST request fails
      console.error('Failed to log food:', error);
    }
    
    // Close the popup and reset the editedMealIndex
    setIsPopupOpen(false);
    setIsNewPopupOpen(false);
    setEditedMealIndex(null);
  };
  
*/
  const handleSelectRelatedSearch = async (foodUuid) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/food/${foodUuid}`);
      const details = response.data;
      setFoodData({
        foodUuid: details.foodUuid,
        foodName: details.foodName,
        amount: details.servingUnit || 100,
        multiplier: 1,
        energy: details.calories,
        carbs: details.carbohydrate,
        fat: details.fat,
        protein: details.protein,
        mealType: "MORNING",
        dietfoodUuid: details.dietfoodUuid
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error("식품 상세 정보를 가져오는 데 실패했습니다:", error);
    }
  };


  const handleRelatedSearchClick = async (foodUuid) => {
    try {
      // API 호출을 통해 음식 상세 정보 가져오기
      const response = await axios.get(`http://localhost:8080/api/v1/food/${foodUuid}`);
      const foodDetails = response.data;
      // 가져온 음식 상세 정보를 사용하여 selectedFoodData 상태 업데이트
      setSelectedFoodData({
        ...foodDetails,
        foodUuid: foodDetails.foodUuid,
        foodName: foodDetails.foodName,
        amount: foodDetails.servingSize || 100, // 예시로 100을 기본값으로 설정
        multiplier: 1,
        energy: foodDetails.calories,
        carbs: foodDetails.carbohydrate,
        fat: foodDetails.fat,
        protein: foodDetails.protein,
        mealType: foodDetails.mealType,
        dietfoodUuid: foodDetails.dietfoodUuid
      });
      setIsPopupOpen(true); // 팝업 열기
    } catch (error) {
      console.error(`음식 정보를 가져오는 데 실패했습니다:${foodUuid}`, error);
    }
  };

  const handleEditClick = (index) => {
    const mealToEdit = todaysMeals[index];
    setFoodData({
      ...mealToEdit
    });
    setEditedMealIndex(index);
    setIsPopupOpen(true);
  };

{/* 미사용 코드
  const handleEditFood = (indexToEdit) => {
    setEditedMealIndex(indexToEdit); // You'll need to add this to your state
    setIsPopupOpen(true);
  };
*/}

  /*const handleDeleteFood = (indexToDelete) => {
    setTodaysMeals((currentMeals) =>
      currentMeals.filter((_, index) => index !== indexToDelete),
      //setDeletingDiet(currentMeals)
    );
    //console.log(`식사 유형 ${deletingDiet.mealType}에 대한 delete dietUuid: `, dietUuids[deletingDiet.mealType], `음식 uuid: `, deletingDiet.foodUuid);
    // Here you would also call your API to delete the item from the server
  };*/
  const handleDeleteFood = (indexToDelete) => {
    setTodaysMeals((currentMeals) => {
      // 삭제될 음식 정보 파악
      const deletingDiet = currentMeals[indexToDelete];
  
      // 서버에 삭제 요청 (가정)
      deleteDietFromServer(deletingDiet);
  
      // 나머지 음식 목록으로 상태 업데이트
      return currentMeals.filter((_, index) => index !== indexToDelete);
    });
  };
  
  // 서버에 삭제 요청을 보내는 함수 (가정)
  const deleteDietFromServer = async (deletingDiet) => {
    console.log(`식사 유형 ${deletingDiet.mealType}에 대한 delete dietUuid: `, dietUuids[deletingDiet.mealType], `음식 uuid: `, deletingDiet.foodUuid);
    try {
      
      console.log(`식사 딜리트 fooddietUuid: `, deletingDiet.dietfoodUuid);
      const response = await axios.delete(`http://localhost:8080/api/v1/dietfoods/${deletingDiet.dietfoodUuid}`, {});
      console.log('Food deleted:', response.data);
    } catch (error) {
      // Handle the error if the POST request fails
      console.error('Failed to delete food:', error);
    }
  };
  

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
      />
      <button onClick={() => handleSearch(searchTerm)}
      className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">검색</button>
      <button onClick={() => handleMake(searchTerm)}
      className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">사용자 지정 추가</button>

      <div className="related-searches-container">
        <h2>연관 검색어</h2>
        <div className="related-searches-scrollable">
          {relatedSearches.map((relatedSearch) => (
            <button
              key={relatedSearch.foodUuid}
              onClick={() => handleSelectRelatedSearch(relatedSearch.foodUuid)}
              className="related-search-item"
            >
              {relatedSearch.foodName}
            </button>
          ))}
        </div>
      </div>


      {isPopupOpen && (
        <FoodInputPopup
          foodData={foodData}
          setFoodData={setFoodData}
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSaveFood} // onSave prop을 통해 handleSaveFood 함수 전달
        />
      )}
      {isNewPopupOpen && (
        <FoodInputPopup
          foodData={newFoodData}
          setFoodData={setNewFoodData} // Pass the setter function as a prop
          onClose={() => setIsNewPopupOpen(false)}
          onSave={handleSaveFood}
        />
      )}
      {/* 미사용 코드
      {isPopupOpen && (
        <FoodInputPopup 
          selectedFood={editedMealIndex != null ? todaysMeals[editedMealIndex].foodName : searchTerm}
          foodData={editedMealIndex != null ? todaysMeals[editedMealIndex] : undefined}
          setFoodData={setFoodData}
          onClose={() => {
            setIsPopupOpen(false);
            setEditedMealIndex(null); // Reset on close
          }}
          onSave={handleSaveFood}
        />
        )}*/}

      {/* 최근 검색어 목록 
      <div>
        <h2>최근 검색어</h2>
        {recentSearches.slice(-10).map((search, index) => (
          <button key={index} onClick={() => handleSearch(search)}
          className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">
            {search}
          </button>
        ))}
      </div>
      */}
      {/* Buttons to select the meal type */}
      {mealTypes.map((type) => (
        <button
            key={type}
            onClick={() => setSelectedMealType(type)}
            className={`meal-type-button ${selectedMealType === type ? 'active' : ''}`}
          >
            {type === 'all' && '전체'}
            {type === 'MORNING' && '아침'}
            {type === 'LUNCH' && '점심'}
            {type === 'DINNER' && '저녁'}
            {type === 'SNACK' && '간식'}
          </button>
      ))}

      {/* 오늘의 식단 목록 */}
      <div>
        <h2>오늘의 식단</h2>
        <div className="meals-grid">
          {todaysMeals
            .filter((meal) => selectedMealType === 'all' || meal.mealType === selectedMealType)
            .map((meal, index) => (
              <div key={meal.id || index} className="meal-item">
                <button className="delete-button" onClick={() => handleDeleteFood(index)}>X</button>
                <button onClick={() => handleEditClick(index)}>Edit</button>
                <div>식품명: {meal.foodName}</div>
                <div>양: {meal.amount}g</div>
                <div>에너지: {meal.energy}kcal</div>
                <div>탄수화물: {meal.carbs}g</div>
                <div>지방: {meal.fat}g</div>
                <div>단백질: {meal.protein}g</div>
              </div>
            ))}
        </div>
      </div>

    </div>
    </section>
  );
}

export default Search;