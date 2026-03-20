/**
 * Input sanitization utilities for XSS prevention and data validation
 */

// HTML entities to escape
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

// Dangerous patterns to detect
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick=, onerror=
  /data:\s*text\/html/gi,
  /vbscript:/gi,
  /expression\s*\(/gi
];

/**
 * Escape HTML special characters
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"'`=/]/g, char => HTML_ENTITIES[char]);
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Check if string contains potentially dangerous content
 */
export function containsDangerousContent(str) {
  if (typeof str !== 'string') return false;
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(str));
}

/**
 * Sanitize string for safe storage/display
 */
export function sanitizeString(str, options = {}) {
  if (typeof str !== 'string') return str;
  
  const { 
    escape = true,      // Escape HTML entities
    strip = false,      // Strip HTML tags
    maxLength = null    // Maximum length
  } = options;

  let result = str;

  // Strip HTML if requested
  if (strip) {
    result = stripHtml(result);
  }

  // Remove null bytes and control characters
  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Escape HTML if requested
  if (escape) {
    result = escapeHtml(result);
  }

  // Enforce max length
  if (maxLength && result.length > maxLength) {
    result = result.substring(0, maxLength);
  }

  return result;
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email) {
  if (typeof email !== 'string') {
    return { valid: false, sanitized: null, error: 'Email must be a string' };
  }

  const sanitized = email.toLowerCase().trim();
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized: null, error: 'Invalid email format' };
  }

  if (sanitized.length > 255) {
    return { valid: false, sanitized: null, error: 'Email too long' };
  }

  return { valid: true, sanitized, error: null };
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  const errors = [];
  let strength = 0;

  if (typeof password !== 'string') {
    return { valid: false, strength: 0, errors: ['Password must be a string'] };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else {
    strength += 1;
  }

  if (password.length >= 12) {
    strength += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  } else {
    strength += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  } else {
    strength += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain numbers');
  } else {
    strength += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain special characters');
  } else {
    strength += 1;
  }

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123'];
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    errors.push('Password contains common patterns');
    strength = Math.max(0, strength - 2);
  }

  return {
    valid: errors.length === 0,
    strength: Math.min(5, strength),
    errors
  };
}
