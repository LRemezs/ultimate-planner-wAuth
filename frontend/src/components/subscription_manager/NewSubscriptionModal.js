import React, { useState } from 'react';
import SubscriptionService from '../../services/subscription';

const NewSubscriptionModal = ({ subscriptionId, userId, onSave, onClose }) => {
    const displayDaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayOfWeekToDbIndex = {
        'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0
    };

    // Initialize state for new subscription
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isEndDateEnabled, setIsEndDateEnabled] = useState(true);

    const initialTimings = displayDaysOfWeek.reduce((acc, day) => {
        // Initialize with null to indicate no selection
        acc[day] = { startTime: null, endTime: null };
        return acc;
    }, {});

    const [timings, setTimings] = useState(initialTimings);

    const handleTimeChange = (day, type, hourOrMinute, value) => {
      setTimings(prevTimings => {
          const updatedTimings = { ...prevTimings };
  
          // Ensure that we have a valid Date object to work with
          if (!updatedTimings[day][type] || !(updatedTimings[day][type] instanceof Date)) {
              updatedTimings[day][type] = new Date();
          }
  
          // Clone the existing Date object to avoid mutating the state directly
          const newTime = new Date(updatedTimings[day][type].getTime());
  
          // Update the hour or minute
          if (hourOrMinute === 'hour') {
              newTime.setHours(parseInt(value, 10));
          } else { // 'minute'
              newTime.setMinutes(parseInt(value, 10));
          }
  
          // Update the state with the new time
          updatedTimings[day][type] = newTime;
  
          return updatedTimings;
      });
  };
  
  

  const handleDaySelectionChange = (day, isSelected) => {
    if (isSelected) {
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0); // 9:00 AM
        const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0); // 5:00 PM
        setTimings({
            ...timings,
            [day]: { startTime, endTime }
        });
    } else {
        setTimings({
            ...timings,
            [day]: { startTime: null, endTime: null }
        });
    }
};

    const handleEndDateToggle = (e) => {
        setIsEndDateEnabled(!e.target.checked);
        if (e.target.checked) {
            setEndDate('');
        }
    };

    const handleSave = () => {
      const formattedTimings = Object.entries(timings)
          .filter(([_, timing]) => timing.startTime && timing.endTime)
          .map(([day, { startTime, endTime }]) => ({
              day_of_week: dayOfWeekToDbIndex[day],
              start_time: startTime ? `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}` : null,
              end_time: endTime ? `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}` : null
          }));
  
      // onSave should handle creating new entries in user_subscriptions and user_subscription_timings
      onSave(userId, subscriptionId, formattedTimings, startDate, isEndDateEnabled ? endDate : null);
      onClose();
  };
  

    const renderTimeDropdown = (day, type, hourOrMinute) => {
      const time = timings[day] && timings[day][type];
      if (!time) return null;
  
      // Ensure time is in HH:mm format
      const formattedTime = typeof time === 'string' ? time : `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
      
      const value = hourOrMinute === 'hour' ? parseInt(formattedTime.split(':')[0]) : parseInt(formattedTime.split(':')[1]);
      const range = hourOrMinute === 'hour' ? Array.from({ length: 24 }, (_, i) => i) : [0, 15, 30, 45];
  
      return (
          <select 
              value={value}
              onChange={(e) => handleTimeChange(day, type, hourOrMinute, e.target.value)}
          >
              {range.map((option) => (
                  <option key={option} value={option}>
                      {option.toString().padStart(2, '0')}
                  </option>
              ))}
          </select>
      );
  };
  

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Subscribe to New Plan</h3>
                <div>
                    <label>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                    <label>End Date:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        disabled={!isEndDateEnabled}
                    />
                    <label>
                        <input 
                            type="checkbox" 
                            checked={!isEndDateEnabled}
                            onChange={handleEndDateToggle}
                        /> No End Date
                    </label>
                </div>
                {displayDaysOfWeek.map((day, index) => (
                    <div key={index}>
                        <label>
                            <input
                                type="checkbox"
                                checked={!!(timings[day] && timings[day].startTime)}
                                onChange={(e) => handleDaySelectionChange(day, e.target.checked)}
                            />
                            {day}
                        </label>
                        {(timings[day] && timings[day].startTime) && (
                            <div>
                                <div>
                                    <label>Start Time:</label>
                                    {renderTimeDropdown(day, 'startTime', 'hour')}
                                    {renderTimeDropdown(day, 'startTime', 'minute')}
                                </div>
                                <div>
                                    <label>End Time:</label>
                                    {renderTimeDropdown(day, 'endTime', 'hour')}
                                    {renderTimeDropdown(day, 'endTime', 'minute')}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={handleSave}>Subscribe</button>
            </div>
        </div>
    );
};

export default NewSubscriptionModal;
