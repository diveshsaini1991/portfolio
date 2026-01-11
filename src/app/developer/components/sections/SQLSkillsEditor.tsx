"use client";

import { useState, useEffect } from 'react';
import { Skill } from '@/types';
import { skills, getSkillsByCategory } from '@/data/skills';
import { generateSQLQuery } from '@/lib/api-simulator';
import { motion, AnimatePresence } from 'framer-motion';

type CategoryFilter = Skill['category'] | 'all';

export default function SQLSkillsEditor() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [executedCategory, setExecutedCategory] = useState<CategoryFilter | null>(null);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Skill[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryTime, setQueryTime] = useState<number>(0);

  // Track if query has changed since last execution
  const hasChanges = selectedCategory !== executedCategory;

  const categories: { value: CategoryFilter; label: string; icon: string }[] = [
    { value: 'all', label: 'All Skills', icon: '📊' },
    { value: 'backend', label: 'Backend', icon: '⚙️' },
    { value: 'frontend', label: 'Frontend', icon: '🎨' },
    { value: 'database', label: 'Database', icon: '💾' },
    { value: 'devops', label: 'DevOps', icon: '🚀' },
    { value: 'tools', label: 'Tools', icon: '🔧' },
  ];

  useEffect(() => {
    // Generate SQL query based on selected category
    if (selectedCategory === 'all') {
      setQuery(generateSQLQuery('skills', undefined, { field: 'yearsOfExperience', direction: 'DESC' }));
    } else {
      setQuery(generateSQLQuery('skills', { category: selectedCategory }, { field: 'yearsOfExperience', direction: 'DESC' }));
    }
  }, [selectedCategory]);

  const executeQuery = async () => {
    if (!hasChanges) return; // Don't execute if no changes
    
    setIsExecuting(true);
    const startTime = performance.now();
    
    // Simulate query execution delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    
    const filteredSkills = selectedCategory === 'all' 
      ? skills 
      : getSkillsByCategory(selectedCategory);
    
    const sortedResults = [...filteredSkills].sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    
    const endTime = performance.now();
    setQueryTime(endTime - startTime);
    setResults(sortedResults);
    setExecutedCategory(selectedCategory); // Mark this category as executed
    setIsExecuting(false);
  };

  // Auto-execute only on first mount
  useEffect(() => {
    executeQuery();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm dark:shadow-none">
      {/* SQL Editor Header */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-800 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1 sm:gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-mono">skills_database.sql</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 rounded font-medium">PostgreSQL 14</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-slate-50 dark:bg-gray-800 px-2 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="inline sm:hidden">{cat.icon}</span>
            <span className="hidden sm:inline">{cat.icon} {cat.label}</span>
          </button>
        ))}
      </div>

      {/* SQL Query Editor */}
      <div className="flex-1 flex flex-col">
        <div className=" dark:bg-gray-850 px-2 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-mono">QUERY EDITOR</span>
          {hasChanges && (
            <span className="text-[10px] sm:text-xs text-amber-600 dark:text-yellow-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 dark:bg-yellow-400 rounded-full"></span>
              <span className="hidden sm:inline">Modified</span>
            </span>
          )}
          {!hasChanges && results.length > 0 && (
            <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-green-400 rounded-full"></span>
              <span className="hidden sm:inline">Executed</span>
            </span>
          )}
        </div>
        <div className="bg-white dark:bg-gray-900 p-2 sm:p-4 font-mono text-xs sm:text-sm border-b border-gray-100 dark:border-gray-800">
          <div className="flex gap-2">
            <div className="text-gray-400 dark:text-gray-500 select-none">1</div>
            <div className="flex-1">
              <span className="text-purple-600 dark:text-purple-400">SELECT</span>
              <span className="text-gray-800 dark:text-gray-300"> * </span>
              <span className="text-purple-600 dark:text-purple-400">FROM</span>
              <span className="text-blue-600 dark:text-blue-400"> skills</span>
            </div>
          </div>
          {selectedCategory !== 'all' && (
            <>
              <div className="flex gap-2">
                <div className="text-gray-400 dark:text-gray-500 select-none">2</div>
                <div className="flex-1">
                  <span className="text-purple-600 dark:text-purple-400">WHERE</span>
                  <span className="text-blue-600 dark:text-blue-400"> category </span>
                  <span className="text-gray-800 dark:text-gray-300">= </span>
                  <span className="text-green-600 dark:text-green-400">&apos;{selectedCategory}&apos;</span>
                </div>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <div className="text-gray-400 dark:text-gray-500 select-none">{selectedCategory === 'all' ? '2' : '3'}</div>
            <div className="flex-1">
              <span className="text-purple-600 dark:text-purple-400">ORDER BY</span>
              <span className="text-blue-600 dark:text-blue-400"> yearsOfExperience </span>
              <span className="text-purple-600 dark:text-purple-400">DESC</span>
              <span className="text-gray-800 dark:text-gray-300">;</span>
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="bg-slate-50 dark:bg-gray-800 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={executeQuery}
              disabled={isExecuting || !hasChanges}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded font-medium text-xs sm:text-sm transition-all flex items-center gap-2 ${
                hasChanges && !isExecuting
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 dark:shadow-green-500/50 animate-pulse'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isExecuting ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Executing...</span>
                </>
              ) : hasChanges ? (
                <>
                  ▶ <span className="hidden sm:inline">Run Query</span><span className="sm:hidden">Run</span>
                </>
              ) : (
                <>
                  ✓ <span className="hidden sm:inline">Query Up to Date</span><span className="sm:hidden">Up to Date</span>
                </>
              )}
            </button>
            {hasChanges && !isExecuting && (
              <span className="text-[10px] sm:text-xs text-amber-600 dark:text-yellow-400 flex items-center gap-1">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 dark:bg-yellow-400 rounded-full animate-pulse"></span>
                <span className="hidden sm:inline">Changes detected</span>
              </span>
            )}
          </div>
          {queryTime > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <span className="hidden sm:inline">Query executed in </span><span className="text-emerald-600 dark:text-green-400 font-mono">{queryTime.toFixed(2)}ms</span>
            </span>
          )}
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-2 sm:p-4"
              >
                <div className="mb-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  {results.length} row{results.length !== 1 ? 's' : ''} returned
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-1.5 sm:py-2 px-2 sm:px-3 text-gray-500 dark:text-gray-400 font-mono text-[10px] sm:text-xs">id</th>
                        <th className="text-left py-1.5 sm:py-2 px-2 sm:px-3 text-gray-500 dark:text-gray-400 font-mono text-[10px] sm:text-xs">name</th>
                        <th className="text-left py-1.5 sm:py-2 px-2 sm:px-3 text-gray-500 dark:text-gray-400 font-mono text-[10px] sm:text-xs hidden sm:table-cell">category</th>
                        <th className="text-left py-1.5 sm:py-2 px-2 sm:px-3 text-gray-500 dark:text-gray-400 font-mono text-[10px] sm:text-xs">exp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((skill, idx) => (
                        <motion.tr
                          key={skill.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-gray-400 dark:text-gray-500 font-mono text-[10px] sm:text-xs">{skill.id}</td>
                          <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-gray-800 dark:text-gray-300">
                            <div className="flex items-center gap-1 sm:gap-2">
                              {skill.icon && (
                                <img 
                                  src={skill.icon} 
                                  alt={`${skill.name} logo`}
                                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <span className="font-medium text-[10px] sm:text-sm">{skill.name}</span>
                            </div>
                          </td>
                          <td className="py-1.5 sm:py-2 px-2 sm:px-3 hidden sm:table-cell">
                            <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] sm:text-xs">
                              {skill.category}
                            </span>
                          </td>
                          <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-mono text-[10px] sm:text-xs">
                            {skill.yearsOfExperience}<span className="hidden sm:inline"> years</span><span className="sm:hidden">y</span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
