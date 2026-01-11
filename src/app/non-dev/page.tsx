"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { destroySession } from '@/lib/session-manager';
import ThemeToggle from '@/components/ThemeToggle';
import { experiences } from '@/data/experience';
import { projects } from '@/data/projects';
import { skills, getSkillsByCategory } from '@/data/skills';
import { Experience, Project, Skill } from '@/types';

type TabType = 'about' | 'experience' | 'projects' | 'skills';

export default function NonDevPortfolio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      destroySession();
      router.push('/');
    }, 1500); // Show logout animation for 1.5 seconds
  };

  const tabs = [
    { id: 'about' as TabType, label: 'About', icon: '👋' },
    { id: 'experience' as TabType, label: 'Experience', icon: '💼' },
    { id: 'projects' as TabType, label: 'Projects', icon: '🚀' },
    { id: 'skills' as TabType, label: 'Skills', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Logout Modal */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 border-2 border-red-500 rounded-lg p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Logging Out</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Clearing session and redirecting...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative">
        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md"
            title="Logout and return to home"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-14 sm:pt-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Divesh Saini
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4">
              Software Development Engineer
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bengaluru, India
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Available for opportunities
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto border-t border-gray-200 dark:border-gray-700 pt-4 pb-2">
            <div className=" px-2 flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-thin pb-2 sm:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all whitespace-nowrap flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'about' && <AboutSection />}
            {activeTab === 'experience' && <ExperienceSection experiences={experiences} />}
            {activeTab === 'projects' && <ProjectsSection projects={projects} />}
            {activeTab === 'skills' && <SkillsSection skills={skills} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Made with ❤️ by Divesh Saini</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Built using Next.js, TypeScript, Tailwind CSS & Framer Motion</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="https://github.com/diveshsaini1991" target="_blank" rel="noopener noreferrer" 
               className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              GitHub
            </a>
            <a href="https://linkedin.com/in/diveshsaini1991" target="_blank" rel="noopener noreferrer" 
               className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              LinkedIn
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">© 2025 Divesh Saini. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        About Me
      </h2>
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p className="text-base sm:text-lg leading-relaxed">
          Hi! I'm Divesh Saini, a passionate Software Development Engineer currently working as an SDE Intern at Razorpay. 
          I specialize in backend development, full-stack applications, and building scalable systems.
        </p>
        <p className="text-base sm:text-lg leading-relaxed">
          My expertise spans across modern web technologies including Node.js, React, Golang, Spring Boot, and various 
          database systems. I have hands-on experience with microservices architecture, real-time communication, 
          and end-to-end testing frameworks.
        </p>
        <p className="text-base sm:text-lg leading-relaxed">
          I'm passionate about creating efficient, maintainable, and user-friendly applications that solve real-world problems.
          My goal is to continuously learn and grow as a developer while contributing to meaningful projects.
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard number="4+" label="Years Coding" />
            <StatCard number="7+" label="Major Projects" />
            <StatCard number="40+" label="Technologies" />
            <StatCard number="1" label="Experience" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label, color = 'blue' }: { number: string; label: string; color?: 'blue' | 'green' | 'purple' }) {
  const colorClasses = {
    blue: 'from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 text-blue-600 dark:text-blue-400',
    green: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-600 dark:text-green-400',
    purple: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4 text-center`}>
      <div className={`text-2xl sm:text-3xl font-bold mb-1 ${color === 'blue' ? 'text-blue-600 dark:text-blue-400' : color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}`}>
        {number}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        {label}
      </div>
    </div>
  );
}

function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Professional Experience
      </h2>
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {exp.position}
              </h3>
              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-1">
                {exp.company}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 sm:text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                exp.type === 'internship' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                exp.type === 'fulltime' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
              }`}>
                {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{exp.duration}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{exp.location}</p>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {exp.description}
          </p>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {exp.achievements && exp.achievements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Achievements:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                project.type === 'fullstack' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                project.type === 'backend' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                project.type === 'frontend' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
              }`}>
                {project.type}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              {project.description}
            </p>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="font-semibold">Role:</span> {project.role}
                <span className="text-gray-400">•</span>
                <span className="font-semibold">Duration:</span> {project.duration}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tech Stack:</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Highlights:</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {project.highlights.slice(0, 3).map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span dangerouslySetInnerHTML={{ __html: highlight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [
    { id: 'backend', label: 'Backend Development', icon: '⚙️', color: 'blue' },
    { id: 'frontend', label: 'Frontend Development', icon: '🎨', color: 'purple' },
    { id: 'database', label: 'Databases', icon: '💾', color: 'green' },
    { id: 'devops', label: 'DevOps & Infrastructure', icon: '🚀', color: 'orange' },
    { id: 'tools', label: 'Tools & IDEs', icon: '🔧', color: 'gray' },
    { id: 'testing', label: 'Testing', icon: '✅', color: 'red' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Technical Skills
      </h2>
      
      {categories.map((category, index) => {
        const categorySkills = getSkillsByCategory(category.id as Skill['category']);
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {category.label}
              </h3>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                {categorySkills.length} skills
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all hover:-translate-y-1 group"
                >
                  {skill.icon && (
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      <img
                        src={skill.icon}
                        alt={`${skill.name} logo`}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white text-center">
                    {skill.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {skill.yearsOfExperience}y
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
      
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 sm:p-8 text-white">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          📊 Skills Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">{skills.length}</div>
            <div className="text-sm opacity-90">Total Skills</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{getSkillsByCategory('backend').length + getSkillsByCategory('database').length}</div>
            <div className="text-sm opacity-90">Backend & DB</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{getSkillsByCategory('frontend').length}</div>
            <div className="text-sm opacity-90">Frontend</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{getSkillsByCategory('devops').length}</div>
            <div className="text-sm opacity-90">DevOps</div>
          </div>
        </div>
      </div>
    </div>
  );
}
