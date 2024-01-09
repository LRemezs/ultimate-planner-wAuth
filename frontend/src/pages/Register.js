import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    AuthService.register(values)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/login');
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <div>
        <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'><strong>Name</strong></label>
            <input
              type='text'
              placeholder='Enter Name'
              name='name'
              onChange={e => setValues({ ...values, name: e.target.value })}
            />
          </div>
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
          <button type='submit'>Sign up</button>
        </form>
        <Link to='/login'>Already have an account? Log in</Link>
      </div>
    </div>
  );
}

export default Register;