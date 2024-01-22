import { format, addDays } from 'date-fns';

export const generateWeekDates = (startDate) => (
  Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(startDate, index);
    return { currentDate, formattedDate: format(currentDate, 'dd-MM-yyyy') };
  })
);

export const isEventInCell = (event, hour, dayIndex, weekDates) => {
  const cellDate = new Date(weekDates[dayIndex].currentDate);
  cellDate.setHours(hour, 0, 0, 0);
  const cellEndTime = new Date(cellDate);
  cellEndTime.setHours(hour + 1, 0, 0, 0);

  const dayOfWeek = cellDate.getDay(); 

  const isOneOffEvent = event.type === 'oneOff';
  const isRepeatingEvent = event.type === 'repeating';

  const eventStartTime = new Date(event.start_time);
  let eventEndTime = new Date(event.end_time);

  // Adjust end time for events that end at midnight
  if (eventEndTime.getHours() === 0 && eventEndTime.getMinutes() === 0 && eventEndTime.getSeconds() === 0) {
    eventEndTime.setDate(eventEndTime.getDate() + 1);
  }

  const matchesOneOffEvent = isOneOffEvent && 
                              eventStartTime < cellEndTime &&
                              eventEndTime > cellDate;

  const matchesRepeatingEvent = isRepeatingEvent && 
                                event.repeat_on_days && 
                                event.repeat_on_days.includes(dayOfWeek) &&
                                eventStartTime.getHours() <= hour &&
                                (eventEndTime.getHours() > hour || (eventEndTime.getHours() === 0 && hour < 24));

  return matchesOneOffEvent || matchesRepeatingEvent;
};
