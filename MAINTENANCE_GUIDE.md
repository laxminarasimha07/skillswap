# SkillSwap Maintenance & Best Practices Guide

## 📋 Post-Deployment Checklist

### Security

- [ ] Enable HTTPS (automatic on Vercel & Render)
- [ ] Set strong database password
- [ ] Enable GitHub branch protection for `main`
- [ ] Review environment variables (no secrets in code)
- [ ] Check CORS origins are restricted
- [ ] Enable database backups
- [ ] Monitor for security updates

### Database

- [ ] Verify PostgreSQL connectivity
- [ ] Set up automated backups
- [ ] Monitor storage usage (256MB free tier)
- [ ] Plan archival strategy for old data
- [ ] Document database schema
- [ ] Create maintenance user for backups

### Monitoring

- [ ] Set up error alerts
- [ ] Monitor API response times
- [ ] Track database performance
- [ ] Review logs weekly
- [ ] Monitor user growth metrics

---

## 🔄 Continuous Deployment Workflow

### Local Development

```powershell
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/new-feature

# Make changes & test locally
npm run dev  # Frontend
mvn spring-boot:run  # Backend

# Commit & push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Pull Request & Review

1. Create Pull Request on GitHub
2. Run automated tests
3. Get team review
4. Merge to main
5. Vercel & Render auto-deploy

---

## 🐛 Common Issues & Solutions

### Issue: Frontend can't connect to backend

**Symptoms**: Browser console shows 404 or CORS error

**Solution:**
1. Verify backend URL in `.env.production`
2. Check CORS settings in backend
3. Verify backend is running on Render
4. Check network tab in browser DevTools

```bash
# Test backend endpoint
curl https://skillswap-backend.onrender.com/api/health
```

### Issue: WebSocket disconnection

**Symptoms**: Chat messages don't sync

**Solution:**
1. Update WS_URL to use `wss://` (secure)
2. Verify backend WebSocket configuration
3. Check firewall/proxy settings
4. Test with browser WebSocket client

```javascript
// Test WebSocket
const ws = new WebSocket('wss://skillswap-backend.onrender.com/ws');
ws.onopen = () => console.log('Connected');
```

### Issue: Database connection timeout

**Symptoms**: "Connection refused" errors

**Solution:**
1. Verify Render PostgreSQL is running
2. Check credentials in `application.properties`
3. Ensure DATABASE_URL environment variable is set
4. Test connection from Render Web Service logs

### Issue: Slow page loads

**Symptoms**: Vercel reports slow Core Web Vitals

**Solution:**
1. Review Vercel Analytics
2. Optimize images
3. Lazy load components
4. Check API response times
5. Enable caching headers

---

## 📊 Performance Optimization

### Frontend (Vercel)

```javascript
// Lazy load routes
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Image optimization
<img src="image.jpg" alt="..." loading="lazy" />

// Bundle analysis
npx vite-plugin-visualizer
```

### Backend (Spring Boot)

```java
// Connection pooling
@Bean
public DataSource dataSource() {
    return DataSourceBuilder.create()
        .driverClassName("org.postgresql.Driver")
        .url(dbUrl)
        .username(dbUser)
        .password(dbPass)
        .type(HikariDataSource.class)
        .build();
}

// Caching
@Cacheable("users")
public User getUserById(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

### Database (PostgreSQL)

```sql
-- Create indexes for frequently queried fields
CREATE INDEX idx_connections_user ON connections(senderId, receiverId);
CREATE INDEX idx_messages_sender ON messages(senderId, createdAt);
CREATE INDEX idx_sessions_user1 ON sessions(user1Id);
```

---

## 🔐 Security Hardening

### Environment Variables Protection

Never commit these to Git:
```
.env.local
.env.production.local
Database credentials
API keys
JWT secrets
```

### CORS Configuration

Strict CORS in production:
```java
.allowedOrigins(
    "https://your-domain.vercel.app",
    "https://your-custom-domain.com"
)
```

### SQL Injection Prevention

Use parameterized queries (Spring Data JPA does this):
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);  // Safe from SQL injection
}
```

