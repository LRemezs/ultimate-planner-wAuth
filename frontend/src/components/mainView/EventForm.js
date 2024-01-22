import React, { useState } from 'react';

const EventForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, startTime, endTime, description, location });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="Start Time" />
      <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="End Time" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"></textarea>
      <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
