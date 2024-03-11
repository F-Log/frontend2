import React, { useState } from 'react';
import CalenderUI from './CalenderUI';

const RecordView = () => {
  const [view, setView] = useState('diet'); // 현재 보고 있는 뷰 상태
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 상태

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate());
    setSelectedDate(newMonth);
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
    setSelectedDate(newMonth);
  };
  // 인바디 피드백 요청을 처리하는 함수
  const handleFeedbackRequest = () => {
    console.log("인바디 피드백 요청");
  };

  // 피드백 생성 로직
  const handleFeedbackGenerated = () => {
    console.log("피드백 생성");
  };

  // 선택된 뷰에 따라 렌더링할 컴포넌트를 결정하는 함수
  const renderView = () => {
    switch (view) {
      case 'diet':
        return <RecordViewDiet selectedDate={selectedDate} />;
      case 'inbody':
        return <RecordViewInBody selectedDate={selectedDate} onFeedbackRequest={handleFeedbackRequest} />;
      case 'feedback':
        return <RecordViewFeedback selectedDate={selectedDate} onFeedbackGenerated={handleFeedbackGenerated} />;
      default:
        return <div>선택된 뷰가 없습니다.</div>;
    }
  };

  return (
    <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5 flex">
  <div className="flex-1">
    <CalenderUI 
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
    />
  </div>
  <div className="flex-1 flex flex-col justify-center items-center">
    <div className="mb-4">
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('diet')}>식단</button>
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('inbody')}>인바디</button>
      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={() => setView('feedback')}>피드백</button>
    </div>
    
    <div>
      {renderView()}
    </div>
  </div>
</section>
  );
};

export default RecordView;

const RecordViewDiet = ({ selectedDate }) => {
  return <div>식단 뷰입니다. 선택된 날짜: {selectedDate.toDateString()}</div>;
};

const RecordViewInBody = ({ selectedDate, onFeedbackRequest }) => {
  return (
    <div>
      인바디 뷰입니다. 선택된 날짜: {selectedDate.toDateString()}

      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={onFeedbackRequest}>피드백 요청</button>
    </div>
  );
};

const RecordViewFeedback = ({ selectedDate, onFeedbackGenerated }) => {
  return (
    <div>
      피드백 뷰입니다. 선택된 날짜: {selectedDate.toDateString()}

      <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5" onClick={onFeedbackGenerated}>피드백 생성</button>
    </div>
  );
};
