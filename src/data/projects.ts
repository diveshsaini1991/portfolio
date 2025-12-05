import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Med-Haven',
    description: 'A comprehensive hospital management system (MERN stack) managing patient registration, appointments, medical records, and real-time doctor-patient chat.',
    techStack: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Socket.io',
      'JWT',
      'Docker',
      'Tailwind CSS',
      'Nodemailer'
    ],
    type: 'fullstack',
    role: 'Full Stack Developer',
    duration: '9 months',
    highlights: [
      'Implemented real-time doctor-patient chat using Socket.io.',
      'Secured APIs with JWT and enhanced security via OTP email verification.',
      'Fully containerized the entire application (Backend, Frontend, Admin/Doctor Dashboards) using Docker.',
      'Achieved responsive UI and incorporated interactive GSAP animations.',
      'Implemented API rate limiting for improved performance and reliability.'
    ],
    github: 'https://github.com/diveshsaini1991/Med-Haven',
    live: 'https://med-haven-frontend.vercel.app',
    apiEndpoint: '/api/v1/projects/proj-1'
  },
  {
    id: 'proj-2',
    name: 'Examify',
    description: 'A modern online examination platform (MERN stack) optimized for secure, real-time assessments with automated anti-cheating and instant result generation.',
    techStack: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'JWT',
      'Tailwind CSS',
      'PDFKit',
      'Framer Motion'
    ],
    type: 'fullstack',
    role: 'Full Stack Developer',
    duration: '3 months',
    highlights: [
      'Developed an anti-cheating system (tab-switch detection, auto-submission).',
      'Implemented automated PDF certificate generation for passing candidates.',
      'Secure, role-based access control (Student and Admin roles).',
      'Used JWT for authentication and role-based protected routes.',
      'Designed a responsive UI with Framer Motion animations.'
    ],
    github: 'https://github.com/diveshsaini1991/Examify',
    live: 'https://examify-nine.vercel.app/',
    apiEndpoint: '/api/v1/projects/proj-2'
  },
  {
    id: 'proj-3',
    name: 'Chrono-fit',
    description: 'An AI-integrated fitness platform built on a Microservices architecture (Spring Boot) for tracking activities and generating personalized workout recommendations.',
    techStack: [
      'Spring Boot',
      'Java',
      'React.js',
      'Microservices',
      'Keycloak',
      'Eureka Server',
      'Spring Cloud Gateway',
      'Gemini Flash 1.5 API'
    ],
    type: 'backend',
    role: 'Lead Backend Developer',
    duration: '3 months',
    highlights: [
      'Designed and implemented a **Microservices Architecture** with Spring Boot, Eureka, and Gateway.',
      'Integrated **Gemini Flash 1.5 API** for smart, personalized workout recommendations.',
      'Secured all services using **Keycloak** for robust JWT and OAuth2 authentication.',
      'Built separate services for User Management, Activity Tracking, and Recommendations.'
    ],
    github: 'https://github.com/diveshsaini1991/Chrono-fit',
    live: 'Demo link - will be here soon ...',
    apiEndpoint: '/api/v1/projects/proj-3'
  },
  {
    id: 'proj-4',
    name: 'Realtime Chat-App',
    description: 'A real-time, one-to-one chat application built using the MERN stack with Socket.IO for instant messaging.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'bcrypt'],
    type: 'fullstack',
    role: 'Full Stack Developer',
    duration: '4 months', 
    highlights: [
      'Achieved real-time messaging using **Socket.IO** for low-latency communication.',
      'Implemented secure user authentication with **bcrypt** for password hashing.',
      'Designed efficient one-to-one chat functionality and message history retrieval.',
      'Used CORS for cross-origin resource sharing.'
    ],
    github: 'https://github.com/diveshsaini1991/chit-chat',
    live: 'https://chat-app-dken.onrender.com',
    apiEndpoint: '/api/v1/projects/proj-4'
  }
];

export const getProjectsByType = (type: Project['type']) => {
  return projects.filter(project => project.type === type);
};

export const getProjectsByTech = (tech: string) => {
  return projects.filter(project => 
    project.techStack.some(t => t.toLowerCase().includes(tech.toLowerCase()))
  );
};