# SkillSwap Quick Deployment Checklist

## 🚀 5-Minute Setup

### 1. GitHub Setup (2 minutes)

```powershell
# In swapskill folder
cd c:\Users\laxmi\Desktop\swapskill
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skillswap.git
git branch -M main
git push -u origin main
```

### 2. Database Setup (1 minute)

1. Go to https://render.com
2. Click "New +" → "PostgreSQL"
3. Set Name: `skillswap-db` → Create
4. **Copy credentials** (save in notepad)

### 3. Backend Deployment (1 minute)

**Update [swapskill/src/main/resources/application.properties](swapskill/src/main/resources/application.properties):**

```properties
spring.datasource.url=jdbc:postgresql://<RENDER_HOSTNAME>:5432/skillswap
spring.datasource.username=<YOUR_USERNAME>
spring.datasource.password=<YOUR_PASSWORD>
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL12Dialect
spring.jpa.hibernate.ddl-auto=update
```

Then:
1. Go to https://render.com → "New Web Service"
2. Connect GitHub → Select `skillswap` repository
3. Build Command: `mvn clean package -DskipTests`
4. Start Command: `java -jar target/swapskill-0.0.1-SNAPSHOT.jar`
5. Choose Free plan → Deploy
6. **Copy backend URL** (e.g., `https://skillswap-backend.onrender.com`)

### 4. Frontend Deployment (1 minute)

**Update [skillswap/src/api/axiosInstance.js](skillswap/src/api/axiosInstance.js):**

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'https://skillswap-backend.onrender.com/api';
// Replace with your actual backend URL
```

**Create [skillswap/.env.production](skillswap/.env.production):**

```
VITE_API_URL=https://skillswap-backend.onrender.com/api
VITE_WS_URL=wss://skillswap-backend.onrender.com/ws
```

Then:
1. Go to https://vercel.com → Import Project
2. Select GitHub repository
3. Root Directory: `skillswap`
4. Add Environment Variables from `.env.production`
5. Deploy

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend URL accessible in browser (should show error page, not blank)
- [ ] Frontend loads without console errors
- [ ] Can login/register
- [ ] Can send messages in chat
- [ ] Can propose sessions
- [ ] Google Calendar redirect works
- [ ] No duplicate chat messages shown

---

## 📊 Dashboard URLs

| Service | URL |
|---------|-----|
| GitHub | https://github.com/YOUR_USERNAME/skillswap |
| Render Backend | https://dashboard.render.com |
| Vercel Frontend | https://vercel.com/dashboard |
| Database | Render → PostgreSQL instance |

---

## 🆘 Quick Debug

**Backend logs**: Render Dashboard → Logs
**Frontend logs**: Browser Console (F12)
**Database issue**: Check PostgreSQL credentials match

---

## 🎯 Estimated Timeline

- GitHub setup: **5 min**
- Database creation: **2 min**
- Backend deployment: **5-10 min**
- Frontend deployment: **5-10 min**
- Testing: **3-5 min**

**Total: ~25-30 minutes**

---

**All set! Your app is now live! 🎉**
