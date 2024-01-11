import React, { useState } from 'react';
import WeekViewGrid from './WeekViewGrid';
import { addWeeks, subWeeks } from 'date-fns';
import '../../styles/WeekViewContainer.css';

const initialOneOffEvents = [
  {
    title: 'Event 1',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T12:00:00'),
    description: 'Event 1 description',
    location: 'Location 1',
    type: 'oneOff'
  },
  {
    title: 'Event 2',
    startTime: new Date('2024-01-15T14:00:00'),
    endTime: new Date('2024-01-15T15:00:00'),
    description: 'Event 2 description',
    location: 'Location 2',
    type: 'oneOff'
  },
  {
    title: 'Event 3',
    startTime: new Date('2024-01-21T14:00:00'),
    endTime: new Date('2024-01-21T18:00:00'),
    description: 'Event 3 description',
    location: 'Location 3',
    type: 'oneOff'
  },
  {
    title: 'Event 4',
    startTime: new Date('2024-01-01T07:00:00'),
    endTime: new Date('2024-01-01T10:00:00'),
    description: 'Event 4 description',
    location: 'Location 4',
    type: 'oneOff'
  },
  // Add more events as needed
];

const initialRoutineEvents = [
  {
    title: 'Routine Event',
    startHour: 1,
    endHour: 3,
    startTime: new Date('2024-01-01T01:00:00'),
    endTime: new Date('2024-01-01T03:00:00'),
    description: 'Routine event description',
    location: 'Routine Location',
    type: 'routine',
    repeat: {
      weekdays: [1, 3, 5], // Repeat on Monday, Wednesday, and Friday
    },
  },
  {
    title: 'Routine Event 2',
    startHour: 4,
    endHour: 7,
    description: 'Routine event 2 description',
    location: 'Routine 2 Location',
    type: 'routine',
    startTime: new Date('2024-01-01T04:00:00'),
    endTime: new Date('2024-01-01T06:00:00'),
    repeat: {
      weekdays: [0, 1, 2, 3, 4, 5, 6], // Repeat on Monday, Wednesday, and Friday
    },
  },
  // Add more routine events as needed
];

const WeekViewContainer = () => {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());

  const handleNextWeek = () => {
    setCurrentWeekStartDate((prevStartDate) => addWeeks(prevStartDate, 1));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStartDate((prevStartDate) => subWeeks(prevStartDate, 1));
  };

  return (
    <div>
      <button onClick={handlePrevWeek}>Previous Week</button>
      <button onClick={handleNextWeek}>Next Week</button>
      <WeekViewGrid
        startDate={currentWeekStartDate}
        events={{
          oneOffEvents: initialOneOffEvents,
          routineEvents: initialRoutineEvents,
        }}
      />
    </div>
  );
};

export default WeekViewContainer;