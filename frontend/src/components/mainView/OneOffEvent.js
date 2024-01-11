import React from "react";

const OneOffEvent = ({ event, columnIndex, hour }) => {
  const startHour = event.startTime.getHours();
  const endHour = event.endTime.getHours();
  const isStartingCell = hour === startHour;
  const rowSpan = endHour - startHour;

  // Render event only in the starting cell
  if (isStartingCell) {
    return (
      <td key={`${columnIndex}`} rowSpan={rowSpan}>
        <div>
          <strong>{event.title}</strong>
          <br />
          {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).format(event.startTime)}
          <br />
          {event.description && <span>{event.description}</span>}
          <br />
          {event.location && <span>{event.location}</span>}
        </div>
      </td>
    );
  } else {
    // If not the starting cell, return null to avoid rendering extra empty cells
    return null;
  }
};

export default OneOffEvent;
