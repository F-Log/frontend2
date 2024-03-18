import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "./FoodContext";

function Header() {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const navigate = useNavigate();
  const { userUuid } = useUser();

  return (
    <header className="text-gray-600 body-font bg-white">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center madimi">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" onClick={() => navigate('/')}>
          <span className="ml-3 text-5xl text-[#88d1f9]">F-log</span>
        </a>
        <nav className="mr-auto ml-4 py-1 pl-7 flex flex-wrap items-center text-base justify-center text-[#88d1f9]">
          <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/home')}>HOME</a>
          {/* FOOD 메뉴 아이템에 onMouseEnter와 onMouseLeave 이벤트 추가 */}
          <div className="relative" onMouseEnter={() => setShowSubMenu(true)} onMouseLeave={() => setShowSubMenu(false)}>
            <button className="mr-5 hover:text-gray-900">FOOD</button>
            {showSubMenu && (
              <ul className="submenu absolute bg-white shadow-md mt-1">
                <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/ocr">OCR</Link></li>
                <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/search">Search</Link></li>
              </ul>
            )}
          </div>
          <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/log')}>LOG</a>
          <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/inbodyOcr')}>InBody</a>
          <a className="mr-5 hover:text-gray-900" onClick={() => navigate('/calender')}>CALENDAR</a>
        </nav>
        <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => navigate('/')}>Log out</button>
        <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5" onClick={() => navigate('/setting')}>Setting</button>
      </div>
      
    </header>
  );
}

export default Header;
