import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Buffer } from 'buffer';

// Fix Buffer is not defined error
window.Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);