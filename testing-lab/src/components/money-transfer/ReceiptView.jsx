import React from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import TransferStepper from './TransferStepper.jsx';
import { tid } from '../../lib/money-transfer/tid.js';
import { formatMoney } from '../../lib/money-transfer/transfer.js';
import { getTransfer } from '../../lib/money-transfer/transferStore.js';

export default function ReceiptView() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const transfer = getTransfer(user.id, ref);

  if (!transfer) {
    return (
      <section className="mt-card" {...tid('transfer-receipt-missing')}>
        <h2>Receipt not found</h2>
        <p className="mt-muted">This demo receipt is not in this browser. Start a new test transfer from the dashboard.</p>
        <button type="button" className="primary-button" onClick={() => navigate('/money-transfer')} {...tid('receipt-missing-home')}>
          Back to dashboard
        </button>
      </section>
    );
  }

  const created = new Date(transfer.createdAt).toLocaleString();

  return (
    <section className="mt-card mt-receipt" {...tid('transfer-receipt')}>
      <TransferStepper current="receipt" />
      <div className="mt-card-head">
        <span className="mt-card-kicker">Demo receipt</span>
        <h2>Test transfer complete</h2>
        <p className="mt-muted">No real money moved. Keep this reference for automation and exploratory checks.</p>
      </div>

      <div className="mt-receipt-ref" {...tid('receipt-reference')}>
        <span>Tracking number</span>
        <strong>{transfer.reference}</strong>
      </div>

      <p className="mt-info" role="status" {...tid('receipt-status')}>{transfer.status}</p>

      <dl className="mt-review-list">
        <div><dt>Date</dt><dd {...tid('receipt-date')}>{created}</dd></div>
        <div><dt>Sender</dt><dd {...tid('receipt-sender')}>{transfer.senderName}</dd></div>
        <div><dt>Receiver</dt><dd {...tid('receipt-receiver')}>{transfer.receiverName}</dd></div>
        <div><dt>Destination</dt><dd>{transfer.city}, {transfer.country}</dd></div>
        <div><dt>Payout</dt><dd>{transfer.payoutLabel}</dd></div>
        <div><dt>You sent</dt><dd {...tid('receipt-send')}>{formatMoney(transfer.sendAmount)}</dd></div>
        <div><dt>They receive</dt><dd {...tid('receipt-receive')}>{formatMoney(transfer.receiveAmount, transfer.receiveCurrency)}</dd></div>
        <div><dt>Fee</dt><dd>{formatMoney(transfer.fee)}</dd></div>
        <div><dt>Total debit</dt><dd {...tid('receipt-total')}>{formatMoney(transfer.totalDebit)}</dd></div>
      </dl>

      <div className="mt-transfer-actions">
        <button type="button" className="secondary-button" onClick={() => window.print()} {...tid('receipt-print')}>
          Print receipt
        </button>
        <button type="button" className="primary-button" onClick={() => navigate('/money-transfer')} {...tid('receipt-done')}>
          Back to dashboard
        </button>
      </div>
    </section>
  );
}
