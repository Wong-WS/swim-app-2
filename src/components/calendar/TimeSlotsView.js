import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const SlotsContainer = styled.div`
  width: 100%;
`;

const SlotsHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const TimeSlotList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const TimeSlotButton = styled(Button)`
  width: 100%;
  text-align: center;
`;

const NoSlotsMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  border: 1px dashed #ccc;
  border-radius: 4px;
`;

const TimeSlotsView = ({ slots, selectedDate, onSlotSelect, selectedSlot }) => {
  if (!selectedDate) {
    return null;
  }

  return (
    <SlotsContainer>
      <SlotsHeader>
        Available Time Slots for {selectedDate}
      </SlotsHeader>
      
      {slots.length > 0 ? (
        <TimeSlotList>
          {slots.map((slot, index) => (
            <TimeSlotButton
              key={index}
              primary={selectedSlot && selectedSlot.startFormatted === slot.startFormatted}
              onClick={() => onSlotSelect(slot)}
            >
              {slot.startFormatted} - {slot.endFormatted}
            </TimeSlotButton>
          ))}
        </TimeSlotList>
      ) : (
        <NoSlotsMessage>
          No available time slots for this date.
        </NoSlotsMessage>
      )}
    </SlotsContainer>
  );
};

export default TimeSlotsView;
