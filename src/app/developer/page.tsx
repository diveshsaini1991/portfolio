"use client";

import { useState, useEffect } from "react";
import Terminal from "./components/Terminal";
import MainPortfolio from "./components/MainPortfolio";
import { validateSession, createSession } from "@/lib/session-manager";

export default function DeveloperPage() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check for existing valid session on mount
    async function checkSession() {
      const { valid, payload } = await validateSession();
      
      if (valid) {
        // Valid session exists, skip terminal
        setShowPortfolio(true);
      }
      
      setIsCheckingSession(false);
    }

    checkSession();
  }, []);

  const handleTerminalContinue = async () => {
    // Create new session when user authenticates via terminal
    await createSession();
    setShowPortfolio(true);
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">Checking session...</p>
        </div>
      </div>
    );
  }

  return showPortfolio ? (
    <MainPortfolio />
  ) : (
    <Terminal onContinue={handleTerminalContinue} />
  );
}
