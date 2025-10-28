# Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Issue: Port 3000 Already in Use

**Error Message:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Use Different Port:**

```bash
yarn dev -p 3001
```

2. **Kill Process Using Port 3000:**

```bash
# Find process
lsof -ti:3000

# Kill process (Mac/Linux)
kill -9 $(lsof -ti:3000)

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Issue: Module Not Found

**Error Message:**

```
Module not found: Can't resolve '@/components/...'
```

**Solutions:**

1. **Reinstall Dependencies:**

```bash
rm -rf node_modules
rm yarn.lock
yarn install
```

2. **Check TypeScript Config:**
   Verify `tsconfig.json` has:

```json
"paths": {
  "@/*": ["./*"]
}
```

3. **Restart Dev Server:**

```bash
# Stop server (Ctrl+C)
yarn dev
```

---

### Issue: OpenAI API Error

**Error Message:**

```
OpenAI API error: 401 Unauthorized
```

**Solutions:**

1. **Check API Key:**

```bash
# Verify .env file exists
cat .env

# Should show:
OPENAI_API_KEY=sk-proj...
```

2. **Restart Server:**
   Changes to `.env` require server restart

```bash
# Stop and restart
yarn dev
```

3. **Verify API Key:**

- Check key isn't expired
- Ensure no extra spaces
- Confirm key has GPT-4 access

---

### Issue: Database Errors

**Error Message:**

```
Error: SQLITE_CANTOPEN: unable to open database file
```

**Solutions:**

1. **Create Data Directory:**

```bash
mkdir -p data
```

2. **Check Permissions:**

```bash
chmod 755 data
```

3. **Reset Database:**

```bash
rm -rf data
# Restart server - DB will auto-create
yarn dev
```

---

### Issue: Scraping Timeout

**Error Message:**

```
Request timeout - the website took too long to respond
```

**Solutions:**

1. **Try Simpler Site:**
   Test with `example.com` first

2. **Increase Timeout:**
   Edit `lib/scraper.ts`:

```typescript
const timeout = setTimeout(() => controller.abort(), 20000) // 20 seconds
```

3. **Check Internet Connection:**

```bash
curl -I https://example.com
```

---

### Issue: Tests Failing

**Error Message:**

```
FAIL __tests__/scraper.test.ts
```

**Solutions:**

1. **Install Test Dependencies:**

```bash
yarn install
```

2. **Clear Jest Cache:**

```bash
yarn jest --clearCache
yarn test
```

3. **Check Node Version:**

```bash
node --version
# Should be 18.x or higher
```

4. **Run Specific Test:**

```bash
yarn test scraper.test.ts
```

---

### Issue: Build Fails

**Error Message:**

```
Type error: Cannot find module...
```

**Solutions:**

1. **Clean Build:**

```bash
rm -rf .next
yarn build
```

2. **Check TypeScript:**

```bash
yarn tsc --noEmit
```

3. **Fix Import Paths:**
   Ensure all imports use `@/` alias correctly

---

### Issue: Styles Not Loading

**Symptoms:**

- No Tailwind styles
- Plain HTML appearance

**Solutions:**

1. **Check Tailwind Config:**
   Verify `tailwind.config.js` content array:

```javascript
content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}']
```

2. **Verify CSS Import:**
   Check `app/globals.css` has:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. **Clear Next Cache:**

```bash
rm -rf .next
yarn dev
```

---

### Issue: Slow Performance

**Symptoms:**

- Long analysis times (> 20 seconds)
- Sluggish UI

**Solutions:**

1. **Check Network:**

```bash
curl -w "@curl-format.txt" -o /dev/null -s https://api.openai.com
```

2. **Monitor API Calls:**
   Open DevTools Network tab, filter by API

3. **Database Optimization:**

```bash
# If many reports, clear old ones
rm -rf data/*.db
```

---

### Issue: Environment Variables Not Loading

**Error Message:**

```
OpenAI API key is undefined
```

**Solutions:**

1. **Create .env File:**

```bash
cp .env.example .env
# Edit with your API key
```

2. **Restart Server:**

```bash
# Always restart after .env changes
yarn dev
```

3. **Check Syntax:**
   No quotes needed in .env:

```
# Correct
OPENAI_API_KEY=sk-proj...

# Wrong
OPENAI_API_KEY="sk-proj..."
```

---

## 🧪 Debugging Tips

### Enable Verbose Logging

Add to `.env`:

```
NODE_ENV=development
DEBUG=*
```

### Check API Responses

Add console logs in `app/api/analyze/route.ts`:

```typescript
console.log('Scraped metadata:', metadata)
console.log('AI response:', aiFeedback)
```

### Inspect Database

```bash
sqlite3 data/seo-reports.db
.tables
.schema seo_reports
SELECT * FROM seo_reports LIMIT 5;
.quit
```

### Test Components Individually

```bash
# Test specific component
yarn test components.test.tsx

# Watch mode
yarn test:watch
```

---

## 📊 Health Checks

### Verify Installation

Run these commands to verify everything works:

```bash
# 1. Dependencies installed
ls node_modules/@types/react

# 2. TypeScript compiles
yarn tsc --noEmit

# 3. Tests pass
yarn test

# 4. Build succeeds
yarn build

# 5. Server starts
yarn dev
```

Expected: All commands succeed

---

### Verify Functionality

1. **Server Running:**

```bash
curl http://localhost:3000
# Should return HTML
```

2. **API Working:**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

3. **Database Created:**

```bash
ls -la data/
# Should show seo-reports.db
```

---

## 🆘 When All Else Fails

### Nuclear Option: Fresh Install

```bash
# 1. Backup .env
cp .env .env.backup

# 2. Clean everything
rm -rf node_modules .next data
rm yarn.lock

# 3. Fresh install
yarn install

# 4. Restore .env
cp .env.backup .env

# 5. Start fresh
yarn dev
```

### Check System Requirements

Minimum requirements:

- Node.js: 18.17.0 or higher
- Yarn: 1.22.0 or higher
- RAM: 2GB available
- Disk: 500MB available

```bash
# Check versions
node --version
yarn --version
```

---

## 📝 Error Reporting

If you encounter a bug:

1. **Note Error Message:**
   Copy full error from terminal

2. **Note Steps to Reproduce:**
   What did you do before error?

3. **Check Logs:**
   Look in browser console and terminal

4. **Environment Info:**

   ```bash
   node --version
   yarn --version
   cat .env | grep -v 'API_KEY'
   ```

5. **Create Issue:**
   Include all above information

---

## 🎯 Quick Fixes Cheat Sheet

| Problem            | Quick Fix                             |
| ------------------ | ------------------------------------- |
| Module not found   | `rm -rf node_modules && yarn install` |
| Port in use        | `yarn dev -p 3001`                    |
| Database error     | `rm -rf data && yarn dev`             |
| Styles not working | `rm -rf .next && yarn dev`            |
| Tests failing      | `yarn jest --clearCache && yarn test` |
| API not working    | Restart server after `.env` changes   |
| Build failing      | `rm -rf .next && yarn build`          |
| Slow performance   | Clear database or browser cache       |

---

## 💡 Pro Tips

1. **Always check .env first** - Most issues relate to missing/wrong API key
2. **Restart after config changes** - Next.js caches configuration
3. **Clear .next folder often** - Fixes many weird build issues
4. **Check Node version** - Use Node 18+ for best compatibility
5. **Read error messages** - They usually tell you exactly what's wrong
6. **Use fresh terminals** - Sometimes environment variables don't update
7. **Test with simple URLs first** - Use `example.com` to verify basic functionality
8. **Check network tab** - DevTools shows all API calls and responses

---

## 🚀 Performance Optimization

If experiencing slow performance:

1. **Reduce Report History:**

```typescript
// In lib/db.ts, reduce default limit
getAllReports: (limit = 10) => { // Changed from 50
```

2. **Shorter Timeouts:**

```typescript
// In lib/scraper.ts
const timeout = setTimeout(() => controller.abort(), 5000) // Faster
```

3. **Smaller AI Responses:**

```typescript
// In lib/openai.ts
max_tokens: 500, // Changed from 1000
```

---

## ✅ Verification Checklist

Before submitting or demoing:

- [ ] `yarn install` succeeds
- [ ] `yarn dev` starts server
- [ ] `yarn test` all pass
- [ ] `yarn build` succeeds
- [ ] Can analyze example.com
- [ ] Report history loads
- [ ] Export works
- [ ] Delete works
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] .env is configured
- [ ] README is accurate

If all checked, you're ready to go! 🎉

---

## 📞 Getting Help

If stuck:

1. Check this guide first
2. Review error messages carefully
3. Search error message online
4. Check Next.js documentation
5. Review the code comments
6. Ask for help with specific error message

Remember: Most issues have simple solutions! Don't give up. 💪
