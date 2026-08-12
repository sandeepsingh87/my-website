import React, { useState } from 'react';
import { CheckCircle2, ListChecks } from 'lucide-react';
import { tid } from '../../lib/tid.js';

const STEPS = ['Details', 'Validation', 'Confirmation'];

export default function WorkflowView({ wizardStep, setWizardStep, showToast, onLog }) {
  const [releaseName, setReleaseName] = useState('QE Lab 1.2');
  const [version, setVersion] = useState('1.2.0');
  const [checks, setChecks] = useState({ smoke: false, a11y: false, signoff: false });
  const [maxStep, setMaxStep] = useState(1);
  const [finished, setFinished] = useState(false);
  const [stepError, setStepError] = useState('');
  const allChecks = checks.smoke && checks.a11y && checks.signoff;

  function goStep(next) {
    if (next > maxStep) return;
    setWizardStep(next);
    setStepError('');
  }

  function next() {
    if (wizardStep === 1) {
      if (!releaseName.trim()) {
        setStepError('Release name is required');
        showToast('Release name is required', 'error');
        return;
      }
      if (!/^\d+\.\d+\.\d+$/.test(version.trim())) {
        setStepError('Version must look like 1.2.0');
        showToast('Version must look like 1.2.0', 'error');
        return;
      }
    }
    if (wizardStep === 2 && !allChecks) {
      setStepError('Complete all validation checks');
      showToast('Complete all validation checks', 'error');
      return;
    }
    setStepError('');
    const upcoming = wizardStep + 1;
    setMaxStep((current) => Math.max(current, upcoming));
    setWizardStep(upcoming);
  }

  function finish() {
    if (!allChecks || !releaseName.trim()) {
      showToast('Complete the workflow before finishing', 'error');
      return;
    }
    setFinished(true);
    onLog?.(`Release workflow completed for ${releaseName} ${version}`);
    showToast('Release workflow completed');
  }

  return (
    <section className="panel" {...tid('view-workflow')}>
      <div className="panel-head">
        <h2>Multi-step Workflow</h2>
        <ListChecks size={18} aria-hidden="true" />
      </div>
      <p className="panel-lede">Gated steps with required fields, checkboxes, and a finish state. Future steps stay locked until the current gate passes.</p>
      <div className="stepper" {...tid('cmp-release-stepper')}>
        {STEPS.map((step, index) => {
          const n = index + 1;
          const locked = n > maxStep;
          return (
            <button
              key={step}
              className={`${wizardStep === n ? 'step active' : 'step'}${wizardStep > n ? ' complete' : ''}`}
              disabled={locked}
              onClick={() => goStep(n)}
              {...tid(`btn-step-${n}`)}
            >
              <span>{n}</span>
              {step}
            </button>
          );
        })}
      </div>
      {finished ? (
        <div className="success-banner" role="status" {...tid('msg-workflow-done')}>
          <CheckCircle2 size={16} aria-hidden="true" />
          {releaseName} {version} marked ready.
        </div>
      ) : null}
      <div className="workflow-body" {...tid(`pnl-step-${wizardStep}`)}>
        <h3>{STEPS[wizardStep - 1]}</h3>
        {wizardStep === 1 && (
          <>
            <p>Capture release information, scope, affected modules, and test data needs.</p>
            <label {...tid('fld-release-name')}>
              Release name
              <input {...tid('inp-release-name')} value={releaseName} onChange={(event) => setReleaseName(event.target.value)} />
            </label>
            <label {...tid('fld-release-version')}>
              Version
              <input {...tid('inp-release-version')} value={version} onChange={(event) => setVersion(event.target.value)} />
            </label>
          </>
        )}
        {wizardStep === 2 && (
          <>
            <p>Validate mandatory checks, environment health, smoke tests, and approvals.</p>
            {[
              ['smoke', 'Smoke suite green'],
              ['a11y', 'Accessibility review done'],
              ['signoff', 'Stakeholder sign-off']
            ].map(([id, label]) => (
              <label className="check-row" key={id} {...tid(`chk-wf-${id}`)}>
                <input
                  type="checkbox"
                  checked={checks[id]}
                  onChange={(event) => setChecks((current) => ({ ...current, [id]: event.target.checked }))}
                  {...tid(`inp-wf-${id}`)}
                />
                {label}
              </label>
            ))}
          </>
        )}
        {wizardStep === 3 && (
          <>
            <p>Confirm release readiness and trigger stakeholder communication.</p>
            <dl className="detail-list" {...tid('dl-wf-summary')}>
              <div><dt>Release</dt><dd>{releaseName || '—'}</dd></div>
              <div><dt>Version</dt><dd>{version || '—'}</dd></div>
              <div><dt>Checks</dt><dd>{allChecks ? 'Complete' : 'Incomplete'}</dd></div>
            </dl>
          </>
        )}
        {stepError ? <p className="field-error" {...tid('err-workflow')}>{stepError}</p> : null}
      </div>
      <div className="button-row">
        <button className="secondary-button" disabled={wizardStep === 1} onClick={() => goStep(wizardStep - 1)} {...tid('btn-step-prev')}>Previous</button>
        {wizardStep < 3 ? (
          <button className="primary-button" onClick={next} {...tid('btn-step-next')}>Next</button>
        ) : (
          <button className="primary-button" disabled={finished} onClick={finish} {...tid('btn-workflow-finish')}>Finish</button>
        )}
      </div>
    </section>
  );
}
