import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { tid } from '../../lib/money-transfer/tid.js';

export default function LabStrip() {
  return (
    <div className="mt-strip" role="status" {...tid('test-environment-banner')}>
      <ShieldAlert size={16} aria-hidden="true" />
      <p>
        <strong>TEST ENVIRONMENT</strong>
        <span> · Money Transfer Lab · No real money, accounts, or payouts · Login, OTP, register, then send a demo transfer to receipt</span>
      </p>
    </div>
  );
}
