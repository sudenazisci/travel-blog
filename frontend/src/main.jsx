import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios';

// Global interceptor to fix API calls when accessed from mobile/network
axios.interceptors.request.use((config) => {
    if (config.url && config.url.includes('localhost')) {
        config.url = config.url.replace('localhost', window.location.hostname);
    }
    return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
