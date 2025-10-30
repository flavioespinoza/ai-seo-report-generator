# AI SEO Report Generator

The **AI SEO Report Generator** is a web application built with **Next.js**, **TypeScript**, and **Tailwind CSS** that analyzes websites and produces SEO reports enhanced by AI feedback.
It features a modern, responsive UI, an accessible dark/light theme, and integrated PDF and Markdown export functionality.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Theming and Design](#theming-and-design)
- [Core Components](#core-components)
- [Export and Report Handling](#export-and-report-handling)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

This application allows users to input a website URL and receive a complete SEO analysis that includes:

- Metadata validation
- H1 tag checks
- Favicon and image presence
- Performance and accessibility review
- AI-generated optimization feedback

Reports are saved in local history and can be exported as **PDF** or **Markdown**.

---

## Features

- **AI-powered SEO analysis**
  Integrates AI feedback for detailed website recommendations.

- **Real-time analysis modal**
  Displays a loading modal during report generation using Radix UI Dialog.

- **Responsive and themed layout**
  Uses fluid Tailwind spacing and color variables for adaptive design.

- **Persistent report history**
  Stores reports with searchable filters and tag-based categorization.

- **PDF and Markdown export**
  Exports the full report view using `html2canvas` and `jsPDF`, or plain Markdown.

- **Dark mode support**
  Fully theme-aware with color variables defined in `globals.css`.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3, Fluid Tailwind
- **State Management:** Recoil
- **UI Components:** Radix UI, Lucide Icons
- **PDF/Markdown Export:** jsPDF, html2canvas
- **AI Integration:** OpenAI API (via backend `/api/analyze` route)

---

## Project Structure

```
src/
 ├── app/
 │    ├── page.tsx              # Main page component
 │    └── api/                  # API routes (reports, analyze)
 │
 ├── components/
 │    ├── UrlInputForm.tsx      # Website URL input form
 │    ├── ReportHistory.tsx     # Report history table and filters
 │    ├── SeoReport.tsx         # Detailed SEO report view
 │    ├── AnalyzeLoadingModal.tsx # Radix Dialog modal shown during analysis
 │    ├── DeleteConfirmDialog.tsx # Radix Dialog for report deletion
 │    └── ErrorAlert.tsx        # Error handling UI
 │
 ├── lib/
 │    └── export.ts             # PDF and Markdown export logic
 │
 ├── state/
 │    └── atoms.ts              # Recoil global states
 │
 ├── styles/
 │    └── globals.css           # Base styles, variables, and custom utilities
 │
 ├── types/
 │    └── report.ts             # Type definitions for reports
 │
 └── utils/
      └── getTagColor.ts        # Tag color mapping logic
```

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ai-seo-report-generator.git
   cd ai-seo-report-generator
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up your environment variables (see below).

---

## Development

the project locally:

```bash
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file at the root with the following variables:

```bash
# OpenAI API Key
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=<your_openai_api_key>

# MongoDB Configuration
# Set up your database at: https://www.mongodb.com/cloud/atlas/register
# MongoDB connection string
MONGODB_URI=mongodb+srv://<your_database_username>:<your_database_password>@cluster.mongodb.net/<your_database_name>?retryWrites=true&w=majority
# MongoDB database name
MONGODB_DB=<your_database_name>
```

Adjust as needed for your environment.

---

## Scripts

| Command       | Description                   |
| ------------- | ----------------------------- |
| `yarn dev`    | Start development server      |
| `yarn  build` | Build the production bundle   |
| `yarn  start` | Serve the production build    |
| `yarn  clean` | Format all code with Prettier |
| `yarn  lint`  | ESLint checks                 |

---

## Theming and Design

Global theming is handled in `globals.css` using Tailwind’s `@layer` directive.

### Highlights

- All base colors are defined using CSS variables (`--primary`, `--foreground`, etc.).
- The `.card`, `.btn`, `.btn-icon`, `.tooltip`, and `.filter-dot-*` utilities ensure consistent UI elements.
- Dark mode is activated with the `.dark` class and is automatically color-aware.

---

## Core Components

### UrlInputForm

- The entry point for analysis.
- Styled using `.card` and `.btn-primary`.
- Automatically prepends `https://` to incomplete URLs.

### ReportHistory

- Displays saved reports with tag filters, search, and sorting.
- Integrated tooltips for all action buttons.
- Exports reports via PDF or Markdown.

### AnalyzeLoadingModal

- A Radix UI Dialog that stays open while the analysis runs.
- Uses the `Loader2` spinner and theme colors.

### SeoReport

- Renders the detailed AI-generated report.
- Export actions connect directly to `export.ts`.

---

## Export and Report Handling

The `export.ts` module handles:

- **PDF Export:** Converts the current `#seo-report-content` DOM element to a PDF using `html2canvas` and `jsPDF`.

- **Markdown Export:** Generates a clean Markdown document from the report’s structured data.

All exports are named dynamically using the target site’s domain and a UTC timestamp.

#### File Name Pattern

```bas
your-name-2025-10-30_18-22-54_Z.pdf
```
**What it means:**

- `your-name` → What the file is about (like a website or project)
- `2025-10-30` → The **date** (year-month-day)
- `_18-22-54` → The **time** (hour-minute-second, 24-hour clock)
- `_Z` → Made in **UTC time** (like "world time" — no confusion with time zones)
- `.pdf` → The file type

**Why it’s good:**

- Easy to **read** like a calendar entry
- Files **sort correctly** in any folder (newest on bottom)
- Works on **Windows, Mac, and Linux**
- No weird symbols that break things

**Example:**  
`seo-report-google.com-2025-10-30_18-22-54_Z.pdf`  
→ "SEO report for google.com, saved on Oct 30, 2025 at 6:22 PM UTC"

---

**Just remember:**  
**Name + Date + Time + Z + .filetype**  
→ Clean, clear, and always in order!

---

## Suggested Improvements for AI SEO Report Generator

### 1. Testing and Stability
- **Migrate tests to Jest with `ts-jest`** for consistent TypeScript handling.
- **Add integration tests** for API routes (`/api/reports` and `/api/analyze`).
- **Mock external dependencies** such as `fetch` and OpenAI API to improve test reliability.
- **Include error handling tests** for network timeouts and invalid responses.

### 2. Code Quality and Architecture
- **Refactor API route logic** into reusable functions within `lib/` for better separation of concerns.
- **Add input validation schemas** (Zod) for `/api/analyze` and `/api/reports` endpoints.
- **Implement centralized error handler** to return structured error responses.
- **Improve type safety** by extending shared TypeScript interfaces across components and API responses.

### 3. Frontend UX Enhancements
- **Add progress indicators** inside the Analyze modal (e.g., "Fetching HTML", "Analyzing Metadata", "Generating AI Feedback").
- **Enable cancel button** during SEO analysis to abort requests.
- **Add skeleton loaders** for report cards and history table.
- **Persist filter state** (tags, search query) between sessions using `localStorage`.

### 4. Export and Data Management
- **Support batch export** of multiple reports (PDF and Markdown).
- **Add CSV export** for SEO report summaries.
- **Improve file naming** consistency and allow custom export filenames.
- **Embed report metadata** (date, domain, version) in exported Markdown and PDF files.

### 5. Performance and Scalability
- **Add caching** for repeated URL analyses.
- **Introduce incremental static regeneration (ISR)** for faster server responses.
- **Optimize `html2canvas` rendering** by excluding unnecessary elements (buttons, tooltips).
- **Implement pagination or virtualized lists** for large report histories.

### 6. UI and Theming
- **Add color system presets** (e.g., blue, green, amber themes).
- **Improve dark mode contrast** in cards, tooltips, and table headers.
- **Add motion preferences** to respect user’s reduced motion settings.
- **Introduce consistent spacing system** across cards, buttons, and modals.

### 7. Developer Experience
- **Add ESLint and Prettier configs** aligned with Next.js defaults.
- **Add commit hooks with Husky** to enforce linting before commits.
- **Include a sample `.env.local.example`** for new contributors.
- **Improve README** with environment setup, test coverage, and deployment instructions.

### 8. Deployment and Monitoring
- **Enable Vercel analytics** for performance insights.
- **Add logging middleware** for API routes to monitor failures.
- **Integrate Sentry or Logtail** for error tracking in production.
- **Use environment-specific configuration** to separate dev, staging, and prod builds.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
