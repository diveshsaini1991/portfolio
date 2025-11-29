# Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Variables
1. Generate a secure JWT secret:
   ```bash
   openssl rand -base64 32
   ```
2. Set the following environment variables:
   - `JWT_SECRET` - Your generated secret
   - `NEXT_PUBLIC_APP_URL` - Your production domain
   - `NODE_ENV=production`

### ✅ Build Test
Run a production build locally:
```bash
npm run build
npm start
```

Visit `http://localhost:3000` to verify everything works.

### ✅ Code Quality
```bash
# Type check
npm run type-check

# Lint
npm run lint
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: production-ready portfolio"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   In Vercel dashboard, add:
   - `JWT_SECRET` - Your secure secret
   - `NEXT_PUBLIC_APP_URL` - `https://yourdomain.com`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

5. **Custom Domain**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Custom VPS/Server

1. **Server Requirements**
   - Node.js 18.17.0+
   - npm 9.0.0+
   - PM2 (for process management)

2. **Setup**
   ```bash
   # Clone repository
   git clone https://github.com/diveshsaini1991/portfolio.git
   cd portfolio
   
   # Install dependencies
   npm install
   
   # Create .env.local
   cp .env.example .env.local
   # Edit .env.local with your values
   
   # Build
   npm run build
   
   # Start with PM2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration** (if using Nginx)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t portfolio .
   docker run -p 3000:3000 -e JWT_SECRET=your-secret portfolio
   ```

## Post-Deployment

### Monitor Performance
- Check Vercel Analytics
- Monitor Core Web Vitals
- Set up error tracking (Sentry recommended)

### SEO Optimization
- Submit sitemap to Google Search Console
- Verify Open Graph tags
- Test with PageSpeed Insights

### Security
- Enable HTTPS
- Configure security headers (already in next.config.ts)
- Regular dependency updates: `npm audit fix`

## DNS Configuration

### For Custom Domain
Point your domain's DNS to:

**Vercel:**
- A Record: `76.76.21.21`
- CNAME: `cname.vercel-dns.com`

**Custom Server:**
- A Record: `your.server.ip.address`

Wait 24-48 hours for DNS propagation.

## Troubleshooting

### Build Fails
- Clear cache: `npm run clean && npm install`
- Check Node.js version: `node -v` (should be 18.17+)
- Verify environment variables are set

### JWT Issues
- Ensure JWT_SECRET is set in production
- Check cookie settings (SameSite, Secure flags)
- Verify domain matches NEXT_PUBLIC_APP_URL

### Performance Issues
- Enable compression in hosting provider
- Use CDN for static assets
- Monitor with Lighthouse

## Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## Support

For issues or questions:
- Create an issue on GitHub
- Email: diveshsaini1991@gmail.com

---

**Good luck with your deployment! 🚀**

