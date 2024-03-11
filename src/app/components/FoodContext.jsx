import React, { createContext, useState } from 'react';

export const FoodContext = createContext(null);

export const FoodProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [todaysMeals, setTodaysMeals] = useState([]);

  return (
    <FoodContext.Provider value={{ recentSearches, setRecentSearches, todaysMeals, setTodaysMeals }}>
      {children}
    </FoodContext.Provider>
  );
};
