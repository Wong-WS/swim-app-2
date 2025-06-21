import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../common/Input';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';
import { formatDisplayDate } from '../../utils/dateUtils';

const FormContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const FormTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const SelectedInfo = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const BookingForm = ({ selectedPlace, selectedDate, selectedSlot, onCancel, onSuccess }) => {
  const { addBooking, places } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [errors, setErrors] = useState({
    name: '',
    email: ''
  });

  const place = places.find(p => p.id === selectedPlace);
  
  const validate = () => {
    let tempErrors = {
      name: '',
      email: ''
    };
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      tempErrors.email = 'Invalid email address';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const bookingData = {
      name,
      email,
      placeId: selectedPlace,
      startTime: selectedSlot.start.toISOString(),
      endTime: selectedSlot.end.toISOString(),
      bookingDate: selectedDate,
    };
    
    addBooking(bookingData);
    
    // Reset form
    setName('');
    setEmail('');
    
    // Call onSuccess callback
    onSuccess();
  };

  return (
    <FormContainer>
      <FormTitle>Complete Your Booking</FormTitle>
      
      <SelectedInfo>
        <InfoItem>
          <Label>Place:</Label>
          {place?.name}
        </InfoItem>
        <InfoItem>
          <Label>Date:</Label>
          {formatDisplayDate(selectedSlot.start)}
        </InfoItem>
        <InfoItem>
          <Label>Time:</Label>
          {selectedSlot.startFormatted} - {selectedSlot.endFormatted}
        </InfoItem>
      </SelectedInfo>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          error={errors.name}
        />
        
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          error={errors.email}
        />
        
        <ButtonContainer>
          <Button $primary type="submit">
            Confirm Booking
          </Button>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default BookingForm;
