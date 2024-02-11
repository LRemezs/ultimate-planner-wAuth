import React, { useState } from "react";
import SubscriptionEventService from "../../../services/subscriptionEvent";

const RunningContent = ({ event, refreshEvents }) => {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    const [minutes, seconds] = time.split(':').map(Number);
    const totalMinutes = minutes + (seconds / 60);
    
    try {
      await SubscriptionEventService.createRunningEvent({
        userId: event.user_id,
        runDistanceKm: parseFloat(distance),
        runTimeMinutes: totalMinutes,
        startTime: event.start_time,
        endTime: event.end_time
      });
      
      refreshEvents();
    } catch (error) {
      console.error('Error creating running event:', error);
      alert('Failed to create running event.');
    }
  };

  return (
    <div>
      <h3>Create New Running Event</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Distance (km):
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Time (MM:SS):
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} pattern="\d{2}:\d{2}" placeholder="MM:SS" />
          </label>
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default RunningContent;
