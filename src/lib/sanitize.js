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
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"'`=/]/g, char => HTML_ENTITIES[char]);
}

/**
 * Remove HTML tags from string
 * @param {string} str - String to strip
 * @returns {string} Stripped string
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Check if string contains potentially dangerous content
 * @param {string} str - String to check
 * @returns {boolean} True if dangerous content detected
 */
export function containsDangerousContent(str) {
  if (typeof str !== 'string') return false;
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(str));
}

/**
 * Sanitize string for safe storage/display
 * Removes dangerous content and escapes HTML
 * @param {string} str - String to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized string
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
 * Sanitize object recursively
 * @param {object} obj - Object to sanitize
 * @param {object} options - Sanitization options
 * @returns {object} Sanitized object
 */
export function sanitizeObject(obj, options = {}) {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj, options);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, options));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize key
      const sanitizedKey = sanitizeString(key, { escape: true });
      // Sanitize value
      sanitized[sanitizedKey] = sanitizeObject(value, options);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Validate and sanitize email
 * @param {string} email - Email to validate
 * @returns {object} { valid, sanitized, error }
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
 * @param {string} password - Password to validate
 * @returns {object} { valid, strength, errors }
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

/**
 * Validate MongoDB-style ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean}
 */
export function isValidId(id) {
  if (typeof id !== 'string') return false;
  // Check for hex string (our ID format)
  return /^[a-f0-9]{24,32}$/i.test(id);
}

/**
 * Validate UUID
 * @param {string} uuid - UUID to validate
 * @returns {boolean}
 */
export function isValidUuid(uuid) {
  if (typeof uuid !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

/**
 * Trim and sanitize input fields
 * @param {object} data - Data object to trim
 * @param {string[]} fields - Fields to trim
 * @returns {object}
 */
export function trimFields(data, fields = []) {
  const result = { ...data };
  
  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = result[field].trim();
    }
  }
  
  return result;
}

/**
 * Remove null/undefined values from object
 * @param {object} obj - Object to clean
 * @returns {object}
 */
export function removeNulls(obj) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Request body sanitizer middleware
 */
export function sanitizeBody(options = {}) {
  return (handler) => {
    return async (request, context) => {
      try {
        // Clone request to read body
        const clonedRequest = request.clone();
        const body = await clonedRequest.json();
        
        // Sanitize the body
        const sanitizedBody = sanitizeObject(body, options);
        
        // Attach sanitized body to request
        request.sanitizedBody = sanitizedBody;
        
        return handler(request, context);
      } catch (error) {
        // If no body or invalid JSON, continue
        return handler(request, context);
      }
    };
  };
}
