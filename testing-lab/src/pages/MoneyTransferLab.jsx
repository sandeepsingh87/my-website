import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ExternalLink, Menu, Sparkles, X, Landmark } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import LabStrip from '../components/money-transfer/LabStrip.jsx';
import AboutLab from '../components/money-transfer/AboutLab.jsx';
import {
  logout as authLogout,
  restorePersistedAuth
} from '../lib/money-transfer/moneyTransferAuth.js';
import { readTheme, writeTheme } from '../lib/money-transfer/session.js';
import { tid } from '../lib/money-transfer/tid.js';
import '../styles/money-transfer.css';

export default function MoneyTransferLab() {
  const [theme, setTheme] = useState(() => readTheme());
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [logoutNotice, setLogoutNotice] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loginMode, setLoginMode] = useState('password');
  const [loginCardKey, setLoginCardKey] = useState(0);
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const restored = restorePersistedAuth();
    if (restored.user) setUser(restored.user);
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(message, tone = 'success') {
    const text = String(message || '').trim();
    if (!text) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ message: text, tone });
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }

  function handleLoginSuccess(nextUser) {
    setUser(nextUser);
    setLogoutNotice('');
  }

  function handleLogout() {
    authLogout();
    setUser(null);
    setLogoutNotice('You have been logged out of the test environment.');
    showToast('You have been logged out of the test environment.', 'success');
    navigate('/money-transfer');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    writeTheme(next);
  }

  function scrollToRegister() {
    document.getElementById('mt-register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToLogin(email) {
    if (email) {
      setIdentifier(email);
      setLoginMode('password');
      setLoginCardKey((n) => n + 1);
    }
    document.getElementById('mt-login')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const ToastIcon = toast?.tone === 'error' ? AlertCircle : CheckCircle2;

  return (
    <div className={`app-shell mt-theme ${theme}`} {...tid('app-shell-mt')}>
      <header className="topbar" {...tid('hdr-mt-topbar')}>
        <Link className="brand" to="/" {...tid('lnk-brand-home')}>
          <span className="brand-mark">QE</span>
          <span>
            <strong>Testing Lab</strong>
            <small>Money Transfer Lab</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          <Link className="nav-button" to="/" {...tid('nav-dashboard')}>
            Main Lab
          </Link>
          <Link className="nav-button active" to="/money-transfer" {...tid('nav-money-transfer')}>
            <Landmark size={16} aria-hidden="true" />
            Auth Lab
          </Link>
        </nav>
        <div className="topbar-actions">
          {user ? (
            <button className="link-button" type="button" onClick={handleLogout} {...tid('hdr-logout')}>
              Logout
            </button>
          ) : null}
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            {...tid('btn-theme-tgl')}
          >
            <Sparkles size={18} aria-hidden="true" />
          </button>
          <a className="link-button" href="../index.html" {...tid('lnk-main-site')}>
            Main site <ExternalLink size={15} aria-hidden="true" />
          </a>
          <button
            className="icon-button mobile-only"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            {...tid('btn-menu-open')}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="mobile-drawer" role="dialog" aria-label="Mobile menu" {...tid('dlg-mobile-menu')}>
          <div className="drawer-head">
            <strong>Testing Lab</strong>
            <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu" {...tid('btn-menu-close')}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <Link className="drawer-link" to="/" onClick={() => setMenuOpen(false)} {...tid('mnav-main')}>
            Main Lab
          </Link>
          <Link className="drawer-link" to="/money-transfer" onClick={() => setMenuOpen(false)} {...tid('mnav-money-transfer')}>
            Auth Lab
          </Link>
        </div>
      ) : null}

      <main className="workspace mt-workspace" {...tid('main-money-transfer')}>
        <LabStrip />

        {logoutNotice ? (
          <p className="mt-info" role="status" aria-live="polite" {...tid('logout-notice')}>
            {logoutNotice}
          </p>
        ) : null}

        <Outlet
          context={{
            user,
            handleLogout,
            showToast,
            identifier,
            setIdentifier,
            loginMode,
            loginCardKey,
            handleLoginSuccess,
            scrollToRegister,
            scrollToLogin
          }}
        />

        <AboutLab />
      </main>

      {toast ? (
        <div
          className={`toast mt-toast mt-toast-${toast.tone || 'success'}`}
          role="status"
          aria-live="polite"
          {...tid('toast')}
        >
          <ToastIcon size={18} aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  );
}
