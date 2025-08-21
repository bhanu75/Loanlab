import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'   // ab .jsx ki jagah direct ./App likhna hoga
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
