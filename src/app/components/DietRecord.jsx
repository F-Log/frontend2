import React from 'react';

const DietRecord = ({ records }) => {
  return (
    <div className="diet-record mt-4">
      {records.map((record, index) => (
        <div key={index} className="record-details p-4 mb-4 bg-gray-100 rounded-lg shadow">
          <h4 className="font-semibold text-lg mb-2">식단 유형: {record.mealType}</h4>
          <p className="mb-1">총 칼로리: {record.totalCalories}kcal</p>
          <p className="mb-1">총 탄수화물: {record.totalCarbohydrate}g</p>
          <p className="mb-1">총 단백질: {record.totalProtein}g</p>
          <p className="mb-3">총 지방: {record.totalFat}g</p>
          <ul className="list-disc ml-5">
            {record.dietFoods.map((food, foodIndex) => (
              <li key={foodIndex} className="mb-1">
                {food.foodName} - 수량: {food.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DietRecord;

// import React from 'react';

// const DietRecord = ({ records }) => {
//   return (
//     <div className="diet-record">
//       {records.map((record) => (
//         <div key={record.dietUuid} className="record-details">
//           <h4>식단 유형: {record.mealType}</h4>
//           <p>총 칼로리: {record.totalCalories}kcal</p>
//           <p>총 탄수화물: {record.totalCarbohydrate}g</p>
//           <p>총 단백질: {record.totalProtein}g</p>
//           <p>총 지방: {record.totalFat}g</p>
//           <ul>
//             {record.dietFoods.map((food) => (
//               <li key={food.dietfoodUuid}>
//                 <span>{food.foodName}</span> - <span>수량: {food.quantity}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };


// export default DietRecord;




