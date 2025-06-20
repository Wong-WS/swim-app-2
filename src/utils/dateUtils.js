import { format, parse, addMinutes, isWithinInterval, areIntervalsOverlapping, getDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, endOfDay, isSameDay } from 'date-fns';

// Format time from date object to HH:MM format
export const formatTime = (date) => {
  return format(date, 'HH:mm');
};

// Format date to YYYY-MM-DD format
export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

// Format date to display format (e.g., Jan 1, 2025)
export const formatDisplayDate = (date) => {
  return format(date, 'MMM d, yyyy');
};

// Parse time string (HH:MM) and date string (YYYY-MM-DD) to date object
export const parseDateTime = (dateStr, timeStr) => {
  return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
};

// Get all days in a month
export const getDaysInMonth = (year, month) => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
};

// Check if a slot overlaps with any existing bookings
export const isOverlappingWithBookings = (start, end, bookings) => {
  return bookings.some(booking => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    // Check for overlaps with ANY booking at any place (since there's only one coach)
    return areIntervalsOverlapping(
      { start, end },
      { start: bookingStart, end: bookingEnd }
    );
  });
};

// Check if a time falls within the availability rules for a specific day
export const isWithinAvailabilityRules = (date, rules) => {
  const dayOfWeek = getDay(date); // 0 is Sunday, 1 is Monday, etc.
  
  // Find rule for the day of week
  const rule = rules.find(r => {
    // Convert day names to numbers for comparison
    const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    return dayMap[r.day.toLowerCase()] === dayOfWeek;
  });
  
  if (!rule) {
    return false; // No rule for this day means not available
  }
  
  // Parse start and end times from rule
  const dayStart = parse(rule.startTime, 'HH:mm', date);
  const dayEnd = parse(rule.endTime, 'HH:mm', date);
  
  // Check if date is within the rule's time range
  return isWithinInterval(date, { start: dayStart, end: dayEnd });
};

// This function is no longer used directly - it's been integrated into calculateAvailableSlotsWithBuffer
// Keeping it here for reference, but it's now deprecated
export const generateAvailableSlots = (date, placeId, places, bookings, availabilityRules, duration = 60) => {
  console.warn('generateAvailableSlots is deprecated - use calculateAvailableSlotsWithBuffer instead');
  return [];
};

// Calculate available slots with travel buffer consideration
export const calculateAvailableSlotsWithBuffer = (date, placeId, places, bookings, availabilityRules, duration = 60) => {
  const place = places.find(p => p.id === placeId);
  if (!place) return [];
  
  // Get all bookings for the day across all places
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  const dayBookings = bookings.filter(booking => {
    const bookingStart = new Date(booking.startTime);
    return isSameDay(bookingStart, date);
  });
  
  // Generate raw time slots based on availability rules (without checking conflicts yet)
  const rule = availabilityRules.find(r => r.placeId === placeId);
  if (!rule) return [];
  
  // Generate slots for the day
  const slots = [];
  const currentDate = startOfDay(date);
  
  // Parse start and end times for the day
  const dayRule = rule.rules.find(r => {
    const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    return dayMap[r.day.toLowerCase()] === getDay(currentDate);
  });
  
  if (!dayRule) return []; // No rule for this day
  
  const startTime = parse(dayRule.startTime, 'HH:mm', currentDate);
  const endTime = parse(dayRule.endTime, 'HH:mm', currentDate);
  
  // Generate all possible slots based on start/end times and duration
  let slotStart = startTime;
  const possibleSlots = [];
  
  while (slotStart < endTime) {
    const slotEnd = addMinutes(slotStart, duration);
    if (slotEnd > endTime) break;
    
    possibleSlots.push({
      start: slotStart,
      end: slotEnd,
      startFormatted: formatTime(slotStart),
      endFormatted: formatTime(slotEnd),
    });
    
    // Move to next slot
    slotStart = addMinutes(slotStart, duration);
  }
  
  // Apply coach's schedule and travel buffer constraints
  return possibleSlots.filter(slot => {
    // 1. Check if the coach is already booked at any place during this time
    const isCoachBooked = isOverlappingWithBookings(slot.start, slot.end, dayBookings);
    if (isCoachBooked) {
      return false;
    }
    
    // 2. Check if there's enough travel buffer from previous bookings
    for (const booking of dayBookings) {
      const bookingEnd = new Date(booking.endTime);
      const bookingStart = new Date(booking.startTime);
      const bookingPlace = places.find(p => p.id === booking.placeId);
      if (!bookingPlace) continue;
      
      // Check if the booking is right before this slot
      if (bookingEnd <= slot.start) {
        // Calculate how much travel time is needed
        let requiredBufferTime = 0;
        
        // If different place, we need travel time
        if (booking.placeId !== placeId) {
          // If same area, use the defined buffer time
          if (bookingPlace.area === place.area) {
            requiredBufferTime = place.bufferTime;
          } else {
            // If different area, use the higher buffer time of the two places
            // This is a simplified assumption - in real world you might use a distance matrix
            requiredBufferTime = Math.max(place.bufferTime, bookingPlace.bufferTime);
          }
        }
        
        const actualBufferTime = (slot.start - bookingEnd) / (1000 * 60); // convert ms to minutes
        
        if (actualBufferTime < requiredBufferTime) {
          return false; // Not enough buffer time
        }
      }
      
      // Also check if this slot ends too close to the next booking
      if (slot.end <= bookingStart) {
        let requiredBufferTime = 0;
        
        // If different place, we need travel time
        if (booking.placeId !== placeId) {
          // If same area, use the defined buffer time
          if (bookingPlace.area === place.area) {
            requiredBufferTime = bookingPlace.bufferTime;
          } else {
            // If different area, use the higher buffer time of the two places
            requiredBufferTime = Math.max(place.bufferTime, bookingPlace.bufferTime);
          }
        }
        
        const actualBufferTime = (bookingStart - slot.end) / (1000 * 60); // convert ms to minutes
        
        if (actualBufferTime < requiredBufferTime) {
          return false; // Not enough buffer time before next booking
        }
      }
    }
    
    return true; // Slot is available with buffer consideration
  });
};
