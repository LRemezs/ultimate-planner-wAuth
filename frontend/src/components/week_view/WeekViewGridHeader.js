import React from "react";
import { generateWeekDates } from '../one_off_events/dateHelpers';

const WeekViewGridHeader = ({ daysOfWeek, startDate }) => {
  const weekDates = generateWeekDates(startDate);
  return (
    <thead>
      <tr>
        <th></th>
        {weekDates.map((day, index) => (
          <th key={index} data-currentdate={day.currentDate}>
            {`${daysOfWeek[index]} ${day.formattedDate}`}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default WeekViewGridHeader;