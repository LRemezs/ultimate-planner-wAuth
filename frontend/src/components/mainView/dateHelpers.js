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

  const matchesOneOffEvent = isOneOffEvent && 
                              event.startTime < cellEndTime &&
                              event.endTime > cellDate;

  const matchesRepeatingEvent = isRepeatingEvent && 
                                event.repeatOnDays.includes(dayOfWeek) &&
                                event.startTime.getHours() <= hour &&
                                event.endTime.getHours() > hour;

  return matchesOneOffEvent || matchesRepeatingEvent;
};
