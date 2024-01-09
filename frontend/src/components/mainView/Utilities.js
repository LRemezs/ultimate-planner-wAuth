import { addDays, format } from 'date-fns';

export const createEmptyDay = () => {
  const emptyDay = {};

  for (let hour = 0; hour < 24; hour++) {
    // Check if there's an event at xx:15, xx:30, or xx:45
    const hasEvent = hour % 1 === 0.25 || hour % 1 === 0.5 || hour % 1 === 0.75;

    // Only add full hours or those with events at xx:15, xx:30, or xx:45
    if (hour % 1 === 0 || hasEvent) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      emptyDay[timeSlot] = { event: null };
    }
  }

  return emptyDay;
};

export const createEmptyWeek = (startDate) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return daysOfWeek.map((day, index) => {
    const currentDate = addDays(startDate, index);
    return {
      day,
      date: format(currentDate, 'dd-MM-yyyy'),
      dayData: createEmptyDay(),
    };
  });
};