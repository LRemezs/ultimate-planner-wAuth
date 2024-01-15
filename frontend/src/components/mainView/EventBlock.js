import React from "react";
import { Link } from 'react-router-dom';

const EventBlock = ({ event, columnIndex, hour, userId }) => {
  const startHour = event.startTime.getHours();
  const endHour = event.endTime.getHours();
  const isStartingCell = hour === startHour;
  const rowSpan = endHour - startHour;
  const isRoutineEvent = event.type === 'repeating'; 
  const eventDetailsUrl = `/events/${event.id}/user/${userId.userId}`;

  if (isStartingCell) {
    return (
      <td key={`${columnIndex}`} rowSpan={rowSpan}>
        <div>
          <strong>{event.title}</strong>
          <br />
          {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).format(event.startTime)}
          <br />
          {event.description && (
            isRoutineEvent ?
            <Link to={eventDetailsUrl}>{event.description}</Link> :
            <span>{event.description}</span>
          )}
          <br />
          {event.location && <span>{event.location}</span>}
        </div>
      </td>
    );
  } else {
    return null;
  }
};

export default EventBlock;
