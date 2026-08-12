import React from 'react';
import { Bell, Database, X } from 'lucide-react';
import { LAB_STATS } from '../../data/fixtures.js';
import { tid } from '../../lib/tid.js';

export default function DashboardView({
  notifications,
  dismissedNotes,
  onDismissNote,
  qaEnvironments,
  releaseChecklist,
  setReleaseChecklist,
  flags,
  orders
}) {
  const completed = releaseChecklist.filter((item) => item.done).length;
  const health = Math.round((completed / releaseChecklist.length) * 100);
  const openDefects = notifications.filter((note) => note.type === 'warning' && !dismissedNotes.includes(note.id)).length;
  const visibleNotes = notifications.filter((note) => !dismissedNotes.includes(note.id));
  const openOrders = orders.filter((order) => order.status === 'new' || order.status === 'processing').length;
  const passRate = health;

  return (
    <div className="content-grid" {...tid('view-dashboard')}>
      <section className="panel metric-grid" {...tid('sec-dashboard-metrics')}>
        {[
          ['Active tests', String(LAB_STATS.activeTests), 'card-active-tests'],
          ['Open defects', String(openDefects), 'card-open-defects'],
          ['Automation pass', `${passRate}%`, 'card-automation-pass'],
          ['Deployments', String(LAB_STATS.deployments), 'card-deployments']
        ].map(([label, value, id]) => (
          <div className="metric" key={id} {...tid(id)}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="panel release-card" {...tid('card-release-health')}>
        <span>Release health</span>
        <strong {...tid('txt-release-health')}>{health}%</strong>
        <progress value={health} max="100" {...tid('prg-release-health')}>{health}%</progress>
        <p className="panel-lede flag-note">
          {openOrders} open orders · checklist {completed}/{releaseChecklist.length}
        </p>
        {flags?.betaGrid ? (
          <p className="panel-lede flag-note" {...tid('txt-flag-beta-grid')}>
            Beta grid flag on — extra dashboard copy for flag tests.
          </p>
        ) : null}
        {flags?.darkPreview ? (
          <p className="panel-lede flag-note" {...tid('txt-flag-dark-preview')}>
            Dark preview flag on — use theme toggle to compare surfaces.
          </p>
        ) : null}
        {flags?.noisyToasts ? (
          <p className="panel-lede flag-note" {...tid('txt-flag-noisy-toasts')}>
            Verbose toasts flag on — settings actions stay chatty.
          </p>
        ) : null}
      </section>

      <section className="panel" {...tid('sec-env-status')}>
        <div className="panel-head">
          <h2>Environment Status</h2>
          <Database size={18} aria-hidden="true" />
        </div>
        <div className="env-list">
          {qaEnvironments.map((env) => (
            <div className="env-row" key={env.name} {...tid(`row-env-${env.key}`)}>
              <span className={`status-dot ${env.status}`} aria-hidden="true" />
              <div>
                <strong>{env.name}</strong>
                <small>{env.detail}</small>
              </div>
              <span {...tid(`txt-env-uptime-${env.key}`)}>{env.uptime}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" {...tid('sec-release-checklist')}>
        <div className="panel-head">
          <h2>Release Checklist</h2>
          <span {...tid('txt-checklist-count')}>{completed}/{releaseChecklist.length}</span>
        </div>
        {releaseChecklist.map((item) => (
          <label className="check-row" key={item.id} {...tid(`chk-release-${item.id}`)}>
            <input
              {...tid(`inp-release-${item.id}`)}
              type="checkbox"
              checked={item.done}
              onChange={(event) => setReleaseChecklist((current) => current.map((row) => (
                row.id === item.id ? { ...row, done: event.target.checked } : row
              )))}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </section>

      <section className="panel" {...tid('sec-notifications')}>
        <div className="panel-head">
          <h2>Notifications</h2>
          <Bell size={18} aria-hidden="true" />
        </div>
        {visibleNotes.length === 0 ? (
          <p className="empty-state" {...tid('msg-notes-empty')}>No notifications.</p>
        ) : visibleNotes.map((note) => (
          <article className={`note ${note.type}`} key={note.id} {...tid(`note-${note.id}`)}>
            <div className="note-head">
              <strong>{note.title}</strong>
              <button
                type="button"
                className="icon-button note-dismiss"
                aria-label={`Dismiss ${note.title}`}
                onClick={() => onDismissNote(note.id)}
                {...tid(`btn-note-dismiss-${note.id}`)}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <p>{note.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
