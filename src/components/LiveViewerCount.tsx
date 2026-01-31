"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startSessionTracking, VisitorStats } from '@/lib/visitor-tracker';

interface LiveViewerCountProps {
  showTotal?: boolean;
  showUnique?: boolean;
  compact?: boolean;
  className?: string;
}

export default function LiveViewerCount({ 
  showTotal = true, 
  showUnique = false,
  compact = false,
  className = '' 
}: LiveViewerCountProps) {
  // Start with 1 viewer (the current user) to avoid showing 0
  const [stats, setStats] = useState<VisitorStats>({
    liveViewers: 1,
    totalVisits: 0,
    uniqueVisitors: 0,
  });
  const [isLoading, setIsLoading] = useState(false); // Don't show loading since we start with 1
  const [isConnected, setIsConnected] = useState(false);
  
  // Prevent double initialization in React Strict Mode
  const initRef = useRef(false);

  useEffect(() => {
    // Skip if already initialized (React Strict Mode runs effects twice)
    if (initRef.current) return;
    initRef.current = true;
    
    let cleanup: (() => void) | null = null;
    let isMounted = true;

    const init = async () => {
      cleanup = await startSessionTracking((newStats) => {
        if (isMounted) {
          // Ensure at least 1 viewer (the current user)
          setStats({
            ...newStats,
            liveViewers: Math.max(1, newStats.liveViewers),
          });
          setIsLoading(false);
          setIsConnected(true);
        }
      });
    };

    init();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isLoading ? '...' : stats.liveViewers} live
        </span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm ${className}`}
    >
      {/* Live Viewers */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Live Viewers</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={stats.liveViewers}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white"
            >
              {isLoading ? '...' : stats.liveViewers}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Divider */}
      {(showTotal || showUnique) && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 grid grid-cols-2 gap-4">
          {showTotal && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Visits</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {isLoading ? '...' : stats.totalVisits.toLocaleString()}
              </div>
            </div>
          )}
          {showUnique && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Unique Visitors</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {isLoading ? '...' : stats.uniqueVisitors.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connection Status */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
        <span className={`flex items-center gap-1 ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
        <span className="text-gray-400 dark:text-gray-500">
          Live updates
        </span>
      </div>
    </motion.div>
  );
}

