import React, { useState, useEffect } from 'react';
const Calendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    if (selectedDate) {
      onDateSelect(selectedDate);
    }
  }, [selectedDate, onDateSelect]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const renderCalendarDates = () => {
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const dates = [];
    for (let i = 0; i < startDay; i++) {
      dates.push(<div key={`prev${i}`} className="calendar-date empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      dates.push(
        <div key={i} className={`calendar-date ${selectedDate && selectedDate.toDateString() === date.toDateString() ? 'selected' : ''}`} onClick={() => handleDateClick(date)}>
          {i}
        </div>
      );
    }

    return dates;
  };

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{monthsOfYear[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-weekdays">
        {daysOfWeek.map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-dates">
        {renderCalendarDates()}
      </div>
    </div>
  );
};

export default Calendar;
