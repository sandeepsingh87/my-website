import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import TransferStepper from './TransferStepper.jsx';
import { tid } from '../../lib/money-transfer/tid.js';
import {
  PAYOUT_METHODS,
  createReference,
  emptyDraft,
  formatMoney,
  getCorridor,
  payoutStatus,
  quoteTransfer,
  validateAmount,
  validateReceiver
} from '../../lib/money-transfer/transfer.js';
import {
  addTransfer,
  clearDraft,
  getBalance,
  readDraft,
  setBalance
} from '../../lib/money-transfer/transferStore.js';

export default function ReviewStep() {
  const navigate = useNavigate();
  const { user, showToast } = useOutletContext();
  const draft = { ...emptyDraft, ...(readDraft() || {}) };
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const balance = getBalance(user.id);
  const quote = quoteTransfer(draft);
  const corridor = getCorridor(draft.country);
  const payout = PAYOUT_METHODS.find((item) => item.id === draft.payoutMethod)?.label || draft.payoutMethod;

  async function handleConfirm(event) {
    event.preventDefault();
    const receiverErrors = validateReceiver(draft);
    const { errors } = validateAmount(draft, balance);
    if (Object.values(receiverErrors).some(Boolean) || errors.sendAmount || errors.promo) {
      setError('This test transfer is incomplete or invalid. Go back and correct the details.');
      return;
    }
    if (!accepted) {
      setError('Confirm that this is a demo transfer before continuing.');
      return;
    }

    setLoading(true);
    setError('');
    window.setTimeout(() => {
      const reference = createReference();
      const transfer = {
        reference,
        createdAt: new Date().toISOString(),
        senderName: `${user.firstName} ${user.lastName}`,
        senderEmail: user.email,
        receiverName: `${draft.firstName.trim()} ${draft.lastName.trim()}`,
        country: corridor.country,
        countryCode: corridor.code,
        city: draft.city.trim(),
        phone: draft.phone.trim(),
        payoutMethod: draft.payoutMethod,
        payoutLabel: payout,
        sendAmount: quote.send,
        fee: quote.fee,
        totalDebit: quote.totalDebit,
        receiveAmount: quote.receive,
        receiveCurrency: corridor.currency,
        rate: corridor.rate,
        promo: quote.promoValid ? quote.promo : '',
        status: payoutStatus(draft.payoutMethod)
      };
      const nextBalance = Number((balance - quote.totalDebit).toFixed(2));
      setBalance(user.id, nextBalance);
      addTransfer(user.id, transfer);
      clearDraft();
      showToast?.('Test transfer submitted. Receipt is ready.', 'success');
      navigate(`/money-transfer/receipt/${reference}`);
    }, 400);
  }

  return (
    <section className="mt-card mt-transfer-card" {...tid('transfer-review')}>
      <TransferStepper current="review" />
      <div className="mt-card-head">
        <span className="mt-card-kicker">Step 3 of 3</span>
        <h2>Review test transfer</h2>
        <p className="mt-muted">No real payout occurs. Confirming only records a local demo receipt.</p>
      </div>

      <dl className="mt-review-list" {...tid('transfer-review-summary')}>
        <div><dt>Receiver</dt><dd>{draft.firstName} {draft.lastName}</dd></div>
        <div><dt>Destination</dt><dd>{draft.city}, {corridor.country}</dd></div>
        <div><dt>Mobile</dt><dd>{draft.phone}</dd></div>
        <div><dt>Payout</dt><dd>{payout}</dd></div>
        <div><dt>You send</dt><dd>{formatMoney(quote.send)}</dd></div>
        <div><dt>They receive</dt><dd>{formatMoney(quote.receive, corridor.currency)}</dd></div>
        <div><dt>Fee</dt><dd>{formatMoney(quote.fee)}</dd></div>
        <div><dt>Total debit</dt><dd>{formatMoney(quote.totalDebit)}</dd></div>
      </dl>

      <form className="mt-stack" onSubmit={handleConfirm} noValidate>
        <label className="mt-check" {...tid('transfer-confirm-label')}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            {...tid('transfer-confirm')}
          />
          I understand this is a test/demo transfer and no real money will be sent.
        </label>

        {error ? (
          <p className="mt-form-error" role="alert" {...tid('transfer-review-error')}>{error}</p>
        ) : null}

        <div className="mt-transfer-actions">
          <button type="button" className="secondary-button" onClick={() => navigate('/money-transfer/receiver')} {...tid('transfer-review-back')}>
            Back
          </button>
          <button type="submit" className="primary-button" disabled={loading} {...tid('transfer-confirm-submit')}>
            {loading ? 'Submitting…' : 'Confirm test transfer'}
          </button>
        </div>
      </form>
    </section>
  );
}
