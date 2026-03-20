'use client';

import { createContext, useContext, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useSync } from './SyncContext';

const AuditContext = createContext();

export function AuditProvider({ children }) {
  const { user } = useAuth();
  const { isOnline, addToQueue } = useSync();
  const queueRef = useRef([]);

  const log = useCallback(async (action, entityType, entityId, oldValues = null, newValues = null) => {
    const auditEntry = {
      action,
      entityType,
      entityId,
      userId: user?.id,
      timestamp: new Date().toISOString(),
      oldValues,
      newValues,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };

    if (isOnline) {
      try {
        const response = await fetch('/api/audit/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(auditEntry)
        });
        
        if (!response.ok) {
          throw new Error('Failed to log audit');
        }
      } catch (error) {
        console.error('Audit log failed, queueing:', error);
        queueRef.current.push(auditEntry);
        addToQueue('audit', auditEntry);
      }
    } else {
      queueRef.current.push(auditEntry);
      addToQueue('audit', auditEntry);
    }
  }, [user, isOnline, addToQueue]);

  const logCreate = useCallback((entityType, entityId, newValues) => {
    return log('CREATE', entityType, entityId, null, newValues);
  }, [log]);

  const logUpdate = useCallback((entityType, entityId, oldValues, newValues) => {
    return log('UPDATE', entityType, entityId, oldValues, newValues);
  }, [log]);

  const logDelete = useCallback((entityType, entityId, oldValues) => {
    return log('DELETE', entityType, entityId, oldValues, null);
  }, [log]);

  const withAudit = useCallback((entityType, entityId) => {
    return {
      create: (newValues) => logCreate(entityType, entityId, newValues),
      update: (oldValues, newValues) => logUpdate(entityType, entityId, oldValues, newValues),
      delete: (oldValues) => logDelete(entityType, entityId, oldValues)
    };
  }, [logCreate, logUpdate, logDelete]);

  const value = {
    log,
    logCreate,
    logUpdate,
    logDelete,
    withAudit
  };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}

// HOC for adding audit to components
export function withAudit(WrappedComponent, entityType) {
  return function WithAuditComponent(props) {
    const audit = useAudit();
    const entityId = props.id || props.entityId;
    
    const auditProps = {
      ...props,
      audit: entityId ? audit.withAudit(entityType, entityId) : audit
    };
    
    return <WrappedComponent {...auditProps} />;
  };
}
