import api from '../utils/api';

const API_BASE_URL = 'http://localhost:8081/subscriptions';

const SubscriptionService = {
  getUserSubscriptions: (userId) =>
    api.get(`${API_BASE_URL}/listSubscriptions/?user_id=${userId}`),
  getCurrentUserSubscriptions: (userId) =>
    api.get(`${API_BASE_URL}/current/${userId}`),
  getAllSubscriptions: () =>
    api.get(`${API_BASE_URL}/all`),
  addSubscription: (subscriptionData) =>
    api.post(`${API_BASE_URL}/add`, subscriptionData),
  getSubscriptionTimings: (userSubscriptionId) =>
    api.get(`${API_BASE_URL}/timings/${userSubscriptionId}`),
  updateSubscriptionTimings: (userSubscriptionId, timings) => {
      return api.put(`${API_BASE_URL}/updateTimings/${userSubscriptionId}`, { timings });
    },
  updateSubscriptionDetails: (userSubscriptionId, timings, startDate, endDate) => {
      return api.put(`${API_BASE_URL}/updateDetails/${userSubscriptionId}`, { timings, startDate, endDate });
    },
  deleteSubscription: (userSubscriptionId) =>
    api.delete(`${API_BASE_URL}/unsubscribe/${userSubscriptionId}`)
};

export default SubscriptionService;
