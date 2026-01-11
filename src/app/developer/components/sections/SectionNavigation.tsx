"use client";

import { motion } from 'framer-motion';
import { SectionType } from '@/types';

interface SectionConfig {
  id: SectionType;
  label: string;
  icon: string;
  color: string;
  available: boolean;
}

interface SectionNavigationProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export default function SectionNavigation({ activeSection, onSectionChange }: SectionNavigationProps) {
  const sections: SectionConfig[] = [
    { id: 'skills', label: 'SQL Skills', icon: '💾', color: 'from-blue-500 to-cyan-500', available: true },
    { id: 'projects', label: 'API Projects', icon: '📮', color: 'from-orange-500 to-red-500', available: true },
    { id: 'jwt', label: 'JWT Demo', icon: '🔐', color: 'from-purple-500 to-pink-500', available: true },
    { id: 'analytics', label: 'Analytics', icon: '📊', color: 'from-green-500 to-emerald-500', available: true },
    { id: 'encryption', label: 'Encryption', icon: '🔒', color: 'from-indigo-500 to-blue-500', available: false },
    { id: 'graphql', label: 'GraphQL', icon: '◈', color: 'from-pink-500 to-rose-500', available: false },
  ];

  return (
    <div className="bg-white/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mr-1 sm:mr-2 whitespace-nowrap flex-shrink-0">SECTIONS:</span>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => section.available && onSectionChange(section.id)}
            disabled={!section.available}
            className={`
              relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
              ${activeSection === section.id
                ? 'bg-gradient-to-r text-white dark:text-white shadow-lg scale-105'
                : section.available
                ? 'bg-gray-200/70 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300/70 dark:hover:bg-gray-700 hover:scale-105'
                : 'bg-gray-100/50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }
            `}
            style={
              activeSection === section.id
                ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }
                : undefined
            }
          >
            <span className={`bg-gradient-to-r ${section.color} bg-clip-text ${activeSection === section.id ? 'text-white' : 'text-transparent'} flex items-center gap-1`}>
              <span className="text-xs sm:text-sm">{section.icon}</span>
              <span className="hidden sm:inline">{section.label}</span>
              <span className="sm:hidden">{section.label.split(' ')[0]}</span>
            </span>
            
            {!section.available && (
              <span className="absolute -top-1 -right-1 px-1 sm:px-1.5 py-0.5 bg-yellow-500 text-black text-[8px] sm:text-[10px] font-bold rounded">
                SOON
              </span>
            )}

            {activeSection === section.id && (
              <motion.div
                layoutId="activeSection"
                className="absolute inset-0 bg-gradient-to-r rounded-lg -z-10"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

