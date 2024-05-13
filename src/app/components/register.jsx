import { useUser } from "./FoodContext";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./forms.css";


export default function Register(){
  const navigate = useNavigate();
  const inref = useRef(null); 
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(''); // State for gender selection
  const [exerciseType, setExerciseType] = useState(''); // State for exercise type
  const [targetWeight, setTargetWeight] = useState(''); // State for target weight
  const [exerciseFrequency, setExerciseFrequency] = useState(''); // State for exercise frequency
  const [exerciseIntensity, setExerciseIntensity] = useState(''); // State for exercise intensity
  const [exerciseGoal, setExerciseGoal] = useState(''); // State for exercise goal

  const [isRegistered, setIsRegistered] = useState(false);
  const handleRegister = () => {
    if (id && password && passwordcon && (password === passwordcon)) {
      axios
        .post("http://localhost:8080/api/v1/members/new", {
          loginId: id,
          password: password,
          age: age,
          name: name,
          gender: gender,
          exerciseType: exerciseType, 
          targetWeight: targetWeight, // Add target weight to the request body
          exerciseFrequency: exerciseFrequency, // Add exercise frequency to the request body
          exerciseIntensity: exerciseIntensity, // Add exercise intensity to the request body
          exerciseGoal: exerciseGoal // Add exercise goal to the request body
        })
        .then((response) => {
          alert(`회원가입이 완료되었습니다. OK!`);
          navigate("/"); // 성공 시 홈 페이지로 리다이렉션
        })
        .catch((error) => {
          console.error("회원가입 중 오류 발생:", error);
          alert(`회원가입에 실패했습니다.`);
        });
    } else {
      alert("ID와 비밀번호를 모두 입력해주세요. 비밀번호가 일치하는지 확인해주세요.");
    }
  };

    return (
        <>
        <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
        <div classNameName="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <a className="flex title-font font-medium items-center text-gray-900 mb-0 mx-auto">
              <span className="madimi ml-3 text-5xl text-[#3B7666]">F-log</span>
            </a>
          </div>
          <div className="w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input ref={inref} type="text" id="user_id" name="user_id" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="아이디" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                <input ref={inref} type="password" id="user_pw" name="user_pw" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="패스워드" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                <input ref={inref} type="password" id="user_pwcon" name="user_pwcon" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="패스워드 확인" 
                  value={passwordcon}
                  onChange={(e) => setPasswordcon(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input ref={inref} type="username" id="user_name" name="user_name" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="이름"
                value={name} 
                onChange={(e) => setName(e.target.value)}/>
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                >
                  <option value="">성별 선택</option>
                  <option value="FEMALE"
                  onChange={(e) => setGender(e.target.value)}>여성</option>
                  <option value="MALE"
                  onChange={(e) => setGender(e.target.value)}>남성</option>
                </select>
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input ref={inref} type="age" id="user_age" name="user_age" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="나이"
                  value = {age}
                  onChange={(e) => setAge(e.target.value)} />
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input ref={inref} type="allergies" id="user_allergies" name="user_allergies" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="알레르기" />
                </div>
              </div>

              {/* 운동 타입 입력란 */}
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input
                    type="text"
                    id="exercise_type"
                    name="exercise_type"
                    className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#3B7666] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    placeholder="운동 타입"
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                  />
                </div>
              </div>
              {/* 목표 체중 입력란 */}
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input
                    type="number"
                    id="target_weight"
                    name="target_weight"
                    className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    placeholder="목표 체중(kg)"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              {/* 운동 강도 선택 */}
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <select
                    value={exerciseIntensity}
                    onChange={(e) => setExerciseIntensity(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="">운동 강도</option>
                    <option value="LIGHT">LIGHT</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>
              {/* 운동 목표 선택 */}
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <select
                    value={exerciseGoal}
                    onChange={(e) => setExerciseGoal(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="">운동 목표</option>
                    <option value="LOSE_WEIGHT">LOSE_WEIGHT</option>
                    <option value="MAINTAIN_WEIGHT">MAINTAIN_WEIGHT</option>
                    <option value="GAIN_WEIGHT">GAIN_WEIGHT</option>
                    <option value="GAIN_MUSCLE">GAIN_MUSCLE</option>
                  </select>
                </div>
              </div>

              <div className="p-2 w-1/2 mx-auto">
                <button onClick={handleRegister}
                className="w-full text-white bg-[#3B7666] border-0 py-2 text-center focus:outline-none mx-auto text-lg">회원가입</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
