import React, { useRef } from 'react';
import { tid } from '../../lib/money-transfer/tid.js';
import { FIELD_LIMITS } from '../../lib/money-transfer/validation.js';

/**
 * Six OTP boxes. Value is a digit string (0–6 chars), filled left-to-right.
 */
export default function OtpInput({ value, onChange, onBlur, error, disabled }) {
  const chars = String(value || '').replace(/\D/g, '').slice(0, FIELD_LIMITS.otp).split('');
  const digits = Array.from({ length: FIELD_LIMITS.otp }, (_, i) => chars[i] || '');
  const refs = useRef([]);

  function emit(nextDigits) {
    onChange(nextDigits.join(''));
  }

  function handleChange(index, event) {
    const raw = event.target.value.replace(/\D/g, '');
    if (!raw) {
      const next = digits.slice();
      next[index] = '';
      emit(next);
      return;
    }

    const next = digits.slice();
    const incoming = raw.split('');
    let cursor = index;
    incoming.forEach((digit) => {
      if (cursor < FIELD_LIMITS.otp) {
        next[cursor] = digit;
        cursor += 1;
      }
    });
    emit(next);
    const focusIndex = Math.min(cursor, FIELD_LIMITS.otp - 1);
    refs.current[focusIndex]?.focus();
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      const next = digits.slice();
      next[index - 1] = '';
      emit(next);
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < FIELD_LIMITS.otp - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, FIELD_LIMITS.otp);
    onChange(pasted);
    const focusIndex = Math.min(Math.max(pasted.length - 1, 0), FIELD_LIMITS.otp - 1);
    refs.current[focusIndex]?.focus();
  }

  return (
    <div className="mt-otp" {...tid('otp-input')}>
      <div className="mt-otp-boxes" role="group" aria-label="Verification code">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-label={`Digit ${index + 1} of ${FIELD_LIMITS.otp}`}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onBlur={onBlur}
            {...tid(`otp-digit-${index + 1}`)}
          />
        ))}
      </div>
    </div>
  );
}
