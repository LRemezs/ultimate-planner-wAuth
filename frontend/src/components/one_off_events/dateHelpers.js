import { startOfWeek, format, addDays } from 'date-fns';

export const generateWeekDates = (startDate) => {
  const startOfWeekDate = startOfWeek(startDate, { weekStartsOn: 1 });

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(startOfWeekDate, index);
    return { currentDate, formattedDate: format(currentDate, 'dd-MM-yyyy') };
  })
};

export const isEventInCell = (event, timeSlot, dayIndex, weekDates) => {
  const [hour, minutes] = timeSlot.split(':').map(Number);
  const cellDate = new Date(weekDates[dayIndex].currentDate);
  cellDate.setHours(hour, minutes, 0, 0);
  const cellEndTime = new Date(cellDate);
  cellEndTime.setMinutes(cellDate.getMinutes() + 15); 

  const eventStartTime = new Date(event.start_time);
  let eventEndTime = new Date(event.end_time);

  const isWithinEventTimeRange = eventStartTime < cellEndTime && eventEndTime > cellDate;

  if (event.type === 'oneOff' || event.type === 'rEntry') {
    return isWithinEventTimeRange;
  }

  if (event.type === 'repeating') {
    const eventDayOfWeek = eventStartTime.getDay();
    const cellDayOfWeek = cellDate.getDay();
    return eventDayOfWeek === cellDayOfWeek && isWithinEventTimeRange;
  }

  return false;
};

