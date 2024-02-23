import React, { useState, useEffect } from "react";
import SubscriptionEventService from "../../../services/subscriptionEvent";

const RunningEntryContent = ({ event, refreshEvents }) => {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    SubscriptionEventService.getRunningEventData(event.r_entry_id)
      .then(response => {
        const { run_distance_km, run_time_minutes } = response.data;
        // Convert decimal minutes to minutes:seconds format
        const totalMinutes = parseInt(run_time_minutes);
        const totalSeconds = Math.round((run_time_minutes - totalMinutes) * 60);
        setTime(`${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`);
        setDistance(run_distance_km.toString());
      })
      .catch(error => {
        console.error('Failed to fetch running event data:', error);
      });
  }, [event.r_entry_id]);

  const handleUpdate = () => {
    const [minutes, seconds] = time.split(':').map(Number);
    const totalMinutes = minutes + (seconds / 60);
    SubscriptionEventService.updateRunningEventData(event.r_entry_id, parseFloat(distance), totalMinutes)
      .then(() => {
        alert('Update successful!');
      })
      .catch(error => {
        console.error('Error updating running entry:', error);
        alert('Update failed!');
      });
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this entry?");
    if (isConfirmed) {
      SubscriptionEventService.deleteRunningEventData(event.r_entry_id)
        .then(() => {
          refreshEvents();
        })
        .catch(error => {
          console.error('Error deleting running entry:', error);
          alert('Failed to delete entry.');
        });
    }
  };

  return (
    <div>
      <h3>{event.title}</h3>
      <form onSubmit={(e) => e.preventDefault()}>
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
        <button type="button" onClick={handleUpdate}>Update</button>
      </form>
      <button onClick={handleDelete}>&times;</button>
    </div>
  );
};


export default RunningEntryContent;