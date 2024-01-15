import React, { useState } from 'react';
import WeekViewGrid from './WeekViewGrid';
import { addWeeks, subWeeks } from 'date-fns';
import '../../styles/WeekViewContainer.css';

const initialEvents = [
  {
    // test OneOffEvents
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
  {
    title: 'Event 5',
    startTime: new Date('2024-01-22T17:00:00'),
    endTime: new Date('2024-01-22T20:00:00'),
    description: 'Event 5 description',
    location: 'Location 5',
    type: 'oneOff'
  },
  // Test Routine Events
  {
    title: 'Routine Event 1',
    startTime: new Date('2024-01-15T04:00:00'),
    endTime: new Date('2024-01-15T06:00:00'),
    description: 'Event 1 description',
    location: 'Location 1',
    type: 'repeating',
    id: 'workout',
    repeatOnDays: [1, 3, 0]  // Repeats every Tuesday, Thursday, Saturday and Sunday
  },
  {
    title: 'Routine Event 2',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T11:00:00'),
    description: 'Event 2 description',
    location: 'Location 2',
    type: 'repeating',
    id: 'sleep', // test for routine options in future
    repeatOnDays: [1, 2, 4] // Repeats every Tuesday and Thursday
  },
];


const WeekViewContainer = (userId) => {
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
          events: initialEvents,
        }}
        userId={userId}
      />
    </div>
  );
};

export default WeekViewContainer;