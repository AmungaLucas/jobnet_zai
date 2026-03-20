import crypto from 'crypto';

export function generateId(length = 32) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

export function generateShortId(length = 16) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Note: For production, use bcrypt instead of sha256
// This is a simplified version for demonstration
