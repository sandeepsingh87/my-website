import React from 'react';
import { LogOut, Send, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tid } from '../../lib/money-transfer/tid.js';
import { formatMoney } from '../../lib/money-transfer/transfer.js';
import { getBalance, readHistory } from '../../lib/money-transfer/transferStore.js';

export default function MockDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const name = user ? `${user.firstName} ${user.lastName}` : 'Test User';
  const balance = getBalance(user.id);
  const history = readHistory(user.id);

  return (
    <section className="mt-dashboard" {...tid('dashboard')}>
      <div className="mt-card mt-dashboard-hero">
        <div className="mt-dashboard-hero-copy">
          <span className="mt-card-kicker">Signed in</span>
          <h2>Test Money Transfer Dashboard</h2>
          <p className="mt-muted">
            Welcome, <strong {...tid('dashboard-user-name')}>{name}</strong>
          </p>
        </div>
        <button type="button" className="mt-secondary-btn" onClick={onLogout} {...tid('dashboard-logout')}>
          <LogOut size={16} aria-hidden="true" />
          Logout
        </button>
      </div>

      <div className="mt-dashboard-grid">
        <div className="mt-card mt-balance" {...tid('dashboard-balance')}>
          <div className="mt-balance-icon" aria-hidden="true">
            <Wallet size={20} />
          </div>
          <span>Test Balance</span>
          <strong {...tid('dashboard-balance-value')}>{formatMoney(balance)}</strong>
          <small>Demo value only — not real funds</small>
        </div>

        <div className="mt-card mt-dashboard-actions">
          <p className="mt-info" role="status">
            Simulated corridor. No actual money can be transferred.
          </p>
          <button
            type="button"
            className="mt-primary-btn"
            onClick={() => navigate('/money-transfer/transfer')}
            {...tid('dashboard-start-transfer')}
          >
            <Send size={16} aria-hidden="true" />
            Start Test Transfer
          </button>
        </div>
      </div>

      <div className="mt-card mt-tx" {...tid('dashboard-transactions')}>
        <h3>Recent Test Transactions</h3>
        {history.length === 0 ? (
          <p className="mt-muted" {...tid('dashboard-tx-empty')}>No test transfers yet. Start one to generate a receipt.</p>
        ) : (
          <ul>
            {history.map((tx) => (
              <li key={tx.reference} {...tid(`dashboard-tx-${tx.reference}`)}>
                <button
                  type="button"
                  className="mt-tx-link"
                  onClick={() => navigate(`/money-transfer/receipt/${tx.reference}`)}
                  {...tid(`dashboard-tx-open-${tx.reference}`)}
                >
                  <span className="mt-tx-label">{tx.reference} · {tx.receiverName}</span>
                  <small>{tx.status}</small>
                </button>
                <span className="mt-tx-amount">{formatMoney(tx.sendAmount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
