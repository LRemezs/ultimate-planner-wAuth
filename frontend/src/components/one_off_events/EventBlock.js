
import React from "react";
import OneOffEventContent from "../event_content/OneOffEventContent";
import RepeatingEventContent from "../event_content/RepeatingEventContent";
import REntryContent from "../event_content/REntryContent";

const EventBlock = ({ event, columnIndex, timeSlot, refreshEvents }) => {
  const eventStartTime = new Date(event.start_time);
  const eventEndTime = new Date(event.end_time);

  const isStartingCell = `${String(eventStartTime.getHours()).padStart(2, '0')}:${String(eventStartTime.getMinutes()).padStart(2, '0')}` === timeSlot;
  const durationMinutes = (eventEndTime - eventStartTime) / (1000 * 60);
  const rowSpan = Math.ceil(durationMinutes / 15);

  // Determine which component to render based on event.type
  const renderEventContent = () => {
    switch (event.type) {
      case 'oneOff':
        return <OneOffEventContent event={event} refreshEvents={refreshEvents} />;
      case 'repeating':
        return <RepeatingEventContent event={event} refreshEvents={refreshEvents}/>;
      case 'rEntry':
        return <REntryContent event={event} refreshEvents={refreshEvents}/>;
      default:
        return null; // Or some default content
    }
  };

  if (isStartingCell) {
    return (
      <td key={`${columnIndex}`} rowSpan={rowSpan} style={{ position: 'relative' }}>
        {renderEventContent()}
      </td>
    );
  } else {
    return null;
  }
};

export default EventBlock;
