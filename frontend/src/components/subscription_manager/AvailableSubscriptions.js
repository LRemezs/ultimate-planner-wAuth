import React, { useEffect, useState } from "react";
import SubscriptionService from "../../services/subscription"; 
import NewSubscriptionModal from "./NewSubscriptionModal";

const AvailableSubscriptions = ({ userId, onViewDetails, refreshTrigger, onRefreshDone }) => {
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);
  const [showNewSubModal, setShowNewSubModal] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);


  useEffect(() => {
    SubscriptionService.getAllSubscriptions()
      .then(allSubsResponse => {

        SubscriptionService.getCurrentUserSubscriptions(userId)
          .then(currentUserSubsResponse => {

            const currentUserSubsIds = new Set(
              currentUserSubsResponse.data.subscriptions.map(sub => sub.subscription_id)
            );

            const filteredSubs = allSubsResponse.data.AvailableSubscriptions.filter(
              sub => !currentUserSubsIds.has(sub.subscription_id)
            );

            setAvailableSubscriptions(filteredSubs);
          })
          .catch(error => {
            console.error("Error fetching user's current subscriptions", error);
          });
      })
      .catch(error => {
        console.error("Error fetching available subscriptions", error);
      });
  }, [userId, refreshTrigger]);

  const handleSubscribeClick = (subscriptionId) => {
    setSelectedSubscriptionId(subscriptionId);
    setShowNewSubModal(true);
  };

  const handleModalSave = (userId, subscriptionId, timings, startDate, endDate) => {
    SubscriptionService.addSubscription({
      userId, 
      subscriptionId, 
      timings, 
      startDate, 
      endDate
    })
    .then(response => {

      setShowNewSubModal(false);
      onRefreshDone();
    })
    .catch(error => {
      console.error("Error subscribing", error);
    });
  };

  return (
    <div>
      <h3>Available Subscriptions</h3>
      {availableSubscriptions.length > 0 ? (
        availableSubscriptions.map(sub => (
          <div key={sub.subscription_id}>
            <p>{sub.s_name}</p>
            <button onClick={() => handleSubscribeClick(sub.subscription_id)}>Subscribe</button>
            <button onClick={() => onViewDetails(sub.subscription_id)}>Details</button>
          </div>
        ))
      ) : (
        <p>No available subscriptions found.</p>
      )}
      {showNewSubModal && (
        <NewSubscriptionModal
          subscriptionId={selectedSubscriptionId}
          userId={userId}
          onSave={handleModalSave}
          onClose={() => setShowNewSubModal(false)}
        />
      )}
    </div>
  );
};

export default AvailableSubscriptions;
