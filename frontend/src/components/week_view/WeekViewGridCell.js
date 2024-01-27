import React from "react";
import EventBlock from "../one_off_events/EventBlock";

const WeekViewGridCell = ({ columnIndex, timeSlot, events, weekDates, isEventInCell, userId, onEventDeleted }) => {
  // Get the date for the current column
  const columnDate = new Date(weekDates[columnIndex].currentDate);

  // Filter events for this cell
  const eventsForCell = events.filter(event => isEventInCell(event, timeSlot, columnIndex, weekDates));

  // Gather all oneOff events for this day
  const oneOffEventsForDay = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return event.type === 'oneOff' && eventDate.toDateString() === columnDate.toDateString();
  });

  // Filter events based on overlap with oneOff events for the day
  const filteredEvents = eventsForCell.filter(event => {
    if (event.type === 'repeating') {
      return !oneOffEventsForDay.some(oneOffEvent => {
        const oneOffStart = new Date(oneOffEvent.start_time);
        const oneOffEnd = new Date(oneOffEvent.end_time);
        const repeatingStart = new Date(event.start_time);
        const repeatingEnd = new Date(event.end_time);
        return repeatingStart < oneOffEnd && repeatingEnd > oneOffStart;
      });
    }
    return true; // Always include oneOff events
  });

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
