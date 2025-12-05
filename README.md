# Divesh Saini's Portfolio

> A modern, interactive portfolio showcasing backend development skills and full-stack expertise

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 🌟 Features

### Dual Portfolio Experience
- **Developer Mode**: Interactive terminal-based authentication with JWT demonstrations
- **Non-Dev Mode**: Clean, professional portfolio for non-technical audiences

### Interactive Demonstrations
- 🗄️ **SQL Skills Editor**: Live SQL query execution with syntax highlighting
- 🚀 **API Projects Showcase**: Postman-style API testing interface with caching & rate limiting
- 🔐 **JWT Authentication**: Live JWT token generation, validation, and session management
- 📊 **Coming Soon**: Analytics Dashboard, Encryption Playground, GraphQL Demo

### Technical Highlights
- ⚡ Server-side and client-side caching with performance metrics
- 🔒 Secure JWT-based session management with HTTP-only cookies
- 🎨 Beautiful UI with Framer Motion animations
- 🌓 Dark/Light theme support
- 📱 Fully responsive design
- ♿ Accessible components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/diveshsaini1991/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # JWT Secret (generate with: openssl rand -base64 32)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # App URL (for production deployment)
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
portfolio/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── developer/           # Developer portfolio (terminal mode)
│   │   ├── non-dev/             # Non-technical portfolio
│   │   ├── api/                 # API routes (JWT, sessions)
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable UI components
│   ├── lib/                     # Utility functions & business logic
│   │   ├── jwt-utils.ts        # JWT operations
│   │   ├── session-manager.ts  # Session management
│   │   ├── cache-manager.ts    # Client-side caching
│   │   ├── rate-limiter.ts     # API rate limiting
│   │   └── api-simulator.ts    # Mock API responses
│   ├── data/                    # Static content (skills, projects, experience)
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
└── ...config files

```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animation library

### Backend & Features
- **Next.js API Routes** - Backend API
- **JWT** - Authentication & session management
- **Edge Runtime** - Fast API responses
- **Server Actions** - Type-safe server functions

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Upstash Redis** - (Optional) For distributed sessions

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Custom Domain
1. Configure your domain DNS to point to your hosting provider
2. Set `NEXT_PUBLIC_APP_URL` to your domain
3. Configure SSL certificate
4. Deploy

### Environment Variables for Production
```env
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## 🎯 Key Features Explained

### JWT Session Management
- Secure token generation with HS256 algorithm
- HTTP-only cookies for XSS protection
- Automatic session validation
- Configurable expiration (default: 24 hours)

### Interactive SQL Editor
- Syntax highlighting
- Mock database with realistic data
- Support for SELECT, INSERT, UPDATE, DELETE
- Error handling and validation

### API Testing Interface
- REST API simulation
- Request/response visualization
- Caching with TTL
- Rate limiting (5 req/min)
- Multiple HTTP methods support

### Caching System
- Client-side caching with LRU eviction
- Configurable TTL per endpoint
- Real-time cache hit/miss statistics
- Performance metrics tracking

## 📝 Customization

### Update Personal Information
Edit files in `src/data/`:
- `experience.ts` - Work experience
- `projects.ts` - Project showcase
- `skills.ts` - Technical skills

### Modify Theme Colors
Update `tailwind.config.js` and Tailwind classes in components

### Add New Sections
1. Create component in `src/app/developer/components/sections/`
2. Add to `SectionType` in `src/types/index.ts`
3. Update `MainPortfolio.tsx` router

## 🔒 Security

- ✅ JWT tokens stored in HTTP-only cookies
- ✅ CSRF protection via SameSite cookies
- ✅ Environment variables for secrets
- ✅ Rate limiting on API routes
- ✅ Input validation and sanitization
- ✅ No sensitive data in client bundle

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

**Divesh Saini**
- GitHub: [@diveshsaini1991](https://github.com/diveshsaini1991)
- LinkedIn: [diveshsaini1991](https://linkedin.com/in/diveshsaini1991)
- Email: diveshsaini1991@gmail.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/diveshsaini1991/portfolio/issues).

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Made with ❤️ by Divesh Saini using Next.js, TypeScript & Tailwind CSS**
