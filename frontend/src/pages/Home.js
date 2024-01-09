import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081/auth')
    .then(res => {
      if(res.data.Status === "Success") {
        setAuth(true)
        setName(res.data.name)
      } else {
        setAuth(false)
      }
    })
    .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:8081/auth/logout')
    .then(res => {
      navigate('/login');
      }).catch(err => console.log(err));
  }
  return (
    <div>
      {
        auth ? 
        <div>
            <h3> You are authorized as {name}</h3>
            <button onClick={handleLogout}>Logout</button>
        </div>
        :
        <div>
          <h3>To access the planner, you need to be logged in</h3>
          <Link to="/login">Login</Link>
        </div>
      }
    </div>
  )
}

export default Home;