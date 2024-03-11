import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    
    <div className="home-body">
      <div className="center-text">
        <p>기록과 피드백 더 나은 내일</p>
      </div>
      <div className="search-section">
        <button onClick={() => navigate('/search')} className="button inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">음식명 검색</button>
        <button onClick={() => navigate('/ocr')} className="button inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">사진 업로드</button>
        <button onClick={() => navigate('/result')} className="buttoninline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">오늘의 결과</button>
      </div>
      
    </div>
  );
}

export default Home;