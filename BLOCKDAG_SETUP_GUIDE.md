# 🚀 BLOCKDAG HASHING HEROS - SETUP & DEPLOYMENT GUIDE

**Version:** 2.0 (BlockDAG Powered)  
**Last Updated:** November 21, 2025  
**Status:** Production Ready

---

## 📋 TABLE OF CONTENTS
1. [Quick Start](#quick-start)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## ⚡ QUICK START

### For Judges (Fastest Path)

```bash
# 1. Clone the repo
git clone https://github.com/Maxephraim09/Hash-Heros.git
cd Hash-Heros/client

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open browser
# Navigate to http://localhost:3000

# 5. Connect MetaMask
# Click "🦊 Connect MetaMask" button
# Accept network switch to BlockDAG Awakening Testnet
# Get test BDAG from https://awakening.bdagscan.com/faucet

# 6. Play!
# Tap to earn tokens
# Evolve your NFT
# Build reputation
```

**Time to Play:** ~5 minutes

---

## 🖥️ SYSTEM REQUIREMENTS

### Minimum
- Node.js 14.0+ (recommend 16+)
- npm 6.0+ or yarn
- 4GB RAM
- Modern browser with MetaMask support

### Recommended
- Node.js 18 LTS
- npm 9+
- 8GB RAM
- Chrome/Edge (Chromium-based)
- Broadband internet (10+ Mbps)

### Tested On
- ✅ Windows 10/11
- ✅ macOS 12+
- ✅ Ubuntu 20.04+
- ✅ Arch Linux

---

## 📦 INSTALLATION

### Step 1: Clone Repository

```bash
# HTTPS
git clone https://github.com/Maxephraim09/Hash-Heros.git

# SSH (if configured)
git clone git@github.com:Maxephraim09/Hash-Heros.git

cd Hash-Heros
```

### Step 2: Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Optional: Install blockdag-sim (backend simulator)
cd ../blockdag-sim
npm install

# Install mock-api (optional)
cd ../mock-api
npm install
```

### Step 3: Install MetaMask (if not already installed)

Visit: https://metamask.io/download/

### Step 4: Verify Installation

```bash
# Check Node.js version
node --version  # Should be 14.0+

# Check npm version
npm --version   # Should be 6.0+

# Check installed packages
cd client
npm list | head -20
```

---

## ⚙️ CONFIGURATION

### BlockDAG Network Configuration

The application automatically connects to BlockDAG Awakening Testnet.

**Network Details:**
- **Chain ID:** 1043
- **RPC URL:** https://rpc.awakening.bdagscan.com
- **Explorer:** https://awakening.bdagscan.com
- **Faucet:** https://awakening.bdagscan.com/faucet
- **Currency:** BDAG
- **Decimals:** 18

### Manual Network Addition (if Auto-Switch Fails)

1. Open MetaMask
2. Click Network dropdown → "Add Network"
3. Fill in:
   - **Network Name:** BlockDAG Awakening Testnet
   - **RPC URL:** https://rpc.awakening.bdagscan.com
   - **Chain ID:** 1043
   - **Currency Symbol:** BDAG
   - **Block Explorer:** https://awakening.bdagscan.com

4. Click "Save"

### Environment Variables (Optional)

Create `.env` file in `client/` directory:

```bash
# .env (optional for development)
REACT_APP_BLOCKDAG_RPC=https://rpc.awakening.bdagscan.com
REACT_APP_BLOCKDAG_CHAIN_ID=1043
REACT_APP_BLOCKDAG_EXPLORER=https://awakening.bdagscan.com
REACT_APP_API_URL=http://localhost:4002
REACT_APP_BLOCKDAG_SIM_URL=http://localhost:4001
```

---

## 🧪 TESTING

### Unit Testing

```bash
cd client

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Manual Testing Checklist

#### Wallet Connection
- [ ] Click "🦊 Connect MetaMask"
- [ ] Account displayed correctly
- [ ] Balance shows BDAG amount
- [ ] Network shows "BlockDAG Awakening"

#### Token Earning
- [ ] Click "Tap" button (TapToEarn)
- [ ] XP increases
- [ ] Energy decreases
- [ ] Pending tokens increase in TokenDashboard

#### NFT Evolution
- [ ] Accumulate 200 XP
- [ ] Click "Evolve (200 XP)"
- [ ] NFT image changes
- [ ] Level increases
- [ ] Reputation increases

#### Reputation System
- [ ] Check ReputationBadge component
- [ ] Confirm tier displays correctly
- [ ] Verify badge unlocks at thresholds
- [ ] Test "Add 5 Rep" button

#### Token Claiming
- [ ] Earn some pending tokens
- [ ] Click "🎯 Claim Now" button
- [ ] Monitor claiming process
- [ ] Verify claimed balance increases
- [ ] Verify transaction appears in history

#### Instant Transfer
- [ ] Click "Send NFT Instantly"
- [ ] Monitor confirmation time (~1-2 sec)
- [ ] Check transfer appears in activities
- [ ] Verify explorer link works

### Performance Testing

```bash
# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Check performance metrics
npm run lighthouse  # (if configured)
```

---

## 🌐 DEPLOYMENT

### Development Server

```bash
cd client
npm start

# Server runs on http://localhost:3000
# Hot-reload enabled
```

### Production Build

```bash
cd client

# Create optimized build
npm run build

# Build output in client/build/
# Ready for deployment to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Any static hosting
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, defaults work fine
# Your app will be live in ~1 minute
```

### Deploy to Netlify

```bash
# Option 1: Drag & drop
# Just drag the client/build/ folder to netlify.com

# Option 2: CLI
npm install -g netlify-cli
netlify deploy --prod --dir=client/build
```

### Deploy to Traditional Server (VPS/Dedicated)

```bash
# Build the app
cd client
npm run build

# Copy build folder to server
scp -r build/ user@server:/var/www/hashing-heros/

# Configure nginx
# (See nginx.conf example below)

# Restart web server
sudo systemctl restart nginx
```

**nginx.conf example:**
```nginx
server {
    listen 80;
    server_name hashing-heros.com;
    
    root /var/www/hashing-heros/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 📊 MONITORING

### Application Health

Check these endpoints in production:

```bash
# Health check
curl https://hashing-heros.com/
# Should return HTML with app loaded

# Check Core Web Vitals
# Open DevTools → Lighthouse → Run audit
# Target: 90+ scores
```

### Transaction Monitoring

View all transactions on BlockDAG Explorer:
https://awakening.bdagscan.com/

### User Analytics

Integrate with analytics provider:

```javascript
// Add to App.js
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <AppContent />
      <Analytics />
    </>
  );
}
```

### Performance Monitoring

```javascript
// Already integrated in web3Service.js
import { performanceMonitor } from './utils/performanceMonitoring';

