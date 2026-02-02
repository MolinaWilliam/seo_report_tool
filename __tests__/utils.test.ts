import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  getChangeIndicator,
  getDifficultyColor,
  getDifficultyLabel,
  getHealthScoreColor,
  getHealthScoreLabel,
  validateDomain,
  cleanDomain,
} from '../lib/utils';

describe('formatNumber', () => {
  it('formats millions correctly', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(5500000)).toBe('5.5M');
  });

  it('formats thousands correctly', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(5500)).toBe('5.5K');
  });

  it('formats small numbers correctly', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(0)).toBe('0');
  });

  it('handles null and undefined', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
  });
});

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(5500)).toBe('$5,500');
  });

  it('handles null and undefined', () => {
    expect(formatCurrency(null)).toBe('$0');
    expect(formatCurrency(undefined)).toBe('$0');
  });
});

describe('formatPercent', () => {
  it('formats percentages correctly', () => {
    expect(formatPercent(50)).toBe('50.0%');
    expect(formatPercent(33.333)).toBe('33.3%');
  });

  it('handles null and undefined', () => {
    expect(formatPercent(null)).toBe('0%');
    expect(formatPercent(undefined)).toBe('0%');
  });
});

describe('getChangeIndicator', () => {
  it('returns positive change correctly', () => {
    const result = getChangeIndicator(100);
    expect(result.direction).toBe('up');
    expect(result.text).toBe('+100');
    expect(result.color).toBe('text-green-600');
  });

  it('returns negative change correctly', () => {
    const result = getChangeIndicator(-50);
    expect(result.direction).toBe('down');
    expect(result.color).toBe('text-red-600');
  });

  it('returns neutral for zero', () => {
    const result = getChangeIndicator(0);
    expect(result.direction).toBe('neutral');
    expect(result.text).toBe('-');
  });

  it('handles null and undefined', () => {
    expect(getChangeIndicator(null).direction).toBe('neutral');
    expect(getChangeIndicator(undefined).direction).toBe('neutral');
  });
});

describe('getDifficultyColor', () => {
  it('returns green for easy difficulty', () => {
    expect(getDifficultyColor(10)).toContain('green');
    expect(getDifficultyColor(29)).toContain('green');
  });

  it('returns yellow for medium difficulty', () => {
    expect(getDifficultyColor(30)).toContain('yellow');
    expect(getDifficultyColor(49)).toContain('yellow');
  });

  it('returns orange for hard difficulty', () => {
    expect(getDifficultyColor(50)).toContain('orange');
    expect(getDifficultyColor(69)).toContain('orange');
  });

  it('returns red for very hard difficulty', () => {
    expect(getDifficultyColor(70)).toContain('red');
    expect(getDifficultyColor(100)).toContain('red');
  });
});

describe('getDifficultyLabel', () => {
  it('returns correct labels', () => {
    expect(getDifficultyLabel(10)).toBe('Easy');
    expect(getDifficultyLabel(35)).toBe('Medium');
    expect(getDifficultyLabel(55)).toBe('Hard');
    expect(getDifficultyLabel(80)).toBe('Very Hard');
  });
});

describe('getHealthScoreColor', () => {
  it('returns correct colors for health scores', () => {
    expect(getHealthScoreColor(90)).toContain('green');
    expect(getHealthScoreColor(70)).toContain('yellow');
    expect(getHealthScoreColor(50)).toContain('orange');
    expect(getHealthScoreColor(30)).toContain('red');
  });
});

describe('getHealthScoreLabel', () => {
  it('returns correct labels for health scores', () => {
    expect(getHealthScoreLabel(90)).toBe('Excellent');
    expect(getHealthScoreLabel(70)).toBe('Good');
    expect(getHealthScoreLabel(50)).toBe('Needs Work');
    expect(getHealthScoreLabel(30)).toBe('Poor');
  });
});

describe('validateDomain', () => {
  it('validates correct domains', () => {
    expect(validateDomain('example.com')).toBe(true);
    expect(validateDomain('sub.example.com')).toBe(true);
    expect(validateDomain('www.example.co.uk')).toBe(true);
  });

  it('rejects invalid domains', () => {
    expect(validateDomain('example')).toBe(false);
    expect(validateDomain('http://example.com')).toBe(false);
    expect(validateDomain('')).toBe(false);
    expect(validateDomain('example..com')).toBe(false);
  });
});

describe('cleanDomain', () => {
  it('removes protocol and www', () => {
    expect(cleanDomain('https://www.example.com')).toBe('example.com');
    expect(cleanDomain('http://example.com')).toBe('example.com');
    expect(cleanDomain('www.example.com')).toBe('example.com');
  });

  it('removes paths', () => {
    expect(cleanDomain('example.com/path/to/page')).toBe('example.com');
  });

  it('converts to lowercase and trims', () => {
    expect(cleanDomain('  EXAMPLE.COM  ')).toBe('example.com');
  });
});
