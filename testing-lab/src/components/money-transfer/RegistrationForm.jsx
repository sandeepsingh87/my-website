import React, { useId, useState } from 'react';
import PasswordField from './PasswordField.jsx';
import { tid } from '../../lib/money-transfer/tid.js';
import {
  FIELD_LIMITS,
  clampLength,
  passwordStrength,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePhone,
  validateRegistrationPassword
} from '../../lib/money-transfer/validation.js';
import { registerAccount } from '../../lib/money-transfer/moneyTransferAuth.js';

const empty = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  terms: false
};

const LIMIT_BY_FIELD = {
  firstName: FIELD_LIMITS.firstName,
  lastName: FIELD_LIMITS.lastName,
  email: FIELD_LIMITS.email,
  phone: FIELD_LIMITS.phone,
  password: FIELD_LIMITS.password,
  confirmPassword: FIELD_LIMITS.password
};

export default function RegistrationForm({ onRegistered, onGoToLogin, showToast }) {
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const strength = passwordStrength(form.password);
  const strengthId = useId();

  function setField(key, value) {
    const limit = LIMIT_BY_FIELD[key];
    const nextValue = typeof value === 'string' && limit ? clampLength(value, limit) : value;
    setForm((current) => ({ ...current, [key]: nextValue }));
  }

  function errorFor(key, snapshot) {
    const data = snapshot || form;
    const validators = {
      firstName: () => validateName(data.firstName, 'First name'),
      lastName: () => validateName(data.lastName, 'Last name'),
      email: () => validateEmail(data.email),
      phone: () => validatePhone(data.phone),
      password: () => validateRegistrationPassword(data.password),
      confirmPassword: () => validateConfirmPassword(data.password, data.confirmPassword),
      terms: () => (data.terms ? '' : 'You must accept the test/demo account terms.')
    };
    return validators[key]?.() || '';
  }

  function blurValidate(key, override) {
    const snapshot = { ...form, [key]: override !== undefined ? override : form[key] };
    setTouched((t) => ({ ...t, [key]: true }));
    setFieldErrors((e) => ({ ...e, [key]: errorFor(key, snapshot) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      terms: true
    });

    setLoading(true);
    setFormError('');
    try {
      const result = await registerAccount(form);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors || {});
        setFormError(result.error || 'Please fix the highlighted fields.');
        return;
      }
      setSuccess(result.user);
      showToast?.('Test account created successfully.', 'success');
      onRegistered?.(result.user);
    } catch {
      setFormError('Something went wrong while creating the test account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="mt-card" {...tid('register-success')}>
        <span className="mt-card-kicker">Ready to test</span>
        <h2>Registration successful</h2>
        <p className="mt-muted">Your test account has been created for this browser session.</p>
        <dl className="mt-success-dl">
          <div>
            <dt>Email</dt>
            <dd>{success.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{success.phone}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="primary-button mt-full"
          onClick={() => {
            setSuccess(null);
            setForm(empty);
            setFieldErrors({});
            setTouched({});
            onGoToLogin?.(success.email);
          }}
          {...tid('register-goto-login')}
        >
          Go to Login
        </button>
      </section>
    );
  }

  return (
    <section className="mt-card" id="mt-register" {...tid('register-card')}>
      <div className="mt-card-head">
        <span className="mt-card-kicker">New sandbox user</span>
        <h2>Create a Test Account</h2>
        <p className="mt-muted">Create a local demo account for testing authentication scenarios.</p>
      </div>

      <form className="mt-stack" onSubmit={handleSubmit} noValidate {...tid('form-register')}>
        <div className="mt-form-grid">
          <div className="mt-field">
            <label htmlFor="register-first-name">First name</label>
            <input
              id="register-first-name"
              maxLength={FIELD_LIMITS.firstName}
              value={form.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              onBlur={(e) => blurValidate('firstName', e.target.value)}
              aria-invalid={Boolean(touched.firstName && fieldErrors.firstName)}
              {...tid('register-first-name')}
            />
            {touched.firstName && fieldErrors.firstName ? (
              <p className="mt-field-error" role="alert">{fieldErrors.firstName}</p>
            ) : null}
          </div>

          <div className="mt-field">
            <label htmlFor="register-last-name">Last name</label>
            <input
              id="register-last-name"
              maxLength={FIELD_LIMITS.lastName}
              value={form.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              onBlur={(e) => blurValidate('lastName', e.target.value)}
              aria-invalid={Boolean(touched.lastName && fieldErrors.lastName)}
              {...tid('register-last-name')}
            />
            {touched.lastName && fieldErrors.lastName ? (
              <p className="mt-field-error" role="alert">{fieldErrors.lastName}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-field">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            onBlur={(e) => blurValidate('email', e.target.value)}
            aria-invalid={Boolean(touched.email && fieldErrors.email)}
            {...tid('register-email')}
          />
          {touched.email && fieldErrors.email ? (
            <p className="mt-field-error" role="alert">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="mt-field">
          <label htmlFor="register-phone">Mobile number</label>
          <input
            id="register-phone"
            type="tel"
            autoComplete="tel"
            maxLength={FIELD_LIMITS.phone}
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            onBlur={(e) => blurValidate('phone', e.target.value)}
            aria-invalid={Boolean(touched.phone && fieldErrors.phone)}
            placeholder="+919876543210"
            {...tid('register-phone')}
          />
          {touched.phone && fieldErrors.phone ? (
            <p className="mt-field-error" role="alert">{fieldErrors.phone}</p>
          ) : null}
        </div>

        <PasswordField
          id="register-password"
          label="Password"
          value={form.password}
          maxLength={FIELD_LIMITS.password}
          onChange={(e) => setField('password', e.target.value)}
          onBlur={(e) => blurValidate('password', e.target.value)}
          error={touched.password ? fieldErrors.password : ''}
          describedBy={strengthId}
          testId="register-password"
          toggleTestId="register-password-toggle"
          autoComplete="new-password"
        />

        <ul className="mt-password-hints" id={strengthId} aria-label="Password requirements">
          <li className={strength.minLength ? 'ok' : ''}>8–64 characters</li>
          <li className={strength.upper ? 'ok' : ''}>1 uppercase letter</li>
          <li className={strength.lower ? 'ok' : ''}>1 lowercase letter</li>
          <li className={strength.number ? 'ok' : ''}>1 number</li>
        </ul>

        <PasswordField
          id="register-confirm-password"
          label="Confirm password"
          value={form.confirmPassword}
          maxLength={FIELD_LIMITS.password}
          onChange={(e) => setField('confirmPassword', e.target.value)}
          onBlur={(e) => blurValidate('confirmPassword', e.target.value)}
          error={touched.confirmPassword ? fieldErrors.confirmPassword : ''}
          testId="register-confirm-password"
          toggleTestId="register-confirm-password-toggle"
          autoComplete="new-password"
        />

        <label className="mt-check" {...tid('register-terms-label')}>
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => {
              setField('terms', e.target.checked);
              blurValidate('terms', e.target.checked);
            }}
            onBlur={() => blurValidate('terms')}
            aria-invalid={Boolean(touched.terms && fieldErrors.terms)}
            {...tid('register-terms')}
          />
          I understand this is a test/demo account and does not represent a real financial account.
        </label>
        {touched.terms && fieldErrors.terms ? (
          <p className="mt-field-error" role="alert">{fieldErrors.terms}</p>
        ) : null}

        {formError ? (
          <p className="mt-form-error" role="alert" {...tid('register-error')}>{formError}</p>
        ) : null}

        <button className="primary-button mt-full" type="submit" disabled={loading} {...tid('register-submit')}>
          {loading ? 'Creating account…' : 'Create Test Account'}
        </button>
      </form>
    </section>
  );
}
