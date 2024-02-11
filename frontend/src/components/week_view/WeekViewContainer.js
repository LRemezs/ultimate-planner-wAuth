import React, { useState, useEffect } from 'react';
import WeekViewGrid from './WeekViewGrid';
import EventForm from '../one_off_events/EventForm';
import { addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { generateEventsBasedOnSubscriptions, transformSubscriptionsData } from '../routines/routinesHelpers';
import EventService from '../../services/event';
import SubscriptionService from '../../services/subscription';
import SubscriptionEventService from '../../services/subscriptionEvent';
import '../../styles/WeekViewContainer.css';
import '../../styles/Modal.css';

const WeekViewContainer = ({ userId }) => {
    const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);

    const startOfWeekDate = startOfWeek(currentWeekStartDate, { weekStartsOn: 1 });
    startOfWeekDate.setHours(0, 0, 0, 0);

    const endOfWeekDate = endOfWeek(currentWeekStartDate, { weekStartsOn: 1 });
    endOfWeekDate.setHours(23, 59, 59, 999);

    const startDateString = startOfWeekDate.toISOString();
    const endDateString = endOfWeekDate.toISOString();

    const fetchAndSetEvents = async () => {
        const [eventsResponse, subscriptionsResponse, repeatingEventsResponse] = await Promise.all([
            EventService.listEvents(userId, startDateString, endDateString),
            SubscriptionService.getUserSubscriptions(userId),
            SubscriptionEventService.listRepeatingEvents(userId, startDateString, endDateString)
        ]);
        
        const databaseEvents = eventsResponse.data.events || [];
        const userSubscriptions = transformSubscriptionsData(subscriptionsResponse.data.subscriptions || []);
        const repeatingEvents = repeatingEventsResponse.data.repeating_events || [];

        const generatedEvents = generateEventsBasedOnSubscriptions(userSubscriptions, startOfWeekDate, endOfWeekDate, userId);
        setEvents([...databaseEvents, ...generatedEvents, ...repeatingEvents]);
    };

    useEffect(() => {
        if (userId) {
            fetchAndSetEvents().catch(err => console.error(err));
        }
    }, [userId, currentWeekStartDate, startDateString, endDateString]);

    const handleNextWeek = () => setCurrentWeekStartDate(prevStartDate => addWeeks(prevStartDate, 1));
    const handlePrevWeek = () => setCurrentWeekStartDate(prevStartDate => subWeeks(prevStartDate, 1));

    const handleEventFormSubmit = async () => {
        await fetchAndSetEvents(); // Refresh events after adding
        setShowEventForm(false);
    };

    const refreshEvents = () => {
      fetchAndSetEvents().catch(err => console.error(err));
    };

    return (
        <div>
            <button onClick={handlePrevWeek}>Previous Week</button>
            <button onClick={handleNextWeek}>Next Week</button>
            <WeekViewGrid
                startDate={currentWeekStartDate}
                events={events}
                userId={userId}
                refreshEvents={refreshEvents}
            />
            <button onClick={() => setShowEventForm(true)}>Add Event</button>
            {showEventForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowEventForm(false)}>&times;</span>
                        <EventForm userId={userId} onEventAdded={handleEventFormSubmit} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeekViewContainer;
