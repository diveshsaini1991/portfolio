"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check for stored theme or system preference
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = stored || (systemPrefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    
    // Apply theme to document
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        aria-label="Toggle Theme"
        className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 transition-colors"
        disabled
      >
        <div className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      </button>
    );
  }

  return (
    <button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className="rounded-lg p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all shadow-sm hover:shadow-md"
    >
      {theme === "dark" ? (
        <SunIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
      ) : (
        <MoonIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
      )}
    </button>
  );
}
