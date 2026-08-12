import React, { useState } from 'react';
import { CheckCircle2, ClipboardCheck, Eye, EyeOff, Upload } from 'lucide-react';
import { NOTES_MAX } from '../../data/fixtures.js';
import { tid } from '../../lib/tid.js';

function passwordHints(password) {
  return [
    { id: 'len', ok: password.length >= 8, label: '8+ characters' },
    { id: 'letter', ok: /[A-Za-z]/.test(password), label: 'A letter' },
    { id: 'number', ok: /\d/.test(password), label: 'A number' }
  ];
}

export default function FormsView({
  formState,
  setFormState,
  formErrors,
  setFormErrors,
  profileSaved,
  setProfileSaved,
  submitProfile,
  resetProfile,
  updateSkill,
  uploadedFile,
  setUploadedFile,
  setFileError,
  fileError
}) {
  const [showPassword, setShowPassword] = useState(false);
  const hints = passwordHints(formState.password);

  function patch(partial) {
    setFormState((current) => ({ ...current, ...partial }));
    setProfileSaved(false);
    setFormErrors((current) => {
      const next = { ...current };
      Object.keys(partial).forEach((key) => {
        delete next[key];
      });
      return next;
    });
  }

  return (
    <section className="panel form-panel" {...tid('view-forms')}>
      <div className="panel-head">
        <h2>Registration and Input Controls</h2>
        <ClipboardCheck size={18} aria-hidden="true" />
      </div>
      <p className="panel-lede">Required fields, live validation, file upload, and mixed input types for functional coverage.</p>

      {profileSaved ? (
        <p className="success-banner" role="status" {...tid('msg-profile-saved')}>
          <CheckCircle2 size={16} aria-hidden="true" />
          Profile saved for {formState.fullName}.
        </p>
      ) : null}

      <form onSubmit={submitProfile} noValidate {...tid('form-qe-profile')}>
        <div className="form-grid">
          <label {...tid('fld-full-name')}>
            Full name <span className="req">*</span>
            <input
              {...tid('inp-full-name')}
              className={formErrors.fullName ? 'input-invalid' : undefined}
              aria-invalid={Boolean(formErrors.fullName)}
              aria-describedby={formErrors.fullName ? 'err-full-name' : undefined}
              value={formState.fullName}
              onChange={(event) => patch({ fullName: event.target.value })}
              placeholder="Sandeep Singh"
              autoComplete="name"
              required
            />
            {formErrors.fullName ? <span className="field-error" id="err-full-name" {...tid('err-full-name')}>{formErrors.fullName}</span> : null}
          </label>
          <label {...tid('fld-email')}>
            Email <span className="req">*</span>
            <input
              {...tid('inp-email')}
              type="email"
              className={formErrors.email ? 'input-invalid' : undefined}
              aria-invalid={Boolean(formErrors.email)}
              value={formState.email}
              onChange={(event) => patch({ email: event.target.value })}
              placeholder="qe@example.com"
              autoComplete="email"
              required
            />
            {formErrors.email ? <span className="field-error" {...tid('err-email')}>{formErrors.email}</span> : null}
          </label>
          <label {...tid('fld-password')}>
            Password <span className="req">*</span>
            <span className="password-wrap">
              <input
                {...tid('inp-password')}
                type={showPassword ? 'text' : 'password'}
                className={formErrors.password ? 'input-invalid' : undefined}
                aria-invalid={Boolean(formErrors.password)}
                value={formState.password}
                onChange={(event) => patch({ password: event.target.value })}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                {...tid('btn-password-toggle')}
              >
                {showPassword ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
            <ul className="hint-list" {...tid('lst-password-hints')}>
              {hints.map((hint) => (
                <li key={hint.id} className={hint.ok ? 'ok' : ''} {...tid(`hint-password-${hint.id}`)}>{hint.label}</li>
              ))}
            </ul>
            {formErrors.password ? <span className="field-error" {...tid('err-password')}>{formErrors.password}</span> : null}
          </label>
          <label {...tid('fld-confirm-password')}>
            Confirm password <span className="req">*</span>
            <input
              {...tid('inp-confirm-password')}
              type={showPassword ? 'text' : 'password'}
              className={formErrors.confirmPassword ? 'input-invalid' : undefined}
              aria-invalid={Boolean(formErrors.confirmPassword)}
              value={formState.confirmPassword}
              onChange={(event) => patch({ confirmPassword: event.target.value })}
              placeholder="Re-enter password"
              autoComplete="new-password"
              required
            />
            {formErrors.confirmPassword ? <span className="field-error" {...tid('err-confirm-password')}>{formErrors.confirmPassword}</span> : null}
          </label>
          <label {...tid('sel-role')}>
            Role
            <select {...tid('ddl-role')} value={formState.role} onChange={(event) => patch({ role: event.target.value })}>
              <option value="tester">Tester</option>
              <option value="automation-engineer">Automation Engineer</option>
              <option value="lead">QE Lead</option>
              <option value="manager">QE Manager</option>
            </select>
          </label>
          <label {...tid('sel-country')}>
            Country
            <select {...tid('ddl-country')} value={formState.country} onChange={(event) => patch({ country: event.target.value })}>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Singapore</option>
            </select>
          </label>
          <label {...tid('rng-experience')}>
            Experience: {formState.experience} years
            <input
              {...tid('inp-experience')}
              type="range"
              min="0"
              max="20"
              value={formState.experience}
              onChange={(event) => patch({ experience: Number(event.target.value) })}
            />
          </label>
        </div>

        <fieldset {...tid('grp-skills')}>
          <legend>Testing skills</legend>
          {['functional', 'api', 'accessibility', 'performance'].map((skill) => (
            <label className="check-pill" key={skill} {...tid(`chk-skill-${skill}`)}>
              <input {...tid(`inp-skill-${skill}`)} type="checkbox" checked={formState.skills.includes(skill)} onChange={(event) => updateSkill(skill, event.target.checked)} />
              {skill}
            </label>
          ))}
        </fieldset>

        <fieldset {...tid('grp-preference')}>
          <legend>Automation readiness</legend>
          <label className="radio-row" {...tid('rad-ready-yes')}>
            <input {...tid('inp-ready-yes')} type="radio" name="automationReady" checked={formState.automationReady} onChange={() => patch({ automationReady: true })} />
            Ready for automation
          </label>
          <label className="radio-row" {...tid('rad-ready-no')}>
            <input {...tid('inp-ready-no')} type="radio" name="automationReady" checked={!formState.automationReady} onChange={() => patch({ automationReady: false })} />
            Manual testing only
          </label>
        </fieldset>

        <label {...tid('txt-notes')}>
          Test notes
          <textarea
            {...tid('inp-notes')}
            rows="4"
            maxLength={NOTES_MAX}
            value={formState.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            placeholder="Add exploratory notes, boundary values, or defect context."
          />
          <small className="char-count" {...tid('txt-notes-count')}>{formState.notes.length}/{NOTES_MAX}</small>
        </label>

        <label className="file-zone" {...tid('upl-evidence')}>
          <Upload size={18} aria-hidden="true" />
          Upload evidence (PNG, PDF, or TXT · max 1 MB)
          <input
            {...tid('inp-evidence-file')}
            type="file"
            accept=".png,.pdf,.txt,image/png,application/pdf,text/plain"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setUploadedFile('');
                setFileError('');
                return;
              }
              const okType = /png|pdf|plain|text/.test(file.type) || /\.(png|pdf|txt)$/i.test(file.name);
              if (!okType) {
                setUploadedFile('');
                setFileError('Only PNG, PDF, or TXT files are allowed');
                return;
              }
              if (file.size > 1024 * 1024) {
                setUploadedFile('');
                setFileError('File must be 1 MB or smaller');
                return;
              }
              setFileError('');
              setUploadedFile(file.name);
            }}
          />
          <small {...tid('txt-evidence-name')}>{uploadedFile || 'No file selected'}</small>
          {fileError ? <span className="field-error" {...tid('err-evidence-file')}>{fileError}</span> : null}
        </label>

        <label className="check-row" {...tid('chk-terms')}>
          <input
            {...tid('inp-terms')}
            type="checkbox"
            checked={formState.terms}
            onChange={(event) => patch({ terms: event.target.checked })}
          />
          I agree this is a test sandbox and not a production account
        </label>
        {formErrors.terms ? <span className="field-error" {...tid('err-terms')}>{formErrors.terms}</span> : null}

        <div className="button-row">
          <button className="primary-button" type="submit" {...tid('btn-profile-submit')}>Save profile</button>
          <button className="secondary-button" type="button" onClick={resetProfile} {...tid('btn-profile-reset')}>Reset</button>
        </div>
      </form>
    </section>
  );
}
