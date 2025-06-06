import React, { useState } from 'react';

const ClientView = () => {
  const [student, setStudent] = useState({
    name: '',
    rollNumber: '',
    department: '',
    year: ''
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });

    if (response.ok) {
      alert('Student submitted!');
      setStudent({ name: '', rollNumber: '', department: '', year: '' });
    } else {
      alert('Failed to submit student data.');
    }
  };

  return (
    <div>
      <h2>Client View - Enter Student Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input name="name" value={student.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Roll Number: </label>
          <input name="rollNumber" value={student.rollNumber} onChange={handleChange} required />
        </div>
        <div>
          <label>Department: </label>
          <input name="department" value={student.department} onChange={handleChange} required />
        </div>
        <div>
          <label>Year: </label>
          <input name="year" value={student.year} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ClientView;
