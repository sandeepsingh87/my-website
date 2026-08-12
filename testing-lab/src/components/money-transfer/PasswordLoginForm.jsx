import React, { useId, useState } from 'react';
import PasswordField from './PasswordField.jsx';
import { tid } from '../../lib/money-transfer/tid.js';
import {
  FIELD_LIMITS,
  clampLength,
  validateIdentifier,
  validateLoginPassword
} from '../../lib/money-transfer/validation.js';
import { loginWithPassword } from '../../lib/money-transfer/moneyTransferAuth.js';

export default function PasswordLoginForm({
  identifier,
  onIdentifierChange,
  onSuccess,
  onSwitchToOtp,
  showToast
}) {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formErrorId = useId();

  function validateAll() {
    const next = {
      identifier: validateIdentifier(identifier),
      password: validateLoginPassword(password)
    };
    setErrors(next);
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setForgotOpen(false);
    setTouched({ identifier: true, password: true });
    const next = validateAll();
    if (next.identifier || next.password) {
      setFormError('');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const result = await loginWithPassword({ identifier, password, rememberMe });
      if (!result.ok) {
        setFormError(result.error);
        showToast?.(result.error, 'error');
        return;
      }
      showToast?.('Login successful.', 'success');
      onSuccess(result.user);
    } catch {
      const message = 'Something went wrong while processing the test login. Please try again.';
      setFormError(message);
      showToast?.(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-stack" onSubmit={handleSubmit} noValidate {...tid('form-password-login')}>
      <div className="mt-field">
        <label htmlFor="login-identifier">Email or mobile number</label>
        <input
          id="login-identifier"
          type="text"
          autoComplete="username"
          maxLength={FIELD_LIMITS.identifier}
          value={identifier}
          placeholder="testuser01@example.com or 9876543210"
          onChange={(event) => {
            onIdentifierChange(clampLength(event.target.value, FIELD_LIMITS.identifier));
            setFormError('');
          }}
          onBlur={(event) => {
            setTouched((t) => ({ ...t, identifier: true }));
            setErrors((e) => ({ ...e, identifier: validateIdentifier(event.target.value) }));
          }}
          aria-invalid={Boolean(touched.identifier && errors.identifier)}
          aria-describedby={touched.identifier && errors.identifier ? 'login-identifier-error' : undefined}
          {...tid('login-identifier')}
        />
        {touched.identifier && errors.identifier ? (
          <p className="mt-field-error" id="login-identifier-error" role="alert">{errors.identifier}</p>
        ) : null}
      </div>

      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        maxLength={FIELD_LIMITS.password}
        onChange={(event) => {
          setPassword(clampLength(event.target.value, FIELD_LIMITS.password));
          setFormError('');
        }}
        onBlur={(event) => {
          setTouched((t) => ({ ...t, password: true }));
          setErrors((e) => ({ ...e, password: validateLoginPassword(event.target.value) }));
        }}
        error={touched.password ? errors.password : ''}
        testId="login-password"
        toggleTestId="login-password-toggle"
      />

      <label className="mt-check" {...tid('login-remember-me-label')}>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
          {...tid('login-remember-me')}
        />
        Remember me
      </label>

      {formError ? (
        <p className="mt-form-error" role="alert" id={formErrorId} {...tid('login-error')}>
          {formError}
        </p>
      ) : null}

      <button className="primary-button mt-full" type="submit" disabled={loading} {...tid('login-submit')}>
        {loading ? 'Checking credentials…' : 'Log in'}
      </button>

      <div className="mt-form-footer">
        <button
          type="button"
          className="mt-link-btn"
          onClick={() => setForgotOpen(true)}
          {...tid('login-forgot-password')}
        >
          Forgot password?
        </button>

        {forgotOpen ? (
          <p className="mt-info" role="status" {...tid('login-forgot-message')}>
            Password reset is not available in this test environment. Use the password shown in the Test Credentials panel.
          </p>
        ) : null}

        <p className="mt-divider"><span>or</span></p>

        <button type="button" className="secondary-button mt-full" onClick={onSwitchToOtp} {...tid('login-switch-to-otp')}>
          Log in with OTP
        </button>
      </div>
    </form>
  );
}
