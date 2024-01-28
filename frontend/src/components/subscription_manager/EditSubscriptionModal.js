import React, { useEffect, useState } from 'react';
import SubscriptionService from '../../services/subscription';

const EditSubscriptionModal = ({ subscription, onSave, onClose }) => {
    const displayDaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayOfWeekToDbIndex = {
        'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0
    };

    // Initialize state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isEndDateEnabled, setIsEndDateEnabled] = useState(true);
    const initialTimings = displayDaysOfWeek.reduce((acc, day) => {
        acc[day] = { startTime: null, endTime: null };
        return acc;
    }, {});
    const [timings, setTimings] = useState(initialTimings);

    useEffect(() => {
        // Fetch timings for the subscription
        SubscriptionService.getSubscriptionTimings(subscription.user_subscription_id)
            .then(response => {
                const currentTimings = response.data.timings;
                const updatedTimings = { ...initialTimings };
                currentTimings.forEach(timing => {
                    const dayName = displayDaysOfWeek[timing.day_of_week === 0 ? 6 : timing.day_of_week - 1];
                    updatedTimings[dayName] = {
                        startTime: new Date(`1970-01-01T${timing.start_time}`),
                        endTime: new Date(`1970-01-01T${timing.end_time}`)
                    };
                });
                setTimings(updatedTimings);
            })
            .catch(error => console.error("Error fetching timings", error));

        // Set start and end dates
        if (subscription.start_date) {
            const formattedStartDate = new Date(subscription.start_date).toISOString().split('T')[0];
            setStartDate(formattedStartDate);
        }
        if (subscription.end_date) {
            const formattedEndDate = new Date(subscription.end_date).toISOString().split('T')[0];
            setEndDate(formattedEndDate);
            setIsEndDateEnabled(true);
        } else {
            setIsEndDateEnabled(false);
        }
    }, [subscription]);

    const handleTimeChange = (day, type, hourOrMinute, value) => {
      let updatedTime = timings[day][type];
      if (!updatedTime) {
          updatedTime = new Date();
          updatedTime.setHours(0, 0, 0, 0); // Reset to midnight
      }
  
      // Parse the hours and minutes if the time already exists
      const hours = updatedTime ? updatedTime.getHours() : 0;
      const minutes = updatedTime ? updatedTime.getMinutes() : 0;
  
      if (hourOrMinute === 'hour') {
          updatedTime.setHours(value, minutes, 0, 0);
      } else { // 'minute'
          updatedTime.setHours(hours, value, 0, 0);
      }
  
      setTimings({
          ...timings,
          [day]: { ...timings[day], [type]: updatedTime }
      });
  };
  

  const handleDaySelectionChange = (day, isSelected) => {
    if (isSelected) {
      setTimings({
        ...timings,
        [day]: {
          startTime: timings[day].startTime || new Date(),
          endTime: timings[day].endTime || new Date()
        }
      });
    } else {
      setTimings({
        ...timings,
        [day]: { startTime: null, endTime: null }
      });
    }
  };

  const handleEndDateToggle = (e) => {
    const isChecked = e.target.checked;
    setIsEndDateEnabled(!isChecked);
    if (isChecked) {
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

    // Pass null for end_date if isEndDateEnabled is false
    onSave(subscription.user_subscription_id, formattedTimings, startDate, isEndDateEnabled ? endDate : null);
    onClose();
};


  const renderTimeDropdown = (day, type, hourOrMinute) => {
    const time = timings[day] && timings[day][type];
    if (!time) return null;

    const value = hourOrMinute === 'hour' ? time.getHours() : time.getMinutes();
    const range = hourOrMinute === 'hour' ? Array.from({ length: 24 }, (_, i) => i) : [0, 15, 30, 45];

    return (
      <select 
        value={value}
        onChange={(e) => handleTimeChange(day, type, hourOrMinute, e.target.value)}
      >
        {range.map((option) => (
          <option key={option} value={option}>
            {hourOrMinute === 'hour' ? option.toString().padStart(2, '0') : option}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>Edit Timings for {subscription.s_name}</h3>
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
            disabled={!isEndDateEnabled} // Disabled if checkbox is checked
          />
          <label>
            <input 
              type="checkbox" 
              checked={!isEndDateEnabled} // Checked if endDate is not enabled
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
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EditSubscriptionModal;
