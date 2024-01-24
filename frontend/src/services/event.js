import api from '../utils/api';

const API_BASE_URL = 'http://localhost:8081/events';

const EventService = {
  addEvent: (eventData) => api.post(`${API_BASE_URL}/add`, eventData),
  listEvents: (userId, startDateString, endDateString) =>
  api.get(`${API_BASE_URL}/list?user_id=${userId}&start_date=${startDateString}&end_date=${endDateString}`),
  deleteEvent: (event_id) => api.delete(`${API_BASE_URL}/remove/${event_id}`),
};

export default EventService;
