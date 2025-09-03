// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OptionModal from './components/OptionModal';
import ReceiptModal from './components/ReceiptModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} /> 
      <Route path="/options/:id" element={<OptionModal />} />
      <Route path="/receipt" element={<ReceiptModal />} />
    </Routes>
  );
}

export default App;
