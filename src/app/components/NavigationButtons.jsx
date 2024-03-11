//미사용 컴포넌트
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function NavigationButtons() {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <ul className="nav-list">
      <li>
        <button onClick={() => navigate('/')}>HOME</button>
      </li>
      <li 
        onMouseEnter={() => setShowSubMenu(true)} 
        onMouseLeave={() => setShowSubMenu(false)}
      >
        <button>FOOD</button>
        {showSubMenu && (
          <ul className="submenu">
            <li><Link to="/ocr">OCR</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul>
        )}
      </li>
      <li>
        <button onClick={() => navigate('/log')}>LOG</button>
      </li>
      <li>
        <button onClick={() => navigate('/inbody')}>InBody</button>
      </li>
      <li>
        <button onClick={() => navigate('/calender')}>CALENDER</button>
      </li>
    </ul>
  );
}

export default NavigationButtons;
