import styles from "./forms.css";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const navigate = useNavigate();
  const inref = useRef(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  
    const handleRegister = () => {
      if (id && password && passwordcon && (password === passwordcon)) {
        // 웹 서버가 구현되면, 여기에 회원탈퇴를 요청하는 코드를 추가하세요.
        // 예: API 호출
        setIsRegistered(true); // 이 예제에서는 단순히 상태를 변경합니다.
        alert('회원가입이 완료되었습니다. OK!');
        navigate('/');
      } else {
        alert('ID와 비밀번호를 모두 입력해주세요.');
      }
    };
    return (
        <>
        <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
        <div classNameName="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <a className="flex title-font font-medium items-center text-gray-900 mb-0 mx-auto">
              <span className="madimi ml-3 text-5xl text-[#88d1f9]">F-log</span>
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
              <div className="p-2 w-1/2 mx-auto">
                <button onClick={handleRegister}
                className="w-full text-white bg-[#88d1f9] border-0 py-2 text-center focus:outline-none mx-auto text-lg">회원가입</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
    )
}