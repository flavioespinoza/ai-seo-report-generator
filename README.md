# AI SEO Report Generator

The **AI SEO Report Generator** is a web application built with **Next.js**, **TypeScript**, and **Tailwind CSS** that analyzes websites and produces SEO reports enhanced by AI feedback.
It features a modern, responsive UI, an accessible dark/light theme, and integrated PDF and Markdown export functionality.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Theming and Design](#theming-and-design)
- [Core Components](#core-components)
- [Export and Report Handling](#export-and-report-handling)
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
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts
│   │   └── reports/
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── theme-preview-page/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── providers/
│   │   └── RecoilProvider.tsx
│   ├── AnalyzeLoadingModal.tsx
│   ├── DeleteConfirmDialog.tsx
│   ├── ErrorAlert.tsx
│   ├── ExternalLink.tsx
│   ├── Icon.tsx
│   ├── MarkdownWithCode.tsx
│   ├── ReportHistory.tsx
│   ├── SeoReport.tsx
│   └── UrlInputForm.tsx
│
├── lib/
│   ├── db.ts
│   ├── export.ts
│   ├── generateTags.ts
│   ├── openai.ts
│   └── scraper.ts
│
├── state/
│   └── atoms.ts
│
├── styles/
│   └── globals.css
│
├── types/
│   └── report.ts
│
└── utils/
    └── getTagColor.ts
```

## Summary

- **Total Directories:** 13
- **Total Files:** 26

### Breakdown by Directory:

| Directory | Files | Purpose |
|-----------|-------|---------|
| `app/` | 3 | Next.js App Router pages and layouts |
| `app/api/` | 3 | API route handlers |
| `components/` | 10 | React components (UI elements) |
| `lib/` | 5 | Business logic and utilities |
| `state/` | 1 | Recoil state management |
| `styles/` | 1 | Global CSS styles |
| `types/` | 1 | TypeScript type definitions |
| `utils/` | 1 | Helper utility functions |

### Key Files:

#### API Routes
- `app/api/analyze/route.ts` - Main endpoint for analyzing URLs
- `app/api/reports/route.ts` - List all reports
- `app/api/reports/[id]/route.ts` - Get/delete specific report

#### Core Logic
- `lib/scraper.ts` - Web scraping with Cheerio
- `lib/openai.ts` - AI feedback generation
- `lib/generateTags.ts` - Tag and category generation
- `lib/db.ts` - MongoDB connection
- `lib/export.ts` - PDF/Markdown export functionality

#### Components
- `components/SeoReport.tsx` - Main report display
- `components/ReportHistory.tsx` - Report list view
- `components/UrlInputForm.tsx` - URL input form
- `components/AnalyzeLoadingModal.tsx` - Loading state
- `components/providers/RecoilProvider.tsx` - State provider

#### Configuration
- `app/layout.tsx` - Root layout with metadata
- `styles/globals.css` - Global styles
- `types/report.ts` - TypeScript interfaces and types
---

## Getting Started

Follow these steps to get the project running locally:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/flavioespinoza/ai-seo-report-generator.git
    cd ai-seo-report-generator
    ```

2.  **Install Dependencies**
    ```bash
    yarn install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file at the root of the project and add the necessary environment variables. See the [Environment Variables](#environment-variables) section for more details.

4.  **Run the Development Server**
    ```bash
    yarn dev
    ```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

-   `OPENAI_API_KEY`: Your API key from OpenAI. You can get one [here](https://platform.openai.com/api-keys).
-   `MONGODB_URI`: Your MongoDB connection string. You can set up a free database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
-   `MONGODB_DB`: The name of your MongoDB database.

**Example:**
```
# OpenAI API Key
OPENAI_API_KEY=<your_openai_api_key>

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db_name>?retryWrites=true&w=majority
MONGODB_DB=<db_name>
```

---

## Scripts

| Command       | Description                   |
| ------------- | ----------------------------- |
| `yarn dev`    | Start development server      |
| `yarn  build` | Build the production bundle   |
| `yarn  start` | Serve the production build    |
| `yarn  clean` | Format all code with Prettier |
| `yarn  test`  | Run all tests                 |

---

## Theming and Design

Global theming is handled in `globals.css` using Tailwind’s `@layer` directive.

### Highlights

- All base colors are defined using CSS variables (`--primary`, `--foreground`, etc.).
- The `.card`, `.btn`, `.btn-icon`, `.tooltip`, and `.filter-dot-*` utilities ensure consistent UI elements.
- Dark mode is activated with the `.dark` class and is automatically color-aware.

---

## Core AI Implementation

### AI Prompt

- Search criteria: "google.com"
- Prompt generated and sent to OpenAI/ChatGTP:
  ```txt
  You are an expert SEO consultant. Analyze the following webpage metadata and provide actionable SEO improvement recommendations.

  Website URL: https://google.com

  Metadata:
  - Page Title: Google
  - Title Length: 6 characters
  - Meta Description: Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.
  - Description Length: 159 characters
  - Meta Keywords: Not specified
  - H1 Tags: NONE FOUND
  - Number of Images: 1
  - Has Favicon: No

  Automated Issues Detected:
  - No H1 tags found

  Automated Warnings:
  - Title is too short (recommended: 50-60 characters)
  - No favicon detected

  Please provide:
  1. A brief overall SEO health summary (2-3 sentences)
  2. Key strengths (if any)
  3. Critical improvements needed
  4. Technical SEO issues
  5. Specific, actionable recommendations
  ```

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

```bash
# .pdf or .md ()
seo-report-{your_url}-{YYYY-MM-DD}_{HH-MM-SS}_Z.{file_type}
```
**What it means:**

- `your_url` → What **web domain** are you analyzing (google.com, amazon.com, etc.)
- `YYYY-MM-DD` → The **date** (year-month-day)
- `HH-MM-SS` → The **time** (hour-minute-second on a 24-hour clock)
- `_Z` → Made in **UTC time** (Z is for Zulu a.k.a. GMT — no confusion with time zones)
- `file_type` → The file type (pdf or md)

**Example:**  

`seo-report-google.com-2025-10-30_18-22-54_Z.pdf` 

→ "A pdf of an SEO report for google.com was downloaded on Oct 30, 2025 at 6:22 PM UTC"

**Why it’s good:**

- Easy to **read** like a calendar entry
- Files **sort correctly** in any folder (newest on bottom)
- Works on **Windows, Mac, and Linux**
- No weird symbols that break things
- Clean, clear, and always in order!

---

## License

This project is open-source and available under the [MIT License](LICENSE).
