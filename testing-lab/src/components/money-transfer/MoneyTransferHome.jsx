import React from 'react';
import { useOutletContext } from 'react-router-dom';
import LoginCard from './LoginCard.jsx';
import TestCredentialsPanel from './TestCredentialsPanel.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import MockDashboard from './MockDashboard.jsx';

export default function MoneyTransferHome() {
  const ctx = useOutletContext();
  const {
    user,
    handleLogout,
    showToast,
    identifier,
    setIdentifier,
    loginMode,
    loginCardKey,
    handleLoginSuccess,
    scrollToRegister,
    scrollToLogin
  } = ctx;

  if (user) {
    return <MockDashboard user={user} onLogout={handleLogout} showToast={showToast} />;
  }

  return (
    <>
      <div className="mt-layout" id="mt-login">
        <LoginCard
          key={loginCardKey}
          identifier={identifier}
          onIdentifierChange={setIdentifier}
          initialMode={loginMode}
          onSuccess={handleLoginSuccess}
          showToast={showToast}
          focusRegistration={scrollToRegister}
        />
        <TestCredentialsPanel showToast={showToast} />
      </div>
      <RegistrationForm showToast={showToast} onGoToLogin={scrollToLogin} />
    </>
  );
}

export function RequireAuth({ children }) {
  const { user } = useOutletContext();
  if (!user) return <Navigate to="/money-transfer" replace />;
  return children;
}
