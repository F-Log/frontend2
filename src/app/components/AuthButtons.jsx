//미사용 컴포넌트
import React from 'react';
import { useNavigate } from 'react-router-dom';

function AuthButtons() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    navigate('/'); // 홈 페이지로 이동
  };

  const handleSettingClick = () => {
    navigate('/setting'); // 설정 페이지로 이동
  };

  return (
    <div className="auth-buttons">
      <button onClick={handleLogoutClick}>Log out</button>
      <button onClick={handleSettingClick}>Setting</button>
    </div>
  );
}

export default AuthButtons;