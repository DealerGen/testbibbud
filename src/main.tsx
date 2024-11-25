import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CarDataProvider } from './context/CarDataContext';
import './utils/suppressWarnings';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <CarDataProvider>
        <App />
      </CarDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);