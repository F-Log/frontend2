import styles from "./mypage.css";
import imgfile from "./img/aa.jpg";
import { useState, useEffect } from "react";

export default function Mypage() {
  // 가상의 데이터베이스에서 가져온 데이터를 저장할 상태 변수들
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [allergy, setAllergy] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [exerciseIntensity, setExerciseIntensity] = useState('');
  const [dailyLifeIntensity, setDailyLifeIntensity] = useState('');
  const [dietGoal, setDietGoal] = useState('');

  // 데이터베이스에서 데이터를 불러오는 함수 (가정)
  const fetchDataFromDatabase = () => {
    // 이 부분에 데이터를 불러오는 API 호출 또는 로직을 작성합니다.
    // 가정: 가상의 데이터베이스에서 데이터를 가져온다고 가정합니다.
    // 실제로는 이 로직을 백엔드와 연동하여 데이터를 가져와야 합니다.
    setAge('30');
    setGender('여성');
    setAllergy('없음');
    setExerciseType('조깅');
    setExerciseFrequency('주 3회');
    setExerciseIntensity('보통');
    setDailyLifeIntensity('보통');
    setDietGoal('체중 감량');
  };

  // 컴포넌트가 처음으로 렌더링될 때 한 번만 실행되는 효과 함수
  useEffect(() => {
    fetchDataFromDatabase(); // 데이터베이스에서 데이터를 가져옵니다.
  }, []);

  return (
    <>
      <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <a className="flex title-font font-medium items-center text-gray-900 mb-0 mx-auto">
              <span className="madimi ml-3 text-5xl text-[#88d1f9]">F-log</span>
            </a>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <h1 className="text-2xl mb-4">마이페이지</h1>
          <span className="clear-both block"></span>

          <table className="w-full mt-4 text-sm text-left text-gray-500">
            <tbody>
              <tr className="bg-white border-y">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-900">나이</td>
                <td className="px-6 py-4">{age}</td>
                <td className="px-6 py-4">
                  <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                    수정
                  </button>
                </td>
              </tr>

              <tr className="bg-white border-b">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-900">성별</td>
                <td className="px-6 py-4">{gender}</td>
                <td className="px-6 py-4">
                  <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                    수정
                  </button>
                </td>
              </tr>

              <tr className="bg-white border-b">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-900">알레르기</td>
                <td className="px-6 py-4">{allergy}</td>
                <td className="px-6 py-4">
                  <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                    수정
                  </button>
                </td>
              </tr>

              <tr className="bg-white border-b">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-900">운동 종류</td>
                <td className="px-6 py-4">{exerciseType}</td>
                <td className="px-6 py-4">
                  <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                    수정
                  </button>
                </td>
              </tr>

              <tr className="bg-white border-b">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-900">운동 빈도</td>
                <td className="px-6 py-4">{exerciseFrequency}</td>
                <td className="px-6 py-4">
                  <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                    수정
                  </button>
                </td>
              </tr>

              <tr className="bg-white border-b">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-900">운동 강도</td>
                <td className="px-6 py-4">{exerciseIntensity}</td>
                <td className="px-6 py-4">
                <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                 수정
                </button>

              </td>
            </tr>

            <tr className="bg-white border-b">
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-gray-900">일상 생활 강도</td>
              <td className="px-6 py-4">{dailyLifeIntensity}</td>
              <td className="px-6 py-4">
                <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                  수정
                </button>
              </td>
            </tr>

            <tr className="bg-white border-b">
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-gray-900">식단 관리 목표</td>
              <td className="px-6 py-4">{dietGoal}</td>
              <td className="px-6 py-4">
                <button className="text-[#88d1f9]" onClick={() => console.log("수정 버튼이 클릭되었습니다.")}>
                  수정
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </section>
  </>
);
}
