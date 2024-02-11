import React from "react";
import WeekViewGridHeader from './WeekViewGridHeader';
import WeekViewGridBody from './WeekViewGridBody';
import { generateWeekDates } from '../one_off_events/dateHelpers';
import '../../styles/WeekViewGrid.css';

const WeekViewGrid = ({ startDate, events, userId, refreshEvents }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Create an array of 15-minute intervals for each hour
  const hoursOfDay = Array.from({ length: 24 * 4 }, (_, index) => {
    const hour = Math.floor(index / 4);
    const minutes = (index % 4) * 15;
    return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  });

  return (
    <table className="week-grid">
      <WeekViewGridHeader daysOfWeek={daysOfWeek} startDate={startDate} />
      <WeekViewGridBody hoursOfDay={hoursOfDay} weekDates={generateWeekDates(startDate)} events={events} userId={userId} refreshEvents={refreshEvents}/>
    </table>
  );
};

export default WeekViewGrid;
