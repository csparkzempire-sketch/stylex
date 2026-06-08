import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminDashboard from './AdminDashboard';

const path = window.location.pathname;
const root = ReactDOM.createRoot(document.getElementById('root'));

if (path === '/admin') {
  root.render(<AdminDashboard />);
} else {
  root.render(<App />);
}