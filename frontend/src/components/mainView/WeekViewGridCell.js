import React from "react";
import OneOffEvent from "./OneOffEvent";
import RoutineEvent from "./RoutineEvent";

const WeekViewGridCell = ({ columnIndex, hour, events, weekDates, isEventInCell, isRoutineEventInCell }) => {
  const oneOffEvent = events.oneOffEvents.find((event) => isEventInCell(event, hour, columnIndex));
  const routineEvent = events.routineEvents.find((event) => isRoutineEventInCell(event, hour, columnIndex));

  

  if (oneOffEvent) {
    return <OneOffEvent key={`oneOff_${columnIndex}`} event={oneOffEvent} columnIndex={columnIndex} hour={hour} />;
  }
  
  if (routineEvent) {
    return <RoutineEvent key={`routine_${columnIndex}`} event={routineEvent} columnIndex={columnIndex} hour={hour} />;
  }

  // Render empty cell if no events in the cell
  return <td key={columnIndex}></td>;
};

export default WeekViewGridCell;
