import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { CarDataProvider } from './context/CarDataContext'
import './utils/suppressWarnings'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CarDataProvider>
      <App />
    </CarDataProvider>
  </React.StrictMode>,
)