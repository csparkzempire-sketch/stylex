import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminDashboard from './AdminDashboard_1';
const root = ReactDOM.createRoot(document.getElementById('root'));

if (window.location.pathname === '/admin') {
  root.render(
    <React.StrictMode>
      <AdminDashboard />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}