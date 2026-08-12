import React, { useEffect, useRef, useState } from 'react';
import OtpInput from './OtpInput.jsx';
import { tid } from '../../lib/money-transfer/tid.js';
import {
  FIELD_LIMITS,
  clampLength,
  validateIdentifier,
  validateOtp
} from '../../lib/money-transfer/validation.js';
import { loginWithOtp, sendOtp } from '../../lib/money-transfer/moneyTransferAuth.js';

export default function OtpLoginForm({
  identifier,
  onIdentifierChange,
  onSuccess,
  onSwitchToPassword,
  showToast
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const autoVerifyRef = useRef('');

  async function handleSend(event) {
    event.preventDefault();
    setTouched({ identifier: true });
    const identifierError = validateIdentifier(identifier);
    setErrors({ identifier: identifierError });
    if (identifierError) {
      setFormError('');
      return;
    }

    setSending(true);
    setFormError('');
    try {
      const result = await sendOtp({ identifier });
      if (!result.ok) {
        const message = result.error || 'Unable to send OTP. Please try again.';
        setFormError(message);
        showToast?.(message, 'error');
        return;
      }
      setOtpSent(true);
      setOtp('');
      autoVerifyRef.current = '';
      setErrors({});
      setTouched({});
      showToast?.(result.message || 'Demo OTP ready.', 'success');
    } catch {
      const message = 'Something went wrong while sending the demo OTP. Please try again.';
      setFormError(message);
      showToast?.(message, 'error');
    } finally {
      setSending(false);
    }
  }

  async function verifyOtp(code) {
    const otpError = validateOtp(code);
    setTouched((t) => ({ ...t, otp: true }));
    setErrors((e) => ({ ...e, otp: otpError }));
    if (otpError) {
      setFormError(otpError);
      return;
    }
    if (verifying) return;

    setVerifying(true);
    setFormError('');
    try {
      const result = await loginWithOtp({ identifier, otp: code });
      if (!result.ok) {
        const message = result.error || 'Invalid verification code. Please try again.';
        setFormError(message);
        showToast?.(message, 'error');
        return;
      }
      showToast?.('Login successful.', 'success');
      onSuccess(result.user);
    } catch {
      const message = 'Something went wrong while verifying the OTP. Please try again.';
      setFormError(message);
      showToast?.(message, 'error');
    } finally {
      setVerifying(false);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    await verifyOtp(otp);
  }

  useEffect(() => {
    if (!otpSent || otp.length !== FIELD_LIMITS.otp || verifying) return;
    if (autoVerifyRef.current === otp) return;
    autoVerifyRef.current = otp;
    verifyOtp(otp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, otpSent]);

  function handleBackToIdentifier() {
    setOtpSent(false);
    setOtp('');
    autoVerifyRef.current = '';
    setFormError('');
    setErrors({});
    setTouched({});
  }

  return (
    <div className="mt-otp-flow" {...tid('form-otp-login')}>
      {!otpSent ? (
        <form className="mt-stack" onSubmit={handleSend} noValidate>
          <h3 className="mt-form-title">Log in with OTP</h3>
          <div className="mt-field">
            <label htmlFor="otp-identifier">Email or mobile number</label>
            <input
              id="otp-identifier"
              type="text"
              autoComplete="username"
              maxLength={FIELD_LIMITS.identifier}
              value={identifier}
              onChange={(event) => {
                onIdentifierChange(clampLength(event.target.value, FIELD_LIMITS.identifier));
                setFormError('');
              }}
              onBlur={(event) => {
                setTouched((t) => ({ ...t, identifier: true }));
                setErrors((e) => ({ ...e, identifier: validateIdentifier(event.target.value) }));
              }}
              aria-invalid={Boolean(touched.identifier && errors.identifier)}
              placeholder="testuser01@example.com or 9876543210"
              {...tid('otp-identifier')}
            />
            {touched.identifier && errors.identifier ? (
              <p className="mt-field-error" role="alert">{errors.identifier}</p>
            ) : null}
          </div>

          {formError ? (
            <p className="mt-form-error" role="alert" {...tid('otp-error')}>{formError}</p>
          ) : null}

          <button className="primary-button mt-full" type="submit" disabled={sending} {...tid('otp-send')}>
            {sending ? 'Sending…' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form className="mt-stack" onSubmit={handleVerify} noValidate>
          <div className="mt-otp-verify-head">
            <h3 className="mt-form-title">Enter verification code</h3>
            <p className="mt-muted">
              Demo OTP sent for <strong>{identifier}</strong>. Use code <strong>147272</strong> from the Test Credentials panel.
            </p>
          </div>

          <OtpInput
            value={otp}
            onChange={(next) => {
              setOtp(next);
              setFormError('');
              setErrors((e) => ({ ...e, otp: '' }));
            }}
            error={touched.otp ? errors.otp : ''}
            disabled={verifying}
          />

          {touched.otp && errors.otp ? (
            <p className="mt-field-error" role="alert">{errors.otp}</p>
          ) : null}

          {formError ? (
            <p className="mt-form-error" role="alert" {...tid('otp-error')}>{formError}</p>
          ) : null}

          <button className="primary-button mt-full" type="submit" disabled={verifying} {...tid('otp-verify')}>
            {verifying ? 'Verifying OTP…' : 'Verify OTP'}
          </button>

          <button
            type="button"
            className="mt-link-btn"
            onClick={handleBackToIdentifier}
            {...tid('otp-change-identifier')}
          >
            Use a different email or mobile
          </button>
        </form>
      )}

      <button
        type="button"
        className="secondary-button mt-full"
        onClick={onSwitchToPassword}
        {...tid('otp-switch-to-password')}
      >
        Use password login
      </button>
    </div>
  );
}
