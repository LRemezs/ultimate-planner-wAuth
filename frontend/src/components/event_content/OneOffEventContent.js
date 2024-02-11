import React from "react";
import EventService from "../../services/event"; 

const OneOffEventContent = ({ event, refreshEvents }) => {
  const formatTime = (time) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).format(new Date(time));
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
        try {
            const response = await EventService.deleteEvent(eventId);
            if (response.status === 200) {
                refreshEvents();
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete the event.');
        }
    }
  };

  return (
    <div>
      <strong>{event.title}</strong>
      <br />
      {formatTime(event.start_time)}
      <br />
      {event.description && <span>{event.description}</span>}
      <br />
      {event.location && <span>{event.location}</span>}
      <span 
        style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} 
        onClick={() => handleDeleteEvent(event.event_id)}
      >
        X
      </span>
    </div>
  );
};

export default OneOffEventContent;
