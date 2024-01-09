import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/auth/login', values)
    .then(res => {
      if(res.data.Status === "Success") {
        navigate('/')
      } else {
        alert(res.data.Error);
      }
    })
  };

  return (
    <div>
      <h2>Sign-In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'><strong>Email</strong></label>
          <input type='email' placeholder='Enter Email' name='email'
          onChange={e => setValues({...values, email: e.target.value})}/>
        </div>
        <div>
          <label htmlFor='password'><strong>Password</strong></label>
          <input type='password' placeholder='Enter Password' name='password'
          onChange={e => setValues({...values, password: e.target.value})}/>
        </div>
        <button type='submit'>Log in</button>
      </form>
      <Link to='/register'>Create new account</Link>
    </div>     
  )
}

export default Login;