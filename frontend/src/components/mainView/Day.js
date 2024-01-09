import React from 'react';

const Day = ({ day, date, dayData }) => {
  return (
    <div className="day">
      <h3>{day}</h3>
      <p>{date}</p>
      {/* Render time slots for day */}
      {Object.entries(dayData).map(([time, { event }]) => (
        <div key={time}>
          <p>{time}</p>
          {event && (
            <div>
              <p>{event.title}</p>
              <p>{`Duration: ${event.duration} slots`}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Day;