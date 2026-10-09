import { demoAdmins, DEMO_PASSWORD } from '../../config/demoAccounts.js';

export function demoAdminProfile(id) {
  const admin = demoAdmins.find((account) => account.id === id);
  return admin ? { ...admin, role: 'Admin' } : null;
}

export function validateSignIn(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

// Replace this adapter with server authentication when the shared backend is ready.
export function signInDemo(email, password) {
  const admin = demoAdmins.find((account) => account.email === email.trim().toLowerCase());
  if (!admin || password !== DEMO_PASSWORD)
    throw Error('Email or password is incorrect. Use one of the demo accounts below.');
  return demoAdminProfile(admin.id);
}
