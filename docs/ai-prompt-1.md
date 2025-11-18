# AI SEO Report Generator - Claude Code Implementation Prompt

## Project Overview
Build an AI-powered SEO analysis tool that scrapes websites, analyzes their SEO health, and provides AI-generated optimization recommendations. This is a Next.js 14 application with React 18, TypeScript, and Tailwind CSS that features persistent report history, PDF/Markdown export, and a modern themed UI.

**Time Budget:** 5-7 focused hours for core features
**Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3, Recoil.js, MongoDB, OpenAI API, Cheerio
**Package Manager:** Yarn

## Core Requirements

### 1. URL Analysis Interface
- URL input form with validation
- Automatic `https://` prepending for incomplete URLs
- Real-time analysis with loading modal (Radix UI Dialog)
- Display comprehensive SEO report with AI feedback
- Export options (PDF and Markdown)

### 2. SEO Analysis Features
- Web scraping with Cheerio to extract:
  - Title and meta description
  - H1 tags (presence and content)
  - Favicon detection
  - Image analysis (count, alt text coverage)
  - Open Graph and Twitter Card metadata
- AI-powered recommendations using OpenAI API
- Automatic tag generation based on analysis results

### 3. Report History System
- Persistent storage of all analyzed reports
- Searchable report list with filters
- Tag-based categorization with color coding
- Sort options (date, URL, score)
- Individual report deletion with confirmation dialog
- Click to view saved reports

### 4. Export Functionality
- PDF export using html2canvas and jsPDF
- Markdown export with structured formatting
- Timestamped filenames: `seo-report-{domain}-{YYYY-MM-DD}_{HH-MM-SS}_Z.{ext}`
- Exports include full report content with all sections

### 5. Theming System
- Dark/light mode support
- CSS variable-based color system
- Fluid Tailwind spacing for responsive design
- Consistent UI components (.card, .btn, etc.)
- Radix UI primitives for accessible components

### 6. Data Persistence
- Store all reports in MongoDB database
- Collection: `reports`
- Schema: _id, url, domain, title, description, h1Tags, images, favicon, openGraph, twitterCard, aiFeedback, tags, score, analyzedAt
- Automatic tag generation and scoring

## Implementation Order

### Phase 1: Project Setup - Prettier & MongoDB (30-45 min)

#### 1.1 Install Prettier and Plugins
```bash
yarn add -D prettier @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss
```

#### 1.2 Create `.prettierrc` file at project root:
```json
{
	"arrowParens": "always",
	"useTabs": true,
	"tabWidth": 2,
	"singleQuote": true,
	"trailingComma": "none",
	"semi": false,
	"printWidth": 100,
	"importOrderSeparation": false,
	"importOrderSortSpecifiers": true,
	"importOrderGroupNamespaceSpecifiers": true,
	"importOrderParserPlugins": ["typescript", "jsx", "decorators-legacy"],
	"importOrder": [
		"^react$",
		"^react-dom$",
		"^next",
		"<THIRD_PARTY_MODULES>",
		"^@/(.*)$",
		"^[./]"
	],
	"plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
}
```

#### 1.3 Add scripts to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "clean": "prettier --write .",
    "test": "jest",
    "deploy": "vercel --prod"
  }
}
```

#### 1.4 Install core dependencies:
```bash
yarn add mongodb cheerio openai zod recoil
yarn add @radix-ui/react-dialog lucide-react
yarn add html2canvas jspdf react-markdown
yarn add fluid-tailwind
```

#### 1.5 Create `.env.example` file:
```bash
# OpenAI API Key
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=<your_openai_api_key>

# MongoDB Configuration
# Set up your database at: https://www.mongodb.com/cloud/atlas/register
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
MONGODB_DB=<your_database_name>
```

#### 1.6 Create `.env.local` (gitignored) with actual values

#### 1.7 Create TypeScript types at `src/types/report.ts`:
```typescript
// Date: 2025-11-18
// Version: 1.0.0

