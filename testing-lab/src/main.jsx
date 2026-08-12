import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import QeLabApp from './pages/QeLabApp.jsx';
import MoneyTransferLab from './pages/MoneyTransferLab.jsx';
import MoneyTransferHome, { RequireAuth } from './components/money-transfer/MoneyTransferHome.jsx';
import ReceiverStep from './components/money-transfer/ReceiverStep.jsx';
import AmountStep from './components/money-transfer/AmountStep.jsx';
import ReviewStep from './components/money-transfer/ReviewStep.jsx';
import ReceiptView from './components/money-transfer/ReceiptView.jsx';
import './styles/app.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/testing-lab">
    <Routes>
      <Route path="/" element={<QeLabApp />} />
      <Route path="/money-transfer" element={<MoneyTransferLab />}>
        <Route index element={<MoneyTransferHome />} />
        <Route path="transfer" element={<RequireAuth><AmountStep /></RequireAuth>} />
        <Route path="receiver" element={<RequireAuth><ReceiverStep /></RequireAuth>} />
        <Route path="amount" element={<Navigate to="/money-transfer/transfer" replace />} />
        <Route path="review" element={<RequireAuth><ReviewStep /></RequireAuth>} />
        <Route path="receipt/:ref" element={<RequireAuth><ReceiptView /></RequireAuth>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
