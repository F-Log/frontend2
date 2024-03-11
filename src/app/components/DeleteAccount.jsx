import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [isWithdrawn, setIsWithdrawn] = useState(false);
  
    const handleWithdraw = () => {
      if (id && password) {
        // 웹 서버가 구현되면, 여기에 회원탈퇴를 요청하는 코드를 추가하세요.
        // 예: API 호출
        setIsWithdrawn(true); // 이 예제에서는 단순히 상태를 변경합니다.
        alert('회원탈퇴가 완료되었습니다. OK!');
        // 로그아웃 로직을 실행하고 홈 페이지로 이동할 수 있습니다.
        // navigate('/logout');
      } else {
        alert('ID와 비밀번호를 모두 입력해주세요.');
      }
    };
  
    const handleCancel = () => {
      navigate('/'); // 홈 페이지로 이동
    };
  
    return (
      <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
      <div className="withdraw-container">
        <h2>회원탈퇴 확인</h2>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="action-buttons">
          <button onClick={handleWithdraw}>확인</button>
          <button onClick={handleCancel}>취소</button>
        </div>
        {isWithdrawn && <div>회원탈퇴 처리가 완료되었습니다.</div>}
      </div>
      </section>
    );
  }

export default DeleteAccount;