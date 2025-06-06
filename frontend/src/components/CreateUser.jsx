import React, { useState } from 'react';

const CreateUser = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    role: 'admin' // optional field, can be used if your app supports roles
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        alert('User created successfully!');
        setUserData({ email: '', password: '', role: 'admin' });
      } else {
        alert('Failed to create user.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred.');
    }
  };

  return (
    <div>
      <h3>Create Admin User</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