### CSRF Protection

Ensure CSRF tokens are used for state-changing operations:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        return http.build();
    }
}
```

---

## 📈 Scaling Strategy

### When to upgrade

| Metric | Free Tier Limit | Upgrade When |
|--------|-----------------|--------------|
| Storage | 256MB | > 200MB used |
| Build time | No limit | > 15 min |
| Bandwidth | 100GB/month | > 80GB used |

### Upgrade Path

1. **Database**: Render PostgreSQL Pro ($15/month)
2. **Backend**: Render Paid Plan ($7+/month)
3. **Frontend**: Vercel Pro ($20/month)
4. **CDN**: Add Cloudflare (free tier available)

---

## 🚚 Backup & Recovery Strategy

### Database Backups

**Manual Backup:**
```bash
# Using pg_dump
pg_dump -h <host> -U <user> -d skillswap > backup.sql

# To restore
psql -h <host> -U <user> -d skillswap < backup.sql
```

**Automated Backups:**
- Render PostgreSQL handles daily backups
- Exports available via Render dashboard
- Keep 7+ days of backups

### Code Backups

- GitHub is your code backup
- Never delete the GitHub repository
- Use GitHub's release feature for versioning

---

## 📝 Documentation

### Maintain updated docs

1. **README.md** - Project overview
2. **DEPLOYMENT_GUIDE.md** - Deployment steps ✅
3. **API_DOCS.md** - API endpoints (consider Swagger)
4. **CONTRIBUTING.md** - Contribution guidelines
5. **ARCHITECTURE.md** - System design

### API Documentation Example

```markdown
## User Endpoints

### GET /api/users/:id
Get user details by ID

**Request:**
```
GET /api/users/123
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "skillsOffered": ["Python", "JavaScript"]
}
```

**Status Codes:**
- 200: Success
- 404: User not found
- 401: Unauthorized
```

---

## 📊 Analytics & Monitoring

### Metrics to Track

1. **User Metrics**
   - Daily active users
   - New user signups
   - User retention rate

2. **Performance Metrics**
   - API response time
   - Page load time
   - Database query time

3. **Business Metrics**
   - Skills exchanged
   - Sessions completed
   - User satisfaction

### Tools to Use

- **Analytics**: Google Analytics (free)
- **Error Tracking**: Sentry (free tier)
- **Performance**: New Relic (free tier)
- **Monitoring**: Render built-in logs

---

## 🔄 Update & Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Respond to user issues

### Weekly
- [ ] Review performance metrics
- [ ] Check system health
- [ ] Update dependencies (`npm audit`)

### Monthly
- [ ] Plan new features
- [ ] Security patches
- [ ] Database optimization
- [ ] Backup verification

### Quarterly
- [ ] Major updates
- [ ] Security audit
- [ ] Architecture review
- [ ] Scaling assessment

---

## 🚨 Emergency Procedures

### If Backend Crashes

1. Check Render logs for errors
2. Review recent deployments
3. Check database connectivity
4. Restart service from Render dashboard
5. Rollback last deployment if needed

### If Database is Down

1. Check Render PostgreSQL dashboard
2. Verify connection credentials
3. Check storage limits
4. Restore from backup if corrupted
5. Contact Render support

### If Frontend is Down

1. Check Vercel deployment logs
2. Verify recent git commits
3. Check build logs for errors
4. Rollback to previous version
5. Re-deploy with `vercel --prod`

---

## 📞 Support Contacts

- **Render Support**: https://support.render.com
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: Your repository issues
- **Community**: Stack Overflow, GitHub Discussions

---

## ✅ Checklist for Production Readiness

- [ ] HTTPS enabled on all endpoints
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Error monitoring enabled
- [ ] Performance monitoring enabled
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Rate limiting configured
- [ ] Load testing completed
- [ ] Disaster recovery plan documented

---

**Remember: Always test changes in development before deploying to production!**
