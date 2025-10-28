import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './data/seo-reports.db';
const DB_DIR = join(process.cwd(), 'data');

if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(join(process.cwd(), DB_PATH));

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS seo_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    page_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    h1_tags TEXT,
    image_count INTEGER DEFAULT 0,
    has_favicon INTEGER DEFAULT 0,
    ai_feedback TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_url ON seo_reports(url);
  CREATE INDEX IF NOT EXISTS idx_created_at ON seo_reports(created_at);
`);

export interface SeoReport {
  id?: number;
  url: string;
  page_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  h1_tags: string | null;
  image_count: number;
  has_favicon: number;
  ai_feedback: string;
  created_at?: string;
}

export const dbOperations = {
  createReport: (report: Omit<SeoReport, 'id' | 'created_at'>) => {
    const stmt = db.prepare(`
      INSERT INTO seo_reports (
        url, page_title, meta_description, meta_keywords, 
        h1_tags, image_count, has_favicon, ai_feedback
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      report.url,
      report.page_title,
      report.meta_description,
      report.meta_keywords,
      report.h1_tags,
      report.image_count,
      report.has_favicon,
      report.ai_feedback
    );
    
    return result.lastInsertRowid;
  },

  getReportById: (id: number): SeoReport | undefined => {
    const stmt = db.prepare('SELECT * FROM seo_reports WHERE id = ?');
    return stmt.get(id) as SeoReport | undefined;
  },

  getAllReports: (limit = 50): SeoReport[] => {
    const stmt = db.prepare(`
      SELECT * FROM seo_reports 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    return stmt.all(limit) as SeoReport[];
  },

  getReportsByUrl: (url: string): SeoReport[] => {
    const stmt = db.prepare(`
      SELECT * FROM seo_reports 
      WHERE url = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(url) as SeoReport[];
  },

  deleteReport: (id: number) => {
    const stmt = db.prepare('DELETE FROM seo_reports WHERE id = ?');
    return stmt.run(id);
  },
};

export default db;
