import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";
import WeekViewContainer from "../components/week_view/WeekViewContainer";

const Home = () => {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    AuthService.checkAuth()
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setUserId(res.data.id); 
        } else {
          setAuth(false);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    AuthService.logout()
      .then(res => {
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  const handleManageSubscriptionsClick = () => {
    if (userId) {
      navigate(`/manage-subscriptions/${userId}`);
    } else {
      console.error("User ID is undefined");
    }
  };

  const handleProfileClick = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      console.error("User ID is undefined")
    }
  }
  
  return (
    <div>
      {auth ? (
        <div>
          <div>
          <h3>You are authorized as {name}</h3>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleManageSubscriptionsClick}>Manage Subscriptions</button>
          <button onClick={handleProfileClick}>View Profile</button>
          </div>
          <WeekViewContainer userId={userId} />
        </div>
      ) : (
        <div>
          <h3>To access the planner, you need to be logged in</h3>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
}

export default Home;