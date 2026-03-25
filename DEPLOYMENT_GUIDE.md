# SkillSwap Deployment Guide

This guide explains how to deploy the SkillSwap application to GitHub, Vercel (frontend), Render (backend), and set up a database.

---

## Prerequisites

Before starting, make sure you have:
- GitHub account (https://github.com)
- Vercel account (https://vercel.com) - Sign up with GitHub
- Render account (https://render.com) - Sign up with GitHub
- Git installed on your machine

---

## Phase 1: Prepare GitHub Repository

### Step 1.1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `skillswap`
3. Initialize with README.md
4. Do NOT add .gitignore from template (we'll do it manually)
5. Click "Create repository"

### Step 1.2: Initialize Git in Your Project

Open PowerShell in the `swapskill` folder (backend) and run:

```powershell
cd c:\Users\laxmi\Desktop\swapskill
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 1.3: Create .gitignore Files

**For Backend (swapskill folder):**

Create [swapskill/.gitignore](swapskill/.gitignore):
```
# Maven
target/
.classpath
.project
.settings/
*.class

# IDEs
.idea/
.vscode/
*.swp
*.swo
.DS_Store

# Environment
.env
.env.local

# Dependencies
node_modules/
npm-debug.log

# Logs
logs/
*.log

# Build
build/
dist/
```

**For Frontend (skillswap folder):**

Create [skillswap/.gitignore](skillswap/.gitignore):
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/

# Logs
logs/
npm-debug.log*
yarn-debug.log*

# Environment
.env
.env.local
.env.development.local

# Editor
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

### Step 1.4: Create Root .gitignore

Create root [.gitignore](.gitignore):
```
# OS
.DS_Store
Thumbs.db

# Editors
.vscode/
.idea/
*.swp

# Environments
.env
.env.local
```

### Step 1.5: Commit and Push to GitHub

```powershell
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: SkillSwap application"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/skillswap.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Phase 2: Database Setup on Render

### Step 2.1: Choose Database Type

**Recommended: PostgreSQL (Free Tier)**

**Pros:**
- Free tier with 256MB storage
- Reliable ACID compliance
- Great for relational data
- Auto-backups
- Easy scaling

**Alternative: MySQL** (Also available on Render)

### Step 2.2: Create PostgreSQL Database on Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "PostgreSQL"
4. Fill in the form:
   - **Name**: `skillswap-db`
   - **Database**: `skillswap`
   - **User**: `skillswap_user`
   - **Region**: Choose region closest to your users
   - **Version**: Latest (e.g., 16)
5. Click "Create Database"
6. **Save these credentials:**
   - Hostname
   - Database name
   - Port (5432)
   - Username
   - Password

### Step 2.3: Configure Backend for Database

Update [swapskill/src/main/resources/application.properties](swapskill/src/main/resources/application.properties):

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://<RENDER_HOSTNAME>:5432/<DATABASE_NAME>
spring.datasource.username=<RENDER_USERNAME>
spring.datasource.password=<RENDER_PASSWORD>
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL12Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Connection Pool
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
```

**For Local Development**, create `application-local.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillswap
spring.datasource.username=postgres
spring.datasource.password=your_local_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL12Dialect
spring.jpa.hibernate.ddl-auto=update
```

### Step 2.4: Update pom.xml for PostgreSQL

Ensure [swapskill/pom.xml](swapskill/pom.xml) includes PostgreSQL driver:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## Phase 3: Deploy Backend to Render

### Step 3.1: Update application.properties for production

Update [swapskill/src/main/resources/application.properties](swapskill/src/main/resources/application.properties) for Render:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database - Will use environment variables on Render
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver

# Logging
logging.level.root=INFO
logging.level.com.skillswap=DEBUG
```

### Step 3.2: Create render.yaml

Create [swapskill/render.yaml](swapskill/render.yaml):

```yaml
services:
  - type: web
    name: skillswap-backend
    env: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -jar target/swapskill-0.0.1-SNAPSHOT.jar
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: skillswap-db
          property: connectionString
      - key: JAVA_OPTS
        value: "-Dserver.port=8080"
      - key: ENVIRONMENT
        value: production
    autoDeploy: true
```

### Step 3.3: Create Render Service

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `skillswap-backend`
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/swapskill-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free
5. Click "Create Web Service"
6. **Save the deployed URL** (e.g., `https://skillswap-backend.onrender.com`)

### Step 3.4: Add Environment Variables on Render

In Render dashboard for your service:
1. Go to "Environment"
2. Add variables:
   - `DATABASE_URL`: (auto-filled from linked database)
   - `JAVA_OPTS`: `-Dserver.port=8080`

---

## Phase 4: Deploy Frontend to Vercel

### Step 4.1: Update API Endpoint

Update [skillswap/src/api/axiosInstance.js](skillswap/src/api/axiosInstance.js):

```javascript
import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const API_BASE_URL = process.env.VITE_API_URL || 'https://skillswap-backend.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
```

### Step 4.2: Create .env.production

Create [skillswap/.env.production](skillswap/.env.production):

```
VITE_API_URL=https://skillswap-backend.onrender.com/api
VITE_WS_URL=wss://skillswap-backend.onrender.com/ws
```

### Step 4.3: Update vite.config.js (if needed)

Verify [skillswap/vite.config.js](skillswap/vite.config.js):

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

### Step 4.4: Create vercel.json

Create [skillswap/vercel.json](skillswap/vercel.json):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_WS_URL": "@vite_ws_url"
  }
}
```

### Step 4.5: Choose Deployment Option

#### Option A: Deploy from GitHub (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select `skillswap` as the root directory
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: `https://skillswap-backend.onrender.com/api`
   - `VITE_WS_URL`: `wss://skillswap-backend.onrender.com/ws`
6. Click "Deploy"

#### Option B: Deploy Manually

```powershell
cd c:\Users\laxmi\skillswap

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### Step 4.6: Vercel Dashboard Configuration

After deployment:
1. Go to your Vercel project settings
2. Set **Production Branch**: `main`
3. Enable **Automatic Deployments**
4. Add custom domain (optional)

---

## Phase 5: Connect Frontend & Backend

### Step 5.1: Update Backend CORS Settings

Update [swapskill/src/main/java/com/skillswap/config/CorsConfig.java](swapskill/src/main/java/com/skillswap/config/CorsConfig.java):

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "https://*.vercel.app",
                    "https://your-custom-domain.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Step 5.2: Test Integration

1. Visit your Vercel deployment URL
2. Test login/registration
3. Check browser console for errors
4. Test all major features:
   - Chat
   - Sessions
   - Connections

---

## Phase 6: Monitoring & Maintenance

### Render Backend Monitoring

1. Go to Render dashboard
2. Check "Logs" for errors
3. Monitor Memory/CPU usage
4. Set up email alerts (paid feature)

### Vercel Frontend Monitoring

1. Go to Vercel Analytics
2. Monitor Core Web Vitals
3. Check error tracking
4. Review deployment history

### Database Backups

Render PostgreSQL automatically backs up:
- Daily backups (7-day retention on free tier)
- Manual backups available
- Export data via pgAdmin interface

---

## Phase 7: Custom Domain (Optional)

### Add Custom Domain on Vercel

1. Vercel Dashboard → Project Settings
2. Go to "Domains"
3. Add your domain (e.g., `skillswap.com`)
4. Update DNS records as shown
5. Wait for verification

### Update Backend URL

Update environment variables on Render and Vercel to use custom domain.

---

## Troubleshooting

### Backend Won't Deploy

```
# Check build logs on Render
# Ensure pom.xml has all dependencies
# Verify Java version compatibility
mvn clean verify
```

### Database Connection Failed

```
# Verify DATABASE_URL format
# Check credentials match Render settings
# Ensure PostgreSQL driver in pom.xml
# Test connection locally first
```

### Frontend Shows Blank Page

```
# Check browser console for errors
# Verify API_URL environment variables
# Check CORS settings on backend
# Verify WebSocket configuration
```

### WebSocket Connection Issues

```
# Update WS_URL to use wss:// for production
# Check backend supports WebSocket
# Verify WebSocketConfig in backend
# Check firewall/proxy settings
```

---

## Free Tier Limits

| Service | Limit | Solution |
|---------|-------|----------|
| Render Web Service | 750 hours/month | Upgrade or use multiple projects |
| Render PostgreSQL | 256MB storage | Archive old data periodically |
| Vercel | 100GB bandwidth/month | Usually sufficient |
| GitHub | Unlimited free repos | No action needed |

---

## Cost Breakdown (Monthly)

| Service | Cost |
|---------|------|
| GitHub | Free |
| Vercel | Free (with limitations) |
| Render Backend | Free (with limitations) |
| Render Database | Free (256MB) |
| **Total** | **Free** |

---

## Next Steps After Deployment

1. ✅ Test all features in production
2. ✅ Set up monitoring and alerts
3. ✅ Configure custom domain
4. ✅ Enable HTTPS (automatic on Vercel)
5. ✅ Back up database regularly
6. ✅ Monitor error logs
7. ✅ Plan scaling strategy if needed

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React/Vite Docs**: https://vitejs.dev

---

**Questions? Refer to specific service documentation or check deployment logs for error messages.**
