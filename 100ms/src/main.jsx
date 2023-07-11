import { HMSRoomProvider } from '@100mslive/react-sdk'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HMSRoomProvider>
    <App />
  </HMSRoomProvider>
)
