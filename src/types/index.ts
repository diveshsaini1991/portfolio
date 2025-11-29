// Core Type Definitions for Portfolio

export interface Skill {
  id: string;
  name: string;
  category: 'backend' | 'frontend' | 'devops' | 'tools' | 'database' | 'testing';
  yearsOfExperience: number;
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  type: 'backend' | 'fullstack' | 'frontend' | 'devops';
  role: string;
  duration: string;
  highlights: string[];
  github?: string;
  live?: string;
  apiEndpoint?: string;
}

export interface Experience {
  id: string;
  type: 'internship' | 'fulltime' | 'freelance' | 'contract';
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface JWTPayload {
  ip: string;
  timestamp: number;
  userAgent: string;
  sessionId: string;
}

export interface ApiResponse<T> {
  status: number;
  statusText: string;
  data: T;
  timestamp: number;
  responseTime: number; // in ms
  headers: Record<string, string>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // timestamp
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  lastHit?: number;
  lastMiss?: number;
}

export type SectionType = 'skills' | 'projects' | 'experience' | 'jwt' | 'analytics' | 'cache' | 'encryption' | 'graphql';