export interface SeoReport {
	_id?: string
	url: string
	domain: string
	title: string | null
	description: string | null
	h1Tags: string[]
	images: {
		total: number
		withAlt: number
		withoutAlt: number
	}
	favicon: boolean
	openGraph: {
		title: string | null
		description: string | null
		image: string | null
	}
	twitterCard: {
		title: string | null
		description: string | null
		image: string | null
	}
	aiFeedback: string
	tags: string[]
	score: number
	analyzedAt: Date
}

export type ReportTag = 'good' | 'warning' | 'error' | 'info'
```

#### 1.8 Create MongoDB connection at `src/lib/db.ts`:
```typescript
// Date: 2025-11-18
// Version: 1.0.0

import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
	throw new Error('Please add MONGODB_URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
	let globalWithMongo = global as typeof globalThis & {
		_mongoClientPromise?: Promise<MongoClient>
	}

	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri, options)
		globalWithMongo._mongoClientPromise = client.connect()
	}
	clientPromise = globalWithMongo._mongoClientPromise
} else {
	client = new MongoClient(uri, options)
	clientPromise = client.connect()
}

export default clientPromise
```

### Phase 2: Web Scraping & Analysis (45-60 min)

#### 2.1 Create scraper utility at `src/lib/scraper.ts`:

**Functions to implement:**
- `scrapeWebsite(url: string)` - fetches and parses HTML
- Extracts metadata (title, description, og tags, twitter cards)
- Counts images and checks alt attributes
- Finds all H1 tags
- Detects favicon presence
- Handles errors gracefully (404, timeout, invalid URLs)

**Implementation requirements:**
```typescript
import * as cheerio from 'cheerio'

export async function scrapeWebsite(url: string) {
	// Validate and normalize URL
	// Fetch HTML with timeout
	// Parse with Cheerio
	// Extract all SEO elements
	// Return structured data
}
```

#### 2.2 Create OpenAI integration at `src/lib/openai.ts`:

**Functions to implement:**
- `generateAIFeedback(scrapedData)` - generates SEO recommendations
- Uses GPT-4 or GPT-4o-mini
- System prompt: "You are an SEO expert. Analyze the provided website data and give actionable optimization recommendations."
- Returns markdown-formatted feedback

#### 2.3 Create tag generator at `src/lib/generateTags.ts`:

**Functions to implement:**
- `generateTags(report: SeoReport): string[]` - creates descriptive tags
- Logic based on:
  - Missing title/description → "missing-metadata"
  - No H1 tags → "no-h1"
  - Images without alt → "accessibility-issues"
  - No favicon → "missing-favicon"
  - Good practices → "well-optimized"
- Calculate score (0-100) based on SEO factors

### Phase 3: API Routes (45-60 min)

#### 3.1 Create analysis endpoint at `src/app/api/analyze/route.ts`:
```typescript
// POST /api/analyze
// Body: { url: string }
// Returns: SeoReport object

export async function POST(request: Request) {
	// 1. Parse and validate URL
	// 2. Scrape website
	// 3. Generate AI feedback
	// 4. Generate tags and score
	// 5. Save to MongoDB
	// 6. Return report
}
```

#### 3.2 Create reports list endpoint at `src/app/api/reports/route.ts`:
```typescript
// GET /api/reports
// Returns: SeoReport[]

export async function GET() {
	// Fetch all reports from MongoDB
	// Sort by analyzedAt descending
	// Return array
}
```

#### 3.3 Create single report endpoint at `src/app/api/reports/[id]/route.ts`:
```typescript
// GET /api/reports/[id]
// Returns: SeoReport

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	// Fetch report by _id
	// Return report or 404
}

// DELETE /api/reports/[id]
// Returns: { success: boolean }

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	// Delete report by _id
	// Return success status
}
```

### Phase 4: State Management with Recoil (30 min)

#### 4.1 Create Recoil provider at `src/components/providers/RecoilProvider.tsx`:
```typescript
'use client'

import { ReactNode } from 'react'
import { RecoilRoot } from 'recoil'

export default function RecoilProvider({ children }: { children: ReactNode }) {
	return <RecoilRoot>{children}</RecoilRoot>
}
```

#### 4.2 Update `src/app/layout.tsx` to wrap with RecoilProvider

#### 4.3 Create Recoil atoms at `src/state/atoms.ts`:
```typescript
import { atom } from 'recoil'
import { SeoReport } from '@/types/report'

