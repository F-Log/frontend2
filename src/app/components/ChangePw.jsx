import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePw() {
const navigate = useNavigate();
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [isPasswordChanged, setIsPasswordChanged] = useState(false);

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  return regex.test(password);
};

const handleSave = () => {
  if (newPassword !== confirmPassword) {
    alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  if (!validatePassword(newPassword)) {
    alert('새 비밀번호가 요구 사항을 만족하지 않습니다.');
    return;
  }

  // 비밀번호 변경 로직을 여기에 구현하세요.
  // 웹 서버가 구현되면 서버로 새 비밀번호를 전송하는 코드로 대체해야 합니다.

  setIsPasswordChanged(true);
  alert('비밀번호가 변경되었습니다. OK!');
  // 이후 로직을 추가할 수 있습니다. 예를 들어, 홈 페이지로 이동.
};

const handleCancel = () => {
  navigate('/');
};

return (
<section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
  <div className="password-change-container">
    <div className="password-inputs">
      <input
        type="password"
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>
    <div className="action-buttons">
      <button onClick={handleSave}>저장</button>
      <button onClick={handleCancel}>취소</button>
    </div>
    {isPasswordChanged && <div>비밀번호가 성공적으로 변경되었습니다!</div>}
  </div>
  </section>
);
}

export default ChangePw;