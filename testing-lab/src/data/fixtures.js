export const initialOrders = [
  { id: 'ORD-1001', customer: 'Aarav Mehta', product: 'Automation Suite', status: 'new', total: '$1,240', amount: 1240, placed: '2026-08-01' },
  { id: 'ORD-1002', customer: 'Mia Johnson', product: 'API Monitor', status: 'processing', total: '$860', amount: 860, placed: '2026-08-03' },
  { id: 'ORD-1003', customer: 'Noah Smith', product: 'QE Dashboard', status: 'shipped', total: '$2,150', amount: 2150, placed: '2026-07-22' },
  { id: 'ORD-1004', customer: 'Diya Rao', product: 'Test Data Pack', status: 'cancelled', total: '$430', amount: 430, placed: '2026-07-28' },
  { id: 'ORD-1005', customer: 'Liam Brown', product: 'Release Console', status: 'processing', total: '$1,780', amount: 1780, placed: '2026-08-08' },
  { id: 'ORD-1006', customer: 'Sofia Alvarez', product: 'Locator Pack', status: 'new', total: '$640', amount: 640, placed: '2026-08-10' },
  { id: 'ORD-1007', customer: 'Kenji Sato', product: 'A11y Audit', status: 'shipped', total: '$990', amount: 990, placed: '2026-08-05' }
];

export const notifications = [
  { id: 'smoke', type: 'success', title: 'Smoke passed', body: 'Critical checkout and login journeys passed in QA.' },
  { id: 'defect', type: 'warning', title: 'Defect triage', body: 'Three medium-priority defects need owner confirmation.' },
  { id: 'deploy', type: 'info', title: 'Deployment queued', body: 'Staging deployment starts after approval window.' }
];

export const qaEnvironments = [
  { key: 'qa', name: 'QA', status: 'good', uptime: '99.9%', detail: 'Healthy and available' },
  { key: 'stg', name: 'Staging', status: 'warn', uptime: '97.2%', detail: 'Payment stub latency detected' },
  { key: 'dev', name: 'Dev', status: 'good', uptime: '98.4%', detail: 'Latest branch deployed' },
  { key: 'sbx', name: 'Sandbox', status: 'down', uptime: '0%', detail: 'Intentional outage for negative env tests' }
];

export const releaseItems = [
  { id: 'smoke', label: 'Smoke suite completed', done: true },
  { id: 'regression', label: 'Regression evidence attached', done: false },
  { id: 'accessibility', label: 'Accessibility checks reviewed', done: true },
  { id: 'signoff', label: 'Business sign-off captured', done: false }
];

export const defaultFlags = {
  betaGrid: true,
  darkPreview: false,
  noisyToasts: false
};

export const defaultProfile = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'tester',
  country: 'India',
  skills: ['functional'],
  experience: 5,
  automationReady: true,
  notes: '',
  terms: false
};

export const PAGE_SIZE = 5;
export const NOTES_MAX = 280;
export const LAB_STATS = {
  activeTests: 148,
  deployments: 7
};
