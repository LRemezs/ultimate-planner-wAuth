import React from 'react';
import Day from './Day';

const WeekView = ({ weekData }) => {
  return (
    <div className="week-view">
      {weekData.map(({ day, date, dayData }) => (
        <Day key={date} day={day} date={date} dayData={dayData} />
      ))}
    </div>
  );
};

export default WeekView;