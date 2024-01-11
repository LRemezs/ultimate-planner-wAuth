import { format, addDays } from 'date-fns';

export const generateWeekDates = (startDate) => (
  Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(startDate, index);
    return { currentDate, formattedDate: format(currentDate, 'dd-MM-yyyy') };
  })
);

export const isEventInCell = (event, hour, dayIndex, weekDates) => {

  const cellStartTime = new Date(weekDates[dayIndex].currentDate).setHours(hour);
  const cellEndTime = new Date(weekDates[dayIndex].currentDate).setHours(hour);

  return (
    event.startTime < cellEndTime &&
    event.endTime >= cellStartTime
  );
};

export const isRoutineEventInCell = (event, hour, columnIndex) => {
  if (event.type === 'routine') {
    const weekdays = event.repeat.weekdays;
    const isApplicableDay = weekdays.includes(columnIndex);
    const isStartingCell = isApplicableDay && hour === event.startHour;
    return isStartingCell;
  }
  return false;
};
