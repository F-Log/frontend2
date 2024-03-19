import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
//import './Setting.css';

function Setting() {
  const navigate = useNavigate();
  const [exerciseType, setExerciseType] = useState(''); // ['유산소', '무산소', '근력', '스트레칭']
  const [targetWeight, setTargetWeight] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [exerciseIntensity, setExerciseIntensity] = useState(''); // {"LIGHT", "MEDIUM", "HARD"}
  const [exerciseGoal, setExerciseGoal] = useState(''); // "LOSE_WEIGHT", "MAINTAIN_WEIGHT", "GAIN_WEIGHT", "GAIN_MUSCLE"
  //const [inbodyAlert, setInbodyAlert] = useState('활성화');
  //const [inbodyAlertPeriod, setInbodyAlertPeriod] = useState('1달');
  //const [customPeriod, setCustomPeriod] = useState('');
  const userUuid = localStorage.getItem("userUuid");

  const isSelected = (buttonName, state) => state === buttonName;
  const settingsData = {
    exerciseType: exerciseType,
    targetWeight: Number(targetWeight),
    exerciseFrequency: Number(exerciseFrequency),
    exerciseIntensity: exerciseIntensity,
    exercisePurpose: exerciseGoal
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/exercises/${userUuid}`);
        const data = response.data;
        // Update your state with the fetched data
        setExerciseType(data.exerciseType);
        setTargetWeight(data.targetWeight.toString()); // Assuming targetWeight is a number
        setExerciseFrequency(data.exerciseFrequency.toString()); // Assuming exerciseFrequency is a number
        setExerciseIntensity(data.exerciseIntensity);
        setExerciseGoal(data.exercisePurpose);
        console.log(data.exercisePurpose);
      } catch (error) {
        console.error('Failed to fetch settings:', error.response ? error.response.data : error);
      }
    };
  
    fetchSettings();
  }, []); // Empty dependency array to run only on the first render
/*
  const handleInbodyAlertPeriodChange = (period) => {
    setInbodyAlertPeriod(period);
    if (period !== '사용자 지정') {
      setCustomPeriod(''); // 사용자 정의 주기가 아니면, customPeriod를 비웁니다.
    }
  };
*/
const saveSettings = async () => {
  

  try {
    // First, try to update the existing settings.
    const putResponse = await axios.put(`http://localhost:8080/api/v1/exercises/${userUuid}`, settingsData);
    console.log('Settings updated:', putResponse.data);
    //navigate('/'); // Redirect to the home page upon successful update.
  } catch (putError) {
    // If the update fails, check if it's because the data doesn't exist.
    if (putError.response && putError.response.status === 500) {
      try {
        // If the data doesn't exist, try to create new settings.
        const postResponse = await axios.post(`http://localhost:8080/api/v1/exercises/${userUuid}`, settingsData);
        console.log('Settings saved:', postResponse.data);
        //navigate('/'); // Redirect to the home page upon successful save.
      } catch (postError) {
        console.error('Failed to save new settings:', postError.response ? postError.response.data : postError);
      }
    } else {
      // If the update fails for another reason, log the error.
      console.error('Failed to update settings:', putError.response ? putError.response.data : putError);
    }
  }
};


  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
    <div className="settings">
    <div>운동 타입</div>
      {/* 운동 타입 섹션 */}
    <div className="exercise-type">
        <input
        type="text"
        value={exerciseType}
        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="주로 하는 운동"
        onChange={(e) => setExerciseType(e.target.value)}
      />
    </div>
    <div>목표 체중</div>
    {/* 목표 체중 섹션 */}
    <div className="target-weight">
        <input
        type="number"
        value={targetWeight}
        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="목표 체중(kg)"
        onChange={(e) => setTargetWeight(e.target.value)}
        min="0"
      />
    </div>
    <div>운동 빈도</div>
    {/* 운동 빈도 섹션 */}
    <div className="exercise-frequency">
        <input
        type="number"
        value={exerciseFrequency}
        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="일주일에 하는 운동 횟수"
        onChange={(e) => setExerciseFrequency(e.target.value)}
        min="0"
      />
    </div>
    <div>운동 강도</div>
    {/* 운동 강도 섹션 */}
    <div className="exercise-intensity">
      {["LIGHT", "MEDIUM", "HARD"].map((goal) => (
        <button
          key={goal}
          onClick={() => setExerciseIntensity(goal)}
          className={isSelected(goal, exerciseIntensity) ? 'selected inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5' : 'inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-black mt-0 px-5 mr-5'}
        >
        {goal}
        </button>
      ))}
    </div>
    <div>운동 목표</div>
    {/* 운동 목표 섹션 */}
    <div className="button-group">
      {["LOSE_WEIGHT", "MAINTAIN_WEIGHT", "GAIN_WEIGHT", "GAIN_MUSCLE"].map((goal) => (
        <button
          key={goal}
          onClick={() => setExerciseGoal(goal)}
          className={isSelected(goal, exerciseGoal) ? 'selected inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5' : 'inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-black mt-0 px-5 mr-5'}
        >
        {goal}
        </button>
      ))}
    </div>
    {/*
    <div>인바디 알림</div>
      <div className="inbody-alert">
        {['활성화', '비활성화'].map((status) => (
          <button
            key={status}
            onClick={() => setInbodyAlert(status)}
            className={isSelected(status, inbodyAlert) ? 'selected inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5' : 'inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-black mt-0 px-5 mr-5'}
          >
            {status}
          </button>
        ))}
      </div>
      <div>인바디 알림 주기</div>
      <div className="inbody-alert-period">
        {['2주', '1달', '2달', '사용자 지정'].map((period) => (
          <button
            key={period}
            onClick={() => handleInbodyAlertPeriodChange(period)}
            className={isSelected(period, inbodyAlertPeriod) ? 'selected inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5' : 'inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-black mt-0 px-5 mr-5'}
          >
            {period}
          </button>
        ))}
        {inbodyAlertPeriod === '사용자 지정' && (
          <input
            type="text"
            value={customPeriod}
            onChange={(e) => setCustomPeriod(e.target.value)}
          />
        )}
      </div>*/}
          
      {/* 저장 및 취소 버튼 */}
      <button onClick={saveSettings} className='save-btn selected inline-flex items-center bg-[#8801f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5'>저장</button>
      <button onClick={() => navigate('/home')} className='cancel-btn selected inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5'>취소</button>

      {/* 비밀번호 변경 링크 */}
      <div onClick={() => navigate('/changepw')} className='change-pw-link'>비밀번호를 변경하시겠습니까?</div>

      {/* 회원탈퇴 버튼 */}
      <button onClick={() => navigate('/deleteaccount')}className='delete-account-button selected inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5'>회원탈퇴</button>

      <button onClick={() => navigate('/mypage')}className='selected inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5'>마이페이지</button>
    </div>
    </section>
  );
}

export default Setting;