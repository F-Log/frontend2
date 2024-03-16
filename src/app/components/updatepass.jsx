import React, { useState } from 'react';
import styles from './updatepass.css';

function UpdatePass() {
    // Supposing `currentPassword` is fetched from the database,
    // for the purpose of this example, we'll use a hardcoded value.
    // In a real-world scenario, you would fetch this from the database.
    const [currentPassword, setCurrentPassword] = useState('existingPassword');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
  
    // 비밀번호 일치 확인
    const checkPasswordMatch = () => {
      return newPassword === confirmPassword;
    };
  
    // 비밀번호 업데이트
    const updatePassword = (newPassword) => {
      // This is where you would call the API to update the password in your database
      // For example: updatePasswordAPI(newPassword);
      console.log('Password updated in the database:', newPassword);
      // After updating the password, you can clear the input fields if necessary
      setNewPassword('');
      setConfirmPassword('');
    };
  
    // 저장 버튼 클릭 핸들러
    const handleSaveClick = () => {
      if (newPassword.length === 0) {
        setMessage('새 비밀번호를 입력해주세요.');
        return;
      }
      if (checkPasswordMatch()) {
        updatePassword(newPassword);
        setMessage('새 비밀번호가 저장되었습니다.');
      } else {
        setMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }
    };

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          
          <h2 className="madimi ml-3 text-5xl text-[#88d1f9]">비밀번호 변경</h2>
         
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-1/2">
              <div className="relative"> 
                <label htmlFor="current-password" className="leading-7 text-sm text-gray-600">현재 비밀번호</label>
                <input
                  type="password"
                  id="current-password"
                  name="current-password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="new-password" className="leading-7 text-sm text-gray-600">새 비밀번호</label>
                <input
                  type="password"
                  id="new-password"
                  name="new-password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="confirm-password" className="leading-7 text-sm text-gray-600">비밀번호 확인</label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            {message && (
              <div className="p-2 w-full">
                <p className="text-red-500 text-xs italic">{message}</p>
              </div>
            )}
            <div className="p-2 w-full flex justify-around">
              <button className="text-white bg-[#88d1f9] border-0 py-2 px-8 focus:outline-none hover:bg-[#77c1f0] rounded text-lg" onClick={handleSaveClick}>저장</button>
              <button className="text-white bg-gray-300 border-0 py-2 px-8 focus:outline-none hover:bg-gray-400 rounded text-lg">취소</button>
            </div>
          </div>
        </div>
          </div>
    </section>
  );
}

export default UpdatePass;
