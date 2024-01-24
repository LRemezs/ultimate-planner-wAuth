import React from "react";
import WeekViewGridCell from './WeekViewGridCell';
import { isEventInCell } from '../one_off_events/dateHelpers';

const WeekViewGridBody = ({ hoursOfDay, weekDates, events, userId, onEventDeleted }) => {
  
  // Function to check if there are events for a given time slot
  const hasEventsInTimeSlot = (timeSlot) => {
    return events.some(event => 
      weekDates.some((day, columnIndex) => 
        isEventInCell(event, timeSlot, columnIndex, weekDates)
      )
    );
  };

  // Check if any row has events
  const anyRowHasEvents = hoursOfDay.some(timeSlot => hasEventsInTimeSlot(timeSlot));

  return (
    <tbody>
      {anyRowHasEvents ? (
        hoursOfDay.map((timeSlot) => (
          hasEventsInTimeSlot(timeSlot) && (
            <tr key={timeSlot}>
              <td style={{lineHeight: 0.5, padding: 0}}>{timeSlot}</td>
              {weekDates.map((day, columnIndex) => (
                <WeekViewGridCell
                  key={columnIndex}
                  columnIndex={columnIndex}
                  timeSlot={timeSlot}
                  weekDates={weekDates}
                  events={events}
                  isEventInCell={(event) => isEventInCell(event, timeSlot, columnIndex, weekDates)}
                  userId={userId}
                  onEventDeleted={onEventDeleted}
                />
              ))}
            </tr>
          )
        ))
      ) : (
        <tr>
          <td colSpan={weekDates.length + 1}>Nothing planned for this week.</td>
        </tr>
      )}
    </tbody>
  );
};

export default WeekViewGridBody;
