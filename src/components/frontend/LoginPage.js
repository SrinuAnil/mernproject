import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const logo = 'https://media.licdn.com/dms/image/C560BAQE0YLKt7EeMZw/company-logo_200_200/0/1630645895449/dealsdray_logo?e=2147483647&v=beta&t=-Sm5muQhICvan844Gdv7cqg7IXnidLdfYP9uQt8HBAo'
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Both fields are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password })
      onLogin(response.data.userName, response.data.data);
      navigate('/home');
    } catch (err) {
      console.error('There was an error!', err);
      alert(err.response?.data || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className='logo-container'>
        <img src={logo} alt="Logo" className="login-logo" />
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
