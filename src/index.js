import React from 'react';
import ReactDOM from 'react-dom/client';
import { APIProvider } from '@vis.gl/react-google-maps';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { TourContextProvider } from './context/TourContext.js';
import { ModalContextProvider } from './context/ModalContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} version="beta">
      <TourContextProvider>
        <ModalContextProvider>
          <App />
        </ModalContextProvider>
      </TourContextProvider>
    </APIProvider >
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
