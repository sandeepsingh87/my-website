export const initialOrders = [
  { id: 'ORD-1001', customer: 'Aarav Mehta', product: 'Automation Suite', status: 'new', total: '$1,240' },
  { id: 'ORD-1002', customer: 'Mia Johnson', product: 'API Monitor', status: 'processing', total: '$860' },
  { id: 'ORD-1003', customer: 'Noah Smith', product: 'QE Dashboard', status: 'shipped', total: '$2,150' },
  { id: 'ORD-1004', customer: 'Diya Rao', product: 'Test Data Pack', status: 'cancelled', total: '$430' },
  { id: 'ORD-1005', customer: 'Liam Brown', product: 'Release Console', status: 'processing', total: '$1,780' }
];

export const notifications = [
  { id: 'smoke', type: 'success', title: 'Smoke passed', body: 'Critical checkout and login journeys passed in QA.' },
  { id: 'defect', type: 'warning', title: 'Defect triage', body: 'Three medium-priority defects need owner confirmation.' },
  { id: 'deploy', type: 'info', title: 'Deployment queued', body: 'Staging deployment starts after approval window.' }
];

export const qaEnvironments = [
  { key: 'qa', name: 'QA', status: 'good', uptime: '99.9%', detail: 'Healthy and available' },
  { key: 'stg', name: 'Staging', status: 'warn', uptime: '97.2%', detail: 'Payment stub latency detected' },
  { key: 'dev', name: 'Dev', status: 'good', uptime: '98.4%', detail: 'Latest branch deployed' }
];

export const releaseItems = [
  { id: 'smoke', label: 'Smoke suite completed', done: true },
  { id: 'regression', label: 'Regression evidence attached', done: false },
  { id: 'accessibility', label: 'Accessibility checks reviewed', done: true },
  { id: 'signoff', label: 'Business sign-off captured', done: false }
];
