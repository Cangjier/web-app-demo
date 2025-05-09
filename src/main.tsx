import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={VITE_PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home style={{ width: '100vw', height: '100vh' }}></Home>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>

);