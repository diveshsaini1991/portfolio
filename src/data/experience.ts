import { Experience } from '@/types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    type: 'internship',
    company: 'Razorpay',
    position: 'SDE Intern (Software Development Engineer Intern)',
    duration: 'Oct 2025 - Present',
    location: 'Bengaluru, Karnataka, India',
    description: 'Focused on enhancing the End-to-End (e2e) backend testing framework for payment workflows, involving environment setup, CI/CD integration, and writing robust test cases for critical regions (like SG).',
    technologies: ['Golang', 'WebDriverIO', 'Mocha', 'CI/CD', 'Argo Workflow', 'BrowserStack'],
    achievements: []
  }
];

export const getExperienceByType = (type: Experience['type']) => {
  return experiences.filter(exp => exp.type === type);
};