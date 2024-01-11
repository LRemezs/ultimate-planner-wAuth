import React from "react";
import { isRoutineEventInCell } from "./dateHelpers";


const RoutineEvent = ({ event, columnIndex, hour }) => {
  if (isRoutineEventInCell(event, hour, columnIndex)) {
    const startTime = new Date(event.startTime);
    startTime.setHours(event.startHour);

    const endTime = new Date(event.endTime);
    endTime.setHours(event.endHour);

    const rowSpan = endTime.getHours() - startTime.getHours();
  
    // Set rendered property to true
    event.rendered = true;

    return (
      <td key={`${columnIndex}`} rowSpan={rowSpan}>
        <div>
          <strong>{event.title}</strong>
          <br />
          {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).format(startTime)}
          <br />
          {event.description && <span>{event.description}</span>}
          <br />
          {event.location && <span>{event.location}</span>}
        </div>
      </td>
    );
  } else {
    return null;
  }
};

export default RoutineEvent;
