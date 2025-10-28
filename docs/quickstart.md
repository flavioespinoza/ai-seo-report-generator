# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
yarn install
```

### 2. Start Development Server

```bash
yarn dev
```

### 3. Open Browser

Navigate to: http://localhost:3000

## Test a Website

1. Enter any URL (e.g., `https://example.com` or just `example.com`)
2. Click "Analyze SEO"
3. Wait 5-10 seconds for the report
4. View AI-powered recommendations
5. Check report history below

## Run Tests

```bash
yarn test
```

## Build for Production

```bash
yarn build
yarn start
```

## Features to Try

✅ **Analyze a URL** - Paste any website URL  
✅ **View Report** - See metadata and AI analysis  
✅ **Export Report** - Download as Markdown  
✅ **Report History** - Click any past report to view  
✅ **Delete Reports** - Click trash icon on reports

## Environment Variables

The `.env` file is already configured with:

- OpenAI API key (provided for challenge)
- Database path

No additional configuration needed!

## Troubleshooting

**Port 3000 already in use?**

```bash
yarn dev -p 3001
```

**Database errors?**
Delete the `data/` folder and restart

**Tests failing?**

```bash
yarn install
yarn test
```

## Project Structure Overview

```
app/
├── api/analyze/      → SEO analysis endpoint
├── api/reports/      → Report CRUD endpoints
└── page.tsx          → Main UI

components/           → React components
lib/                  → Business logic
__tests__/            → Test files
```

## Tech Stack Quick Ref

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite
- **AI:** OpenAI GPT-4 Mini
- **Testing:** Jest + RTL
