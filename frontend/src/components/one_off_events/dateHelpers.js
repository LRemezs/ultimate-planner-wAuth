import { format, addDays } from 'date-fns';

export const generateWeekDates = (startDate) => (
  Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(startDate, index);
    return { currentDate, formattedDate: format(currentDate, 'dd-MM-yyyy') };
  })
);

export const isEventInCell = (event, timeSlot, dayIndex, weekDates) => {
  const [hour, minutes] = timeSlot.split(':').map(Number);
  const cellDate = new Date(weekDates[dayIndex].currentDate);
  cellDate.setHours(hour, minutes, 0, 0);
  const cellEndTime = new Date(cellDate);
  cellEndTime.setMinutes(cellDate.getMinutes() + 15); 

  const isOneOffEvent = event.type === 'oneOff';

  const eventStartTime = new Date(event.start_time);
  let eventEndTime = new Date(event.end_time);

  // Adjust end time for events that end at midnight
  if (eventEndTime.getHours() === 0 && eventEndTime.getMinutes() === 0 && eventEndTime.getSeconds() === 0) {
    eventEndTime.setDate(eventEndTime.getDate() + 1);
  }

  const matchesOneOffEvent = isOneOffEvent && 
                              eventStartTime < cellEndTime &&
                              eventEndTime > cellDate;

  return matchesOneOffEvent;
};