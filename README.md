# Nestandkey API Server

Production backend API server for the Nestandkey Dubai Luxury Real Estate Platform.

## Quick Start for Deployment

### 1. Deploy on Render (Recommended Free/Starter)
1. Push this folder to a GitHub repository (e.g. `N-K-server`).
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Web Service** -> Connect your GitHub repo `N-K-server`.
4. Set:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://ashmeetsingh022_db_user:njgaFmMjA8qNS5Z3@cluster0.bxvvz4o.mongodb.net/nestandkey?appName=Cluster0`
   - `JWT_SECRET` = `nestandkey_super_secret_jwt_key_2026_dubai_luxury_real_estate`
   - `JWT_REFRESH_SECRET` = `nestandkey_refresh_secret_jwt_key_2026_ultra_prime`
   - `CLIENT_URL` = Your deployed Web URL (e.g. `https://your-web.vercel.app`)
   - `ADMIN_URL` = Your deployed Admin URL (e.g. `https://your-admin.vercel.app`)
   - `BROKER_URL` = Your deployed Broker URL (e.g. `https://your-broker.vercel.app`)
6. Deploy! Render will give you a public URL (e.g., `https://nestandkey-api.onrender.com`).
7. Use `https://nestandkey-api.onrender.com/api/v1` as `VITE_API_BASE_URL` in your web, admin, and broker deployments!
