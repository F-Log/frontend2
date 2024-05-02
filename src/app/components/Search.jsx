import React, { useState, useContext, useEffect } from 'react';
import { FoodContext } from './FoodContext';
import { useUser } from "./FoodContext";
import axios from "axios";
import styles from "./Search.module.css";

function FoodInputPopup({ foodData, setFoodData, onClose, onSave, fixed }) {
  const [iniCarb, setIniCarb] = useState((foodData.carbs / foodData.multiplier).toFixed(2));
  const [iniFat, setIniFat] = useState((foodData.fat / foodData.multiplier).toFixed(2));
  const [iniProtein, setIniProtein] = useState((foodData.protein / foodData.multiplier).toFixed(2));
  const [iniEnergy, setIniEnergy] = useState((foodData.energy / foodData.multiplier).toFixed(2));

  const mealTypes = ['MORNING', 'LUNCH', 'DINNER', 'SNACK'];
  console.log('Food data:', foodData);
  const handleChangeMealType = (e) => {
    setFoodData({ ...foodData, mealType: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving food data:', foodData);
    onSave(foodData);
    onClose();
  };
  
  // const handleChange = (name, value) => {
  //   setFoodData(prev => ({ ...prev, [name]: value }));
  // };
  const handleAmountChange = (name, value) => {
    setFoodData(prev => ({ ...prev, [name]: value }));
    setFoodData(prev => ({ ...prev, energy: (iniEnergy * value).toFixed(2) }));
    setFoodData(prev => ({ ...prev, carbs: (iniCarb * value).toFixed(2) }));  
    setFoodData(prev => ({ ...prev, fat: (iniFat * value).toFixed(2) }));
    setFoodData(prev => ({ ...prev, protein: (iniProtein * value).toFixed(2) }));
  };

  const handleChange = (name, value) => {
    const input = (value/foodData.multiplier).toFixed(2);
    const newFoodData = { ...foodData, [name]: value };
    setFoodData(prev => ({ ...prev, [name]: value }));
    console.log(`Handling change for ${name}:`, value, 'Updated data:', newFoodData);
    setFoodData(newFoodData);
    if (name === 'energy') {
      setIniEnergy(input);
    } else if (name === 'carbs') {
      setIniCarb(input);
    } else if (name === 'fat') {  
      setIniFat(input);
    } else if (name === 'protein') {
      setIniProtein(input);
    }
  };

  return (
    
    <div className="food-input-popup">
      {/*<h2>식품명: {selectedFood}</h2>*/}
      <div className="food-input-row">
      <label
      className="select-label">
        <select 
        value={foodData.mealType} onChange={handleChangeMealType}>
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
      {/* <label className="food-name-label"> */}
      <label className="input-group">
        <input 

          type="text" 
          placeholder='식품명을 입력하세요'
          value={foodData.foodName} 
          onChange={(e) => handleChange('foodName', e.target.value)} 
        />
      </label>
      <div className="amount-label-container">
        <label
        htmlFor="amountInput">
          먹은 양 (g) :   {(foodData.amount * foodData.multiplier).toFixed(2)} g
        </label>
        <input
          id="amountInput"
          type="range"
          min="0.1"
          max="5.0"
          step="0.1"
          value={foodData.multiplier}
          onChange={(e) => handleAmountChange('multiplier', parseFloat(e.target.value))}
        />
      </div>
      </div>
      <div className='input-group'>
      <label
      class='flex'>
        에너지 (kcal):
        <input
          class='inline-flex'
          type="number"
          value={foodData.energy}
          onChange={(e) => handleChange('energy', e.target.value)}
          disabled={fixed}
        />
      </label>
      </div>
      <div className="input-group">
      <label
      class='flex'>
        
        탄수화물 (g):
        <input
         class='inline-flex'
          type="number"
          value={foodData.carbs}
          onChange={(e) => handleChange('carbs', e.target.value)}
          disabled={fixed}
        />
      </label>
      </div>
      <div className="input-group">
      <label
      class='flex'>
        지방 (g):
        <input
        class='inline-flex'
          type="number"
          value={foodData.fat}
          onChange={(e) => handleChange('fat', e.target.value)}
          disabled={fixed}
        />
      </label>
      </div>
      <div className="input-group">
      <label
      class='flex'>
        단백질 (g):
        <input
        class='inline-flex'
          type="number"
          value={foodData.protein}
          onChange={(e) => handleChange('protein', e.target.value)}
          disabled={fixed}
        />
      </label>
      </div>
      <div className="buttons">
        <button onClick={handleSave}
        className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
        >확인</button>
        <button onClick={onClose}
        className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5"
        >닫기</button>
      </div>
    </div>
    
  );
}

function Search() {
  const [allRecords, setAllRecords] = useState({
    MORNING: [],
    LUNCH: [],
    DINNER: [],
    SNACK: []
  });
  const [forceUpdate, setForceUpdate] = useState(0);
  const userUuid = localStorage.getItem("userUuid");
  const [isInitialized, setIsInitialized] = useState(false);
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
    const mealDate = new Date().toISOString().split('T')[0];
    const userUuid = localStorage.getItem("userUuid"); // Make sure you have the userUuid
  
    const checkAndInitializeMealTypes = async () => {
      for (const mealType of mealTypes) {
        try {
          const existingUuid = localStorage.getItem(`${mealType}Uuid`);
          const response = await axios.get(`http://localhost:8080/api/v1/diet/${existingUuid}`);
  
          if (response.data && response.data.memberUuid !== userUuid) {
            throw new Error('UUID does not match');
          }
          
          console.log(`${mealType} is already initialized with UUID: ${response.data.dietUuid}`);
        } catch (error) {
          // If there is a mismatch, or it's not initialized, create a new entry
          try {
            const response = await axios.post(`http://localhost:8080/api/v1/diet/register`, {
              memberUuid: userUuid,
              mealType,
              mealDate
            });
            
            const dietUuid = response.data.dietUuid;
            localStorage.setItem(`${mealType}Uuid`, dietUuid);
            console.log(`${mealType} initialized with UUID: ${dietUuid}`);
          } catch (postError) {
            console.error(`Failed to initialize ${mealType}: `, postError);
          }
        }
      }
    };
  
    checkAndInitializeMealTypes();
    
    ['MORNING', 'LUNCH', 'DINNER', 'SNACK'].forEach(fetchDietData);
  }, []);
  const getFormattedDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

  const handleForceUpdate = () => {
    setForceUpdate(forceUpdate + 1);
  };

  const fetchDietData = async (mealType) => {
    const formattedDate = getFormattedDate();
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/diet/date-memberUuid`, {
        params: { date: formattedDate, memberUuid: userUuid, mealType }
      });
      setAllRecords(prevRecords => ({
        ...prevRecords,
        [mealType]: response.data
      }));
      console.log("음식정보 수령 성공", mealType, response.data);
    } catch (error) {
      console.error('식단 정보를 가져오는 데 실패했습니다.', error);
    }
  };
  const DietRecord = ({ record }) => {

    // const [editMode, setEditMode] = useState(false);
    // const [editableData, setEditableData] = useState({
    //   foodName: record.foodName,
    //   calories: record.calories,
    //   carbs: record.carbohydrate,
    //   protein: record.protein,
    //   fat: record.fat,
    // });
    const [foodDetails, setFoodDetails] = useState([]);
    const {dietFoods} = record;
    
    // const [foodData, setFoodData] = useState([
    //   {
    //     foodName: '',
    //     amount: 0,
    //     energy: 0,
    //     carbs: 0,
    //     protein: 0,
    //     fat: 0
    //   }
    // ]);
    // record 배열이 비어있지 않은지 확인하고 dietFoods를 추출합니다.
    // const dietFoods = record.length > 0 ? record[0].dietFoods : [];
    // console.log('record.length:', record.length);
    // console.log('dietFoods:', dietFoods);
    
    
    
    
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
                      foodUuid: dietFoodResponse.data.foodUuid,
                      foodName: foodResponse.data.foodName,
                      amount: foodResponse.data.servingUnit,
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
      // ['MORNING', 'LUNCH', 'DINNER', 'SNACK'].forEach(fetchDietData);
  }, [record, dietFoods, todaysMeals]);
  if (!record) {
    console.error("DietRecord 컴포넌트에 유효하지 않은 record가 전달됨.");
    return null;  // record가 없으면 아무것도 렌더링하지 않음
  }
  // const handleEditClick = (index) => {
  //   const mealToEdit = todaysMeals[index];
  //   setFoodData({
  //     ...mealToEdit
  //   });
  //   setEditedMealIndex(index);
  //   setIsPopupOpen(true);
  // };
  const handleEditClick = (foodDetail) => {
    const { calories, carbohydrate, dietFoodUuid, fat, amount, foodName, foodUuid, protein, quantity } = foodDetail;
    const updatedData = {
        foodUuid: foodUuid,
        dietFoodUuid: dietFoodUuid,
        foodName: foodName,
        multiplier: quantity,
        amount: amount,
        energy: parseFloat(calories),
        carbs: parseFloat(carbohydrate),
        fat: parseFloat(fat),
        protein: parseFloat(protein),
        mealType: selectedMealType, // 현재 선택된 식사 유형을 사용
        dietfoodUuid: dietFoodUuid
    };

    setFoodData(updatedData);
    console.log('편집할 음식 정보:', foodDetail);
    console.log('편집될 음식 정보:', foodData);
    setEditedMealIndex(foodDetails.findIndex((item) => item.dietfoodUuid === foodDetail.dietfoodUuid));
    setIsPopupOpen(true);
};

  
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
    ['MORNING', 'LUNCH', 'DINNER', 'SNACK'].forEach(fetchDietData);
  };
  return (
    <>
        <div className="styles.diet-record">
            {foodDetails.map((foodDetail, index) => (
                <div
                    key={index}
                    className="a-record-details p-4 mb-4 bg-gray-100 rounded-lg shadow"
                    
                >
                    <p className="aadetails" onClick={() => deleteHandler(foodDetail.dietfoodUuid, index)}><u>삭제</u></p>
                    <p className="aadetails" onClick={() => handleEditClick(foodDetail)}><u>편집</u></p>
                    <h4 className="font-semibold text-lg mb-2">{foodDetail.foodName}</h4>
                    <p className="mb-1">칼로리: {foodDetail.calories} kcal</p>
                    <p className="mb-1">탄수화물: {foodDetail.carbohydrate} g</p>
                    <p className="mb-1">단백질: {foodDetail.protein} g</p>
                    <p className="mb-3">지방: {foodDetail.fat} g</p>
                    
                </div>
            ))}
        </div>
    </>
);
};

  const useInitializeMealTypes = (userUuid) => {
    useEffect(() => {
      const mealTypes = ['MORNING', 'LUNCH', 'DINNER', 'SNACK'];
      const mealDate = new Date().toISOString().split('T')[0];
      
      async function checkAndInitializeMealTypes() {
        for (const mealType of mealTypes) {
          try {
            const existingUuid = localStorage.getItem(`${mealType}Uuid`);
            if (existingUuid) {
              const response = await axios.get(`http://localhost:8080/api/v1/diet/${existingUuid}`);
              if (response.data && response.data.memberUuid !== userUuid) {
                throw new Error('UUID does not match');
              }
              console.log(`${mealType} is already initialized with UUID: ${response.data.dietUuid}`);
            } else {
              throw new Error('UUID is not initialized');
            }
          } catch (error) {
            try {
              const response = await axios.post(`http://localhost:8080/api/v1/diet/register`, {
                memberUuid: userUuid,
                mealType,
                mealDate
              });
              const dietUuid = response.data.dietUuid;
              localStorage.setItem(`${mealType}Uuid`, dietUuid);
              console.log(`${mealType} initialized with UUID: ${dietUuid}`);
            } catch (postError) {
              console.error(`Failed to initialize ${mealType}: `, postError);
            }
          }
        }
      }
      
      checkAndInitializeMealTypes();
    }, [userUuid]);
  };


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
      // 사용자 지정 검색 결과
      const response1 = await axios.get("http://localhost:8080/api/v1/food/search", {
        params: { foodName: searchTerm, memberUuid: userUuid, size: 100000 }
      });
      
      // 일반 검색 결과
      const response = await axios.get("http://localhost:8080/api/v1/food/search", {
        params: { foodName: searchTerm, size: 100000 }
      });
      
      // 사용자 지정 검색 결과에 isUserDefined: true 추가
      const userSearchesWithFlag = response1.data.content.map(item => ({
        ...item,
        isUserDefined: true
      }));

      // 일반 검색 결과에 isUserDefined: false 추가
      const generalSearchesWithFlag = response.data.content.map(item => ({
        ...item,
        isUserDefined: false
      }));
      
      // 차집합 계산 및 최상단에 배치
      const uniqueUserSearches = userSearchesWithFlag.filter(r1Item =>
        !generalSearchesWithFlag.some(rItem => rItem.foodUuid === r1Item.foodUuid)
      );
      
      const finalSearchResults = [...uniqueUserSearches, ...generalSearchesWithFlag];
  
      // 최종 결과 업데이트
      setRelatedSearches(finalSearchResults);
    } catch (error) {
      console.error(`Failed to fetch related searches: ${searchTerm}`, error);
    }
};



  const handleSaveFood = async (updatedFoodData) => {
    //const dietUuid = dietUuids[updatedFoodData.mealType];
    const dietUuid = localStorage.getItem(`${updatedFoodData.mealType}Uuid`);
    const foodUuid = updatedFoodData.foodUuid; // 음식의 uuid를 가져옵니다.
    console.log("updatedFoodData: ",updatedFoodData);
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
          foodName: updatedFoodData.foodName,
          quantity: updatedFoodData.multiplier,
          notes: ""
        });
        console.log('Food logged:', response.data);

        //updatedFoodData.dietfoodUuid = response.data.dietfoodUuid;
        const newUpdatedFoodData = {
          ...updatedFoodData,
          dietfoodUuid: response.data.dietfoodUuid
      };

        if (editedMealIndex !== null) {
          // 기존 식단 항목을 업데이트하는 경우
          setTodaysMeals(prevMeals =>
              prevMeals.map((meal, index) =>
                  index === editedMealIndex ? { ...meal, ...newUpdatedFoodData } : meal
              )
          );
      } else {
          // 새 식단 항목을 추가하는 경우
          setTodaysMeals(prevMeals => [...prevMeals, { ...newUpdatedFoodData, id: prevMeals.length }]);
      }
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
          quantity: updatedFoodData.multiplier,
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
    ['MORNING', 'LUNCH', 'DINNER', 'SNACK'].forEach(fetchDietData);
  };


  const handleCreateFood = async (updatedFoodData) => {
    let newUpdatedFoodData = {...updatedFoodData};
    try {
      const response = await axios.post("http://localhost:8080/api/v1/food/new", { // 실제 요청 URL로 교체해야 합니다.          memberUuid: userUuid,
        foodName: updatedFoodData.foodName,
        servingUnit: updatedFoodData.amount,
        calories: updatedFoodData.energy,
        carbohydrate: updatedFoodData.carbs,
        fat: updatedFoodData.fat,
        protein: updatedFoodData.protein,
        memberUuid: userUuid
      });
      console.log('Food appended:', response.data);
      //updatedFoodData.dietfoodUuid = response.data.dietfoodUuid;
      newUpdatedFoodData = {
        ...updatedFoodData,
        foodUuid: response.data.foodUuid
        };
      //setTodaysMeals(prevMeals => [...prevMeals, { ...newUpdatedFoodData, id: prevMeals.length }]);

      
    } catch (error) {
      // Handle the error if the POST request fails
      console.error('Failed to log food:', error);
    }

    //const dietUuid = dietUuids[newUpdatedFoodData.mealType];
    const dietUuid = localStorage.getItem(`${newUpdatedFoodData.mealType}Uuid`);
    const foodUuid = newUpdatedFoodData.foodUuid; // 음식의 uuid를 가져옵니다.
  
    
    console.log(`식사 유형 ${newUpdatedFoodData.mealType}에 대한 post dietUuid: `, dietUuid, `음식 uuid: `, foodUuid);
    try {
      const dietResponse = await axios.post("http://localhost:8080/api/v1/dietfoods/new", { // 실제 요청 URL로 교체해야 합니다.          memberUuid: userUuid,
        foodUuid: foodUuid,
        dietUuid: dietUuid,
        quantity: newUpdatedFoodData.multiplier,
        foodName: foodData.foodName,
        notes: ""
      });
      console.log('Food logged:', dietResponse.data);
      //updatedFoodData.dietfoodUuid = response.data.dietfoodUuid;
      newUpdatedFoodData.dietfoodUuid = dietResponse.data.dietfoodUuid;
      setTodaysMeals(prevMeals => [...prevMeals, newUpdatedFoodData]);
      // If the POST request is successful, update the meals list
      /*
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
      }*/
    } catch (error) {
      // Handle the error if the POST request fails
      console.error('Failed to log food:', error);
    }

    //setTodaysMeals(prevMeals => [...prevMeals, { ...updatedFoodData, id: prevMeals.length }]);
    
    // 팝업 닫기 및 편집 인덱스 초기화
    setIsPopupOpen(false);
    setIsNewPopupOpen(false);
    setEditedMealIndex(null);
    ['MORNING', 'LUNCH', 'DINNER', 'SNACK'].forEach(fetchDietData);
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
    //console.log(`식사 유형 ${deletingDiet.mealType}에 대한 delete dietUuid: `, dietUuids[deletingDiet.mealType], `음식 uuid: `, deletingDiet.foodUuid);
    console.log(`식사 유형 ${deletingDiet.mealType}에 대한 delete dietUuid: `, localStorage.getItem(`${deletingDiet.mealType}Uuid`), `음식 uuid: `, deletingDiet.foodUuid);
    try {
      
      console.log(`식사 딜리트 fooddietUuid: `, deletingDiet.dietfoodUuid);
      const response = await axios.delete(`http://localhost:8080/api/v1/dietfoods/${deletingDiet.dietfoodUuid}`, {});
      console.log('Food deleted:', response.data);
    } catch (error) {
      // Handle the error if the POST request fails
      console.error('Failed to delete food:', error);
    }
  };

  const handleDeleteSearch = async (foodUuid) => {
    try {
      // 서버에 삭제 요청
      console.log(`음식정보 딜리트 foodUuid: `, foodUuid)
      await axios.delete(`http://localhost:8080/api/v1/food/${foodUuid}`);
      // 성공적으로 삭제되면, 클라이언트 측 상태 업데이트
      setRelatedSearches(relatedSearches.filter(search => search.foodUuid !== foodUuid));
    } catch (error) {
      console.error(`Failed to delete the search with UUID: ${foodUuid}`, error);
    }
    setIsPopupOpen(false);
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
      className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">검색</button>
      <button onClick={() => handleMake(searchTerm)}
      className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">사용자 지정 추가</button>
{/*
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
          </div>*/}
          <div className="related-searches-container">
            <h2>연관 검색어</h2>
            <div className="related-searches-scrollable">
              {relatedSearches.map((search) => (
                <div key={search.foodUuid}
                onClick={() => handleSelectRelatedSearch(search.foodUuid)}
                className="related-search-item">
                  {search.foodName}
                  {/* 사용자가 지정한 검색어일 경우에만 삭제 버튼을 렌더링 */}
                  {/* {search.isUserDefined && (
                    <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => handleDeleteSearch(search.foodUuid)}>삭제</button>
                  )} */}
                </div>
              ))}
            </div>
          </div>


      {isPopupOpen && (
        <FoodInputPopup
          foodData={foodData}
          setFoodData={setFoodData}
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSaveFood} // onSave prop을 통해 handleSaveFood 함수 전달
          fixed={true}
        />
      )}
      {isNewPopupOpen && (
        <FoodInputPopup
          foodData={newFoodData}
          setFoodData={setNewFoodData} // Pass the setter function as a prop
          onClose={() => setIsNewPopupOpen(false)}
          onSave={handleCreateFood}
          fixed={false}
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
        {/* <div className="meals-grid">
          {todaysMeals
            .filter((meal) => selectedMealType === 'all' || meal.mealType === selectedMealType)
            .map((meal, index) => (
              <div key={meal.id || index} className="meal-item">
                <div className="buttons">
                <button className="btn btn-danger inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => handleDeleteFood(index)}>삭제</button>
                <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => handleEditClick(index)}>편집</button>
                </div>
                <div>식품명: {meal.foodName}</div>
                <div>양: {(meal.amount * meal.multiplier).toFixed(2)}g</div>
                <div>에너지: {(meal.energy * 1).toFixed(2)}kcal</div>
                <div>탄수화물: {(meal.carbs * 1).toFixed(2)}g</div>
                <div>지방: {(meal.fat * 1).toFixed(2)}g</div>
                <div>단백질: {(meal.protein * 1).toFixed(2)}g</div>
              </div>
            ))}
        </div> */}
        <div className="styles.lists-section">
          {selectedMealType === 'all' ? (
            ['MORNING', 'LUNCH', 'DINNER', 'SNACK'].flatMap((type) =>
              allRecords[type].map((record, index) => (
                <DietRecord key={index} record={record} />
              ))
            )
          ) : (
            allRecords[selectedMealType].map((record, index) => (
              <DietRecord key={index} record={record} />
            ))
          )}
        </div>


        {/* <div className="lists-section">
          {records.map((record, index) => (
            <DietRecord key={index} record={record} />
          ))}
        </div> */}

      </div>
      
          
    </div>
    </section>
  );
}

export default Search;