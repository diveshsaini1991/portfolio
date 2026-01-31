"use client";

export interface VisitorStats {
  liveViewers: number;
  totalVisits: number;
  uniqueVisitors: number;
}

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Get or create session ID from sessionStorage
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
}

// Ensure at least 1 viewer (current user)
function ensureMinimumViewers(stats: VisitorStats): VisitorStats {
  return {
    ...stats,
    liveViewers: Math.max(1, stats.liveViewers), // Always at least 1 (you!)
  };
}

// Track visitor and start session
export async function startSessionTracking(
  onStatsUpdate: (stats: VisitorStats) => void
): Promise<() => void> {
  if (typeof window === 'undefined') return () => {};

  const sessionId = getSessionId();
  let intervalId: NodeJS.Timeout | null = null;
  let heartbeatId: NodeJS.Timeout | null = null;
  let isActive = true;

  // Immediately show at least 1 viewer (the current user)
  onStatsUpdate({ liveViewers: 1, totalVisits: 0, uniqueVisitors: 0 });

  // Initial tracking
  async function trackVisit(page?: string) {
    if (!isActive) return;
    
    try {
      const response = await fetch('/api/visitors/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          page: page || window.location.pathname 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.stats) {
          onStatsUpdate(ensureMinimumViewers(data.stats));
        }
      }
    } catch (error) {
      console.error('Error tracking visit:', error);
      // On error, still show at least 1 viewer
      onStatsUpdate({ liveViewers: 1, totalVisits: 0, uniqueVisitors: 0 });
    }
  }

  // Fetch stats without tracking (for polling)
  async function fetchStats() {
    if (!isActive) return;
    
    try {
      const response = await fetch('/api/visitors/stats');
      if (response.ok) {
        const stats = await response.json();
        onStatsUpdate(ensureMinimumViewers(stats));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  // Mark session as inactive on page unload
  function handleUnload() {
    // Use sendBeacon for reliable delivery on page close
    const url = `/api/visitors/track?sessionId=${encodeURIComponent(sessionId)}`;
    navigator.sendBeacon(url, JSON.stringify({ action: 'deactivate' }));
  }

  // Track visibility changes
  function handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, mark as inactive immediately
      try {
        // Use sendBeacon for reliability when tab is hidden
        const url = `/api/visitors/track?sessionId=${encodeURIComponent(sessionId)}`;
        navigator.sendBeacon(url, JSON.stringify({ action: 'deactivate' }));
      } catch (error) {
        console.error('Error marking session inactive:', error);
      }
    } else {
      // Page is visible again, re-track
      trackVisit();
    }
  }

  // Initial track
  await trackVisit();

  // Poll for stats every 5 seconds
  intervalId = setInterval(fetchStats, 5000);

  // Keep session alive every 20 seconds (must be less than 1 minute stale timeout)
  heartbeatId = setInterval(() => trackVisit(), 20000);

  // Listen for page unload
  window.addEventListener('beforeunload', handleUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    isActive = false;
    if (intervalId) clearInterval(intervalId);
    if (heartbeatId) clearInterval(heartbeatId);
    window.removeEventListener('beforeunload', handleUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

