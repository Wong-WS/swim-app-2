import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, getYear, getMonth, getDaysInMonth as getNumDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { formatDate, formatDisplayDate, getDaysInMonth } from '../../utils/dateUtils';

const CalendarContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CalendarTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CalendarNavButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #0077cc;
  
  &:hover {
    color: #005fa3;
  }
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-weight: 600;
  padding: 10px;
  color: #333;
`;

const Day = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 40px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isSelected ? '#e6f7ff' : props.$isAvailable ? 'white' : '#f0f0f0'};
  color: ${props => props.$isToday ? '#0077cc' : props.$isOtherMonth ? '#aaa' : '#333'};
  font-weight: ${props => props.$isToday ? 'bold' : 'normal'};
  
  &:hover {
    border-color: #0077cc;
    background-color: ${props => props.$isSelected ? '#e6f7ff' : '#f0f8ff'};
  }
`;

const EmptyDay = styled.div`
  border: 1px solid transparent;
  height: 40px;
`;

const CalendarView = ({ availableDates, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  
  useEffect(() => {
    const year = getYear(currentDate);
    const month = getMonth(currentDate) + 1; // 0-indexed to 1-indexed
    setDaysInMonth(getDaysInMonth(year, month));
  }, [currentDate]);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(getYear(currentDate), getMonth(currentDate) - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(getYear(currentDate), getMonth(currentDate) + 1, 1));
  };
  
  const monthStart = startOfMonth(currentDate);
  const firstDayOfMonth = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const isDateAvailable = (date) => {
    const dateString = formatDate(date);
    return availableDates.includes(dateString);
  };
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarNavButton onClick={goToPreviousMonth}>&lt; Prev</CalendarNavButton>
        <CalendarTitle>{format(currentDate, 'MMMM yyyy')}</CalendarTitle>
        <CalendarNavButton onClick={goToNextMonth}>Next &gt;</CalendarNavButton>
      </CalendarHeader>
      
      <MonthGrid>
        {weekdays.map((day) => (
          <WeekdayHeader key={day}>{day}</WeekdayHeader>
        ))}
        
        {/* Empty cells for days of the week before the first day of the month */}
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <EmptyDay key={`empty-${index}`} />
        ))}
        
        {/* Calendar days */}
        {daysInMonth.map((day) => {
          const dateString = formatDate(day);
          const isAvailable = isDateAvailable(day);
          const isToday = formatDate(new Date()) === dateString;
          const isSelected = selectedDate === dateString;
          
          return (
            <Day 
              key={dateString}
              $isAvailable={isAvailable}
              $isToday={isToday}
              $isSelected={isSelected}
              onClick={() => isAvailable && onDateSelect(dateString)}
            >
              {day.getDate()}
            </Day>
          );
        })}
      </MonthGrid>
    </CalendarContainer>
  );
};

export default CalendarView;
