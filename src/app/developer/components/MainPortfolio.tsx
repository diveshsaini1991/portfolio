"use client";

import { useState } from 'react';
import { SectionType } from '@/types';
import PortfolioHeader from './PortfolioHeader';
import SectionNavigation from './SectionNavigation';
import SQLSkillsEditor from './sections/SQLSkillsEditor';
import PostmanProjects from './sections/PostmanProjects';
import JWTDemo from './sections/JWTDemo';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainPortfolio() {
  const [activeSection, setActiveSection] = useState<SectionType>('skills');

  const renderSection = () => {
    switch (activeSection) {
      case 'skills':
        return <SQLSkillsEditor />;
      case 'projects':
        return <PostmanProjects />;
      case 'jwt':
        return <JWTDemo />;
      case 'analytics':
        return <ComingSoonPlaceholder title="Analytics Dashboard" icon="📊" />;
      case 'encryption':
        return <ComingSoonPlaceholder title="Encryption Playground" icon="🔒" />;
      case 'graphql':
        return <ComingSoonPlaceholder title="GraphQL Interactive Demo" icon="◈" />;
      default:
        return <SQLSkillsEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <PortfolioHeader />
      <SectionNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-800/30 border-t border-gray-700 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-[10px] sm:text-xs text-gray-500">
        <span className="hidden sm:inline">Made with ❤️ by Divesh Saini • Built using Next.js, TypeScript & Tailwind CSS</span>
        <span className="sm:hidden">Made with ❤️ by Divesh Saini</span>
      </div>
    </div>
  );
}

function ComingSoonPlaceholder({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700 p-4">
      <div className="text-center">
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">{icon}</div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-500">Coming Soon...</p>
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 rounded-lg">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm text-gray-400">Under Development</span>
        </div>
      </div>
    </div>
  );
}
