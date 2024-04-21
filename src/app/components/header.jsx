import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "./FoodContext";
import './header.css';

function Header() {
  // const [showSubMenu, setShowSubMenu] = useState(false);
  const navigate = useNavigate();
  // const { userUuid } = useUser();

  return (
    <header className="text-gray-600 body-font bg-white">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center madimi">
        {/* <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" onClick={() => navigate('/home')}>
          <span className="ml-3 text-5xl text-[#3B7666]">F-log</span>
        </a> */}
        <nav className="mr-auto ml-4 py-1 pl-7 flex flex-wrap items-center text-base justify-center text-[#3B7666]">
          {/* <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/home')}>HOME</a> */}
          {/* FOOD 메뉴 아이템에 onMouseEnter와 onMouseLeave 이벤트 추가 */}
          {/* <div className="relative" onMouseEnter={() => setShowSubMenu(true)} onMouseLeave={() => setShowSubMenu(false)}>
            <button className="mr-5 hover:text-gray-900 text-[#3B7666]">식단 등록</button>
            {showSubMenu && (
              <ul className="submenu absolute bg-white shadow-md mt-1">
                <li><Link className="block px-4 py-2 hover:bg-gray-100 text-[#3B7666]" to="/FoodOcr">영양성분표 OCR</Link></li>
                <li><Link className="block px-4 py-2 hover:bg-gray-100 text-[#3B7666]" to="/search">음식명 검색</Link></li>
              </ul>
            )}
          </div>
          <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/log')}>오늘의 식단 결과</a>
          <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/inbodyOcr')}>인바디</a>
          <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/calender')}>달력</a> */}
          <ul className="menu">
            <li className="lists">
              <a href="#" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" onClick={() => navigate('/home')}>
                <span className="ml-3 text-5xl text-[#3B7666]">F-log</span>
              </a>
            </li>
            <li className="lists">
              <a href="#" className='px-4 py-2 hover:bg-gray-100 text-[#3B7666]'>식단 등록</a>
              <ul className="submenu">
                <li><a href="#" onClick={() => navigate('/FoodOCR')}>영양성분표 OCR</a></li>
                <li><a href="#" onClick={() => navigate('/search')}>음식별 검색</a></li>
              </ul>
            </li>
            <li className="lists">
              <a href="#" onClick={() => navigate('/log')}>오늘의 결과</a>
            </li>
            <li className="lists">
              <a href="#">인바디</a>
              <ul className="submenu">
                <li><a href="#" onClick={() => navigate('/inbodyOcr')}>인바디 OCR</a></li>
                <li><a href="#">인바디 그래프</a></li>
              </ul>
            </li>
            <li className="lists">
              <a href="#" onClick={() => navigate('/calender')}>달력</a>
            </li>
            {/* <li className='settingbuttons'>
              
                <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => navigate('/')}>Log out</button>
              
                <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5" onClick={() => navigate('/setting')}>Setting</button>
              
            </li> */}
            
          </ul>
        </nav>
        <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => navigate('/')}>Log out</button>
        <button className="inline-flex items-center bg-[#3B7666] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5" onClick={() => navigate('/setting')}>Setting</button>
      </div>
      
    </header>
  );
}

export default Header;
