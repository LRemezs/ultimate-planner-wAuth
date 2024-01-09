import React, { useState } from 'react';
import WeekView from './WeekView';
import { createEmptyWeek } from './Utilities';
import { addWeeks, subWeeks, startOfWeek } from 'date-fns';
import '../../styles/WeekViewContainer.css';


const WeekViewContainer = () => {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());

  const handleNextWeek = () => {
    setCurrentWeekStartDate((prevStartDate) => addWeeks(prevStartDate, 1));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStartDate((prevStartDate) => subWeeks(prevStartDate, 1));
  };

  const weekData = createEmptyWeek(startOfWeek(currentWeekStartDate));

  return (
    <div>
      <button onClick={handlePrevWeek}>Previous Week</button>
      <button onClick={handleNextWeek}>Next Week</button>
      <WeekView weekData={weekData} />
    </div>
  );
};

export default WeekViewContainer;