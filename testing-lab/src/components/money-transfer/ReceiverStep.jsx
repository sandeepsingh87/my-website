import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransferStepper from './TransferStepper.jsx';
import { tid } from '../../lib/money-transfer/tid.js';
import {
  CORRIDORS,
  PAYOUT_METHODS,
  SEED_RECEIVERS,
  TRANSFER_LIMITS,
  clampTransferField,
  emptyDraft,
  validateReceiver
} from '../../lib/money-transfer/transfer.js';
import { readDraft, writeDraft } from '../../lib/money-transfer/transferStore.js';

export default function ReceiverStep() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(() => ({ ...emptyDraft, ...(readDraft() || {}) }));
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const errorMap = useMemo(() => validateReceiver(draft), [draft]);

  function setField(key, value) {
    const next = { ...draft, [key]: clampTransferField(key, value) };
    setDraft(next);
    writeDraft(next);
  }

  function applySeed(receiver) {
    const next = {
      ...draft,
      firstName: receiver.firstName,
      lastName: receiver.lastName,
      country: receiver.country,
      city: receiver.city,
      phone: receiver.phone,
      payoutMethod: receiver.payoutMethod
    };
    setDraft(next);
    writeDraft(next);
    setErrors({});
    setTouched({});
  }

  function handleContinue(event) {
    event.preventDefault();
    setTouched({
      country: true,
      payoutMethod: true,
      firstName: true,
      lastName: true,
      phone: true,
      city: true
    });
    setErrors(errorMap);
    if (Object.values(errorMap).some(Boolean)) return;
    writeDraft(draft);
    navigate('/money-transfer/review');
  }

  return (
    <section className="mt-card mt-transfer-card" {...tid('transfer-receiver')}>
      <TransferStepper current="receiver" />
      <div className="mt-card-head">
        <span className="mt-card-kicker">Step 2 of 3</span>
        <h2>Who is receiving this test transfer?</h2>
        <p className="mt-muted">Demo only. Use a seed receiver or enter unique test data.</p>
      </div>

      <div className="mt-seed-row" {...tid('transfer-seed-receivers')}>
        {SEED_RECEIVERS.map((receiver) => (
          <button
            key={receiver.id}
            type="button"
            className="mt-seed-chip"
            onClick={() => applySeed(receiver)}
            {...tid(`transfer-seed-${receiver.id}`)}
          >
            Use {receiver.firstName} {receiver.lastName} · {receiver.country}
          </button>
        ))}
      </div>

      <form className="mt-stack" onSubmit={handleContinue} noValidate {...tid('form-transfer-receiver')}>
        <div className="mt-form-grid">
          <div className="mt-field">
            <label htmlFor="transfer-country">Destination country</label>
            <select
              id="transfer-country"
              value={draft.country}
              onChange={(e) => setField('country', e.target.value)}
              {...tid('transfer-country')}
            >
              {CORRIDORS.map((item) => (
                <option key={item.code} value={item.code}>{item.country}</option>
              ))}
            </select>
          </div>
          <div className="mt-field">
            <label htmlFor="transfer-payout">Payout method</label>
            <select
              id="transfer-payout"
              value={draft.payoutMethod}
              onChange={(e) => setField('payoutMethod', e.target.value)}
              {...tid('transfer-payout')}
            >
              {PAYOUT_METHODS.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-form-grid">
          <div className="mt-field">
            <label htmlFor="transfer-first-name">First name</label>
            <input
              id="transfer-first-name"
              maxLength={TRANSFER_LIMITS.firstName}
              value={draft.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
              aria-invalid={Boolean(touched.firstName && errorMap.firstName)}
              {...tid('transfer-first-name')}
            />
            {touched.firstName && errorMap.firstName ? <p className="mt-field-error" role="alert">{errorMap.firstName}</p> : null}
          </div>
          <div className="mt-field">
            <label htmlFor="transfer-last-name">Last name</label>
            <input
              id="transfer-last-name"
              maxLength={TRANSFER_LIMITS.lastName}
              value={draft.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
              aria-invalid={Boolean(touched.lastName && errorMap.lastName)}
              {...tid('transfer-last-name')}
            />
            {touched.lastName && errorMap.lastName ? <p className="mt-field-error" role="alert">{errorMap.lastName}</p> : null}
          </div>
        </div>

        <div className="mt-form-grid">
          <div className="mt-field">
            <label htmlFor="transfer-phone">Mobile number</label>
            <input
              id="transfer-phone"
              type="tel"
              maxLength={TRANSFER_LIMITS.phone}
              value={draft.phone}
              onChange={(e) => setField('phone', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              placeholder="+919811122334"
              aria-invalid={Boolean(touched.phone && errorMap.phone)}
              {...tid('transfer-phone')}
            />
            {touched.phone && errorMap.phone ? <p className="mt-field-error" role="alert">{errorMap.phone}</p> : null}
          </div>
          <div className="mt-field">
            <label htmlFor="transfer-city">City</label>
            <input
              id="transfer-city"
              maxLength={TRANSFER_LIMITS.city}
              value={draft.city}
              onChange={(e) => setField('city', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, city: true }))}
              aria-invalid={Boolean(touched.city && errorMap.city)}
              {...tid('transfer-city')}
            />
            {touched.city && errorMap.city ? <p className="mt-field-error" role="alert">{errorMap.city}</p> : null}
          </div>
        </div>

        {Object.values(errors).some(Boolean) ? (
          <p className="mt-form-error" role="alert" {...tid('transfer-receiver-error')}>Please fix the highlighted fields.</p>
        ) : null}

        <div className="mt-transfer-actions">
          <button type="button" className="secondary-button" onClick={() => navigate('/money-transfer/transfer')} {...tid('transfer-receiver-back')}>
            Back
          </button>
          <button type="submit" className="primary-button" {...tid('transfer-receiver-continue')}>
            Continue to review
          </button>
        </div>
      </form>
    </section>
  );
}
