# Quick Reference Card

## 🚀 Essential Commands

```bash
# Setup
yarn install              # Install dependencies
yarn dev                  # Start development server (port 3000)
yarn dev -p 3001         # Use different port

# Testing
yarn test                # Run all tests
yarn test:watch          # Watch mode
yarn test:coverage       # Coverage report

# Building
yarn build               # Production build
yarn start               # Run production server
yarn lint                # Run ESLint
```

## 📁 Key Files

```
lib/scraper.ts           # Web scraping logic
lib/openai.ts            # AI integration
lib/db.ts                # Database operations
app/api/analyze/route.ts # Main API endpoint
app/page.tsx             # Main UI
components/              # React components
__tests__/               # Test files
```

## 🔧 Configuration

```bash
.env                     # Environment variables (pre-configured)
tsconfig.json            # TypeScript settings
tailwind.config.js       # Tailwind settings
jest.config.js           # Jest settings
next.config.js           # Next.js settings
```

## 🎯 API Endpoints

```
POST   /api/analyze           # Analyze URL
GET    /api/reports           # List all reports
GET    /api/reports/[id]      # Get single report
DELETE /api/reports/[id]      # Delete report
```

## 🧪 Test URLs

```
example.com              # Simple test (5 sec)
github.com               # Well-optimized (8 sec)
news.ycombinator.com     # Minimal design (6 sec)
```

## ⚡ Quick Troubleshooting

```bash
# Port in use
yarn dev -p 3001

# Clean install
rm -rf node_modules .next data
yarn install

# Reset database
rm -rf data

# Clear cache
rm -rf .next
```

## 📊 Project Stats

- **Language:** TypeScript (100%)
- **Lines:** 2,000+
- **Tests:** 30+
- **Time:** 5-6 hours
- **Coverage:** High

## 🎬 Demo Flow

1. Enter URL
2. Click "Analyze SEO"
3. View metadata
4. Read AI feedback
5. Export report
6. Check history

## 📧 Submission Email

```
To: leonmoyer@ftmedia.com
Subject: Coding Challenge - Flavio Espinoza - Option 3

Attach: Repository link or zip file
Include: Start/end timestamps
```

## 🔗 Documentation

- README.md → Full docs
- QUICKSTART.md → Setup
- PROJECT_SUMMARY.md → Overview
- DEMO_GUIDE.md → Testing
- TROUBLESHOOTING.md → Issues

## 💡 Pro Tips

✓ Always restart after .env changes
✓ Test with example.com first
✓ Check .env is configured
✓ Clear .next for weird issues
✓ Read error messages carefully
✓ Use DevTools Network tab

## ✅ Pre-Demo Checklist

- [ ] yarn install works
- [ ] yarn dev starts
- [ ] yarn test passes
- [ ] Can analyze URLs
- [ ] Export works
- [ ] History loads
- [ ] No console errors

Everything you need on one page! 🚀