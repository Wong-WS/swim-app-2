import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlaces, getBookings, getAvailabilityRules, savePlaces, saveBookings, saveAvailabilityRules } from '../services/localStorage';

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  // State for places, bookings, and availability rules
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availabilityRules, setAvailabilityRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on initial render
  useEffect(() => {
    setPlaces(getPlaces());
    setBookings(getBookings());
    setAvailabilityRules(getAvailabilityRules());
    setIsLoading(false);
  }, []);

  // Save places to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      savePlaces(places);
    }
  }, [places, isLoading]);

  // Save bookings to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveBookings(bookings);
    }
  }, [bookings, isLoading]);

  // Save availability rules to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveAvailabilityRules(availabilityRules);
    }
  }, [availabilityRules, isLoading]);

  // Function to add a new place
  const addPlace = (place) => {
    setPlaces([...places, { ...place, id: Date.now().toString() }]);
  };

  // Function to update a place
  const updatePlace = (id, updatedPlace) => {
    setPlaces(places.map(place => place.id === id ? { ...updatedPlace, id } : place));
  };

  // Function to delete a place
  const deletePlace = (id) => {
    setPlaces(places.filter(place => place.id !== id));
  };

  // Function to add a new booking
  const addBooking = (booking) => {
    setBookings([...bookings, { ...booking, id: Date.now().toString() }]);
  };

  // Function to update a booking
  const updateBooking = (id, updatedBooking) => {
    setBookings(bookings.map(booking => booking.id === id ? { ...updatedBooking, id } : booking));
  };

  // Function to delete a booking
  const deleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  // Function to add a new availability rule
  const addAvailabilityRule = (rule) => {
    setAvailabilityRules([...availabilityRules, { ...rule, id: Date.now().toString() }]);
  };

  // Function to update an availability rule
  const updateAvailabilityRule = (id, updatedRule) => {
    setAvailabilityRules(availabilityRules.map(rule => rule.id === id ? { ...updatedRule, id } : rule));
  };

  // Function to delete an availability rule
  const deleteAvailabilityRule = (id) => {
    setAvailabilityRules(availabilityRules.filter(rule => rule.id !== id));
  };

  // Context value
  const value = {
    places,
    bookings,
    availabilityRules,
    addPlace,
    updatePlace,
    deletePlace,
    addBooking,
    updateBooking,
    deleteBooking,
    addAvailabilityRule,
    updateAvailabilityRule,
    deleteAvailabilityRule,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
