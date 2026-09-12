/**
 * Shared analytics layer for sandeepsingh87.in
 *
 * DO NOT add passwords, OTPs, personal information or user data here.
 * Never send user-entered values (email, phone, password, OTP, bank/card details).
 *
 * Paste real IDs only in ANALYTICS_CONFIG below:
 *   - cloudflareToken: Cloudflare Web Analytics site token (manual JS beacon)
 *   - clarityProjectId: Microsoft Clarity Project ID
 *   - googleMeasurementId: GA4 Measurement ID (optional; off by default)
 */
(function () {
  'use strict';

  if (window.Analytics && window.Analytics.__ready) {
    return;
  }

  var ANALYTICS_CONFIG = {
    cloudflareEnabled: true,

    // Leave empty: sandeepsingh87.in uses Cloudflare Web Analytics Automatic setup.
    // Do not paste a token here or page views will double-count.
    cloudflareToken: '',

    clarityEnabled: true,

    // Microsoft Clarity Project ID (Clarity dashboard → Settings).
    clarityProjectId: 'yhb2p9ddu7',

    googleAnalyticsEnabled: true,

    // GA4 Measurement ID from Google Analytics (Admin → Data streams).
    googleMeasurementId: 'G-GVX8L8SVWW'
  };

  var PLACEHOLDER_CLARITY = 'CLARITY_PROJECT_ID';
  var PLACEHOLDER_GA = 'G-XXXXXXXXXX';
  var BLOCKED_PARAM_KEY = /^(password|passwd|otp|email|e-?mail|phone|telephone|mobile|identifier|card|cvv|cvc|iban|account|ssn|pin|secret|token|pan|bank)$/i;
  var EMAIL_LIKE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  var PHONE_LIKE = /^\+?\d[\d\s\-()]{7,}$/;

  var initialized = false;
  var pageViewSent = false;
  var playbookEventSent = false;
  var lastPagePath = '';

  function noop() {}

  function safe(fn) {
    try {
      fn();
    } catch (error) {
      // Analytics must never break the site. Do not log user data.
    }
  }

  function usableValue(value, placeholder) {
    if (typeof value !== 'string') return false;
    var trimmed = value.trim();
    return Boolean(trimmed) && trimmed !== placeholder;
  }

  function sanitizeParams(parameters) {
    var out = {};
    if (!parameters || typeof parameters !== 'object') return out;
    Object.keys(parameters).forEach(function (key) {
      if (BLOCKED_PARAM_KEY.test(key)) return;
      var value = parameters[key];
      if (value === null || value === undefined) return;
      var type = typeof value;
      if (type !== 'string' && type !== 'number' && type !== 'boolean') return;
      if (type === 'string') {
        if (EMAIL_LIKE.test(value) || PHONE_LIKE.test(value)) return;
      }
      out[key] = value;
    });
    return out;
  }

  function pageContext(extra) {
    var params = {
      page_title: document.title || '',
      page_path: (window.location && window.location.pathname) || ''
    };
    var extraSafe = sanitizeParams(extra);
    Object.keys(extraSafe).forEach(function (key) {
      params[key] = extraSafe[key];
    });
    return params;
  }

  function loadScript(src, options) {
    return new Promise(function (resolve) {
      safe(function () {
        var script = document.createElement('script');
        script.src = src;
        script.async = true;
        if (options && options.type) script.type = options.type;
        if (options && options.defer) script.defer = true;
        if (options && options.attrs) {
          Object.keys(options.attrs).forEach(function (name) {
            script.setAttribute(name, options.attrs[name]);
          });
        }
        script.onload = function () { resolve(true); };
        script.onerror = function () { resolve(false); };
        (document.head || document.documentElement).appendChild(script);
      });
    });
  }

  function maskSensitiveInputs(root) {
    var scope = root || document;
    if (!scope || !scope.querySelectorAll) return;
    var nodes = scope.querySelectorAll(
      'input[type="password"], input[type="email"], input[type="tel"],' +
      'input[autocomplete="email"], input[autocomplete="username"],' +
      'input[autocomplete="tel"], input[autocomplete="one-time-code"],' +
      'input[autocomplete="current-password"], input[autocomplete="new-password"],' +
      'input[id*="otp" i], input[id*="password" i], input[id*="phone" i],' +
      'input[id*="email" i], input[id*="amount" i], input[id*="promo" i]'
    );
    for (var i = 0; i < nodes.length; i += 1) {
      nodes[i].setAttribute('data-clarity-mask', 'true');
    }
  }

  function watchSensitiveInputs() {
    maskSensitiveInputs(document);
    if (typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i += 1) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j += 1) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (node.matches && node.matches('input')) maskSensitiveInputs(node.parentNode || document);
          else maskSensitiveInputs(node);
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function loadCloudflare() {
    if (!ANALYTICS_CONFIG.cloudflareEnabled) return Promise.resolve();
    if (!usableValue(ANALYTICS_CONFIG.cloudflareToken, '')) return Promise.resolve();
    var token = ANALYTICS_CONFIG.cloudflareToken.trim();
    return loadScript('https://static.cloudflareinsights.com/beacon.min.js', {
      type: 'module',
      defer: true,
      attrs: {
        'data-cf-beacon': JSON.stringify({ token: token })
      }
    });
  }

  function loadClarity() {
    if (!ANALYTICS_CONFIG.clarityEnabled) return Promise.resolve();
    if (!usableValue(ANALYTICS_CONFIG.clarityProjectId, PLACEHOLDER_CLARITY)) return Promise.resolve();
    var projectId = ANALYTICS_CONFIG.clarityProjectId.trim();
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    return loadScript('https://www.clarity.ms/tag/' + encodeURIComponent(projectId));
  }

  function loadGoogleAnalytics() {
    if (!ANALYTICS_CONFIG.googleAnalyticsEnabled) return Promise.resolve();
    if (!usableValue(ANALYTICS_CONFIG.googleMeasurementId, PLACEHOLDER_GA)) return Promise.resolve();
    var measurementId = ANALYTICS_CONFIG.googleMeasurementId.trim();
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      send_page_view: false
    });
    return loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId));
  }

  function sendToClarity(eventName, parameters) {
    if (typeof window.clarity !== 'function') return;
    window.clarity('event', eventName);
    Object.keys(parameters || {}).forEach(function (key) {
      var value = parameters[key];
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        window.clarity('set', key, String(value));
      }
    });
  }

  function sendToGa4(eventName, parameters) {
    if (!ANALYTICS_CONFIG.googleAnalyticsEnabled) return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, parameters || {});
  }

  function track(eventName, parameters) {
    safe(function () {
      if (!eventName || typeof eventName !== 'string') return;
      var payload = sanitizeParams(parameters);
      sendToClarity(eventName, payload);
      sendToGa4(eventName, payload);
    });
  }

  function pageView(parameters) {
    safe(function () {
      var payload = pageContext(parameters);
      var pathKey = payload.page_path + (parameters && parameters.page_search ? parameters.page_search : '');
      if (pageViewSent && pathKey === lastPagePath) return;
      lastPagePath = pathKey;
      pageViewSent = true;
      if (ANALYTICS_CONFIG.googleAnalyticsEnabled && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', payload);
      }
      sendToClarity('page_view', payload);
    });
  }

  function maybePlaybookEvent() {
    if (playbookEventSent) return;
    var path = (window.location && window.location.pathname) || '';
    if (path.indexOf('/sessions/') === -1 && !/sessions\/[^/]+\.html$/i.test(path)) return;
    playbookEventSent = true;
    track('playbook_article_view', pageContext());
  }

  function init() {
    if (initialized) return;
    initialized = true;
    safe(function () {
      watchSensitiveInputs();
      Promise.all([
        loadCloudflare(),
        loadClarity(),
        loadGoogleAnalytics()
      ]).then(function () {
        pageView();
        maybePlaybookEvent();
      }).catch(function () {
        pageView();
        maybePlaybookEvent();
      });
    });
  }

  window.Analytics = {
    __ready: true,
    init: init,
    track: track,
    pageView: pageView
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
