import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { tid } from '../../lib/money-transfer/tid.js';

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  describedBy,
  testId,
  toggleTestId,
  autoComplete = 'current-password',
  maxLength
}) {
  const [visible, setVisible] = useState(false);
  const errorId = useId();
  const described = [describedBy, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mt-field">
      <label htmlFor={id}>{label}</label>
      <div className="mt-password-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={described}
          {...tid(testId)}
        />
        <button
          type="button"
          className="mt-icon-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          {...tid(toggleTestId)}
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      </div>
      {error ? (
        <p className="mt-field-error" id={errorId} role="alert">{error}</p>
      ) : null}
    </div>
  );
}
