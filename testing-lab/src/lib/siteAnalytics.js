import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/** Safe wrapper around window.Analytics. Never pass user-entered values. */
export function track(eventName, parameters) {
  try {
    if (window.Analytics && typeof window.Analytics.track === 'function') {
      window.Analytics.track(eventName, parameters);
    }
  } catch {
    // Analytics must not affect lab behaviour.
  }
}

export function pageView(parameters) {
  try {
    if (window.Analytics && typeof window.Analytics.pageView === 'function') {
      window.Analytics.pageView(parameters);
    }
  } catch {
    // Analytics must not affect lab behaviour.
  }
}

/** Channel only (email vs phone). Never pass the identifier value itself. */
export function identifierChannel(identifier) {
  return String(identifier || '').includes('@') ? 'email' : 'phone';
}

/** Microsoft Clarity: mask this node in session recordings. */
export const CLARITY_MASK = { 'data-clarity-mask': 'true' };

/** SPA route changes after the initial page view from analytics.js. */
export function AnalyticsRouteTracker() {
  const location = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    pageView({
      page_path: location.pathname + location.search,
      page_title: document.title
    });
  }, [location.pathname, location.search]);

  return null;
}
