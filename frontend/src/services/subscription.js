import api from '../utils/api';

const API_BASE_URL = 'http://localhost:8081/subscriptions';

const SubscriptionService = {
  getUserSubscriptions: (userId) =>
    api.get(`${API_BASE_URL}/listSubscriptions/?user_id=${userId}`),
  addSubscription: (subscriptionData) =>
    api.post(`${API_BASE_URL}/add`, subscriptionData),
  editSubscription: (subscriptionId, subscriptionData) =>
    api.post(`${API_BASE_URL}/edit/${subscriptionId}`, subscriptionData),
  deleteSubscription: (subscriptionId) =>
    api.delete(`${API_BASE_URL}/remove/${subscriptionId}`),
};

export default SubscriptionService;
