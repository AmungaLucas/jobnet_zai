'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DeviceManager() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/auth/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      } else {
        setError('Failed to load sessions');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutDevice = async (sessionId) => {
    try {
      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      } else {
        setError('Failed to logout device');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!confirm('Are you sure you want to logout from all other devices?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSessions(sessions.filter(s => s.isCurrent));
      } else {
        setError('Failed to logout devices');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return '📱';
      case 'tablet':
        return '📟';
      case 'desktop':
        return '💻';
      default:
        return '🌐';
    }
  };

  if (loading) return <div className="p-4 text-center">Loading devices...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Devices</h2>
        {sessions.length > 1 && (
          <button
            onClick={handleLogoutAllDevices}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout All Other Devices
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`p-4 border rounded-lg ${
              session.isCurrent ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getDeviceIcon(session.device_type)}</span>
                <div>
                  <div className="font-medium">
                    {session.device_name}
                    {session.isCurrent && (
                      <span className="ml-2 text-sm text-green-600">(Current)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    IP: {session.ip_address}
                  </div>
                  <div className="text-sm text-gray-500">
                    Last active: {new Date(session.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires: {new Date(session.expires_at).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {!session.isCurrent && (
                <button
                  onClick={() => handleLogoutDevice(session.id)}
                  className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        ))}
        
        {sessions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No active sessions found
          </div>
        )}
      </div>
    </div>
  );
}
