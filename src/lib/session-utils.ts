/**
 * Session and user tracking utilities
 */

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function getSessionDuration(startTime: number): string {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function fetchUserIP(): Promise<string> {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (!res.ok) throw new Error('IP fetch failed');
    const data = await res.json();
    return data.ip || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export function getUserAgent(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  return navigator.userAgent;
}

