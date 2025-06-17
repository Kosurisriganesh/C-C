import React from 'react';
// Remove BrowserRouter import, as App.js uses HashRouter
// import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Remove BrowserRouter here. App.js already provides the router.
  // <BrowserRouter>
  <React.StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
  // Remove closing BrowserRouter tag
  // </BrowserRouter>
);