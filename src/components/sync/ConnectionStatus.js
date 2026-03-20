'use client';

import { useState, useSyncExternalStore } from 'react';
import { useSync } from '@/contexts/SyncContext';

// Simple store for tracking client-side mount
let mounted = false;
const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return mounted;
}

function getServerSnapshot() {
  return false;
}

// Mark as mounted on client
if (typeof window !== 'undefined') {
  mounted = true;
  listeners.forEach(listener => listener());
}

export default function ConnectionStatus() {
  const { isOnline, isSyncing, syncError } = useSync();
  const [showDetails, setShowDetails] = useState(false);
  
  // Use useSyncExternalStore to avoid hydration mismatch
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Don't render status until mounted on client to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg bg-gray-100 text-gray-600"
          type="button"
        >
          <span className="text-lg">⋯</span>
          <span className="text-sm font-medium">Checking...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg ${
          isOnline 
            ? isSyncing 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
        type="button"
      >
        <span className="text-lg">
          {isOnline 
            ? isSyncing 
              ? '🔄' 
              : '✅' 
            : '❌'
          }
        </span>
        <span className="text-sm font-medium">
          {isOnline 
            ? isSyncing 
              ? 'Syncing...' 
              : 'Connected' 
            : 'Offline'
          }
        </span>
      </button>
      
      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl p-4">
          <h4 className="font-medium mb-2">Connection Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Sync:</span>
              <span>{isSyncing ? 'In progress' : 'Idle'}</span>
            </div>
            
            {syncError && (
              <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-xs">
                Error: {syncError}
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="w-full mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              type="button"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
