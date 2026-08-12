import React, { useEffect, useState } from 'react';
import PasswordLoginForm from './PasswordLoginForm.jsx';
import OtpLoginForm from './OtpLoginForm.jsx';
import { tid } from '../../lib/money-transfer/tid.js';

export default function LoginCard({
  onSuccess,
  showToast,
  focusRegistration,
  identifier,
  onIdentifierChange,
  initialMode = 'password'
}) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <section className="mt-card mt-login-card" {...tid('login-card')}>
      <div className="mt-card-head">
        <span className="mt-card-kicker">Authentication</span>
        <h2>Sign in</h2>
        <p className="mt-muted">Use the published test credentials beside this form.</p>
      </div>

      <div className="mt-tabs" role="tablist" aria-label="Login method">
        <button
          type="button"
          role="tab"
          id="login-tab-password"
          aria-controls="login-panel-password"
          aria-selected={mode === 'password'}
          className={mode === 'password' ? 'mt-tab active' : 'mt-tab'}
          onClick={() => setMode('password')}
          {...tid('login-tab-password')}
        >
          Password
        </button>
        <button
          type="button"
          role="tab"
          id="login-tab-otp"
          aria-controls="login-panel-otp"
          aria-selected={mode === 'otp'}
          className={mode === 'otp' ? 'mt-tab active' : 'mt-tab'}
          onClick={() => setMode('otp')}
          {...tid('login-tab-otp')}
        >
          OTP
        </button>
      </div>

      <div
        role="tabpanel"
        id={mode === 'password' ? 'login-panel-password' : 'login-panel-otp'}
        aria-labelledby={mode === 'password' ? 'login-tab-password' : 'login-tab-otp'}
      >
        {mode === 'password' ? (
          <PasswordLoginForm
            identifier={identifier}
            onIdentifierChange={onIdentifierChange}
            onSuccess={onSuccess}
            onSwitchToOtp={() => setMode('otp')}
            showToast={showToast}
          />
        ) : (
          <OtpLoginForm
            identifier={identifier}
            onIdentifierChange={onIdentifierChange}
            onSuccess={onSuccess}
            onSwitchToPassword={() => setMode('password')}
            showToast={showToast}
          />
        )}
      </div>

      {focusRegistration ? (
        <p className="mt-muted mt-foot-link">
          Need an account?{' '}
          <button type="button" className="mt-link-btn" onClick={focusRegistration} {...tid('login-goto-register')}>
            Create a test account
          </button>
        </p>
      ) : null}
    </section>
  );
}
