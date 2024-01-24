import React from "react";


const EventBlock = ({ event, columnIndex, timeSlot, onEventDeleted }) => {
  const eventStartTime = new Date(event.start_time);
  const eventEndTime = new Date(event.end_time);

  const isStartingCell = `${String(eventStartTime.getHours()).padStart(2, '0')}:${String(eventStartTime.getMinutes()).padStart(2, '0')}` === timeSlot;
  const durationMinutes = (eventEndTime - eventStartTime) / (1000 * 60);
  const rowSpan = Math.ceil(durationMinutes / 15);


  const formatTime = (time) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).format(new Date(time));
  };


  if (isStartingCell) {
    return (
      <td key={`${columnIndex}`} rowSpan={rowSpan} style={{ position: 'relative' }}>
        <div>
          <strong>{event.title}</strong>
          <br />
          {formatTime(event.start_time)}
          <br />
          {event.description && <span>{event.description}</span>}
          <br />
          {event.location && <span>{event.location}</span>}
        </div>
        <span 
          style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} 
          onClick={() => onEventDeleted(event.event_id)}
        >
          X
        </span>
      </td>
    );
  } else {
    return null;
  }
};

export default EventBlock;
