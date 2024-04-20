import React, { createContext, useContext, useState } from 'react';

export const FoodContext = createContext(null);

export const FoodProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [userUuid, setUserUuid] = useState(null);
  
  return (
    <FoodContext.Provider value={{ recentSearches, setRecentSearches, todaysMeals, setTodaysMeals, userUuid, setUserUuid}}>
      {children}
    </FoodContext.Provider>
  );
};

export const useUser = () => useContext(FoodContext);