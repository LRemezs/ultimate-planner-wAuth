import React, { useState, useEffect } from 'react';
import WeekViewGrid from './WeekViewGrid';
import { addWeeks, subWeeks } from 'date-fns';
import EventService from '../../services/event';
import '../../styles/WeekViewContainer.css';

const WeekViewContainer = ({ userId }) => {
    const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (userId) {
            EventService.listEvents(userId)
                .then(response => {
                    setEvents(response.data.events);
                    console.log("Events received:", response.data.events);
                })
                .catch(err => console.error(err));
        }
    }, [userId, currentWeekStartDate]);

    const handleNextWeek = () => {
        setCurrentWeekStartDate(prevStartDate => addWeeks(prevStartDate, 1));
    };

    const handlePrevWeek = () => {
        setCurrentWeekStartDate(prevStartDate => subWeeks(prevStartDate, 1));
    };

    return (
        <div>
            <button onClick={handlePrevWeek}>Previous Week</button>
            <button onClick={handleNextWeek}>Next Week</button>
            <WeekViewGrid
                startDate={currentWeekStartDate}
                events={events}
                userId={userId}
            />
        </div>
    );
};

export default WeekViewContainer;
