import React from 'react'
import ReactDOM from "react-dom/client";
//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("service worker registerad:", reg))
    .catch((err) => console.error("service worker misslyckades:", err));
  });
}
