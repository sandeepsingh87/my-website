import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertCircle,
  ArrowUpDown,
  Bell,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Database,
  Download,
  ExternalLink,
  Filter,
  Home,
  ListChecks,
  Lock,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Upload,
  UserPlus,
  X
} from 'lucide-react';
import { initialOrders, notifications, qaEnvironments, releaseItems } from './data/fixtures.js';
import './styles/app.css';

const aid = (id) => ({ 'automation-id': id });

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'tester',
    country: 'India',
    skills: ['functional'],
    experience: 5,
    automationReady: true,
    notes: ''
  });
  const [wizardStep, setWizardStep] = useState(1);
  const [releaseChecklist, setReleaseChecklist] = useState(releaseItems);
  const [uploadedFile, setUploadedFile] = useState('');

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => status === 'all' || order.status === status)
      .filter((order) => {
        const value = `${order.id} ${order.customer} ${order.product} ${order.status}`.toLowerCase();
        return value.includes(query.toLowerCase());
      })
      .sort((left, right) => String(left[sortBy]).localeCompare(String(right[sortBy])));
  }, [orders, query, sortBy, status]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function updateSkill(skill, checked) {
    setFormState((current) => ({
      ...current,
      skills: checked ? [...current.skills, skill] : current.skills.filter((item) => item !== skill)
    }));
  }

  function submitProfile(event) {
    event.preventDefault();
    showToast(`Profile saved for ${formState.fullName || 'new QE user'}`);
  }

  function resetProfile() {
    setFormState({
      fullName: '',
      email: '',
      password: '',
      role: 'tester',
      country: 'India',
      skills: ['functional'],
      experience: 5,
      automationReady: true,
      notes: ''
    });
    showToast('Profile form reset');
  }

  function updateOrderStatus(orderId, nextStatus) {
    setOrders((current) => current.map((order) => (
      order.id === orderId ? { ...order, status: nextStatus } : order
    )));
    showToast(`${orderId} moved to ${nextStatus}`);
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'forms', label: 'Forms', icon: UserPlus },
    { id: 'commerce', label: 'Commerce', icon: ShoppingCart },
    { id: 'workflow', label: 'Workflow', icon: ListChecks },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`app-shell ${theme}`} {...aid('app-shell-qe01')}>
      <header className="topbar" {...aid('hdr-topbar-a1')}>
        <a className="brand" href="#dashboard" onClick={() => setActiveView('dashboard')} {...aid('lnk-brand-home')}>
          <span className="brand-mark">QE</span>
          <span>
            <strong>Testing Lab</strong>
            <small>React automation playground</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activeView === item.id ? 'nav-button active' : 'nav-button'}
                onClick={() => setActiveView(item.id)}
                {...aid(`nav-${item.id}`)}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="topbar-actions">
          <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" {...aid('btn-theme-tgl')}>
            <Sparkles size={18} aria-hidden="true" />
          </button>
          <a className="link-button" href="../index.html" {...aid('lnk-main-site')}>Main site <ExternalLink size={15} aria-hidden="true" /></a>
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu" {...aid('btn-menu-open')}>
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-drawer" role="dialog" aria-label="Mobile menu" {...aid('dlg-mobile-menu')}>
          <div className="drawer-head">
            <strong>Testing Lab</strong>
            <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu" {...aid('btn-menu-close')}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="drawer-link"
                onClick={() => {
                  setActiveView(item.id);
                  setMenuOpen(false);
                }}
                {...aid(`mnav-${item.id}`)}
              >
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      <main className="workspace" {...aid('main-workspace')}>
        <section className="hero-band" {...aid('sec-product-hero')}>
          <div>
            <p className="eyebrow">Product demo candidate</p>
            <h1>One realistic web app for functional, exploratory, and automation testing.</h1>
            <p>
              Built as a compact product simulation with forms, tables, filters, modals, workflows,
              notifications, file input, responsive navigation, and stable automation locators.
            </p>
          </div>
          <div className="release-card" {...aid('card-release-health')}>
            <span>Release health</span>
            <strong>92%</strong>
            <progress value="92" max="100" {...aid('prg-release-health')}>92%</progress>
          </div>
        </section>

        {activeView === 'dashboard' && (
          <Dashboard
            notifications={notifications}
            qaEnvironments={qaEnvironments}
            releaseChecklist={releaseChecklist}
            setReleaseChecklist={setReleaseChecklist}
          />
        )}

        {activeView === 'forms' && (
          <FormsLab
            formState={formState}
            setFormState={setFormState}
            submitProfile={submitProfile}
            resetProfile={resetProfile}
            updateSkill={updateSkill}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
          />
        )}

        {activeView === 'commerce' && (
          <CommerceLab
            query={query}
            setQuery={setQuery}
            status={status}
            setStatus={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredOrders={filteredOrders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            updateOrderStatus={updateOrderStatus}
          />
        )}

        {activeView === 'workflow' && (
          <WorkflowLab wizardStep={wizardStep} setWizardStep={setWizardStep} showToast={showToast} />
        )}

        {activeView === 'settings' && (
          <SettingsLab showToast={showToast} />
        )}
      </main>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} updateOrderStatus={updateOrderStatus} />
      )}

      {toast && (
        <div className="toast" role="status" {...aid('msg-toast-status')}>
          <CheckCircle2 size={18} aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}

function Dashboard({ notifications, qaEnvironments, releaseChecklist, setReleaseChecklist }) {
  const completed = releaseChecklist.filter((item) => item.done).length;
  return (
    <div className="content-grid" {...aid('view-dashboard')}>
      <section className="panel metric-grid" {...aid('sec-dashboard-metrics')}>
        {[
          ['Active tests', '148', 'card-active-tests'],
          ['Open defects', '12', 'card-open-defects'],
          ['Automation pass', '86%', 'card-automation-pass'],
          ['Deployments', '7', 'card-deployments']
        ].map(([label, value, id]) => (
          <div className="metric" key={label} {...aid(id)}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="panel" {...aid('sec-env-status')}>
        <div className="panel-head">
          <h2>Environment Status</h2>
          <Database size={18} aria-hidden="true" />
        </div>
        <div className="env-list">
          {qaEnvironments.map((env) => (
            <div className="env-row" key={env.name} {...aid(`row-env-${env.key}`)}>
              <span className={`status-dot ${env.status}`} />
              <div>
                <strong>{env.name}</strong>
                <small>{env.detail}</small>
              </div>
              <span>{env.uptime}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" {...aid('sec-release-checklist')}>
        <div className="panel-head">
          <h2>Release Checklist</h2>
          <span>{completed}/{releaseChecklist.length}</span>
        </div>
        {releaseChecklist.map((item) => (
          <label className="check-row" key={item.id} {...aid(`chk-release-${item.id}`)}>
            <input
              {...aid(`inp-release-${item.id}`)}
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

      <section className="panel" {...aid('sec-notifications')}>
        <div className="panel-head">
          <h2>Notifications</h2>
          <Bell size={18} aria-hidden="true" />
        </div>
        {notifications.map((note) => (
          <article className={`note ${note.type}`} key={note.id} {...aid(`note-${note.id}`)}>
            <strong>{note.title}</strong>
            <p>{note.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function FormsLab({ formState, setFormState, submitProfile, resetProfile, updateSkill, uploadedFile, setUploadedFile }) {
  return (
    <section className="panel form-panel" {...aid('view-forms')}>
      <div className="panel-head">
        <h2>Registration and Input Controls</h2>
        <ClipboardCheck size={18} aria-hidden="true" />
      </div>
      <form onSubmit={submitProfile} noValidate {...aid('form-qe-profile')}>
        <div className="form-grid">
          <label {...aid('fld-full-name')}>
            Full name
            <input {...aid('inp-full-name')} value={formState.fullName} onChange={(event) => setFormState({ ...formState, fullName: event.target.value })} placeholder="Sandeep Singh" required />
          </label>
          <label {...aid('fld-email')}>
            Email
            <input {...aid('inp-email')} type="email" value={formState.email} onChange={(event) => setFormState({ ...formState, email: event.target.value })} placeholder="qe@example.com" required />
          </label>
          <label {...aid('fld-password')}>
            Password
            <input {...aid('inp-password')} type="password" value={formState.password} onChange={(event) => setFormState({ ...formState, password: event.target.value })} placeholder="Minimum 8 characters" required />
          </label>
          <label {...aid('sel-role')}>
            Role
            <select {...aid('ddl-role')} value={formState.role} onChange={(event) => setFormState({ ...formState, role: event.target.value })}>
              <option value="tester">Tester</option>
              <option value="automation-engineer">Automation Engineer</option>
              <option value="lead">QE Lead</option>
              <option value="manager">QE Manager</option>
            </select>
          </label>
          <label {...aid('sel-country')}>
            Country
            <select {...aid('ddl-country')} value={formState.country} onChange={(event) => setFormState({ ...formState, country: event.target.value })}>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Singapore</option>
            </select>
          </label>
          <label {...aid('rng-experience')}>
            Experience: {formState.experience} years
            <input {...aid('inp-experience')} type="range" min="0" max="20" value={formState.experience} onChange={(event) => setFormState({ ...formState, experience: event.target.value })} />
          </label>
        </div>

        <fieldset {...aid('grp-skills')}>
          <legend>Testing skills</legend>
          {['functional', 'api', 'accessibility', 'performance'].map((skill) => (
            <label className="check-pill" key={skill} {...aid(`chk-skill-${skill}`)}>
              <input {...aid(`inp-skill-${skill}`)} type="checkbox" checked={formState.skills.includes(skill)} onChange={(event) => updateSkill(skill, event.target.checked)} />
              {skill}
            </label>
          ))}
        </fieldset>

        <fieldset {...aid('grp-preference')}>
          <legend>Automation readiness</legend>
          <label className="radio-row" {...aid('rad-ready-yes')}>
            <input {...aid('inp-ready-yes')} type="radio" name="automationReady" checked={formState.automationReady} onChange={() => setFormState({ ...formState, automationReady: true })} />
            Ready for automation
          </label>
          <label className="radio-row" {...aid('rad-ready-no')}>
            <input {...aid('inp-ready-no')} type="radio" name="automationReady" checked={!formState.automationReady} onChange={() => setFormState({ ...formState, automationReady: false })} />
            Manual testing only
          </label>
        </fieldset>

        <label {...aid('txt-notes')}>
          Test notes
          <textarea {...aid('inp-notes')} rows="4" value={formState.notes} onChange={(event) => setFormState({ ...formState, notes: event.target.value })} placeholder="Add exploratory notes, boundary values, or defect context." />
        </label>

        <label className="file-zone" {...aid('upl-evidence')}>
          <Upload size={18} aria-hidden="true" />
          Upload evidence
          <input {...aid('inp-evidence-file')} type="file" onChange={(event) => setUploadedFile(event.target.files?.[0]?.name || '')} />
          <small>{uploadedFile || 'No file selected'}</small>
        </label>

        <div className="button-row">
          <button className="primary-button" type="submit" {...aid('btn-profile-submit')}>Save profile</button>
          <button className="secondary-button" type="button" onClick={resetProfile} {...aid('btn-profile-reset')}>Reset</button>
        </div>
      </form>
    </section>
  );
}

function CommerceLab({ query, setQuery, status, setStatus, sortBy, setSortBy, filteredOrders, setSelectedOrder, updateOrderStatus }) {
  return (
    <section className="panel" {...aid('view-commerce')}>
      <div className="panel-head">
        <h2>Orders and Data Grid</h2>
        <ArrowUpDown size={18} aria-hidden="true" />
      </div>
      <div className="toolbar" {...aid('bar-order-filters')}>
        <label className="search-field" {...aid('fld-order-search')}>
          <Search size={16} aria-hidden="true" />
          <input {...aid('inp-order-search')} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" />
        </label>
        <label {...aid('sel-order-status')}>
          <Filter size={16} aria-hidden="true" />
          <select {...aid('ddl-order-status')} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label {...aid('sel-order-sort')}>
          <SlidersHorizontal size={16} aria-hidden="true" />
          <select {...aid('ddl-order-sort')} value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="customer">Sort by customer</option>
            <option value="status">Sort by status</option>
          </select>
        </label>
      </div>

      <div className="table-wrap" {...aid('tbl-orders-wrap')}>
        <table {...aid('tbl-orders')}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} {...aid(`row-order-${order.id.toLowerCase()}`)}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                <td>{order.total}</td>
                <td>
                  <button className="text-button" onClick={() => setSelectedOrder(order)} {...aid(`btn-order-view-${order.id.toLowerCase()}`)}>View</button>
                  <button className="text-button" onClick={() => updateOrderStatus(order.id, 'shipped')} {...aid(`btn-order-ship-${order.id.toLowerCase()}`)}>Ship</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WorkflowLab({ wizardStep, setWizardStep, showToast }) {
  const steps = ['Details', 'Validation', 'Confirmation'];
  return (
    <section className="panel" {...aid('view-workflow')}>
      <div className="panel-head">
        <h2>Multi-step Workflow</h2>
        <ChevronDown size={18} aria-hidden="true" />
      </div>
      <div className="stepper" {...aid('cmp-release-stepper')}>
        {steps.map((step, index) => (
          <button
            key={step}
            className={wizardStep === index + 1 ? 'step active' : 'step'}
            onClick={() => setWizardStep(index + 1)}
            {...aid(`btn-step-${index + 1}`)}
          >
            <span>{index + 1}</span>
            {step}
          </button>
        ))}
      </div>
      <div className="workflow-body" {...aid(`pnl-step-${wizardStep}`)}>
        <h3>{steps[wizardStep - 1]}</h3>
        <p>
          {wizardStep === 1 && 'Capture release information, scope, affected modules, and test data needs.'}
          {wizardStep === 2 && 'Validate mandatory checks, environment health, smoke tests, and approvals.'}
          {wizardStep === 3 && 'Confirm release readiness and trigger stakeholder communication.'}
        </p>
      </div>
      <div className="button-row">
        <button className="secondary-button" disabled={wizardStep === 1} onClick={() => setWizardStep(wizardStep - 1)} {...aid('btn-step-prev')}>Previous</button>
        {wizardStep < 3 ? (
          <button className="primary-button" onClick={() => setWizardStep(wizardStep + 1)} {...aid('btn-step-next')}>Next</button>
        ) : (
          <button className="primary-button" onClick={() => showToast('Release workflow completed')} {...aid('btn-workflow-finish')}>Finish</button>
        )}
      </div>
    </section>
  );
}

function SettingsLab({ showToast }) {
  const [expanded, setExpanded] = useState('api');
  return (
    <section className="panel" {...aid('view-settings')}>
      <div className="panel-head">
        <h2>Settings and Edge Cases</h2>
        <Lock size={18} aria-hidden="true" />
      </div>
      {[
        ['api', 'API keys', 'Masked secrets, copy buttons, and regeneration flows.'],
        ['flags', 'Feature flags', 'Toggle product capabilities for controlled testing.'],
        ['audit', 'Audit log', 'Review activity history and compliance events.']
      ].map(([id, title, body]) => (
        <div className="accordion" key={id} {...aid(`acc-${id}`)}>
          <button onClick={() => setExpanded(expanded === id ? '' : id)} aria-expanded={expanded === id} {...aid(`btn-acc-${id}`)}>
            {title}
            <ChevronDown size={17} aria-hidden="true" />
          </button>
          {expanded === id && (
            <div className="accordion-body" {...aid(`pnl-acc-${id}`)}>
              <p>{body}</p>
              <button className="secondary-button" onClick={() => showToast(`${title} action captured`)} {...aid(`btn-${id}-action`)}>Run action</button>
            </div>
          )}
        </div>
      ))}
      <div className="download-row">
        <button className="secondary-button" onClick={() => showToast('Report download started')} {...aid('btn-download-report')}>
          <Download size={16} aria-hidden="true" />
          Download report
        </button>
        <button className="danger-button" onClick={() => showToast('Negative scenario triggered')} {...aid('btn-negative-case')}>
          <AlertCircle size={16} aria-hidden="true" />
          Trigger negative case
        </button>
      </div>
    </section>
  );
}

function OrderModal({ order, onClose, updateOrderStatus }) {
  return (
    <div className="modal-backdrop" role="presentation" {...aid('ovl-order-modal')}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="order-title" {...aid('dlg-order-details')}>
        <div className="panel-head">
          <h2 id="order-title">{order.id}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close order details" {...aid('btn-order-modal-close')}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <dl className="detail-list">
          <div><dt>Customer</dt><dd>{order.customer}</dd></div>
          <div><dt>Product</dt><dd>{order.product}</dd></div>
          <div><dt>Total</dt><dd>{order.total}</dd></div>
          <div><dt>Status</dt><dd>{order.status}</dd></div>
        </dl>
        <div className="button-row">
          <button className="primary-button" onClick={() => updateOrderStatus(order.id, 'processing')} {...aid('btn-modal-process')}>Process</button>
          <button className="danger-button" onClick={() => updateOrderStatus(order.id, 'cancelled')} {...aid('btn-modal-cancel')}>Cancel order</button>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