// Automatically tracks:
// - First Contentful Paint (FCP)
// - Largest Contentful Paint (LCP)
// - Time to Interactive (TTI)
// - Cumulative Layout Shift (CLS)
```

---

## 🔧 TROUBLESHOOTING

### "MetaMask not detected"

**Problem:** Button shows "MetaMask not detected"

**Solutions:**
1. Install MetaMask from https://metamask.io/
2. Reload page (F5)
3. Check MetaMask is enabled in browser extensions
4. Try incognito/private mode (check extension permissions)

---

### "Wrong Network" or Can't Auto-Switch

**Problem:** Network won't switch to BlockDAG

**Solutions:**
1. Manually add network (see Configuration section)
2. Use MetaMask mobile (better UX)
3. Ensure MetaMask has permission for this site
4. Check RPC URL is correct: https://rpc.awakening.bdagscan.com

---

### "Connection Timed Out"

**Problem:** Can't connect to BlockDAG RPC

**Solutions:**
1. Check internet connection
2. Verify RPC is online: https://status.blockdag.io
3. Try external RPC: https://nownodes.io/nodes/bdag-blockdag
4. Check firewall/VPN settings

---

### "Transaction Pending Forever"

**Problem:** Transaction doesn't confirm

**Solutions:**
1. Check BlockDAG Explorer: https://awakening.bdagscan.com
2. Verify transaction hash is correct
3. Confirm you have balance
4. Retry (usually confirms in 1-2 seconds)

---

### "Build Failed"

**Problem:** `npm run build` fails

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build

# If still failing, check errors:
npm run build 2>&1 | tee build.log
cat build.log
```

---

### "Port 3000 Already in Use"

**Problem:** Dev server won't start (port 3000 taken)

**Solutions:**
```bash
# Use different port
PORT=3001 npm start

# Or kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

### "Low Performance / Slow Load"

**Problem:** App loads slowly

**Solutions:**
1. Check DevTools → Network tab for slow resources
2. Verify Service Worker is caching properly
3. Build production version: `npm run build`
4. Check bundle size: `npm run analyze`
5. Enable Brotli compression on server
6. Use CDN for static assets

---

## 📞 SUPPORT & RESOURCES

### Documentation
- **Main Docs:** See JUDGES_FEEDBACK_RESPONSE.md
- **Performance:** COMPREHENSIVE_PERFORMANCE_REPORT.md
- **Design:** RESPONSIVE_DESIGN_IMPLEMENTATION.md

### Community
- **GitHub Issues:** Post bugs/feature requests
- **Discord:** [BlockDAG Discord]
- **Twitter:** [@HashingHeros](https://twitter.com/hashtag/blockhero)

### Testnet Resources
- **Faucet:** https://awakening.bdagscan.com/faucet (get test BDAG)
- **Explorer:** https://awakening.bdagscan.com
- **Status:** https://status.blockdag.io
- **Docs:** https://docs.blockdag.io

### Contract Addresses (Awakening Testnet)
- Coming soon after deployment

---

## 📝 DEPLOYMENT CHECKLIST

Before going live:

- [ ] All tests passing
- [ ] Production build created
- [ ] Environment variables set
- [ ] MetaMask network configured
- [ ] HTTPS enabled
- [ ] CDN configured (optional)
- [ ] Analytics integrated
- [ ] Error tracking enabled
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place

---

## 🎉 YOU'RE READY!

Your Hashing Heros application is ready for:
- ✅ Judge review
- ✅ Production deployment
- ✅ User testing
- ✅ Scaling to thousands of users

**Next Steps:**
1. Share deployment link with judges
2. Collect feedback
3. Iterate based on user behavior
4. Deploy v2.0 with additional features

---

**Questions?** Check JUDGES_FEEDBACK_RESPONSE.md for detailed feature explanations or see troubleshooting above.

**Good luck! 🚀 Let BlockDAG speed change the game.**
