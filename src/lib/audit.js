import { query } from './db';
import { generateId } from './crypto';

class AuditLogger {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async log(action, entityType, entityId, userId = null, sessionId = null, oldValues = null, newValues = null, request = null) {
    const auditEntry = {
      id: generateId(),
      user_id: userId,
      session_id: sessionId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues ? JSON.stringify(oldValues) : null,
      new_values: newValues ? JSON.stringify(newValues) : null,
      ip_address: request?.headers?.get?.('x-forwarded-for') || request?.headers?.get?.('x-forwarded-for') || null,
      user_agent: request?.headers?.get?.('user-agent') || null,
      created_at: new Date()
    };

    // Add to queue
    this.queue.push(auditEntry);
    
    // Process queue if not already processing
    if (!this.processing) {
      this.processQueue();
    }

    return auditEntry.id;
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const batch = this.queue.splice(0, 50); // Process in batches of 50

    try {
      for (const entry of batch) {
        await query(
          `INSERT INTO audit_logs 
           (id, user_id, session_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            entry.id,
            entry.user_id,
            entry.session_id,
            entry.action,
            entry.entity_type,
            entry.entity_id,
            entry.old_values,
            entry.new_values,
            entry.ip_address,
            entry.user_agent,
            entry.created_at
          ]
        );
      }
    } catch (error) {
      console.error('Failed to process audit batch:', error);
      // Re-queue failed entries
      this.queue.unshift(...batch);
    } finally {
      // Process next batch if any
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 1000);
      } else {
        this.processing = false;
      }
    }
  }

  // Helper methods for common operations
  async logCreate(entityType, entityId, newValues, userId, sessionId, request) {
    return this.log('CREATE', entityType, entityId, userId, sessionId, null, newValues, request);
  }

  async logUpdate(entityType, entityId, oldValues, newValues, userId, sessionId, request) {
    // Calculate diff for better tracking
    const changes = {};
    for (const key in newValues) {
      if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
        changes[key] = {
          from: oldValues[key],
          to: newValues[key]
        };
      }
    }
    
    return this.log('UPDATE', entityType, entityId, userId, sessionId, oldValues, newValues, request);
  }

  async logDelete(entityType, entityId, oldValues, userId, sessionId, request) {
    return this.log('DELETE', entityType, entityId, userId, sessionId, oldValues, null, request);
  }

  async logLogin(userId, sessionId, request, success = true) {
    return this.log(
      success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      'USER',
      userId,
      userId,
      sessionId,
      null,
      { success },
      request
    );
  }

  async logLogout(userId, sessionId, request) {
    return this.log('LOGOUT', 'USER', userId, userId, sessionId, null, null, request);
  }

  async logError(error, context = {}) {
    return this.log(
      'ERROR',
      'SYSTEM',
      null,
      context.userId,
      context.sessionId,
      null,
      {
        message: error.message,
        stack: error.stack,
        context
      },
      context.request
    );
  }
}

// Create singleton instance
const auditLogger = new AuditLogger();

// Middleware to add audit context to request
export function withAudit(handler) {
  return async (req, res) => {
    req.audit = auditLogger;
    return handler(req, res);
  };
}

// Export the singleton instance
export default auditLogger;
