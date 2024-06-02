import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "./FoodContext";
import './header.css';

function Header() {
  // const [showSubMenu, setShowSubMenu] = useState(false);
  const navigate = useNavigate();
  // const { userUuid } = useUser();
  const handleNavigation = (path) => {
    const userUuid = localStorage.getItem('userUuid');
    if (userUuid) {
      navigate(path);
    } else {
      alert('로그인을 해주세요');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userUuid');
    navigate('/');
  };
  return (
    <header className="text-gray-600 body-font bg-white">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center madimi">
        <nav className="mr-auto ml-4 py-1 pl-7 flex flex-wrap items-center text-base justify-center text-[#3B7666]">
          <ul className="menu">
            <li className="lists">
              <a href="#" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" onClick={() => handleNavigation('/home')}>
                <span className="ml-3 text-5xl text-[#3B7666]">F-log</span>
              </a>
            </li>
            <li className="lists">
              <a href="#" className='px-4 py-2 hover:bg-gray-100 text-[#3B7666]'>식단 등록</a>
              <ul className="submenu">
                <li><a href="#" onClick={() => handleNavigation('/FoodOCR')}>영양성분표 OCR</a></li>
                <li><a href="#" onClick={() => handleNavigation('/search')}>음식별 검색</a></li>
              </ul>
            </li>
            <li className="lists">
              <a href="#" onClick={() => handleNavigation('/log')}>오늘의 결과</a>
            </li>
            <li className="lists">
              <a href="#">인바디</a>
              <ul className="submenu">
                <li><a href="#" onClick={() => handleNavigation('/inbodyOcr')}>인바디 OCR</a></li>
                <li><a href="#" onClick={() => handleNavigation('/graph')}>인바디 그래프</a></li>
              </ul>
            </li>
            <li className="lists">
              <a href="#" onClick={() => handleNavigation('/calender')}>달력</a>
            </li>
          </ul>
        </nav>
        <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={handleLogout}>Log out</button>
        <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5" onClick={() => handleNavigation('/setting')}>Setting</button>
      </div>
    </header>
  );
}

export default Header;
