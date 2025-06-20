import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';
import { formatDate, formatTime } from '../../utils/dateUtils';

const ListContainer = styled.div`
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #0077cc;
  color: white;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
`;

const ActionButton = styled(Button)`
  margin-right: 5px;
  padding: 5px 10px;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  border: 1px dashed #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const BookingsList = () => {
  const { bookings, places, deleteBooking } = useApp();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      deleteBooking(id);
    }
  };

  const getPlaceName = (placeId) => {
    const place = places.find(p => p.id === placeId);
    return place ? place.name : 'Unknown Place';
  };

  const formatBookingTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${formatDate(start)} ${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <ListContainer>
      <h3>Bookings</h3>
      
      {bookings.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Client</Th>
              <Th>Place</Th>
              <Th>Date & Time</Th>
              <Th>Email</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <Td>{booking.name}</Td>
                <Td>{getPlaceName(booking.placeId)}</Td>
                <Td>{formatBookingTime(booking.startTime, booking.endTime)}</Td>
                <Td>{booking.email}</Td>
                <Td>
                  <ActionButton onClick={() => handleDelete(booking.id)}>
                    Cancel Booking
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMessage>No bookings found.</EmptyMessage>
      )}
    </ListContainer>
  );
};

export default BookingsList;
