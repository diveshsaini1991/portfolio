"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 Number */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Oops! The page you&apos;re looking for seems to have wandered off into the digital void.
            </p>
          </motion.div>

          {/* Terminal-style error */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-8 max-w-md mx-auto shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-mono">error.log</span>
            </div>
            <div className="font-mono text-xs sm:text-sm text-left space-y-1">
              <div className="text-red-500 dark:text-red-400">
                Error: ROUTE_NOT_FOUND
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                at Router.handleRequest()
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Status: <span className="text-amber-600 dark:text-yellow-400">404</span>
              </div>
              <div className="text-green-600 dark:text-green-400 mt-2">
                $ suggestion: navigate to home
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              🏠 Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all hover:scale-105"
            >
              ← Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-500">
        <span>Divesh Saini&apos;s Portfolio</span>
      </div>
    </div>
  );
}