export const currentReportState = atom<SeoReport | null>({
	key: 'currentReportState',
	default: null
})

export const reportsHistoryState = atom<SeoReport[]>({
	key: 'reportsHistoryState',
	default: []
})

export const isAnalyzingState = atom<boolean>({
	key: 'isAnalyzingState',
	default: false
})

export const errorState = atom<string | null>({
	key: 'errorState',
	default: null
})

export const selectedTagsState = atom<string[]>({
	key: 'selectedTagsState',
	default: []
})

export const searchQueryState = atom<string>({
	key: 'searchQueryState',
	default: ''
})
```

### Phase 5: Global Theming (45 min)

#### 5.1 Create `src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
	:root {
		--background: 0 0% 100%;
		--foreground: 222.2 84% 4.9%;
		--card: 0 0% 100%;
		--card-foreground: 222.2 84% 4.9%;
		--primary: 221.2 83.2% 53.3%;
		--primary-foreground: 210 40% 98%;
		--secondary: 210 40% 96.1%;
		--secondary-foreground: 222.2 47.4% 11.2%;
		--muted: 210 40% 96.1%;
		--muted-foreground: 215.4 16.3% 46.9%;
		--accent: 210 40% 96.1%;
		--accent-foreground: 222.2 47.4% 11.2%;
		--destructive: 0 84.2% 60.2%;
		--destructive-foreground: 210 40% 98%;
		--border: 214.3 31.8% 91.4%;
		--input: 214.3 31.8% 91.4%;
		--ring: 221.2 83.2% 53.3%;
		--radius: 0.5rem;
	}

	.dark {
		--background: 222.2 84% 4.9%;
		--foreground: 210 40% 98%;
		--card: 222.2 84% 4.9%;
		--card-foreground: 210 40% 98%;
		--primary: 217.2 91.2% 59.8%;
		--primary-foreground: 222.2 47.4% 11.2%;
		--secondary: 217.2 32.6% 17.5%;
		--secondary-foreground: 210 40% 98%;
		--muted: 217.2 32.6% 17.5%;
		--muted-foreground: 215 20.2% 65.1%;
		--accent: 217.2 32.6% 17.5%;
		--accent-foreground: 210 40% 98%;
		--destructive: 0 62.8% 30.6%;
		--destructive-foreground: 210 40% 98%;
		--border: 217.2 32.6% 17.5%;
		--input: 217.2 32.6% 17.5%;
		--ring: 224.3 76.3% 48%;
	}
}

@layer components {
	.card {
		@apply rounded-lg border bg-card p-6 shadow-sm;
	}

	.btn {
		@apply inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50;
	}

	.btn-primary {
		@apply btn bg-primary text-primary-foreground hover:bg-primary/90;
	}

	.btn-secondary {
		@apply btn bg-secondary text-secondary-foreground hover:bg-secondary/80;
	}

	.btn-destructive {
		@apply btn bg-destructive text-destructive-foreground hover:bg-destructive/90;
	}

	.btn-ghost {
		@apply btn hover:bg-accent hover:text-accent-foreground;
	}

	.btn-icon {
		@apply btn h-9 w-9 p-0;
	}
}
```

#### 5.2 Configure Tailwind at `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

const config: Config = {
	darkMode: 'class',
	content: {
		files: [
			'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
			'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
			'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
		],
		extract
	},
	theme: {
		screens,
		fontSize,
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))'
			}
		}
	},
	plugins: [fluid]
}

export default config
```

### Phase 6: Core Components (90-120 min)

#### 6.1 Create `src/components/UrlInputForm.tsx`:
- Text input for URL
- Validation (must be valid URL)
- Auto-prepend `https://` if missing
- "Analyze" button
- Loading state during analysis
- Error display
- Uses Recoil state for isAnalyzing

#### 6.2 Create `src/components/AnalyzeLoadingModal.tsx`:
- Radix UI Dialog component
- Shows animated loader (Lucide Loader2 icon)
- Displays "Analyzing website..." message
- Cannot be dismissed while loading
- Theme-aware styling

