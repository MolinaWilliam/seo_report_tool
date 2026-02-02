import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatCurrency(num: number | undefined | null): string {
  if (num === undefined || num === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0%';
  return num.toFixed(1) + '%';
}

export function getChangeIndicator(change: number | undefined | null): {
  direction: 'up' | 'down' | 'neutral';
  text: string;
  color: string;
} {
  if (change === undefined || change === null || change === 0) {
    return { direction: 'neutral', text: '-', color: 'text-gray-500' };
  }
  if (change > 0) {
    return {
      direction: 'up',
      text: `+${formatNumber(change)}`,
      color: 'text-green-600'
    };
  }
  return {
    direction: 'down',
    text: formatNumber(change),
    color: 'text-red-600'
  };
}

export function getDifficultyColor(difficulty: number): string {
  if (difficulty < 30) return 'text-green-600 bg-green-100';
  if (difficulty < 50) return 'text-yellow-600 bg-yellow-100';
  if (difficulty < 70) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}

export function getDifficultyLabel(difficulty: number): string {
  if (difficulty < 30) return 'Easy';
  if (difficulty < 50) return 'Medium';
  if (difficulty < 70) return 'Hard';
  return 'Very Hard';
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
}

export function validateDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

export function cleanDomain(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/.*$/, '')
    .trim();
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// Export Functions
// ============================================================

/**
 * Download a file in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to JSON file
 */
export function exportToJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, 'application/json');
}

/**
 * Convert array of objects to CSV string
 */
function objectsToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Export keywords data to CSV
 */
export function exportKeywordsToCSV(
  keywords: Array<{
    keyword: string;
    position: number;
    volume: number;
    traffic: number;
    difficulty: number;
    url: string;
  }>,
  filename: string
): void {
  const data = keywords.map(k => ({
    Keyword: k.keyword,
    Position: k.position,
    Volume: k.volume,
    Traffic: k.traffic,
    Difficulty: k.difficulty,
    URL: k.url,
  }));
  const csv = objectsToCSV(data);
  downloadFile(csv, `${filename}.csv`, 'text/csv');
}

/**
 * Export backlinks data to CSV
 */
export function exportBacklinksToCSV(
  pages: Array<{
    page: string;
    backlinks: number;
    refdomains: number;
    dofollow: number;
  }>,
  filename: string
): void {
  const data = pages.map(p => ({
    Page: p.page,
    Backlinks: p.backlinks,
    'Referring Domains': p.refdomains,
    Dofollow: p.dofollow,
  }));
  const csv = objectsToCSV(data);
  downloadFile(csv, `${filename}.csv`, 'text/csv');
}
