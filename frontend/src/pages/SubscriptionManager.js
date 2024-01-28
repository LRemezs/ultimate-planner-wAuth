import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CurrentSubscriptions from '../components/subscription_manager/CurrentSubscriptions';
import AvailableSubscriptions from '../components/subscription_manager/AvailableSubscriptions';

const SubscriptionManager = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  const triggerRefresh = () => {
    setRefreshFlag(!refreshFlag);
  };


  return (
    <div>
      <button onClick={handleBackToHome}>Back to Home</button>
      <h2>Manage Your Subscriptions</h2>
      <CurrentSubscriptions 
        userId={userId}
        refreshTrigger={refreshFlag}
        onRefreshDone={triggerRefresh}
      />
      <AvailableSubscriptions 
        userId={userId}
        refreshTrigger={refreshFlag}
        onRefreshDone={triggerRefresh}
      />
    </div>
  );
};

export default SubscriptionManager;
