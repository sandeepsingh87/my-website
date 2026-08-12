import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Home,
  Landmark,
  ListChecks,
  Menu,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  UserPlus,
  X
} from 'lucide-react';
import {
  defaultFlags,
  defaultProfile,
  initialOrders,
  notifications,
  PAGE_SIZE,
  qaEnvironments,
  releaseItems
} from '../data/fixtures.js';
import {
  clearLabSession,
  readChecklist,
  readFlags,
  readOrders,
  readTheme,
  writeChecklist,
  writeFlags,
  writeOrders,
  writeTheme
} from '../lib/qe-lab/storage.js';
import { tid } from '../lib/tid.js';
import AboutLab from '../components/qe-lab/AboutLab.jsx';
import CommerceView from '../components/qe-lab/CommerceView.jsx';
import DashboardView from '../components/qe-lab/DashboardView.jsx';
import FormsView from '../components/qe-lab/FormsView.jsx';
import OrderModal from '../components/qe-lab/OrderModal.jsx';
import SettingsView from '../components/qe-lab/SettingsView.jsx';
import WorkflowView from '../components/qe-lab/WorkflowView.jsx';
import '../styles/app.css';

const VIEWS = new Set(['dashboard', 'forms', 'commerce', 'workflow', 'settings']);
const TITLES = {
  dashboard: 'Dashboard',
  forms: 'Forms',
  commerce: 'Commerce',
  workflow: 'Workflow',
  settings: 'Settings'
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'forms', label: 'Forms', icon: UserPlus },
  { id: 'commerce', label: 'Commerce', icon: ShoppingCart },
  { id: 'workflow', label: 'Workflow', icon: ListChecks },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function QeLabApp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawView = searchParams.get('view') || 'dashboard';
  const activeView = VIEWS.has(rawView) ? rawView : 'dashboard';
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => readTheme());
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState(() => readOrders(initialOrders));
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formState, setFormState] = useState(defaultProfile);
  const [formErrors, setFormErrors] = useState({});
  const [profileSaved, setProfileSaved] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [releaseChecklist, setReleaseChecklist] = useState(() => readChecklist(releaseItems));
  const [uploadedFile, setUploadedFile] = useState('');
  const [fileError, setFileError] = useState('');
  const [flags, setFlags] = useState(() => ({ ...defaultFlags, ...readFlags(defaultFlags) }));
  const [dismissedNotes, setDismissedNotes] = useState([]);
  const [audit, setAudit] = useState([]);
  const toastTimer = useRef(null);
  const auditSeq = useRef(0);

  useEffect(() => {
    document.title = `${TITLES[activeView]} · Testing Lab`;
  }, [activeView]);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    writeChecklist(releaseChecklist);
  }, [releaseChecklist]);

  useEffect(() => {
    writeOrders(orders);
  }, [orders]);

  useEffect(() => {
    writeFlags(flags);
  }, [flags]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const filteredOrders = useMemo(() => {
    const rows = orders
      .filter((order) => status === 'all' || order.status === status)
      .filter((order) => {
        const value = `${order.id} ${order.customer} ${order.product} ${order.status} ${order.placed}`.toLowerCase();
        return value.includes(query.toLowerCase());
      })
      .sort((left, right) => {
        const key = sortBy === 'amount' ? 'amount' : sortBy;
        const a = left[key];
        const b = right[key];
        const cmp = typeof a === 'number' ? a - b : String(a).localeCompare(String(b));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    return rows;
  }, [orders, query, sortBy, sortDir, status]);

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
    if (page > totalPages) setPage(totalPages);
  }, [filteredOrders.length, page]);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) || null;

  function setActiveView(id) {
    const next = new URLSearchParams(searchParams);
    if (id === 'dashboard') next.delete('view');
    else next.set('view', id);
    setSearchParams(next, { replace: true });
  }

  function logEvent(message) {
    auditSeq.current += 1;
    const entry = { id: auditSeq.current, at: new Date().toISOString(), message };
    setAudit((current) => [entry, ...current].slice(0, 25));
  }

  function showToast(message, tone = 'success') {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ message, tone });
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    writeTheme(next);
  }

  function updateSkill(skill, checked) {
    setFormState((current) => ({
      ...current,
      skills: checked ? [...current.skills, skill] : current.skills.filter((item) => item !== skill)
    }));
  }

  function submitProfile(event) {
    event.preventDefault();
    const errors = {};
    if (!formState.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formState.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) errors.email = 'Enter a valid email';
    if (!formState.password || formState.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Za-z]/.test(formState.password) || !/\d/.test(formState.password)) {
      errors.password = 'Password needs a letter and a number';
    }
    if (formState.confirmPassword !== formState.password) errors.confirmPassword = 'Passwords do not match';
    if (!formState.terms) errors.terms = 'Accept the sandbox terms to continue';
    if (fileError) errors.file = fileError;
    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setProfileSaved(false);
      showToast('Fix the highlighted fields', 'error');
      return;
    }
    setProfileSaved(true);
    logEvent(`Profile saved for ${formState.fullName}`);
    showToast(`Profile saved for ${formState.fullName}`);
  }

  function resetProfile() {
    setFormState(defaultProfile);
    setFormErrors({});
    setUploadedFile('');
    setFileError('');
    setProfileSaved(false);
    showToast('Profile form reset');
  }

  function updateOrderStatus(orderId, nextStatus) {
    setOrders((current) => current.map((order) => (
      order.id === orderId ? { ...order, status: nextStatus } : order
    )));
    logEvent(`${orderId} moved to ${nextStatus}`);
    showToast(`${orderId} moved to ${nextStatus}`);
  }

  function clearFilters() {
    setQuery('');
    setStatus('all');
    setSortBy('id');
    setSortDir('asc');
    setPage(1);
  }

  function downloadReport() {
    const header = 'id,customer,product,status,total,placed';
    const lines = orders.map((order) => [order.id, order.customer, order.product, order.status, order.total, order.placed].join(','));
    const blob = new Blob([`${header}\n${lines.join('\n')}\n`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qe-lab-orders.csv';
    link.click();
    URL.revokeObjectURL(url);
    logEvent('Order report downloaded');
    showToast('Report download started');
  }

  function resetLab() {
    clearLabSession();
    setOrders(initialOrders);
    setReleaseChecklist(releaseItems);
    setFlags(defaultFlags);
    setDismissedNotes([]);
    setAudit([]);
    setFormState(defaultProfile);
    setFormErrors({});
    setProfileSaved(false);
    setUploadedFile('');
    setFileError('');
    setWizardStep(1);
    clearFilters();
    showToast('Lab data reset');
  }

  return (
    <div className={`app-shell ${theme}`} {...tid('app-shell-qe01')}>
      <a className="skip-link" href="#main-workspace" {...tid('lnk-skip-main')}>Skip to content</a>
      <header className="topbar" {...tid('hdr-topbar-a1')}>
        <a
          className="brand"
          href="/testing-lab/"
          onClick={(event) => {
            event.preventDefault();
            setActiveView('dashboard');
          }}
          {...tid('lnk-brand-home')}
        >
          <span className="brand-mark">QE</span>
          <span>
            <strong>Testing Lab</strong>
            <small>React automation playground</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                className={active ? 'nav-button active' : 'nav-button'}
                onClick={() => setActiveView(item.id)}
                aria-current={active ? 'page' : undefined}
                {...tid(`nav-${item.id}`)}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
          <Link className="nav-button" to="/money-transfer" {...tid('nav-money-transfer')}>
            <Landmark size={16} aria-hidden="true" />
            Auth Lab
          </Link>
        </nav>
        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={theme === 'dark'}
            {...tid('btn-theme-tgl')}
          >
            <Sparkles size={18} aria-hidden="true" />
          </button>
          <a className="link-button" href="../index.html" {...tid('lnk-main-site')}>Main site <ExternalLink size={15} aria-hidden="true" /></a>
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu" {...tid('btn-menu-open')}>
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile menu" {...tid('dlg-mobile-menu')}>
          <div className="drawer-head">
            <strong>Testing Lab</strong>
            <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu" {...tid('btn-menu-close')}>
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
                {...tid(`mnav-${item.id}`)}
              >
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
          <Link
            className="drawer-link"
            to="/money-transfer"
            onClick={() => setMenuOpen(false)}
            {...tid('mnav-money-transfer')}
          >
            <Landmark size={17} aria-hidden="true" />
            Auth Lab
          </Link>
        </div>
      )}

      <main className="workspace" id="main-workspace" {...tid('main-workspace')}>
        <div className="lab-strip" role="status" {...tid('sec-product-hero')}>
          <ShieldAlert size={16} aria-hidden="true" />
          <p>
            <strong>TEST ENVIRONMENT</strong>
            <span> · Testing Lab · Forms, tables, workflows, and stable locators · No production data</span>
          </p>
        </div>

        {activeView === 'dashboard' && (
          <DashboardView
            notifications={notifications}
            dismissedNotes={dismissedNotes}
            onDismissNote={(id) => setDismissedNotes((current) => [...current, id])}
            qaEnvironments={qaEnvironments}
            releaseChecklist={releaseChecklist}
            setReleaseChecklist={setReleaseChecklist}
            flags={flags}
            orders={orders}
          />
        )}

        {activeView === 'forms' && (
          <FormsView
            formState={formState}
            setFormState={setFormState}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            profileSaved={profileSaved}
            setProfileSaved={setProfileSaved}
            submitProfile={submitProfile}
            resetProfile={resetProfile}
            updateSkill={updateSkill}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            fileError={fileError}
            setFileError={setFileError}
          />
        )}

        {activeView === 'commerce' && (
          <CommerceView
            query={query}
            setQuery={setQuery}
            status={status}
            setStatus={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDir={sortDir}
            setSortDir={setSortDir}
            page={page}
            setPage={setPage}
            filteredOrders={filteredOrders}
            pagedOrders={pagedOrders}
            setSelectedOrder={setSelectedOrderId}
            updateOrderStatus={updateOrderStatus}
            onClearFilters={clearFilters}
          />
        )}

        {activeView === 'workflow' && (
          <WorkflowView wizardStep={wizardStep} setWizardStep={setWizardStep} showToast={showToast} onLog={logEvent} />
        )}

        {activeView === 'settings' && (
          <SettingsView
            showToast={showToast}
            flags={flags}
            setFlags={setFlags}
            audit={audit}
            onResetLab={resetLab}
            onDownloadReport={downloadReport}
            onLog={logEvent}
          />
        )}

        <AboutLab />
      </main>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} updateOrderStatus={updateOrderStatus} />
      )}

      {toast && (
        <div
          className={`toast${toast.tone === 'error' ? ' toast-error' : ''}`}
          role="status"
          aria-live="polite"
          {...tid('msg-toast-status')}
        >
          {toast.tone === 'error' ? <AlertCircle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