#### 6.3 Create `src/components/SeoReport.tsx`:
- Display all SEO analysis results:
  - URL and domain
  - Title and description
  - H1 tags list
  - Image analysis (total, with alt, without alt)
  - Favicon status
  - Open Graph data
  - Twitter Card data
  - AI Feedback (rendered as Markdown)
  - Tags with color coding
  - Score visualization
- Export buttons (PDF and Markdown)
- Clean, organized layout with sections

#### 6.4 Create `src/components/ReportHistory.tsx`:
- List of all saved reports
- Search input (filters by URL or title)
- Tag filters (click to filter by tag)
- Sort dropdown (date, URL, score)
- Each report card shows:
  - Domain
  - Title (truncated)
  - Score badge
  - Tags
  - Analyzed date
  - View/Delete actions
- Click card to load report
- Delete with confirmation

#### 6.5 Create `src/components/DeleteConfirmDialog.tsx`:
- Radix UI Dialog for delete confirmation
- "Are you sure?" message
- Cancel and Delete buttons
- Proper focus management

#### 6.6 Create `src/components/ErrorAlert.tsx`:
- Display error messages
- Close button
- Auto-dismiss after 5 seconds (optional)
- Uses destructive color scheme

#### 6.7 Create `src/components/MarkdownWithCode.tsx`:
- Wrapper around react-markdown
- Code syntax highlighting
- Proper styling for headings, lists, etc.

#### 6.8 Create `src/components/Icon.tsx`:
- Wrapper for Lucide icons
- Consistent sizing
- Color variants

### Phase 7: Export Functionality (45 min)

#### 7.1 Create `src/lib/export.ts`:

**Functions to implement:**
```typescript
export async function exportToPDF(elementId: string, filename: string) {
	// 1. Use html2canvas to capture element
	// 2. Convert to PDF with jsPDF
	// 3. Download with timestamp in filename
	// Format: seo-report-{domain}-{YYYY-MM-DD}_{HH-MM-SS}_Z.pdf
}

export function exportToMarkdown(report: SeoReport): string {
	// 1. Build markdown string from report data
	// 2. Include all sections
	// 3. Return formatted markdown
	// 4. Trigger download
	// Format: seo-report-{domain}-{YYYY-MM-DD}_{HH-MM-SS}_Z.md
}

function generateTimestamp(): string {
	// Return UTC timestamp in format: YYYY-MM-DD_HH-MM-SS_Z
}
```

### Phase 8: Main Page Layout (45-60 min)

#### 8.1 Update `src/app/page.tsx`:
```typescript
'use client'

// Main layout:
// - Header with title
// - UrlInputForm at top
// - Two-column layout:
//   - Left: Current report (SeoReport component) or empty state
//   - Right: Report history sidebar (ReportHistory component)
// - Mobile: stack vertically
// - Load reports on mount
// - Handle analyze action
// - Handle view report action
// - Handle delete report action
```

#### 8.2 Update `src/app/layout.tsx`:
- Wrap with RecoilProvider
- Set metadata (title, description)
- Import global styles
- Add viewport meta tags

### Phase 9: Polish & Testing (45-60 min)

#### 9.1 Error Handling:
- API errors with user-friendly messages
- Network timeouts
- Invalid URLs
- Scraping failures
- MongoDB connection errors

#### 9.2 Loading States:
- Analyzing modal
- Report history loading
- Skeleton screens (optional)

#### 9.3 UX Improvements:
- Smooth transitions
- Optimistic UI updates
- Empty states
- Tooltips for actions
- Keyboard shortcuts
- Focus management

#### 9.4 Responsive Design:
- Mobile-first approach
- Breakpoints for tablet/desktop
- Fluid spacing
- Touch-friendly buttons

#### 9.5 Accessibility:
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast
- Screen reader support

## Code Style Requirements (CRITICAL)

### Prettier Configuration
Follow these exact settings from .prettierrc:
```json
{
  "arrowParens": "always",
  "useTabs": true,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false,
  "printWidth": 100
}
```

