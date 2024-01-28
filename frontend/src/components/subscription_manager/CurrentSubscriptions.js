import React, { useEffect, useState } from "react";
import SubscriptionService from "../../services/subscription";
import { format } from 'date-fns'; 
import EditSubscriptionModal from './EditSubscriptionModal'; 

const CurrentSubscriptions = ({ userId, onViewDetails, refreshTrigger, onRefreshDone }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd-MM-yyyy');
  };

  useEffect(() => {
    if (userId) {
      SubscriptionService.getCurrentUserSubscriptions(userId)
        .then(response => {
          setSubscriptions(response.data.subscriptions);
        })
        .catch(error => {
          console.error("Error fetching subscriptions", error);
        });
    }
  }, [userId, refreshTrigger]);

  const fetchSubscriptions = () => {
    SubscriptionService.getCurrentUserSubscriptions(userId)
      .then(response => {
        setSubscriptions(response.data.subscriptions);
      })
      .catch(error => {
        console.error("Error fetching subscriptions", error);
      });
  };

  const handleEdit = (subscriptionId) => {
    const subscription = subscriptions.find(sub => sub.user_subscription_id === subscriptionId);
    setSelectedSubscription(subscription);
    setEditModalVisible(true);
  };

  const handleSave = (userSubscriptionId, timings, startDate, endDate) => {
    SubscriptionService.updateSubscriptionDetails(userSubscriptionId, timings, startDate, endDate)
      .then(() => {
        fetchSubscriptions();
        setEditModalVisible(false);
        onRefreshDone();
      })
      .catch(error => {
        console.error("Error updating subscription details and timings", error);
      });
};

  const handleUnsubscribe = (userSubscriptionId) => {
    if (window.confirm("Are you sure you want to unsubscribe?")) {
      SubscriptionService.deleteSubscription(userSubscriptionId)
        .then(() => {
          fetchSubscriptions();
          onRefreshDone();
        })
        .catch(error => {
          console.error("Error unsubscribing", error);
        });
    }
  };

  return (
    <div>
      <h3>Your Subscriptions</h3>
      {subscriptions.length > 0 ? (
        subscriptions.map(sub => (
          <div key={sub.user_subscription_id}>
            <p>{sub.s_name} (Start: {formatDate(sub.start_date)}, End: {sub.end_date ? formatDate(sub.end_date) : "No end date"})</p>
            <button onClick={() => handleEdit(sub.user_subscription_id)}>Edit</button>
            <button onClick={() => handleUnsubscribe(sub.user_subscription_id)}>Unsubscribe</button>
            <button onClick={() => onViewDetails(sub.user_subscription_id)}>Details</button>
          </div>
        ))
      ) : (
        <p>No current subscriptions found.</p>
      )}
      {editModalVisible && selectedSubscription && (
        <EditSubscriptionModal 
          subscription={selectedSubscription} 
          onSave={handleSave} 
          onClose={() => setEditModalVisible(false)} 
        />
      )}
    </div>
  );
};

export default CurrentSubscriptions;
