import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PlaceSelector from './PlaceSelector';
import CalendarView from '../calendar/CalendarView';
import TimeSlotsView from '../calendar/TimeSlotsView';
import BookingForm from './BookingForm';
import { useApp } from '../../contexts/AppContext';
import { calculateAvailableSlotsWithBuffer, formatDate, parseDateTime } from '../../utils/dateUtils';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const BookingContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;

const LeftColumn = styled.div`
  flex: 1;
  min-width: 300px;
`;

const RightColumn = styled.div`
  flex: 2;
  min-width: 400px;
`;

const AdminLink = styled(Link)`
  padding: 10px 15px;
  text-decoration: none;
  background-color: white;
  color: #0077cc;
  border: 1px solid #0077cc;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SuccessMessage = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
`;

const Instructions = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  
  h3 {
    margin-top: 0;
  }
  
  p {
    margin-bottom: 10px;
  }
  
  ol {
    margin: 0;
    padding-left: 20px;
  }
`;

const BookingPage = () => {
  const { places, bookings, availabilityRules } = useApp();
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Update available dates when place selection changes
  useEffect(() => {
    if (selectedPlace) {
      // In a real application, this would be calculated based on availability rules
      // For now, we'll use a simple placeholder that shows dates for the next 30 days
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(formatDate(date));
      }
      
      setAvailableDates(dates);
      setSelectedDate('');
      setSelectedSlot(null);
      setShowBookingForm(false);
    } else {
      setAvailableDates([]);
    }
  }, [selectedPlace]);

  // Update available slots when date selection changes
  useEffect(() => {
    if (selectedPlace && selectedDate) {
      const date = parseDateTime(selectedDate, '00:00').getTime() > 0 
        ? parseDateTime(selectedDate, '00:00') 
        : new Date();
      
      const slots = calculateAvailableSlotsWithBuffer(
        date,
        selectedPlace,
        places,
        bookings,
        availabilityRules,
        60 // 60-minute appointment duration
      );
      
      setAvailableSlots(slots);
      setSelectedSlot(null);
      setShowBookingForm(false);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedPlace, selectedDate, places, bookings, availabilityRules]);

  const handlePlaceChange = (placeId) => {
    setSelectedPlace(placeId);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
    setSelectedSlot(null);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedSlot(null);
    setSelectedDate('');
    setSelectedPlace('');
    setBookingSuccess(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setBookingSuccess(false);
    }, 5000);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Smart Calendar Booking</Title>
        <AdminLink to="/admin">Admin Login</AdminLink>
      </Header>

      {bookingSuccess && (
        <SuccessMessage>
          <h3>Booking Confirmed!</h3>
          <p>Your appointment has been successfully booked. A confirmation has been sent to your email.</p>
        </SuccessMessage>
      )}

      <Instructions>
        <h3>How to Book</h3>
        <p><strong>Note:</strong> We have one coach who travels to all locations. Available time slots account for travel time between locations.</p>
        <ol>
          <li>Select a place from the dropdown menu</li>
          <li>Choose an available date from the calendar</li>
          <li>Select an available time slot</li>
          <li>Fill in your information and confirm your booking</li>
        </ol>
      </Instructions>
      
      <BookingContent>
        <LeftColumn>
          <PlaceSelector 
            selectedPlace={selectedPlace} 
            onPlaceChange={handlePlaceChange} 
          />
          
          {selectedPlace && (
            <CalendarView 
              availableDates={availableDates}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          )}
        </LeftColumn>
        
        <RightColumn>
          {selectedPlace && selectedDate && !showBookingForm && (
            <TimeSlotsView 
              slots={availableSlots}
              selectedDate={selectedDate}
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
          )}
          
          {showBookingForm && selectedSlot && (
            <BookingForm 
              selectedPlace={selectedPlace}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onCancel={handleCancelBooking}
              onSuccess={handleBookingSuccess}
            />
          )}
        </RightColumn>
      </BookingContent>
    </PageContainer>
  );
};

export default BookingPage;
