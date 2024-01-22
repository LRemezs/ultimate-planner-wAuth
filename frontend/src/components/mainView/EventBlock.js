import React from "react";
import { Link } from 'react-router-dom';

const EventBlock = ({ event, columnIndex, hour, userId }) => {
  const eventStartTime = new Date(event.start_time);
  const eventEndTime = new Date(event.end_time);

  const startHour = eventStartTime.getHours();
  const endHour = eventEndTime.getHours();
  const adjustedEndHour = endHour === 0 ? 24 : endHour;
  const isStartingCell = hour === startHour;
  const rowSpan = adjustedEndHour - startHour;
  const isRoutineEvent = event.type === 'repeating'; 
  const eventDetailsUrl = `/events/${event.id}/user/${userId.userId}`;

  // Function to format time
  const formatTime = (time) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).format(new Date(time));
};
  

  if (isStartingCell) {
    return (
      <td key={`${columnIndex}`} rowSpan={rowSpan}>
        <div>
          <strong>{event.title}</strong>
          <br />
          {startHour === 0 ? `${formatTime(event.end_time)}` : `${formatTime(event.start_time)}`}
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