"use client";

import SectionSelector from "@/components/SectionSelector";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative min-h-[100vh] flex flex-col">
      {/* Theme Toggle positioned absolutely at the top right */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Main content centered vertically and horizontally */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-20">
        <div className="text-center space-y-1 mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
            Welcome to My Portfolio
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Are you a developer or from a non‑tech background?
          </p>
        </div>
        <SectionSelector />
      </main>
    </div>
  );
}
