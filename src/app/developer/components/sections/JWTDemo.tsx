"use client";

import { useState, useEffect } from 'react';
import { getSessionToken, getSessionPayload, destroySession } from '@/lib/session-manager';
import { formatJWTSections } from '@/lib/jwt-utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { JWTPayload } from '@/types';

export default function JWTDemo() {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [isDecoded, setIsDecoded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedText, setCopiedText] = useState<string>('');
  const [payload, setPayload] = useState<JWTPayload | null>(null);
  const [sections, setSections] = useState<{
    header: string;
    payload: string;
    signature: string;
    raw: string;
  } | null>(null);

  useEffect(() => {
    const sessionToken = getSessionToken();
    if (sessionToken) {
      setToken(sessionToken);
      const sessionPayload = getSessionPayload();
      setPayload(sessionPayload);
    }
  }, []);

  const handleDecode = () => {
    if (token) {
      const formatted = formatJWTSections(token);
      setSections(formatted);
      setIsDecoded(true);
    }
  };

  const handleEncode = () => {
    setIsDecoded(false);
  };

  const handleDeleteToken = () => {
    setIsDeleting(true);
    setTimeout(() => {
      destroySession();
      router.push('/');
    }, 2000); // Show deletion animation for 2 seconds
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText('');
    }, 2000); // Clear after 2 seconds
  };

  const getExpiryTime = () => {
    if (!payload) return 'Unknown';
    const expiryTimestamp = payload.timestamp + (24 * 60 * 60 * 1000);
    const expiryDate = new Date(expiryTimestamp);
    return expiryDate.toLocaleString();
  };

  const getTokenAge = () => {
    if (!payload) return 'Unknown';
    const ageMs = Date.now() - payload.timestamp;
    const hours = Math.floor(ageMs / (1000 * 60 * 60));
    const minutes = Math.floor((ageMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m ago`;
  };

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
              className="bg-gray-800 border-2 border-red-500 rounded-lg p-4 sm:p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"
                />
                <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Deleting JWT Token</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">Clearing JWT token from cookies...</p>
                <div className="bg-gray-900 rounded p-2 sm:p-3 font-mono text-[10px] sm:text-xs text-left">
                  <div className="text-green-400">$ document.cookie.delete(&apos;portfolio_session&apos;)</div>
                  <div className="text-gray-500 mt-1">→ Removing JWT token...</div>
                  <div className="text-gray-500">→ Clearing session data...</div>
                  <div className="text-green-400 mt-1">✓ Session destroyed</div>
                  <div className="text-yellow-400 mt-2">Redirecting to home...</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full h-full flex flex-col bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
          <div className="text-white font-bold text-base sm:text-lg">🔐</div>
          <div className="text-white font-semibold text-sm sm:text-base">JWT Authentication Demo</div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-purple-100 text-[10px] sm:text-xs">HS256 Algorithm</span>
          </div>
        </div>

      {/* Info Section */}
      <div className="bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-300 flex-wrap">
          <span className="text-gray-400 text-[10px] sm:text-sm">Session:</span>
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-900 text-green-400 rounded text-[10px] sm:text-xs font-mono">
            Active
          </span>
          {payload && (
            <>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="text-gray-400 text-[10px] sm:text-xs">Created: {getTokenAge()}</span>
              <span className="text-gray-600 hidden md:inline">|</span>
              <span className="text-gray-400 text-[10px] sm:text-xs hidden md:inline">Expires: {getExpiryTime()}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Copy Confirmation Toast */}
        <AnimatePresence>
          {copiedText && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-40 flex items-center gap-2"
            >
              <span className="text-lg">✓</span>
              <span className="font-medium">{copiedText} copied!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Token Display */}
        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-300">Encoded JWT Token</h3>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => copyToClipboard(token, 'Token')}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs transition-colors ${
                  copiedText === 'Token' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {copiedText === 'Token' ? '✓' : '📋'} <span className="hidden sm:inline">{copiedText === 'Token' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDeleteToken}
                className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] sm:text-xs font-medium transition-colors flex items-center gap-1"
                title="Delete JWT token and logout"
              >
                🗑️ <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-800 rounded p-2 sm:p-4 font-mono text-[10px] sm:text-xs break-all">
            <div className="flex flex-col gap-2">
              {/* Header part - red */}
              <div className="flex gap-1 flex-wrap">
                <span className="text-red-400">{token.split('.')[0]}</span>
                <span className="text-gray-500">.</span>
              </div>
              {/* Payload part - purple */}
              <div className="flex gap-1 flex-wrap">
                <span className="text-purple-400">{token.split('.')[1]}</span>
                <span className="text-gray-500">.</span>
              </div>
              {/* Signature part - cyan */}
              <div className="flex gap-1 flex-wrap">
                <span className="text-cyan-400">{token.split('.')[2]}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex gap-2 sm:gap-4 text-[10px] sm:text-xs flex-wrap">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded"></div>
              <span className="text-gray-400">Header</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded"></div>
              <span className="text-gray-400">Payload</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded"></div>
              <span className="text-gray-400">Signature</span>
            </div>
          </div>
        </div>

        {/* Decode/Encode Button */}
        <div className="flex justify-center">
          <button
            onClick={isDecoded ? handleEncode : handleDecode}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm sm:text-base transition-all shadow-lg"
          >
            {isDecoded ? '🔒 Encode Token' : '🔓 Decode Token'}
          </button>
        </div>

        {/* Decoded Sections */}
        {isDecoded && sections && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Header Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-semibold text-red-400">📋 Header</h3>
                <button
                  onClick={() => copyToClipboard(sections.header, 'Header')}
                  className={`px-2 py-1 rounded text-[10px] sm:text-xs transition-colors ${
                    copiedText === 'Header' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {copiedText === 'Header' ? '✓' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-800 rounded p-2 sm:p-4 border-l-2 sm:border-l-4 border-red-400">
                <pre className="text-gray-300 text-[10px] sm:text-xs font-mono overflow-x-auto">
                  {sections.header}
                </pre>
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-500">
                Specifies the algorithm (HS256) and token type (JWT)
              </p>
            </div>

            {/* Payload Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-400">📦 Payload</h3>
                <button
                  onClick={() => copyToClipboard(sections.payload, 'Payload')}
                  className={`px-2 py-1 rounded text-[10px] sm:text-xs transition-colors ${
                    copiedText === 'Payload' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {copiedText === 'Payload' ? '✓' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-800 rounded p-2 sm:p-4 border-l-2 sm:border-l-4 border-purple-400">
                <pre className="text-gray-300 text-[10px] sm:text-xs font-mono overflow-x-auto">
                  {sections.payload}
                </pre>
              </div>
              <div className="mt-2 text-[10px] sm:text-xs text-gray-500 space-y-1">
                <p>• <strong>ip:</strong> Your public IP address</p>
                <p>• <strong>timestamp:</strong> When the session was created</p>
                <p>• <strong>userAgent:</strong> Your browser information</p>
                <p>• <strong>sessionId:</strong> Unique session identifier</p>
              </div>
            </div>

            {/* Signature Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-semibold text-cyan-400">🔏 Signature</h3>
                <button
                  onClick={() => copyToClipboard(sections.signature, 'Signature')}
                  className={`px-2 py-1 rounded text-[10px] sm:text-xs transition-colors ${
                    copiedText === 'Signature' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {copiedText === 'Signature' ? '✓' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-800 rounded p-2 sm:p-4 border-l-2 sm:border-l-4 border-cyan-400">
                <pre className="text-cyan-300 text-[10px] sm:text-xs font-mono break-all">
                  {sections.signature}
                </pre>
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-500">
                HMAC SHA-256 signature ensuring token integrity and authenticity
              </p>
            </div>

            {/* How it Works */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-purple-300 mb-2">💡 How JWT Works</h3>
              <ul className="text-[10px] sm:text-xs text-gray-400 space-y-1.5 sm:space-y-2">
                <li>• JWT tokens are <strong>stateless</strong> - no server-side session storage needed</li>
                <li>• The signature prevents tampering - any modification invalidates the token</li>
                <li>• Base64 encoding makes it URL-safe for transmission</li>
                <li>• This portfolio uses JWT to persist your session across page refreshes</li>
                <li className="hidden sm:list-item">• In production, the secret key would be stored securely on the server</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}