### Key Rules:
- **NO SEMICOLONS** in TypeScript/JavaScript files
- Use TABS (not spaces) for indentation
- Single quotes for strings
- No trailing commas
- Arrow function params always wrapped in parentheses
- Max line length: 100 characters

### File Headers:
Every code file must include:
```typescript
// Date: 2025-11-18
// Version: 1.0.0
```

### Import Order:
```typescript
// 1. React imports
import React from 'react'

// 2. Next.js imports
import { useRouter } from 'next/navigation'

// 3. Third-party libraries
import { useRecoilState } from 'recoil'
import { Loader2 } from 'lucide-react'

// 4. Internal imports with @ alias
import { SeoReport } from '@/types/report'
import { currentReportState } from '@/state/atoms'

// 5. Relative imports
import { exportToPDF } from '../lib/export'
```

## Bonus Features (If Time Permits)
- Historical score tracking and trends
- Competitor comparison (analyze multiple URLs)
- Scheduled re-analysis
- Email report delivery
- Custom SEO rule sets
- Browser extension for one-click analysis
- Sitemap analysis
- Broken link detection
- Mobile vs Desktop comparison
- Performance metrics (Core Web Vitals)
- Batch URL analysis

## MongoDB Setup
1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (M0 free tier)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string: Connect → Drivers → Node.js
6. Add to `.env.local` as `MONGODB_URI`
7. Collections are created automatically on first write

## Package Manager Commands
```bash
yarn install          # Install dependencies
yarn dev              # Start development server (localhost:3000)
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
yarn format           # Format code with Prettier
yarn clean            # Format code with Prettier (alias)
yarn test             # Run Jest tests
yarn deploy           # Deploy to Vercel
```

## Environment Variables

Create `.env.example`:
```bash
# OpenAI API Key
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=<your_openai_api_key>

# MongoDB Configuration
# Set up your database at: https://www.mongodb.com/cloud/atlas/register
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
MONGODB_DB=<your_database_name>
```

Create `.env.local` (gitignored) with actual values.

## Expected File Structure After Implementation
```
ai-seo-report-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts
│   │   │   └── reports/
│   │   │       ├── [id]/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── providers/
│   │   │   └── RecoilProvider.tsx
│   │   ├── AnalyzeLoadingModal.tsx
│   │   ├── DeleteConfirmDialog.tsx
│   │   ├── ErrorAlert.tsx
│   │   ├── Icon.tsx
│   │   ├── MarkdownWithCode.tsx
│   │   ├── ReportHistory.tsx
│   │   ├── SeoReport.tsx
│   │   └── UrlInputForm.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── export.ts
│   │   ├── generateTags.ts
│   │   ├── openai.ts
│   │   └── scraper.ts
│   ├── state/
│   │   └── atoms.ts
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── report.ts
│   └── utils/
│       └── getTagColor.ts
├── .prettierrc
├── .env.example
├── .env.local (gitignored)
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Testing Checklist
- [ ] Can input URL and trigger analysis
- [ ] URL validation works (rejects invalid URLs)
- [ ] Auto-prepends https:// to incomplete URLs
- [ ] Loading modal appears during analysis
- [ ] Website scraping extracts all metadata correctly
- [ ] AI feedback generates and displays
- [ ] Tags are auto-generated based on findings
- [ ] Report displays all sections correctly
- [ ] Can export report as PDF
- [ ] Can export report as Markdown
- [ ] Reports save to database
- [ ] Report history loads on page load
- [ ] Can search reports by URL/title
- [ ] Can filter reports by tags
- [ ] Can sort reports by date/URL/score
- [ ] Can delete reports with confirmation
- [ ] Deleted reports removed from UI and database
- [ ] Dark mode works correctly
- [ ] Responsive design works on mobile/tablet
- [ ] Error handling works (invalid URL, network error, etc.)
- [ ] Database persists across page refreshes

## README Requirements
Include in README.md:

### 1. Project Overview
- Brief description of the tool
- Key features list
- Live demo link (if deployed)
- Badges (Next.js, TypeScript, Tailwind, License)

### 2. Features
- AI-powered SEO analysis
- Real-time website scraping
- Comprehensive metadata extraction
- AI-generated optimization recommendations
- Report history with search and filters
- PDF and Markdown export
- Dark mode support
- Tag-based categorization
- Responsive design

### 3. Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 3, Fluid Tailwind
- State Management: Recoil
- UI Components: Radix UI, Lucide Icons
- PDF Export: jsPDF, html2canvas
- Web Scraping: Cheerio
- AI Integration: OpenAI API
- Database: MongoDB
- Deployment: Vercel

### 4. Project Structure
```
src/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main dashboard
├── components/          # React components
├── lib/                 # Utilities and business logic
├── state/              # Recoil state management
├── styles/             # Global CSS
├── types/              # TypeScript types
└── utils/              # Helper functions
```

### 5. Getting Started
```bash
# 1. Clone repository
git clone https://github.com/yourusername/ai-seo-report-generator.git
cd ai-seo-report-generator

