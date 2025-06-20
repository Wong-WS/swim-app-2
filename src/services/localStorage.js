/**
 * Service for managing data in localStorage
 */

// Keys for storing different types of data
const STORAGE_KEYS = {
  PLACES: 'swimScheduler_places',
  BOOKINGS: 'swimScheduler_bookings',
  AVAILABILITY_RULES: 'swimScheduler_availabilityRules',
};

// Get data from localStorage with default value if not found
export const getData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving data from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

// Save data to localStorage
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage for key ${key}:`, error);
    return false;
  }
};

// Get all places from localStorage
export const getPlaces = () => getData(STORAGE_KEYS.PLACES);

// Save places to localStorage
export const savePlaces = (places) => saveData(STORAGE_KEYS.PLACES, places);

// Get all bookings from localStorage
export const getBookings = () => getData(STORAGE_KEYS.BOOKINGS);

// Save bookings to localStorage
export const saveBookings = (bookings) => saveData(STORAGE_KEYS.BOOKINGS, bookings);

// Get all availability rules from localStorage
export const getAvailabilityRules = () => getData(STORAGE_KEYS.AVAILABILITY_RULES);

// Save availability rules to localStorage
export const saveAvailabilityRules = (rules) => saveData(STORAGE_KEYS.AVAILABILITY_RULES, rules);

export default {
  getPlaces,
  savePlaces,
  getBookings,
  saveBookings,
  getAvailabilityRules,
  saveAvailabilityRules,
  STORAGE_KEYS,
};
