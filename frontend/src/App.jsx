import React, { useState } from 'react';
import './App.css';
import ClientView from './components/ClientView';
import AdminView from './components/AdminView';

function App() {
  const [view, setView] = useState('home');
  const [students, setStudents] = useState([]);

  const handleAddStudent = (student) => {
    setStudents([...students, student]);
  };

  return (
    <div>
      {view === 'home' && (
        <>
          <button onClick={() => setView('client')}>Client</button>
          <button onClick={() => setView('admin')}>Admin</button>
        </>
      )}

      {view === 'client' && <ClientView onAddStudent={handleAddStudent} />}
      {view === 'admin' && <AdminView students={students} />}
    </div>
  );
}

export default App;
