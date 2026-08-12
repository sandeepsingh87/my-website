import React, { useEffect, useState } from 'react';
import { AlertCircle, ChevronDown, Download, Lock, RotateCcw, X } from 'lucide-react';
import { tid } from '../../lib/tid.js';

export default function SettingsView({ showToast, flags, setFlags, audit, onResetLab, onDownloadReport, onLog }) {
  const [expanded, setExpanded] = useState('api');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [confirmNegative, setConfirmNegative] = useState(false);
  const [regenCount, setRegenCount] = useState(0);
  const apiKey = regenCount === 0 ? 'qe_live_demo_9f3a2c' : `qe_live_demo_regen_${String(regenCount).padStart(2, '0')}`;
  const masked = `${apiKey.slice(0, 8)}••••••••${apiKey.slice(-2)}`;

  useEffect(() => {
    if (!confirmNegative) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') setConfirmNegative(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmNegative]);

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(apiKey);
      onLog?.('API key copied');
      showToast('API key copied');
    } catch {
      showToast('Copy failed', 'error');
    }
  }

  return (
    <section className="panel" {...tid('view-settings')}>
      <div className="panel-head">
        <h2>Settings and Edge Cases</h2>
        <Lock size={18} aria-hidden="true" />
      </div>
      <p className="panel-lede">Accordions, masked secrets, feature flags, audit history, download, reset, and a confirmable negative path.</p>
      {[
        ['api', 'API keys', 'Masked secrets, copy buttons, and regeneration flows.'],
        ['flags', 'Feature flags', 'Toggle product capabilities for controlled testing.'],
        ['audit', 'Audit log', 'Review activity history captured in this browser session.']
      ].map(([id, title, body]) => (
        <div className="accordion" key={id} {...tid(`acc-${id}`)}>
          <button onClick={() => setExpanded(expanded === id ? '' : id)} aria-expanded={expanded === id} {...tid(`btn-acc-${id}`)}>
            {title}
            <ChevronDown size={17} aria-hidden="true" />
          </button>
          {expanded === id && (
            <div className="accordion-body" {...tid(`pnl-acc-${id}`)}>
              <p>{body}</p>
              {id === 'api' ? (
                <div className="secret-row">
                  <code {...tid('txt-api-key')}>{apiKeyVisible ? apiKey : masked}</code>
                  <button className="secondary-button" type="button" onClick={() => setApiKeyVisible((v) => !v)} {...tid('btn-api-reveal')}>
                    {apiKeyVisible ? 'Hide' : 'Reveal'}
                  </button>
                  <button className="secondary-button" type="button" onClick={copyKey} {...tid('btn-api-copy')}>Copy</button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setRegenCount((n) => n + 1);
                      setApiKeyVisible(false);
                      onLog?.('API key regenerated');
                      showToast('API key regenerated');
                    }}
                    {...tid('btn-api-regen')}
                  >
                    Regenerate
                  </button>
                </div>
              ) : null}
              {id === 'flags' ? (
                <>
                  {[
                    ['betaGrid', 'Beta dashboard copy'],
                    ['darkPreview', 'Force dark preview note'],
                    ['noisyToasts', 'Verbose toasts']
                  ].map(([key, label]) => (
                    <label className="flag-row" key={key} {...tid(`chk-flag-${key}`)}>
                      {label}
                      <input
                        type="checkbox"
                        checked={flags[key]}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setFlags((current) => ({ ...current, [key]: checked }));
                          onLog?.(`Flag ${key} ${checked ? 'on' : 'off'}`);
                        }}
                        {...tid(`inp-flag-${key}`)}
                      />
                    </label>
                  ))}
                </>
              ) : null}
              {id === 'audit' ? (
                audit.length === 0 ? (
                  <p className="empty-state" {...tid('msg-audit-empty')}>No audit events yet. Save a profile, ship an order, or toggle a flag.</p>
                ) : (
                  <ol className="audit-list" {...tid('lst-audit')}>
                    {audit.map((entry) => (
                      <li key={entry.id} {...tid(`row-audit-${entry.id}`)}>
                        <time dateTime={entry.at}>{entry.at.replace('T', ' ').slice(0, 19)}</time>
                        <span>{entry.message}</span>
                      </li>
                    ))}
                  </ol>
                )
              ) : null}
              <button
                className="secondary-button"
                onClick={() => {
                  onLog?.(`${title} action captured`);
                  showToast(flags.noisyToasts ? `${title} action captured (verbose)` : `${title} action captured`);
                }}
                {...tid(`btn-${id}-action`)}
              >
                Run action
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="download-row">
        <button className="secondary-button" onClick={onDownloadReport} {...tid('btn-download-report')}>
          <Download size={16} aria-hidden="true" />
          Download report
        </button>
        <button className="secondary-button" onClick={onResetLab} {...tid('btn-reset-lab')}>
          <RotateCcw size={16} aria-hidden="true" />
          Reset lab data
        </button>
        <button className="danger-button" onClick={() => setConfirmNegative(true)} {...tid('btn-negative-case')}>
          <AlertCircle size={16} aria-hidden="true" />
          Trigger negative case
        </button>
      </div>
      {confirmNegative ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmNegative(false)} {...tid('ovl-negative-confirm')}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="neg-title"
            onClick={(event) => event.stopPropagation()}
            {...tid('dlg-negative-confirm')}
          >
            <div className="panel-head">
              <h2 id="neg-title">Trigger negative case?</h2>
              <button className="icon-button" onClick={() => setConfirmNegative(false)} aria-label="Close confirmation" {...tid('btn-neg-close')}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p>This is a sandbox failure path. No real systems are affected.</p>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setConfirmNegative(false)} {...tid('btn-neg-cancel')}>Cancel</button>
              <button
                className="danger-button"
                type="button"
                onClick={() => {
                  setConfirmNegative(false);
                  onLog?.('Negative scenario triggered');
                  showToast('Negative scenario triggered', 'error');
                }}
                {...tid('btn-neg-confirm')}
              >
                Confirm
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
