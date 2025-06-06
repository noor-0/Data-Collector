import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.accessToken);
        alert('Login successful!');
        if (onLogin) onLogin(); // Notify parent
      } else {
        alert('Login failed. Check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            name="email"
            value={credentials.email} 
            onChange={handleChange} 
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            name="password"
            value={credentials.password} 
            onChange={handleChange} 
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
