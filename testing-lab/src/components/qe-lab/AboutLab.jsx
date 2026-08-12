import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { tid } from '../../lib/tid.js';

export default function AboutLab() {
  const [open, setOpen] = useState(false);
  return (
    <section className="panel about-lab" {...tid('about-qe-lab')}>
      <span className="about-kicker">For QE & automation</span>
      <h2>About this test lab</h2>
      <p>Sandbox for functional, exploratory, and automation practice. Locators stay stable on purpose.</p>
      <button
        type="button"
        className="about-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        {...tid('btn-qe-about-toggle')}
      >
        Automation notes {open ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>
      {open ? (
        <div className="about-body" {...tid('qe-about-automation-notes')}>
          <ul>
            <li>Primary locators: <code>automation-id</code> and matching <code>data-testid</code>.</li>
            <li>Deep-link tabs with <code>?view=forms|commerce|workflow|settings</code>.</li>
            <li>Theme: <code>localStorage qe-lab-theme</code>. Flags: <code>qe-lab-flags</code>.</li>
            <li>Orders and checklist persist in <code>sessionStorage</code> until Reset lab data.</li>
            <li>Auth Lab: <code>/money-transfer</code>. Docs: <code>testing-lab/docs/main-lab/</code>.</li>
          </ul>
        </div>
      ) : null}
    </section>
  );
}
