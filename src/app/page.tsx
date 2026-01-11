"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionSelector from "@/components/SectionSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { startSessionTracking, VisitorStats } from "@/lib/visitor-tracker";

export default function Home() {
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ liveViewers: 0, totalVisits: 0, uniqueVisitors: 0 });

  useEffect(() => {
    // Generate particle positions only on client side to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setParticles(generatedParticles);

    // Start visitor tracking
    let cleanupTracking: (() => void) | null = null;
    startSessionTracking((stats) => {
      setVisitorStats(stats);
    }).then((cleanup) => {
      cleanupTracking = cleanup;
    });

    return () => {
      if (cleanupTracking) cleanupTracking();
    };
  }, []);

  return (
    <div className="relative min-h-[100vh] flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-800/20 dark:bg-white/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top Bar - Live Viewers & Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-3">
        {/* Live Viewers Badge */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{visitorStats.liveViewers} live</span>
        </motion.div>
        <ThemeToggle />
      </div>

      {/* Main content centered vertically and horizontally */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 relative z-0">
        {/* Personalized Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-blue-400 bg-clip-text text-transparent px-2 leading-tight">
              Hi, I&apos;m Divesh Saini
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 px-4"
          >
            Welcome to my portfolio
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-2"
          >
            <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 px-4">
              Choose your experience
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs sm:text-sm text-gray-400 dark:text-gray-500">
              <span>👨‍💻 Developer</span>
              <span>•</span>
              <span>🧠 Non-Tech / HR</span>
            </div>
          </motion.div>
        </motion.div>

        <SectionSelector />

        {/* Bottom signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bottom-6 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-600 py-10"
        >
          Software Development Engineer • Backend Specialist
        </motion.div>
      </main>
    </div>
  );
}
