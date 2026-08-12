import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { tid } from '../../lib/money-transfer/tid.js';

export default function TestEnvironmentBanner() {
  return (
    <div className="mt-banner" role="status" {...tid('test-environment-banner')}>
      <span className="mt-banner-icon" aria-hidden="true">
        <AlertTriangle size={18} />
      </span>
      <div className="mt-banner-copy">
        <strong>TEST ENVIRONMENT · NO REAL MONEY · NO REAL ACCOUNTS</strong>
        <p>Sandbox only. Static demo credentials. Nothing leaves this browser.</p>
      </div>
    </div>
  );
}
