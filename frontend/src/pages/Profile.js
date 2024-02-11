import React from "react";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate('/');
  };


  return (
    <div>
      <button onClick={handleBackToHome}>Back to Home</button>  
      <h2>Profile Page</h2>  
    </div>
  )
}

export default Profile;