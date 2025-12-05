/**
 * JWT Utilities for Portfolio Session Management
 * This is a client-side JWT implementation for demonstration purposes
 */

import { JWTPayload } from '@/types';

// Secret key (in production, this would be server-side only)
const SECRET_KEY = 'portfolio_demo_secret_key_2024';

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

/**
 * Generate HMAC SHA-256 signature (simplified for demo)
 */
async function generateSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(SECRET_KEY);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureString = String.fromCharCode(...signatureArray);
  
  return base64UrlEncode(signatureString);
}

/**
 * Generate a JWT token with user session data
 */
export async function generateJWT(payload: JWTPayload): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const signature = await generateSignature(`${encodedHeader}.${encodedPayload}`);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Decode JWT token (without verification for demo)
 */
export function decodeJWT(token: string): { header: any; payload: JWTPayload; signature: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    return { header, payload, signature };
  } catch (error) {
    return null;
  }
}

/**
 * Verify if JWT is valid and not expired
 */
export async function verifyJWT(token: string): Promise<boolean> {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return false;

    // Check if token is expired (24 hour expiry)
    const expiryTime = decoded.payload.timestamp + (24 * 60 * 60 * 1000);
    if (Date.now() > expiryTime) return false;

    // Verify signature
    const parts = token.split('.');
    const expectedSignature = await generateSignature(`${parts[0]}.${parts[1]}`);
    
    return parts[2] === expectedSignature;
  } catch (error) {
    return false;
  }
}

/**
 * Pretty print JWT sections
 */
export function formatJWTSections(token: string): {
  header: string;
  payload: string;
  signature: string;
  raw: string;
} {
  const parts = token.split('.');
  const decoded = decodeJWT(token);

  return {
    header: decoded ? JSON.stringify(decoded.header, null, 2) : 'Invalid',
    payload: decoded ? JSON.stringify(decoded.payload, null, 2) : 'Invalid',
    signature: parts[2] || 'Invalid',
    raw: token,
  };
}

