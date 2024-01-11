import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    AuthService.login(values)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/');
        } else {
          alert(res.data.Error);
        }
      });
  };

  return (
    <div>
      <h2>Sign-In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'><strong>Email</strong></label>
          <input
            type='email'
            placeholder='Enter Email'
            name='email'
            onChange={e => setValues({ ...values, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor='password'><strong>Password</strong></label>
          <input
            type='password'
            placeholder='Enter Password'
            name='password'
            onChange={e => setValues({ ...values, password: e.target.value })}
          />
        </div>
        <button type='submit'>Log in</button>
      </form>
      <Link to='/register'>Create new account</Link>
    </div>
  );
}

export default Login;
