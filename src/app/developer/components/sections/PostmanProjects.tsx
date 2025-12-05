"use client";

import { useState, useEffect } from 'react';
import { Project, Experience, ApiResponse } from '@/types';
import { projects, getProjectsByType, getProjectsByTech } from '@/data/projects';
import { experiences, getExperienceByType } from '@/data/experience';
import { simulateApiCall, getResponseTimeColor, formatJSON } from '@/lib/api-simulator';
import { checkRateLimit, getRateLimitStatus, resetRateLimit, formatRateLimitHeaders, getTimeUntilReset } from '@/lib/rate-limiter';
import cacheManager, { CacheStats } from '@/lib/cache-manager';
import { motion, AnimatePresence } from 'framer-motion';

type EndpointType = 'projects' | 'experience';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestState {
  endpoint: string;
  method: HttpMethod;
  params: Record<string, string>;
  isLoading: boolean;
  response: ApiResponse<any> | null;
  cacheStatus?: 'HIT' | 'MISS';
}

type ViewMode = 'json' | 'html';

export default function PostmanProjects() {
  const [activeTab, setActiveTab] = useState<EndpointType>('projects');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [requestState, setRequestState] = useState<RequestState>({
    endpoint: '/api/v1/projects?cache=true',
    method: 'GET',
    params: {},
    isLoading: false,
    response: null,
  });

  const [filters, setFilters] = useState({
    projectType: 'all',
    tech: '',
    experienceType: 'all',
  });

  const [rateLimitStatus, setRateLimitStatus] = useState(getRateLimitStatus('api-demo'));
  const [isPrettified, setIsPrettified] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('json');
  const [cacheStats, setCacheStats] = useState<CacheStats>(cacheManager.getStats());
  const [cacheCleared, setCacheCleared] = useState(false);

  // Update rate limit status and cache stats every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimitStatus(getRateLimitStatus('api-demo'));
      setCacheStats(cacheManager.getStats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update endpoint display when cache state or filters change
  useEffect(() => {
    const newEndpoint = buildEndpoint();
    setRequestState(prev => ({
      ...prev,
      endpoint: newEndpoint,
    }));
  }, [cacheEnabled, filters, activeTab]);

  const buildEndpoint = () => {
    let endpoint = activeTab === 'projects' ? '/api/v1/projects' : '/api/v1/experience';
    const params: string[] = [];

    // Add cache parameter first
    params.push(`cache=${cacheEnabled}`);

    if (activeTab === 'projects') {
      if (filters.projectType !== 'all') params.push(`type=${filters.projectType}`);
      if (filters.tech) params.push(`tech=${filters.tech}`);
    } else {
      if (filters.experienceType !== 'all') params.push(`type=${filters.experienceType}`);
    }

    endpoint += '?' + params.join('&');

    return endpoint;
  };

  const executeRequest = async () => {
    setRequestState(prev => ({ ...prev, isLoading: true, response: null, cacheStatus: undefined }));

    const endpoint = buildEndpoint();
    const startTime = performance.now();

    // Check cache first (if enabled and GET request)
    let cachedResponse: ApiResponse<any> | null = null;
    let cacheStatus: 'HIT' | 'MISS' = 'MISS';

    if (cacheEnabled && requestState.method === 'GET') {
      cachedResponse = cacheManager.get<ApiResponse<any>>(endpoint);
      if (cachedResponse) {
        cacheStatus = 'HIT';
      }
    }

    // Check rate limit (ALWAYS, even for cache hits)
    // This increments the request counter regardless of cache status
    const rateLimit = checkRateLimit('api-demo');
    setRateLimitStatus(rateLimit.info);

    if (!rateLimit.allowed) {
      // Rate limit exceeded - return 429 response
      const rateLimitResponse: ApiResponse<any> = {
        status: 429,
        statusText: 'Too Many Requests',
        data: {
          error: 'Rate limit exceeded',
          message: `You have exceeded the rate limit of ${rateLimit.info.limit} requests per minute`,
          retryAfter: rateLimit.info.retryAfter,
          details: {
            limit: rateLimit.info.limit,
            remaining: rateLimit.info.remaining,
            reset: new Date(rateLimit.info.reset).toISOString(),
          }
        },
        timestamp: Date.now(),
        responseTime: 45 + Math.random() * 10,
        headers: {
          'Content-Type': 'application/json',
          'X-Powered-By': 'Divesh Portfolio API v1.0',
          'X-Cache-Status': 'BYPASS',
          ...formatRateLimitHeaders(rateLimit.info),
        }
      };

      setRequestState(prev => ({
        ...prev,
        endpoint,
        isLoading: false,
        response: rateLimitResponse,
      }));
      
      // Update rate limit status display
      setRateLimitStatus(getRateLimitStatus('api-demo'));
      return;
    }

    // If we have a cache hit and rate limit passed, return cached response
    if (cachedResponse && cacheStatus === 'HIT') {
      // Simulate fast cache retrieval (3-6ms)
      await new Promise(resolve => setTimeout(resolve, 3 + Math.random() * 3));
      const endTime = performance.now();

      // Add cache and rate limit headers
      cachedResponse.headers = {
        ...cachedResponse.headers,
        'X-Cache-Status': 'HIT',
        'Age': Math.floor((Date.now() - cachedResponse.timestamp) / 1000).toString(),
        ...formatRateLimitHeaders(rateLimit.info),
      };
      cachedResponse.responseTime = endTime - startTime;

      setRequestState(prev => ({
        ...prev,
        endpoint,
        isLoading: false,
        response: cachedResponse,
        cacheStatus: 'HIT',
      }));
      
      // Force update rate limit status immediately after cache hit
      setRateLimitStatus(getRateLimitStatus('api-demo'));
      setCacheStats(cacheManager.getStats());
      return;
    }

    // Check for unauthorized methods (POST, PUT, DELETE)
    if (requestState.method !== 'GET') {
      const unauthorizedResponse: ApiResponse<any> = {
        status: 401,
        statusText: 'Unauthorized',
        data: {
          error: 'Unauthorized',
          message: 'You do not have permission to perform this action',
          details: {
            reason: 'Only the portfolio owner (admin) can modify resources',
            allowedMethods: ['GET'],
            yourRole: 'visitor',
            requiredRole: 'admin',
          }
        },
        timestamp: Date.now(),
        responseTime: 45 + Math.random() * 10,
        headers: {
          'Content-Type': 'application/json',
          'X-Powered-By': 'Divesh Portfolio API v1.0',
          'WWW-Authenticate': 'Bearer realm="Portfolio API"',
          'X-Cache-Status': 'BYPASS',
          ...formatRateLimitHeaders(rateLimit.info),
        }
      };

      setRequestState(prev => ({
        ...prev,
        endpoint,
        isLoading: false,
        response: unauthorizedResponse,
      }));
      
      // Update rate limit status display
      setRateLimitStatus(getRateLimitStatus('api-demo'));
      return;
    }

    // Normal request processing
    let data: any;

    if (activeTab === 'projects') {
      if (filters.projectType !== 'all') {
        data = getProjectsByType(filters.projectType as Project['type']);
      } else if (filters.tech) {
        data = getProjectsByTech(filters.tech);
      } else {
        data = projects;
      }
    } else {
      if (filters.experienceType !== 'all') {
        data = getExperienceByType(filters.experienceType as Experience['type']);
      } else {
        data = experiences;
      }
    }

    const response = await simulateApiCall({ count: data.length, results: data });

    // Add cache and rate limit headers to successful response
    response.headers = {
      ...response.headers,
      'X-Cache-Status': 'MISS',
      ...formatRateLimitHeaders(rateLimit.info),
    };

    // Store in cache if enabled
    if (cacheEnabled && requestState.method === 'GET') {
      cacheManager.set(endpoint, response);
    }

    setRequestState(prev => ({
      ...prev,
      endpoint,
      isLoading: false,
      response,
      cacheStatus: 'MISS',
    }));

    // Force update rate limit status after cache miss too
    setRateLimitStatus(getRateLimitStatus('api-demo'));
    setCacheStats(cacheManager.getStats());
  };

  const handleResetRateLimit = () => {
    resetRateLimit('api-demo');
    setRateLimitStatus(getRateLimitStatus('api-demo'));
  };

  const handleClearCache = () => {
    cacheManager.clearAll();
    setCacheStats(cacheManager.getStats());
    setCacheCleared(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setCacheCleared(false);
    }, 3000);
  };

  const handleCacheToggle = () => {
    setCacheEnabled(!cacheEnabled);
    // useEffect will automatically update the endpoint
  };

  const handleTabChange = (tab: EndpointType) => {
    setActiveTab(tab);
    setRequestState(prev => ({
      ...prev,
      response: null,
    }));
    // useEffect will automatically update the endpoint
  };

  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET':
        return 'bg-green-600 text-white';
      case 'POST':
        return 'bg-yellow-600 text-white';
      case 'PUT':
        return 'bg-blue-600 text-white';
      case 'DELETE':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const renderResponseAsHTML = (data: any) => {
    if (data.error) {
      // Error response HTML - subtle and clean
      return (
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-l-4 border-red-500">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-2">{data.error}</h1>
            <p className="text-gray-300 text-lg mb-4">{data.message}</p>
            {data.details && (
              <div className="bg-gray-950 rounded p-4 text-left border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2 font-semibold">Details:</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(data.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start gap-4">
                      <span className="text-gray-500 font-mono">{key}:</span>
                      <span className="text-gray-300 font-mono text-right">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (data.results) {
      // Success response with results
      return (
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">API Response</h1>
            <p className="text-gray-400">Found {data.count} result{data.count !== 1 ? 's' : ''}</p>
          </div>
          <div className="space-y-4">
            {data.results.map((item: any, idx: number) => (
              <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">
                    {item.name || item.company || item.title}
                  </h3>
                  {item.type && (
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ml-2 ${
                      item.type === 'fullstack' ? 'bg-purple-600 text-white' :
                      item.type === 'backend' ? 'bg-green-600 text-white' :
                      item.type === 'frontend' ? 'bg-blue-600 text-white' :
                      item.type === 'internship' ? 'bg-green-600 text-white' :
                      item.type === 'fulltime' ? 'bg-blue-600 text-white' :
                      'bg-orange-600 text-white'
                    }`}>
                      {item.type}
                    </span>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                )}
                
                {/* Role and Duration for Projects */}
                {(item.role || item.duration) && (
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                    {item.role && (
                      <span><strong className="text-gray-300">Role:</strong> {item.role}</span>
                    )}
                    {item.duration && (
                      <span><strong className="text-gray-300">Duration:</strong> {item.duration}</span>
                    )}
                  </div>
                )}
                
                {/* Position and Location for Experience */}
                {item.position && (
                  <p className="text-sm text-gray-400 mb-1">
                    <strong className="text-gray-300">Position:</strong> {item.position}
                  </p>
                )}
                {item.location && (
                  <p className="text-sm text-gray-400 mb-3">
                    <strong className="text-gray-300">Location:</strong> {item.location}
                  </p>
                )}
                
                {/* Tech Stack for Projects */}
                {item.techStack && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Technologies for Experience */}
                {item.technologies && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-purple-600 text-white rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Highlights for Projects */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Key Highlights:</p>
                    <ul className="space-y-1 text-xs text-gray-300">
                      {item.highlights.map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span dangerouslySetInnerHTML={{ 
                            __html: highlight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
                          }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Achievements for Experience */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Achievements:</p>
                    <ul className="space-y-1 text-xs text-gray-300">
                      {item.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-0.5">★</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Links for Projects */}
                {(item.github || item.live) && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-600">
                    {item.github && (
                      <a
                        href={item.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs transition-colors"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {item.live && (
                      <a
                        href={item.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Fallback for other data
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <pre className="text-gray-300 text-sm">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {/* Postman-style Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
        <div className="text-white font-bold text-base sm:text-lg">📮</div>
        <div className="text-white font-semibold text-sm sm:text-base">Portfolio API Client</div>
        <div className="ml-auto text-orange-100 text-[10px] sm:text-xs">v1.0.0</div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 px-2 sm:px-4 border-b border-gray-700 flex gap-0.5 sm:gap-1">
        <button
          onClick={() => handleTabChange('projects')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors relative ${
            activeTab === 'projects'
              ? 'text-white bg-gray-900'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <span className="hidden sm:inline">📁 Projects API</span>
          <span className="sm:hidden">📁 Projects</span>
          {activeTab === 'projects' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
        <button
          onClick={() => handleTabChange('experience')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors relative ${
            activeTab === 'experience'
              ? 'text-white bg-gray-900'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <span className="hidden sm:inline">💼 Experience API</span>
          <span className="sm:hidden">💼 Experience</span>
          {activeTab === 'experience' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
      </div>

      {/* Rate Limit & Cache Info Bar */}
      <div className="bg-gray-800 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-700 space-y-2">
        {/* Rate Limit */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="text-gray-400 text-[10px] sm:text-sm">Rate Limit:</span>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-mono ${
                rateLimitStatus.remaining > 1 
                  ? 'bg-green-900 text-green-400' 
                  : rateLimitStatus.remaining > 0
                  ? 'bg-yellow-900 text-yellow-400'
                  : 'bg-red-900 text-red-400'
              }`}>
                {rateLimitStatus.remaining}/{rateLimitStatus.limit}
              </div>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="text-gray-400 text-[10px] sm:text-xs">
                {getTimeUntilReset(rateLimitStatus.reset)}
              </span>
            </div>
          </div>
          <button
            onClick={handleResetRateLimit}
            className="px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] sm:text-xs transition-colors"
            title="Reset rate limit counter (for demo)"
          >
            <span className="hidden sm:inline">🔄 Reset Limit</span>
            <span className="sm:hidden">🔄 Reset</span>
          </button>
        </div>
        
        {/* Cache Stats */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-700">
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
            <span className="text-gray-400 text-[10px] sm:text-sm">Cache Stats:</span>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
              <span>Hit Rate:</span>
              <span className={`font-mono font-bold ${cacheStats.hitRate > 70 ? 'text-green-400' : cacheStats.hitRate > 40 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {cacheStats.hitRate.toFixed(0)}%
              </span>
            </div>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
              <span>Requests:</span>
              <span className="font-mono text-gray-300">{cacheStats.totalRequests}</span>
            </div>
            <span className="text-gray-600 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
              <span>Saved:</span>
              <span className="font-mono text-green-400">{(cacheStats.timeSaved / 1000).toFixed(1)}s</span>
            </div>
          </div>
          <button
            onClick={handleClearCache}
            disabled={cacheCleared}
            className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs transition-all flex items-center gap-1 ${
              cacheCleared
                ? 'bg-green-600/30 border border-green-500 text-green-400'
                : 'bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400'
            }`}
            title={cacheCleared ? 'Cache cleared successfully!' : 'Clear cache'}
          >
            {cacheCleared ? (
              <>
                <span>✓</span>
                <span className="hidden sm:inline">Cleared!</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">🗑️ Clear Cache</span>
                <span className="sm:hidden">🗑️ Clear</span>
              </>
            )}
          </button>
        </div>

        {/* Alerts */}
        {rateLimitStatus.remaining === 0 && (
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-900/30 border border-red-500 rounded text-[10px] sm:text-xs text-red-400">
            ⚠️ Rate limit exceeded! Wait {getTimeUntilReset(rateLimitStatus.reset)} or click "Reset" to continue
          </div>
        )}
        
        {cacheCleared && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-900/30 border border-green-500 rounded text-[10px] sm:text-xs text-green-400 flex items-center gap-2"
          >
            <span className="text-base">✓</span>
            <span>Cache cleared successfully! All cached responses have been removed.</span>
          </motion.div>
        )}
      </div>

      {/* Request Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-850 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-700">
          {/* HTTP Method and Endpoint */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2 sm:mb-3">
            <div className="flex gap-2">
              <select
                value={requestState.method}
                onChange={(e) => setRequestState(prev => ({ ...prev, method: e.target.value as HttpMethod }))}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 font-semibold rounded text-xs sm:text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${getMethodColor(requestState.method)}`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <button
                onClick={executeRequest}
                disabled={requestState.isLoading}
                className="px-3 sm:px-6 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium text-xs sm:text-sm transition-colors sm:hidden"
              >
                {requestState.isLoading ? '...' : 'Send'}
              </button>
            </div>
            <div className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-700 text-gray-300 rounded font-mono text-[10px] sm:text-sm flex items-center overflow-x-auto">
              {buildEndpoint()}
            </div>
            <button
              onClick={executeRequest}
              disabled={requestState.isLoading}
              className="hidden sm:block px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium text-sm transition-colors"
            >
              {requestState.isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>

          {/* Query Params/Filters */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
            <span className="text-[10px] sm:text-xs text-gray-400 self-center">Params:</span>
            {activeTab === 'projects' ? (
              <>
                <select
                  value={filters.projectType}
                  onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value }))}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 text-gray-300 rounded text-[10px] sm:text-xs border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="frontend">Frontend</option>
                  <option value="devops">DevOps</option>
                </select>
                <input
                  type="text"
                  placeholder="Tech filter"
                  value={filters.tech}
                  onChange={(e) => setFilters(prev => ({ ...prev, tech: e.target.value }))}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 text-gray-300 rounded text-[10px] sm:text-xs border-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 w-24 sm:w-auto"
                />
              </>
            ) : (
              <select
                value={filters.experienceType}
                onChange={(e) => setFilters(prev => ({ ...prev, experienceType: e.target.value }))}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 text-gray-300 rounded text-[10px] sm:text-xs border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="fulltime">Full Time</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                <option value="contract">Contract</option>
              </select>
            )}
            
            {/* Cache Toggle */}
            <span className="text-gray-600 hidden sm:inline">|</span>
            <button
              onClick={handleCacheToggle}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1 ${
                cacheEnabled 
                  ? 'bg-green-900/30 border border-green-600/50 text-green-400 hover:bg-green-900/50' 
                  : 'bg-gray-700 border border-gray-600 text-gray-400 hover:bg-gray-600'
              }`}
              title={cacheEnabled ? 'Cache enabled (60s TTL) - Click to disable' : 'Cache disabled - Click to enable'}
            >
              <span>{cacheEnabled ? '🟢' : '⚫'}</span>
              <span className="hidden sm:inline">Cache {cacheEnabled ? 'ON' : 'OFF'}</span>
              <span className="sm:hidden">{cacheEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Response Section */}
        <div className="flex-1 overflow-auto bg-gray-900 p-2 sm:p-4">
          <AnimatePresence mode="wait">
            {requestState.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Sending request...</p>
                </div>
              </motion.div>
            )}

            {!requestState.isLoading && requestState.response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Response Status */}
                <div className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-3 flex-wrap">
                  <span className="text-[10px] sm:text-xs text-gray-400">Status:</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-sm font-mono ${
                    requestState.response.status === 429 || requestState.response.status === 401
                      ? 'bg-red-900 text-red-400'
                      : 'bg-green-900 text-green-400'
                  }`}>
                    {requestState.response.status} {requestState.response.statusText}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400">Time:</span>
                  <span className={`font-mono text-[10px] sm:text-sm ${getResponseTimeColor(requestState.response.responseTime)}`}>
                    {requestState.response.responseTime.toFixed(2)} ms
                  </span>
                  {requestState.cacheStatus === 'HIT' && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-900/50 text-green-300 rounded text-[10px] sm:text-xs flex items-center gap-1">
                      🟢 Cache HIT
                      <span className="hidden sm:inline text-[9px]">⚡ {((1 - requestState.response.responseTime / 350) * 100).toFixed(0)}% faster</span>
                    </span>
                  )}
                  {requestState.cacheStatus === 'MISS' && cacheEnabled && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-900/50 text-orange-300 rounded text-[10px] sm:text-xs">
                      🔴 Cache MISS
                    </span>
                  )}
                  {requestState.response.status === 429 && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-900/50 text-red-300 rounded text-[10px] sm:text-xs">
                      ⚠️ Rate Limited
                    </span>
                  )}
                  {requestState.response.status === 401 && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-900/50 text-red-300 rounded text-[10px] sm:text-xs">
                      🔒 Unauthorized
                    </span>
                  )}
                </div>

                {/* Response Headers */}
                <div className="mb-3 sm:mb-4">
                  <div className="text-[10px] sm:text-xs text-gray-400 mb-2 flex items-center gap-2">
                    <span>Response Headers</span>
                    <span className="text-gray-600">({Object.keys(requestState.response.headers).length})</span>
                  </div>
                  <div className="bg-gray-800 rounded p-2 sm:p-3 font-mono text-[10px] sm:text-xs space-y-1 overflow-x-auto">
                    {Object.entries(requestState.response.headers).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-blue-400 whitespace-nowrap">{key}:</span>
                        <span className="text-gray-300 break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Body */}
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-400 mb-2 flex items-center justify-between flex-wrap gap-2">
                    <span>Response Body</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => setViewMode('json')}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs transition-colors ${
                          viewMode === 'json'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        JSON
                      </button>
                      <button
                        onClick={() => setViewMode('html')}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs transition-colors ${
                          viewMode === 'html'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        HTML
                      </button>
                      {viewMode === 'json' && (
                        <button
                          onClick={() => setIsPrettified(!isPrettified)}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-[10px] sm:text-xs transition-colors"
                        >
                          {isPrettified ? '✓ Pretty' : 'Pretty'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {viewMode === 'json' ? (
                    <div className="bg-gray-800 rounded p-2 sm:p-4 font-mono text-[10px] sm:text-xs overflow-x-auto">
                      <pre className="text-gray-300">
                        {isPrettified 
                          ? formatJSON(requestState.response.data)
                          : JSON.stringify(requestState.response.data)
                        }
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-white rounded overflow-auto max-h-64 sm:max-h-96">
                      {renderResponseAsHTML(requestState.response.data)}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {!requestState.isLoading && !requestState.response && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📮</div>
                  <p>Configure your request and click Send</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

