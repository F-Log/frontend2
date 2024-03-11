import React, { useState } from 'react';

function InBody() {
  const [weight, setWeight] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [fatPercentage, setFatPercentage] = useState('');
  const [fatMass, setFatMass] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleConfirm = () => {
    // 여기서 입력값 검증 로직을 추가할 수 있습니다.
    // 예를 들어, 모든 필드가 숫자로 채워져 있는지 확인하는 등
    if (weight && muscleMass && fatPercentage && fatMass) {
      setIsSaved(true);
      alert('입력된 정보가 저장되었습니다. OK!');
    } else {
      alert('모든 필드를 채워주세요.');
    }
  };

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
    <div className="inbody-input-container">
      <h2>인바디 정보를 입력해주세요!</h2>
      <div className="input-group">
        <label>체중</label>
        <input
          type="number"
          value={weight}
          className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          onChange={(e) => setWeight(e.target.value)}
        />
        <label>골격근량</label>
        <input
          type="number"
          value={muscleMass}
          onChange={(e) => setMuscleMass(e.target.value)}
          className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <label>체지방률</label>
        <input
          type="number"
          value={fatPercentage}
          onChange={(e) => setFatPercentage(e.target.value)}
          className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <label>체지방량</label>
        <input
          type="number"
          value={fatMass}
          onChange={(e) => setFatMass(e.target.value)}
          className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <button onClick={handleConfirm}>{isSaved ? 'OK' : '확인'}</button>
    </div>
    </section>
  );
}

export default InBody;