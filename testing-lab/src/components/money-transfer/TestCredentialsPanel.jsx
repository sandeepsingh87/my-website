import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp, KeyRound, Shield } from 'lucide-react';
import { getSeedUsers } from '../../lib/money-transfer/moneyTransferAuth.js';
import { DEMO_OTP, DEMO_PASSWORD } from '../../lib/money-transfer/testUsers.js';
import { tid } from '../../lib/money-transfer/tid.js';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  document.body.removeChild(area);
}

function CopyIconButton({ copyKey, value, label, toastMsg, copied, onCopy, testId }) {
  const isCopied = copied === copyKey;
  return (
    <button
      type="button"
      className={`mt-copy-btn${isCopied ? ' is-copied' : ''}`}
      onClick={() => onCopy(copyKey, value, toastMsg)}
      aria-label={isCopied ? `${label} copied` : label}
      title={isCopied ? 'Copied' : label}
      {...tid(testId)}
    >
      {isCopied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      <span className="mt-copy-btn-label">{isCopied ? 'Copied' : label}</span>
    </button>
  );
}

export default function TestCredentialsPanel({ showToast }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState('');
  const users = getSeedUsers();

  async function handleCopy(key, value, toastMsg) {
    try {
      await copyText(value);
      setCopied(key);
      showToast?.(toastMsg, 'success');
      window.setTimeout(() => setCopied((current) => (current === key ? '' : current)), 1600);
    } catch {
      showToast?.('Unable to copy. Select the text manually.', 'error');
    }
  }

  return (
    <section className="mt-card mt-credentials" {...tid('test-credentials')}>
      <div className="mt-card-head mt-cred-head">
        <div className="mt-cred-title-block">
          <span className="mt-card-kicker">Sandbox data</span>
          <h2>Test Credentials</h2>
          <p className="mt-muted">Intentionally public. Valid only in this browser sandbox.</p>
        </div>
        <button
          type="button"
          className="mt-ghost-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          {...tid('test-credentials-toggle')}
        >
          {open ? <>Hide <ChevronUp size={16} aria-hidden="true" /></> : <>Show <ChevronDown size={16} aria-hidden="true" /></>}
        </button>
      </div>

      {open ? (
        <div className="mt-cred-body">
          <ul className="mt-cred-list">
            {users.map((user, index) => {
              const n = String(index + 1).padStart(2, '0');
              return (
                <li key={user.id} className="mt-cred-item" {...tid(`test-user-${n}`)}>
                  <div className="mt-cred-item-top">
                    <span className="mt-cred-badge">User {n}</span>
                    <div className="mt-cred-actions">
                      <CopyIconButton
                        copyKey={`email-${n}`}
                        value={user.email}
                        label="Copy email"
                        toastMsg="Email copied to clipboard."
                        copied={copied}
                        onCopy={handleCopy}
                        testId={`copy-email-user-${n}`}
                      />
                      <CopyIconButton
                        copyKey={`phone-${n}`}
                        value={user.phone}
                        label="Copy phone"
                        toastMsg="Phone copied to clipboard."
                        copied={copied}
                        onCopy={handleCopy}
                        testId={`copy-phone-user-${n}`}
                      />
                    </div>
                  </div>
                  <p className="mt-cred-email" title={user.email}>{user.email}</p>
                  <p className="mt-cred-phone">{user.phoneDisplay || user.phone}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-cred-shared">
            <div className="mt-secret-chip" {...tid('shared-password')}>
              <KeyRound size={16} aria-hidden="true" />
              <div className="mt-secret-meta">
                <span>Password (all accounts)</span>
                <code>{DEMO_PASSWORD}</code>
              </div>
              <CopyIconButton
                copyKey="password"
                value={DEMO_PASSWORD}
                label="Copy password"
                toastMsg="Test password copied to clipboard."
                copied={copied}
                onCopy={handleCopy}
                testId="copy-password"
              />
            </div>
            <div className="mt-secret-chip" {...tid('shared-otp')}>
              <Shield size={16} aria-hidden="true" />
              <div className="mt-secret-meta">
                <span>Demo OTP (all accounts)</span>
                <code>{DEMO_OTP}</code>
              </div>
              <CopyIconButton
                copyKey="otp"
                value={DEMO_OTP}
                label="Copy OTP"
                toastMsg="Test OTP copied to clipboard."
                copied={copied}
                onCopy={handleCopy}
                testId="copy-otp"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
