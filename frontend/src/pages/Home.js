import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";
import WeekViewContainer from "../components/mainView/WeekViewContainer";

const Home = () => {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.checkAuth()
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
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

  return (
    <div>
      {auth ? (
        <div>
          <div>
          <h3>You are authorized as {name}</h3>
          <button onClick={handleLogout}>Logout</button>
          </div>
          <WeekViewContainer />
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