import React from "react";
import WeekViewGridCell from './WeekViewGridCell';
import { isEventInCell } from './dateHelpers';

const WeekViewGridBody = ({ hoursOfDay, weekDates, events, userId }) => (
  <tbody>
    {hoursOfDay.map((hour, rowIndex) => (
      <tr key={hour}>
        <td>{`${hour}:00`}</td>
        {weekDates.map((day, columnIndex) => (
          <WeekViewGridCell
            key={columnIndex}
            columnIndex={columnIndex}
            hour={hour}
            weekDates={weekDates}
            events={events}
            isEventInCell={(event) => isEventInCell(event, hour, columnIndex, weekDates)}
            userId={userId}
          />
        ))}
      </tr>
    ))}
  </tbody>
);

export default WeekViewGridBody;