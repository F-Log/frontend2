import styles from "./forms.css";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "./FoodContext";
import axios from "axios";

export default function Login(){
  const { userUuid } = useUser();
  const navigate = useNavigate();
  const inref = useRef(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  //const [loginId, setloginId] = useState('');
  const [idcon, setIdcon] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
  const [isLogined, setIsLogined] = useState(false);
  
    const handleLogin = () => {
      axios
    .get(`http://localhost:8080/api/v1/members/${userUuid}`, {})
    //.get(`http://localhost:8080/api/v1/members/${id}`, {}) 아이디를 통한 패스워드 가져오기 성공시
    .then((response) => {
      setIdcon(response.data.loginId);
      setPasswordcon(response.data.password);
      
      // ID와 비밀번호 검증 로직을 axios.get의 결과 처리 내부로 이동
      if ((id === response.data.loginId) && (password === response.data.password)) {
        setIsLogined(true);
        alert(`로그인이 완료되었습니다. OK!`);
        navigate('/home');
      } else {
        alert(`ID와 비밀번호를 모두 입력해주세요.`);
      }
    })
    .catch((error) => {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 실패: 서버 오류");
    });
    };

    return (
        <>
        <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
        <div className="container px-5 py-24 mx-auto">
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
                  placeholder="비밀번호" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2 w-1/2 mx-auto">
                <button className="w-full text-white bg-[#88d1f9] border-0 py-2 text-center focus:outline-none mx-auto text-lg"
                  onClick={handleLogin}>
                  로그인
                  </button>
              </div>
              <div className="p-2 w-2/3 mx-auto">
                <div className="text-hr">또는</div>
              </div>
              <div className="p-2 w-1/2 mx-auto">
                <button className="w-full text-white bg-[#88d1f9] border-0 py-2 text-center focus:outline-none mx-auto text-lg"
                  onClick={() => navigate('/register')}>
                  회원가입
                  </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
    )
}