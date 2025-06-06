import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Login from './Login';
import CreateUser from './CreateUser';

const AdminView = () => {
  const [students, setStudents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Fetch students when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:3001/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => setStudents(data))
        .catch(err => console.error('Error fetching students:', err));
    }
  }, [isLoggedIn]);

  // Export student data to Excel
  const handleDownload = () => {
    if (students.length === 0) {
      alert('No student data to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'students.xlsx');
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setStudents([]);
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      {!isLoggedIn ? (
        <>
          <Login onLogin={() => setIsLoggedIn(true)} />
          <CreateUser />
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <h3>Student Information</h3>
          <button onClick={handleDownload}>Download as Excel</button>

          {students.length === 0 ? (
            <p>No student data available.</p>
          ) : (
            students.map((student, index) => (
              <div key={index}>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Year:</strong> {student.year}</p>
                <hr />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default AdminView;
