# AI SEO Report Generator

The **AI SEO Report Generator** is a web application built with **Next.js**, **TypeScript**, and **Tailwind CSS** that analyzes websites and produces SEO reports enhanced by AI feedback.
It features a modern, responsive UI, an accessible dark/light theme, and integrated PDF and Markdown export functionality.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Development](#development)
* [Environment Variables](#environment-variables)
* [Scripts](#scripts)
* [Theming and Design](#theming-and-design)
* [Core Components](#core-components)
* [Export and Report Handling](#export-and-report-handling)
* [Future Improvements](#future-improvements)
* [License](#license)

---

## Overview

This application allows users to input a website URL and receive a complete SEO analysis that includes:

* Metadata validation
* H1 tag checks
* Favicon and image presence
* Performance and accessibility review
* AI-generated optimization feedback

Reports are saved in local history and can be exported as **PDF** or **Markdown**.

---

## Features

* **AI-powered SEO analysis**
  Integrates AI feedback for detailed website recommendations.

* **Real-time analysis modal**
  Displays a loading modal during report generation using Radix UI Dialog.

* **Responsive and themed layout**
  Uses fluid Tailwind spacing and color variables for adaptive design.

* **Persistent report history**
  Stores reports with searchable filters and tag-based categorization.

* **PDF and Markdown export**
  Exports the full report view using `html2canvas` and `jsPDF`, or plain Markdown.

* **Dark mode support**
  Fully theme-aware with color variables defined in `globals.css`.

---

## Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS 3, Fluid Tailwind
* **State Management:** Recoil
* **UI Components:** Radix UI, Lucide Icons
* **PDF/Markdown Export:** jsPDF, html2canvas
* **AI Integration:** OpenAI API (via backend `/api/analyze` route)

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
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Adjust as needed for your environment.

---

## Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `yarn dev`   | Start development server    |
| `yarn  build` | Build the production bundle |
| `yarn  start` | Serve the production build  |
| `yarn  clean` | Format all code with Prettier |
| `yarn  lint`  |  ESLint checks           |

---

## Theming and Design

Global theming is handled in `globals.css` using Tailwind’s `@layer` directive.

### Highlights

* All base colors are defined using CSS variables (`--primary`, `--foreground`, etc.).
* The `.card`, `.btn`, `.btn-icon`, `.tooltip`, and `.filter-dot-*` utilities ensure consistent UI elements.
* Dark mode is activated with the `.dark` class and is automatically color-aware.

---

## Core Components

### UrlInputForm

* The entry point for analysis.
* Styled using `.card` and `.btn-primary`.
* Automatically prepends `https://` to incomplete URLs.

### ReportHistory

* Displays saved reports with tag filters, search, and sorting.
* Integrated tooltips for all action buttons.
* Exports reports via PDF or Markdown.

### AnalyzeLoadingModal

* A Radix UI Dialog that stays open while the analysis runs.
* Uses the `Loader2` spinner and theme colors.

### SeoReport

* Renders the detailed AI-generated report.
* Export actions connect directly to `export.ts`.

---

## Export and Report Handling

The `export.ts` module handles:

* **PDF Export:** Converts the current `#seo-report-content` DOM element to a PDF using `html2canvas` and `jsPDF`.

* **Markdown Export:** Generates a clean Markdown document from the report’s structured data.

All exports are named dynamically using the target site’s domain and a UTC timestamp.

---

## Future Improvements

* Add progress phases inside the Analyze modal (data fetch, AI analysis, render).
* Integrate OpenAI function calling for structured analysis.
* Enable drag-and-drop file uploads for batch SEO checks.
* Add user authentication and persistent cloud storage for reports.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
 