"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TiltedCard from "@/components/TiltedCard";
import LetterGlitch from "@/components/LetterGlitch";
import Orb from "@/components/Orb";

export default function SectionSelector() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-20 w-full max-w-5xl px-4"
    >
      {/* 👨‍💻 Developer Card */}
      <TiltedCard
        backgroundComponent={
          isDark ? (
            <LetterGlitch
              glitchColors={["#8D53FF", "#7581FF", "#53A1FF"]}
              glitchSpeed={50}
              centerVignette={true}
              outerVignette={false}
              smooth={true}
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 relative overflow-hidden">
              {/* Animated gradient overlay for light mode */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]" />
              {/* Floating shapes */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/20 rounded-full blur-xl"
                animate={{ 
                  x: [0, 30, 0], 
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg"
                animate={{ 
                  x: [0, -20, 0], 
                  y: [0, 30, 0],
                  scale: [1, 0.8, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Code-like pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 text-white font-mono text-xs">{'{ }'}</div>
                <div className="absolute top-12 left-8 text-white font-mono text-xs">{'<>'}</div>
                <div className="absolute bottom-8 right-4 text-white font-mono text-xs">{'( )'}</div>
                <div className="absolute bottom-16 right-12 text-white font-mono text-xs">{'[ ]'}</div>
              </div>
            </div>
          )
        }
        captionText="👨‍💻 Developer"
        containerHeight="300px"
        containerWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.1}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="tilted-card-demo-text text-white text-lg sm:text-xl font-bold drop-shadow-lg">
            Developer
          </p>
        }
        onClick={() => router.push("/developer")}
        className="cursor-pointer"
      />

      {/* 🧠 Non-Tech / HR Card */}
      <TiltedCard
        backgroundComponent={
          isDark ? (
            <Orb
              hoverIntensity={0}
              rotateOnHover={true}
              hue={0}
              forceHoverState={true}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400 relative overflow-hidden">
              {/* Animated gradient overlay for light mode */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
              {/* Floating orbs */}
              <motion.div
                className="absolute top-1/3 left-1/3 w-24 h-24 bg-white/20 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Soft circles */}
              <div className="absolute top-8 right-8 w-4 h-4 bg-white/30 rounded-full" />
              <div className="absolute bottom-12 left-8 w-3 h-3 bg-white/25 rounded-full" />
              <div className="absolute top-1/2 right-12 w-2 h-2 bg-white/20 rounded-full" />
            </div>
          )
        }
        captionText="🧠 Non-Tech / HR"
        containerHeight="300px"
        containerWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.1}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="tilted-card-demo-text text-white text-lg sm:text-xl font-bold drop-shadow-lg">
            Non‑Tech / HR
          </p>
        }
        onClick={() => router.push("/non-dev")}
        className="cursor-pointer"
      />
    </motion.div>
  );
}
