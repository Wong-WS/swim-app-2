/**
 * Utility to initialize sample data for the application
 */

import { getPlaces, savePlaces, getBookings, saveBookings, getAvailabilityRules, saveAvailabilityRules } from '../services/localStorage';

// Initialize sample places
export const initPlaces = () => {
  // Only initialize if there are no places
  const existingPlaces = getPlaces();
  if (existingPlaces && existingPlaces.length > 0) {
    return;
  }
  
  const samplePlaces = [
    {
      id: '1',
      name: 'Quayside',
      area: 'Tanjung Tokong',
      bufferTime: 30, // 30 mins buffer
    },
    {
      id: '2',
      name: 'Tamarind',
      area: 'Tanjung Tokong',
      bufferTime: 30,
    },
    {
      id: '3',
      name: 'Straits Quay',
      area: 'Tanjung Tokong',
      bufferTime: 25,
    },
    {
      id: '4',
      name: 'Gurney Plaza',
      area: 'Gurney',
      bufferTime: 40,
    },
    {
      id: '5',
      name: 'Gurney Paragon',
      area: 'Gurney',
      bufferTime: 35,
    },
  ];
  
  savePlaces(samplePlaces);
};

// Initialize sample availability rules
export const initAvailabilityRules = () => {
  // Only initialize if there are no rules
  const existingRules = getAvailabilityRules();
  if (existingRules && existingRules.length > 0) {
    return;
  }
  
  const sampleRules = [
    {
      id: '1',
      placeId: '1', // Quayside
      rules: [
        { day: 'monday', startTime: '10:00', endTime: '18:00' },
        { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
        { day: 'wednesday', startTime: '10:00', endTime: '18:00' },
        { day: 'thursday', startTime: '10:00', endTime: '18:00' },
        { day: 'friday', startTime: '10:00', endTime: '20:00' },
      ]
    },
    {
      id: '2',
      placeId: '2', // Tamarind
      rules: [
        { day: 'monday', startTime: '09:00', endTime: '17:00' },
        { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
        { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'thursday', startTime: '09:00', endTime: '17:00' },
        { day: 'friday', startTime: '09:00', endTime: '17:00' },
        { day: 'saturday', startTime: '10:00', endTime: '15:00' },
      ]
    },
    {
      id: '3',
      placeId: '3', // Straits Quay
      rules: [
        { day: 'monday', startTime: '11:00', endTime: '19:00' },
        { day: 'wednesday', startTime: '11:00', endTime: '19:00' },
        { day: 'friday', startTime: '11:00', endTime: '19:00' },
      ]
    },
    {
      id: '4',
      placeId: '4', // Gurney Plaza
      rules: [
        { day: 'monday', startTime: '10:00', endTime: '20:00' },
        { day: 'tuesday', startTime: '10:00', endTime: '20:00' },
        { day: 'wednesday', startTime: '10:00', endTime: '20:00' },
        { day: 'thursday', startTime: '10:00', endTime: '20:00' },
        { day: 'friday', startTime: '10:00', endTime: '20:00' },
        { day: 'saturday', startTime: '12:00', endTime: '18:00' },
        { day: 'sunday', startTime: '12:00', endTime: '16:00' },
      ]
    },
    {
      id: '5',
      placeId: '5', // Gurney Paragon
      rules: [
        { day: 'monday', startTime: '10:00', endTime: '19:00' },
        { day: 'wednesday', startTime: '10:00', endTime: '19:00' },
        { day: 'friday', startTime: '10:00', endTime: '19:00' },
        { day: 'saturday', startTime: '13:00', endTime: '18:00' },
      ]
    }
  ];
  
  saveAvailabilityRules(sampleRules);
};

// Initialize sample bookings
export const initBookings = () => {
  // Only initialize if there are no bookings
  const existingBookings = getBookings();
  if (existingBookings && existingBookings.length > 0) {
    return;
  }
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const sampleBookings = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      placeId: '1', // Quayside
      startTime: new Date(today.setHours(13, 0, 0, 0)).toISOString(),
      endTime: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
      bookingDate: today.toISOString().split('T')[0],
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      placeId: '2', // Tamarind
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
      endTime: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(),
      bookingDate: tomorrow.toISOString().split('T')[0],
    },
  ];
  
  saveBookings(sampleBookings);
};

// Initialize all data
export const initializeData = () => {
  initPlaces();
  initAvailabilityRules();
  initBookings();
};

export default initializeData;
