import { query, transaction } from './db';
import { generateId, generateToken } from './crypto';
import { getClientInfo } from './device-detection';
import { serialize } from 'cookie';

export async function createSession(userId, request) {
  const sessionId = generateId();
  const token = generateToken();
  const clientInfo = getClientInfo(request);
  
  const expiresAt = new Date(Date.now() + parseInt(process.env.SESSION_DURATION || '604800000'));
  
  await query(
    `INSERT INTO user_sessions (id, user_id, token, ip_address, user_agent, device_name, device_type, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      userId,
      token,
      clientInfo.ipAddress,
      clientInfo.userAgent,
      clientInfo.deviceName,
      clientInfo.deviceType,
      expiresAt
    ]
  );
  
  return {
    sessionId,
    token,
    expiresAt
  };
}

export async function validateSession(token) {
  if (!token) return null;
  
  const sessions = await query(
    `SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name, u.role, u.organization_id
     FROM user_sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > NOW()`,
    [token]
  );
  
  if (sessions.length === 0) {
    return null;
  }
  
  const session = sessions[0];
  
  return {
    id: session.id,
    userId: session.user_id,
    email: session.email,
    firstName: session.first_name,
    lastName: session.last_name,
    role: session.role,
    organizationId: session.organization_id,
    deviceName: session.device_name,
    deviceType: session.device_type,
    expiresAt: session.expires_at
  };
}

export async function deleteSession(token) {
  if (!token) return;
  await query(`DELETE FROM user_sessions WHERE token = ?`, [token]);
}

export async function deleteAllUserSessions(userId, currentSessionId = null) {
  if (currentSessionId) {
    await query(`DELETE FROM user_sessions WHERE user_id = ? AND id != ?`, [userId, currentSessionId]);
  } else {
    await query(`DELETE FROM user_sessions WHERE user_id = ?`, [userId]);
  }
}

export async function getUserSessions(userId) {
  return await query(
    `SELECT id, device_name, device_type, ip_address, created_at, expires_at
     FROM user_sessions
     WHERE user_id = ? AND expires_at > NOW()
     ORDER BY created_at DESC`,
    [userId]
  );
}

export function setSessionCookie(token, expiresAt) {
  return serialize('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/'
  });
}

export function clearSessionCookie() {
  return serialize('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/'
  });
}
