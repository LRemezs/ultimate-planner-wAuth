import React, { useState, useEffect } from 'react';
import WeekViewGrid from './WeekViewGrid';
import EventForm from '../one_off_events/EventForm'
import { addWeeks, subWeeks } from 'date-fns';
import EventService from '../../services/event';
import '../../styles/WeekViewContainer.css';
import '../../styles/Modal.css';


const WeekViewContainer = ({ userId }) => {
    const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false); // State for controlling EventForm visibility

    const startOfWeek = new Date(currentWeekStartDate);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    endOfWeek.setHours(0, 0, 0, 0);

    const startDateString = startOfWeek.toISOString();
    const endDateString = endOfWeek.toISOString();

    useEffect(() => {
        if (userId) {
            EventService.listEvents(userId, startDateString, endDateString)
                .then(response => {
                    setEvents(response.data.events);
                })
                .catch(err => console.error(err));
        }
    }, [userId, currentWeekStartDate, startDateString, endDateString]);

    const handleNextWeek = () => {
        setCurrentWeekStartDate(prevStartDate => addWeeks(prevStartDate, 1));
    };

    const handlePrevWeek = () => {
        setCurrentWeekStartDate(prevStartDate => subWeeks(prevStartDate, 1));
    };

    const fetchEvents = async () => {
        try {
          const response = await EventService.listEvents(userId, startDateString, endDateString);
          console.log(response);
          return response.data.events;
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

    const handleEventFormSubmit = async () => {
        try {
          const updatedEvents = await fetchEvents();
          setEvents(updatedEvents);
        } catch (error) {
          console.error('Error updating events:', error);
        }
    
        setShowEventForm(false); // Close the modal
      };
    
    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
              const response = await EventService.deleteEvent(eventId);
              if (response.status === 200) {
                const updatedEvents = events.filter((event) => event.event_id !== eventId);
                setEvents(updatedEvents);
              }
            } catch (error) {
              console.error('Error deleting event:', error);
            }
          }
        };

    return (
        <div>
            <button onClick={handlePrevWeek}>Previous Week</button>
            <button onClick={handleNextWeek}>Next Week</button>
            <WeekViewGrid
                startDate={currentWeekStartDate}
                events={events}
                userId={userId}
                onEventDeleted={handleDeleteEvent}
            />
            <button onClick={() => setShowEventForm(true)}>Add Event</button> {/* Button to open EventForm */}

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
