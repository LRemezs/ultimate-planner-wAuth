import React, { useState } from 'react';
import EventService from '../../services/event';

const EventForm = ({ userId, onEventAdded }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const generateHourOptions = () => {
    let options = [];
    for (let i = 0; i < 24; i++) {
      options.push(i.toString().padStart(2, '0'));
    }
    return options;
  };

  const generateMinuteOptions = () => {
    return ['00', '15', '30', '45'];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDateTime = `${startDate}T${startHour}:${startMinute}:00`;
    const endDateTime = `${endDate}T${endHour}:${endMinute}:00`;

    // Validate if end time is after start time
    if (endDateTime <= startDateTime) {
      alert('End time must be after start time.'); // Use a more sophisticated notification method if available
      return; // Prevent form submission
    };

    const eventData = {
      user_id: userId,
      title, 
      start_time: startDateTime, 
      end_time: endDateTime, 
      description, 
      location, 
      type: 'oneOff'
    };
    console.log(eventData);
    

    try {
      const response = await EventService.addEvent(eventData);
      if (response.status === 200) {
        onEventAdded();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      
      {/* Start Date and Time */}
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <select value={startHour} onChange={e => setStartHour(e.target.value)}>
        <option value="">Hour</option>
        {generateHourOptions().map(hour => <option key={hour} value={hour}>{hour}</option>)}
      </select>
      <select value={startMinute} onChange={e => setStartMinute(e.target.value)}>
        <option value="">Minute</option>
        {generateMinuteOptions().map(minute => <option key={minute} value={minute}>{minute}</option>)}
      </select>

      {/* End Date and Time */}
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <select value={endHour} onChange={e => setEndHour(e.target.value)}>
        <option value="">Hour</option>
        {generateHourOptions().map(hour => <option key={hour} value={hour}>{hour}</option>)}
      </select>
      <select value={endMinute} onChange={e => setEndMinute(e.target.value)}>
        <option value="">Minute</option>
        {generateMinuteOptions().map(minute => <option key={minute} value={minute}>{minute}</option>)}
      </select>

      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"></textarea>
      <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
