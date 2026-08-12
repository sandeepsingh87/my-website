/** Seeded demo accounts — intentionally public fake credentials. */
export const DEMO_OTP = '147272';
export const DEMO_PASSWORD = 'Welcome123';

/**
 * Phones use memorable digit patterns (not long zero runs)
 * so testers can type them without counting zeros.
 */
export const TEST_USERS = [
  {
    id: 'test-user-01',
    firstName: 'Test',
    lastName: 'User 01',
    email: 'testuser01@example.com',
    phone: '+919876543210',
    phoneDisplay: '+91 98765 43210',
    password: DEMO_PASSWORD,
    otp: DEMO_OTP,
    source: 'seed'
  },
  {
    id: 'test-user-02',
    firstName: 'Test',
    lastName: 'User 02',
    email: 'testuser02@example.com',
    phone: '+919812345678',
    phoneDisplay: '+91 98123 45678',
    password: DEMO_PASSWORD,
    otp: DEMO_OTP,
    source: 'seed'
  },
  {
    id: 'test-user-03',
    firstName: 'Test',
    lastName: 'User 03',
    email: 'testuser03@example.com',
    phone: '+919711223344',
    phoneDisplay: '+91 97112 23344',
    password: DEMO_PASSWORD,
    otp: DEMO_OTP,
    source: 'seed'
  }
];

export function formatPhoneDisplay(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone;
}
