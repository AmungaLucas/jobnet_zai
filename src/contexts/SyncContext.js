'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { openDB } from 'idb';

const SyncContext = createContext();

let dbPromise;

async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('OfflineSyncDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('syncQueue')) {
          const store = db.createObjectStore('syncQueue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('type', 'type');
          store.createIndex('status', 'status');
          store.createIndex('timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { 
            keyPath: 'key' 
          });
          cacheStore.createIndex('timestamp', 'timestamp');
        }
      }
    });
  }
  return dbPromise;
}

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const syncTimerRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

  const addToQueue = useCallback(async (type, data, options = {}) => {
    try {
      const db = await getDB();
      const item = {
        type,
        data,
        status: 'pending',
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: options.maxRetries || 3,
        priority: options.priority || 0
      };
      
      await db.add('syncQueue', item);
      
      // Try to process if online
      if (isOnline) {
        processQueue();
      }
      
      return item;
    } catch (error) {
      console.error('Failed to add to queue:', error);
    }
  }, [isOnline]);

  const cacheData = useCallback(async (key, data, ttl = 3600000) => {
    try {
      const db = await getDB();
      await db.put('cache', {
        key,
        data,
        timestamp: Date.now(),
        ttl
      });
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }, []);

  const getCachedData = useCallback(async (key) => {
    try {
      const db = await getDB();
      const cached = await db.get('cache', key);
      
      if (!cached) return null;
      
      // Check if expired
      if (Date.now() - cached.timestamp > cached.ttl) {
        await db.delete('cache', key);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }, []);

  const clearExpiredCache = useCallback(async () => {
    try {
      const db = await getDB();
      const tx = db.transaction('cache', 'readwrite');
      const store = tx.objectStore('cache');
      const index = store.index('timestamp');
      
      let cursor = await index.openCursor();
      const now = Date.now();
      
      while (cursor) {
        if (now - cursor.value.timestamp > cursor.value.ttl) {
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }
      
      await tx.done;
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }, []);

  const processQueue = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const db = await getDB();
      const tx = db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      const index = store.index('status');
      
      // Get all pending items, ordered by priority and timestamp
      let pendingItems = await index.getAll('pending');
      pendingItems.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.timestamp - b.timestamp;
      });
      
      for (const item of pendingItems) {
        try {
          // Process based on type
          switch (item.type) {
            case 'audit':
              await fetch('/api/audit/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.data)
              });
              break;
              
            case 'create':
            case 'update':
            case 'delete':
              await fetch(`/api/${item.data.entityType}/${item.data.entityId}`, {
                method: item.type === 'delete' ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.data)
              });
              break;
              
            default:
              console.warn('Unknown sync type:', item.type);
          }
          
          // Remove from queue on success
          await store.delete(item.id);
          
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Update retry count
          item.retryCount++;
          
          if (item.retryCount >= item.maxRetries) {
            item.status = 'failed';
            item.error = error.message;
          }
          
          await store.put(item);
        }
      }
      
      await tx.done;
      
    } catch (error) {
      console.error('Sync process failed:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
      
      // Schedule next sync
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      syncTimerRef.current = setTimeout(processQueue, 30000); // Try again in 30 seconds
    }
  }, [isOnline, isSyncing]);

  // Auto-sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && !isSyncing) {
        processQueue();
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [isOnline, isSyncing, processQueue]);

  // Clear expired cache periodically
  useEffect(() => {
    const interval = setInterval(clearExpiredCache, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [clearExpiredCache]);

  const value = {
    isOnline,
    isSyncing,
    syncError,
    addToQueue,
    cacheData,
    getCachedData,
    processQueue
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
