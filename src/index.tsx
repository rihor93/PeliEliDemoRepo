import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './fonts/ITC-Franklin-Gothic_Heavy-bb9afb67.woff';
import './fonts/ITC-Franklin-Gothic_Book-1a2e60c0.woff';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

