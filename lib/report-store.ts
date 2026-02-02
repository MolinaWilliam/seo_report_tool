import { Report } from './types';
import * as fs from 'fs';
import * as path from 'path';

// Use file-based storage for development
const STORE_DIR = path.join(process.cwd(), '.report-cache');

function ensureStoreDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

function getReportPath(id: string): string {
  return path.join(STORE_DIR, `${id}.json`);
}

export function getReport(id: string): Report | undefined {
  try {
    const filePath = getReportPath(id);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading report:', error);
  }
  return undefined;
}

export function setReport(id: string, report: Report): void {
  try {
    ensureStoreDir();
    const filePath = getReportPath(id);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  } catch (error) {
    console.error('Error writing report:', error);
  }
}

export function updateReportProgress(
  id: string,
  progress: Partial<Report['progress']>
): void {
  const report = getReport(id);
  if (report) {
    report.progress = { ...report.progress, ...progress } as Report['progress'];
    setReport(id, report);
  }
}