# 2. Install dependencies
yarn install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run development server
yarn dev

# Open http://localhost:3000
```

### 6. Environment Variables Setup
- OpenAI API Key setup instructions
- MongoDB Atlas setup guide
- Database configuration steps

### 7. Scripts
| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn format` | Format code with Prettier |
| `yarn test` | Run tests |
| `yarn deploy` | Deploy to Vercel |

### 8. Export File Naming
Explain the timestamp format:
```
seo-report-{domain}-{YYYY-MM-DD}_{HH-MM-SS}_Z.{ext}

Example: seo-report-google.com-2025-11-18_14-30-45_Z.pdf

- {domain}: Analyzed website domain
- {YYYY-MM-DD}: Date (year-month-day)
- {HH-MM-SS}: Time in UTC (24-hour format)
- _Z: UTC timezone indicator
- {ext}: pdf or md
```

### 9. Deployment
- Vercel deployment instructions
- Environment variables configuration
- Build optimization tips

### 10. Development Notes
- Architecture decisions
- Why Recoil for state management
- Component design patterns
- MongoDB schema design
- Tag generation logic
- Scoring algorithm

### 11. Testing
- Test suite overview
- How to run tests
- Coverage goals

### 12. License
MIT License

## Success Criteria
- Clean, typed, well-structured code
- No TypeScript `any` types (use proper types)
- Working web scraping with error handling
- AI integration with meaningful recommendations
- Data persistence across sessions
- Functional PDF and Markdown export
- Responsive design that works on all devices
- Good UX with loading states and feedback
- Dark mode support
- Comprehensive error handling
- Clear documentation
- No hardcoded secrets
- Follows all code style requirements (NO SEMICOLONS!)
- All Prettier rules enforced

## Implementation Notes
- Focus on core functionality first, then polish
- Keep components small and single-purpose
- Use TypeScript strictly (enable strict mode)
- Prioritize working features over pixel-perfect design
- Test each phase before moving to next
- Commit frequently with descriptive messages
- **CRITICAL:** Run `yarn clean` after completing each phase
- All code must follow Prettier configuration
- Use meaningful variable and function names
- Comment complex logic
- Handle edge cases (empty states, errors, loading)
- Optimize for performance (lazy loading, memoization)

## Development Workflow
1. Complete Phase 1 setup (Prettier, MongoDB, dependencies)
2. Run `yarn clean` to format all code
3. Move to Phase 2 (scraping and analysis)
4. Test scraping with real URLs
5. Run `yarn clean`
6. Continue through phases sequentially
7. Test each feature as you build it
8. Commit working code frequently
9. Run `yarn clean` before each commit
10. Deploy early and iterate

## Common Pitfalls to Avoid
- Don't skip error handling
- Don't use `any` types
- Don't hardcode API keys
- Don't forget to validate user input
- Don't skip loading states
- Don't ignore accessibility
- Don't forget mobile responsiveness
- Don't skip the Prettier formatting step
- Don't commit code with semicolons
- Don't use spaces instead of tabs

## Time Tracking
Document in README:
- Start date/time
- End date/time
- Total hours spent
- Breakdown by phase (optional)
- Challenges encountered
- Lessons learned

Start with Phase 1 and work sequentially. The order is optimized for building a solid foundation before adding features. Test frequently, commit often, and format religiously. Good luck!
