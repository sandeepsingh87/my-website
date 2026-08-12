import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_OTP, DEMO_PASSWORD } from '../../lib/money-transfer/testUsers.js';
import { tid } from '../../lib/money-transfer/tid.js';

export default function AboutLab() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-card mt-about" {...tid('about-lab')}>
      <span className="mt-card-kicker">For QE & automation</span>
      <h2>About this test lab</h2>
      <p>
        This page is a local sandbox for UI, functional and automation testing of login and demo money transfer.
      </p>
      <p>
        No real financial transactions occur here. No real money-transfer provider account is used.
      </p>

      <button
        type="button"
        className="mt-link-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        {...tid('about-automation-toggle')}
      >
        Automation Notes {open ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>

      {open ? (
        <div className="mt-about-body" {...tid('about-automation-notes')}>
          <ul>
            <li>Stable <code>data-testid</code> and <code>automation-id</code> selectors are available for automation.</li>
            <li>OTP is deterministic: <code>{DEMO_OTP}</code>.</li>
            <li>Seed test password: <code>{DEMO_PASSWORD}</code>.</li>
            <li>Demo fee promo: <code>TESTFEE0</code>.</li>
            <li>Transfer routes: <code>/money-transfer/transfer</code> (amount) → receiver → review → receipt.</li>
            <li>See <code>testing-lab/docs/money-transfer/</code> for user stories and test scenarios.</li>
          </ul>
        </div>
      ) : null}
    </section>
  );
}
