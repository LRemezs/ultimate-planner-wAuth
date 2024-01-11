import React from "react";
import WeekViewGridHeader from './WeekViewGridHeader';
import WeekViewGridBody from './WeekViewGridBody';
import { generateWeekDates } from './dateHelpers';
import '../../styles/WeekViewGrid.css';

const WeekViewGrid = ({ startDate, events }) => {

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hoursOfDay = Array.from({ length: 24 }, (_, index) => index);

  return (
    <table className="week-grid">
      <WeekViewGridHeader daysOfWeek={daysOfWeek} startDate={startDate} />
      <WeekViewGridBody hoursOfDay={hoursOfDay} weekDates={generateWeekDates(startDate)} events={events} />
    </table>
  );
};

export default WeekViewGrid;