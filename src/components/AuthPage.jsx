import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import '../theme.css';

const AuthPage = () => {
  const firebaseuiContainer = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(auth);
    }

    const uiConfig = {
      signInFlow: 'redirect', // Use redirect flow instead of popup
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          // Return false to avoid redirect, Firebase does it automatically
          return false;
        },
        uiShown: () => {
          const loader = document.getElementById('loader');
          if (loader) loader.style.display = 'none';
        }
      }
    };

    if (firebaseuiContainer.current) {
      ui.start(firebaseuiContainer.current, uiConfig);
    }

    return () => {
      ui.reset();
    };
  }, [from, navigate]);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result.user) {
          navigate(from, { replace: true });
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error', error);
      });
  }, [from, navigate]);

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <div
        className="backdrop-blur-md shadow-xl rounded-xl p-10 max-w-md w-full text-center"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
      >
        <h1 className="text-2xl font-bold mb-6">Sign in to continue</h1>
        <div id="firebaseui-auth-container" ref={firebaseuiContainer}></div>
        <div id="loader" className="mt-4 text-sm opacity-75">Loading...</div>
      </div>
    </div>
  );
};

export default AuthPage;
