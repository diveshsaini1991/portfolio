"use client";

import { useState, useEffect } from 'react';
import { fetchUserIP, getSessionDuration } from '@/lib/session-utils';
import { destroySession, getSessionPayload } from '@/lib/session-manager';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioHeader() {
  const router = useRouter();
  const [userIP, setUserIP] = useState<string>('Loading...');
  const [sessionTime, setSessionTime] = useState<string>('00:00:00');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    setIsDeleting(true);
    setTimeout(() => {
      destroySession();
      router.push('/');
    }, 2000); // Show deletion animation for 2 seconds
  };

  useEffect(() => {
    // Fetch user IP
    fetchUserIP().then(setUserIP);

    // Update session time every second
    const timer = setInterval(() => {
      const payload = getSessionPayload();
      if (payload?.timestamp) {
        setSessionTime(getSessionDuration(payload.timestamp));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {/* Deletion Modal */}
      <AnimatePresence>
        {isDeleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 border-2 border-red-500 rounded-lg p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-red-400 mb-2">Deleting Session</h3>
                <p className="text-gray-300 mb-4">Clearing JWT token from cookies...</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-left">
                  <div className="text-green-400">$ document.cookie.delete(&apos;portfolio_session&apos;)</div>
                  <div className="text-gray-500 mt-1">→ Removing JWT token...</div>
                  <div className="text-gray-500">→ Clearing session data...</div>
                  <div className="text-green-400 mt-1">✓ Session destroyed</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-3 sm:px-4 md:px-6 py-2 sm:py-3"
      >
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3 md:gap-4">
        {/* Left: Title */}
        <div className="flex-shrink-0">
          <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Divesh Saini's Portfolio
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 hidden sm:block">Software Development Engineer • Backend Specialist</p>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 text-xs sm:text-sm flex-wrap">
          {/* IP Address */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700/50 rounded-lg border border-gray-600">
            <span className="text-gray-400 text-sm sm:text-base">🌐</span>
            <span className="text-gray-500 text-[10px] sm:text-xs hidden sm:inline">IP:</span>
            <span className="text-gray-300 font-mono text-[10px] sm:text-xs">{userIP}</span>
          </div>

          {/* Session Time */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700/50 rounded-lg border border-gray-600">
            <span className="text-gray-400 text-sm sm:text-base">🕒</span>
            <span className="text-gray-500 text-[10px] sm:text-xs hidden md:inline">Session:</span>
            <span className="text-gray-300 font-mono tabular-nums text-[10px] sm:text-xs">{sessionTime}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-lg transition-colors text-[10px] sm:text-xs font-medium"
            title="Clear session and return to terminal"
          >
            <span className="hidden sm:inline">🚪 Logout</span>
            <span className="sm:hidden">🚪</span>
          </button>
        </div>
      </div>
    </motion.div>
    </>
  );
}

