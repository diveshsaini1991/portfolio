/**
 * Session Management using JWT and Cookies
 */

import { JWTPayload } from '@/types';
import { generateJWT, verifyJWT, decodeJWT } from './jwt-utils';
import { generateSessionId, fetchUserIP, getUserAgent } from './session-utils';

const SESSION_COOKIE_NAME = 'portfolio_session';

/**
 * Get cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

/**
 * Set cookie value
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Create a new session with JWT
 */
export async function createSession(ip?: string): Promise<string> {
  const userIP = ip || await fetchUserIP();
  
  const payload: JWTPayload = {
    ip: userIP,
    timestamp: Date.now(),
    userAgent: getUserAgent(),
    sessionId: generateSessionId(),
  };

  const token = await generateJWT(payload);
  setCookie(SESSION_COOKIE_NAME, token, 7); // 7 days expiry
  
  return token;
}

/**
 * Get existing session token
 */
export function getSessionToken(): string | null {
  return getCookie(SESSION_COOKIE_NAME);
}

/**
 * Validate existing session
 */
export async function validateSession(): Promise<{ valid: boolean; payload?: JWTPayload }> {
  const token = getSessionToken();
  
  if (!token) {
    return { valid: false };
  }

  const isValid = await verifyJWT(token);
  
  if (!isValid) {
    deleteCookie(SESSION_COOKIE_NAME);
    return { valid: false };
  }

  const decoded = decodeJWT(token);
  return {
    valid: true,
    payload: decoded?.payload,
  };
}

/**
 * Destroy session
 */
export function destroySession(): void {
  deleteCookie(SESSION_COOKIE_NAME);
}

/**
 * Get session payload without validation (for display purposes)
 */
export function getSessionPayload(): JWTPayload | null {
  const token = getSessionToken();
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.payload || null;
}

