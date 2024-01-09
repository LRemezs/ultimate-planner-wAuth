import api from '../utils/api';

const API_BASE_URL = 'http://localhost:8081/auth';

const AuthService = {
  register: (userData) => api.post(`${API_BASE_URL}/register`, userData),
  login: (credentials) => api.post(`${API_BASE_URL}/login`, credentials),
  logout: () => api.get(`${API_BASE_URL}/logout`),
  checkAuth: () => api.get(`${API_BASE_URL}`),
};

export default AuthService;