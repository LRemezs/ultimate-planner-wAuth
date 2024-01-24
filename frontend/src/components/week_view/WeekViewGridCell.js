import React from "react";
import EventBlock from "../one_off_events/EventBlock";


const WeekViewGridCell = ({ columnIndex, timeSlot, events, weekDates, isEventInCell, userId, onEventDeleted }) => {
  // Filter events for this cell
  const eventsForCell = events.filter(event => isEventInCell(event, timeSlot, columnIndex, weekDates));

  // Check if there is at least one one-time event
  const hasOneOffEvent = eventsForCell.some(event => event.type === 'oneOff');

  // If there is a one-time event, filter out all repeating events
  const filteredEvents = hasOneOffEvent ? eventsForCell.filter(event => event.type === 'oneOff') : eventsForCell;

  if (filteredEvents.length > 0) {
    return (
      <>
        {filteredEvents.map((event, index) => (
          <EventBlock key={`event_${columnIndex}_${index}`} event={event} columnIndex={columnIndex} timeSlot={timeSlot} userId={userId} onEventDeleted={onEventDeleted}/>
        ))}
      </>
    );
  }

  return <td key={columnIndex}></td>;
};

export default WeekViewGridCell;
