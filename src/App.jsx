import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth } from './components/firebaseConfig';

import AuthPage from './components/AuthPage';
import ClientView from './components/ClientView';
import AdminView from './components/AdminView';
// import ProtectedRoute from './components/ProtectedRoute';
import './theme.css';

const App = () => {
  const [students, setStudents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // Skipping auth logic
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //     console.log("Auth changed:", currentUser);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const handleAddStudent = (student) => {
    setStudents(prev => [...prev, student]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }} className="flex flex-col">
        <header
          style={{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)' }}
          className="w-full px-6 py-4 flex justify-between items-center shadow-md fixed top-0 z-10"
        >
          <Link to="/" className="text-xl md:text-2xl font-semibold">🎓 Student Portal</Link>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
              className="text-xs md:text-sm border px-3 py-1 rounded hover:opacity-90 transition"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* Skipping login/logout for now */}
            {/* <Link to="/auth" ...>Login</Link> */}
            {/* <button onClick={() => signOut(auth)}>Logout</button> */}

            <Link
              to="/admin"
              style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
              className="text-xs md:text-sm border px-3 py-1 rounded hover:opacity-90 transition"
            >
              Admin
            </Link>
          </div>
        </header>

        <main className="flex-grow pt-20 pb-24 px-4 flex flex-col items-center">
          <Routes>
            <Route
              path="/"
              element={
                <div
                  style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
                  className="backdrop-blur-md shadow-xl rounded-xl p-10 mt-10 text-center max-w-md w-full"
                >
                  <h2 className="text-2xl font-bold mb-6">Welcome</h2>
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/client"
                      style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                      className="px-6 py-3 rounded-lg font-semibold shadow hover:opacity-90 transition"
                    >
                      Client View
                    </Link>
                  </div>
                </div>
              }
            />

            {/* Commented out AuthPage for now */}
            {/* <Route path="/auth" element={<AuthPage />} /> */}

            <Route
              path="/client"
              element={
                <div className="w-full max-w-4xl mt-10">
                  <ClientView onAddStudent={handleAddStudent} />
                </div>
              }
            />
            <Route
              path="/admin"
              element={
                <div className="w-full max-w-4xl mt-10">
                  <AdminView students={students} />
                </div>
              }
            />
            <Route path="*" element={<h2 className="mt-20">Page Not Found</h2>} />
          </Routes>
        </main>

        <footer
          style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--text-color)' }}
          className="shadow-inner text-center py-4 text-sm"
        >
          © {new Date().getFullYear()} Student Management System
        </footer>
      </div>
    </Router>
  );
};

export default App;
