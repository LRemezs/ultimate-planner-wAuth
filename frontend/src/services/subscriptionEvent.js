import api from '../utils/api';

const API_BASE_URL = 'http://localhost:8081/routineEventEntries';

const SubscriptionEventService = {
  listRepeatingEvents: (userId, startDateString, endDateString) =>
    api.get(`${API_BASE_URL}/list?user_id=${userId}&start_date=${startDateString}&end_date=${endDateString}`),

  // Services for "Running" subscription
  getRunningEventData: (r_entry_id) =>
    api.get(`${API_BASE_URL}/runningData/${r_entry_id}`),
  updateRunningEventData: (r_entry_id, run_distance_km, run_time_minutes) =>
    api.put(`${API_BASE_URL}/updateRunningData/${r_entry_id}`, { run_distance_km, run_time_minutes }),
  deleteRunningEventData: (r_entry_id) =>
    api.delete(`${API_BASE_URL}/deleteRunningData/${r_entry_id}`),
  createRunningEvent: (data) =>
    api.post(`${API_BASE_URL}/createRunningEvent`, data),

   // Services for "Gym" subscription
  listWorkoutTypes: (userId) =>
    api.get(`${API_BASE_URL}/workoutTypes/${userId}`),
  addWorkoutType: (data) =>
    api.post(`${API_BASE_URL}/workoutTypes`, data),
  deleteWorkoutType: (workoutTypeId) =>
    api.delete(`${API_BASE_URL}/workoutTypes/${workoutTypeId}`),
  listExercises: (workoutTypeId) =>
    api.get(`${API_BASE_URL}/exercises/${workoutTypeId}`),
  addExercise: (data) =>
    api.post(`${API_BASE_URL}/exercises/add`, data),
  deleteExercise: (exerciseId) =>
    api.delete(`${API_BASE_URL}/exercises/delete/${exerciseId}`),
  createGymEvent: (data) =>
    api.post(`${API_BASE_URL}/createGymEvent`, data),
  getGymEvent: (rEntryId) =>
    api.get(`${API_BASE_URL}/gymEvent/${rEntryId}`),
  replaceWorkoutData: (rEntryId, updatedWorkoutData) => 
    api.put(`${API_BASE_URL}/replaceWorkoutData/${rEntryId}`, updatedWorkoutData),
  deleteGymEvent: (rEntryId) =>
    api.delete(`${API_BASE_URL}/deleteGymEvent/${rEntryId}`),
} 

export default SubscriptionEventService;