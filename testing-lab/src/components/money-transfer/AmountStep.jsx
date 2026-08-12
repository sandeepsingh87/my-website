import React, { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import TransferStepper from './TransferStepper.jsx';
import { tid } from '../../lib/money-transfer/tid.js';
import {
  CORRIDORS,
  PROMO_ZERO_FEE,
  TRANSFER_LIMITS,
  clampTransferField,
  emptyDraft,
  formatMoney,
  quoteTransfer,
  validateAmount
} from '../../lib/money-transfer/transfer.js';
import { getBalance, readDraft, writeDraft } from '../../lib/money-transfer/transferStore.js';

export default function AmountStep() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [draft, setDraft] = useState(() => ({ ...emptyDraft, ...(readDraft() || {}) }));
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');
  const balance = getBalance(user.id);
  const quote = useMemo(() => quoteTransfer(draft), [draft]);

  function setField(key, value) {
    const next = { ...draft, [key]: clampTransferField(key, value) };
    setDraft(next);
    writeDraft(next);
  }

  function handleContinue(event) {
    event.preventDefault();
    const { errors } = validateAmount(draft, balance);
    setTouched({ sendAmount: true, promo: true });
    if (errors.sendAmount || errors.promo) {
      setFormError(errors.sendAmount || errors.promo);
      return;
    }
    writeDraft(draft);
    navigate('/money-transfer/receiver');
  }

  const amountError = touched.sendAmount ? validateAmount(draft, balance).errors.sendAmount : '';
  const promoError = touched.promo ? validateAmount(draft, balance).errors.promo : '';

  return (
    <section className="mt-card mt-transfer-card" {...tid('transfer-amount')}>
      <TransferStepper current="amount" />
      <div className="mt-card-head">
        <span className="mt-card-kicker">Step 1 of 3</span>
        <h2>How much are you sending?</h2>
        <p className="mt-muted">Pick a corridor, then quote. Promo <code>{PROMO_ZERO_FEE}</code> waives the test fee.</p>
      </div>

      <form className="mt-stack" onSubmit={handleContinue} noValidate {...tid('form-transfer-amount')}>
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

        <div className="mt-amount-grid">
          <div className="mt-field">
            <label htmlFor="transfer-send-amount">You send (USD)</label>
            <input
              id="transfer-send-amount"
              inputMode="decimal"
              maxLength={TRANSFER_LIMITS.amount}
              value={draft.sendAmount}
              onChange={(e) => setField('sendAmount', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, sendAmount: true }))}
              aria-invalid={Boolean(amountError)}
              {...tid('transfer-send-amount')}
            />
            {amountError ? <p className="mt-field-error" role="alert">{amountError}</p> : null}
          </div>
          <div className="mt-field">
            <label htmlFor="transfer-receive-amount">They receive ({quote.corridor.currency})</label>
            <input
              id="transfer-receive-amount"
              readOnly
              value={Number.isFinite(quote.receive) ? quote.receive.toFixed(2) : ''}
              {...tid('transfer-receive-amount')}
            />
          </div>
        </div>

        <div className="mt-quote" {...tid('transfer-quote')}>
          <div><span>Exchange rate</span><strong>1 USD = {quote.corridor.rate} {quote.corridor.currency}</strong></div>
          <div><span>Transfer fee</span><strong>{Number.isFinite(quote.fee) ? formatMoney(quote.fee) : '—'}</strong></div>
          <div><span>Total debit</span><strong>{Number.isFinite(quote.totalDebit) ? formatMoney(quote.totalDebit) : '—'}</strong></div>
          <div><span>Test balance</span><strong>{formatMoney(balance)}</strong></div>
        </div>

        <div className="mt-field">
          <label htmlFor="transfer-promo">Promo code (optional)</label>
          <input
            id="transfer-promo"
            maxLength={TRANSFER_LIMITS.promo}
            value={draft.promo}
            onChange={(e) => setField('promo', e.target.value.toUpperCase())}
            onBlur={() => setTouched((t) => ({ ...t, promo: true }))}
            placeholder={PROMO_ZERO_FEE}
            aria-invalid={Boolean(promoError)}
            {...tid('transfer-promo')}
          />
          {promoError ? <p className="mt-field-error" role="alert">{promoError}</p> : null}
        </div>

        {formError ? (
          <p className="mt-form-error" role="alert" {...tid('transfer-amount-error')}>{formError}</p>
        ) : null}

        <div className="mt-transfer-actions">
          <button type="button" className="secondary-button" onClick={() => navigate('/money-transfer')} {...tid('transfer-amount-back')}>
            Back to dashboard
          </button>
          <button type="submit" className="primary-button" {...tid('transfer-amount-continue')}>
            Continue to receiver
          </button>
        </div>
      </form>
    </section>
  );
}
