import React from "react";
import EventBlock from "../one_off_events/EventBlock";

const WeekViewGridCell = ({ columnIndex, timeSlot, events, weekDates, isEventInCell, userId, refreshEvents }) => {
  const columnDate = new Date(weekDates[columnIndex].currentDate);

  const eventsForCell = events.filter(event => isEventInCell(event, timeSlot, columnIndex, weekDates));

  const priorityEventsForDay = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return (event.type === 'oneOff' || event.type === 'rEntry') && eventDate.toDateString() === columnDate.toDateString();
  });

  const filteredEvents = eventsForCell.filter(event => {
    if (event.type === 'repeating') {
      return !priorityEventsForDay.some(priorityEvent => {
        const priorityStart = new Date(priorityEvent.start_time);
        const priorityEnd = new Date(priorityEvent.end_time);
        const repeatingStart = new Date(event.start_time);
        const repeatingEnd = new Date(event.end_time);
        return repeatingStart < priorityEnd && repeatingEnd > priorityStart;
      });
    }
    return true;
  });

  if (filteredEvents.length > 0) {
    return (
      <>
        {filteredEvents.map((event, index) => (
          <EventBlock key={`event_${columnIndex}_${index}`} event={event} columnIndex={columnIndex} timeSlot={timeSlot} userId={userId} refreshEvents={refreshEvents}/>
        ))}
      </>
    );
  }

  return <td key={columnIndex}></td>;
};

export default WeekViewGridCell;
