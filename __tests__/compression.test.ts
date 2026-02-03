import { describe, it, expect } from 'vitest';
import { compressData, decompressData, isCompressed } from '../lib/compression';

describe('compression utilities', () => {
  describe('compressData and decompressData', () => {
    it('should compress and decompress a simple object', () => {
      const original = { name: 'test', value: 123 };
      const compressed = compressData(original);
      const decompressed = decompressData(compressed);
      expect(decompressed).toEqual(original);
    });

    it('should compress and decompress a large object', () => {
      const original = {
        domain: 'example.com',
        progress: {
          status: 'completed',
          currentStep: 10,
          totalSteps: 10,
        },
        data: {
          domainOverview: {
            organicKeywords: 5000,
            organicTraffic: 100000,
            organicCost: 50000,
          },
          topKeywords: Array(100).fill(null).map((_, i) => ({
            keyword: `keyword-${i}`,
            position: i + 1,
            volume: Math.floor(Math.random() * 10000),
            traffic: Math.floor(Math.random() * 1000),
          })),
          backlinks: {
            total: 10000,
            referringDomains: 500,
          },
        },
        apiResponses: Array(30).fill(null).map((_, i) => ({
          endpoint: `/api/endpoint-${i}`,
          duration: Math.floor(Math.random() * 1000),
          response: { data: Array(100).fill('sample data') },
        })),
      };

      const compressed = compressData(original);
      const decompressed = decompressData(compressed);
      expect(decompressed).toEqual(original);
    });

    it('should achieve significant compression on large JSON', () => {
      const largeData = {
        items: Array(1000).fill(null).map((_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: 'This is a long description that repeats '.repeat(10),
          metadata: { created: new Date().toISOString(), tags: ['tag1', 'tag2', 'tag3'] },
        })),
      };

      const originalSize = JSON.stringify(largeData).length;
      const compressed = compressData(largeData);
      const compressedSize = compressed.length;

      const compressionRatio = 1 - (compressedSize / originalSize);
      expect(compressionRatio).toBeGreaterThan(0.7); // At least 70% reduction
    });

    it('should handle arrays', () => {
      const original = [1, 2, 3, { nested: 'value' }];
      const compressed = compressData(original);
      const decompressed = decompressData(compressed);
      expect(decompressed).toEqual(original);
    });

    it('should handle strings with unicode', () => {
      const original = { text: 'Hello 世界 🌍 émoji' };
      const compressed = compressData(original);
      const decompressed = decompressData(compressed);
      expect(decompressed).toEqual(original);
    });
  });

  describe('isCompressed', () => {
    it('should return false for plain JSON object', () => {
      expect(isCompressed('{"key": "value"}')).toBe(false);
    });

    it('should return false for plain JSON array', () => {
      expect(isCompressed('[1, 2, 3]')).toBe(false);
    });

    it('should return false for JSON with whitespace', () => {
      expect(isCompressed('  {"key": "value"}')).toBe(false);
      expect(isCompressed('\n[1, 2, 3]')).toBe(false);
    });

    it('should return true for compressed (base64) data', () => {
      const compressed = compressData({ test: 'data' });
      expect(isCompressed(compressed)).toBe(true);
    });

    it('should return true for base64 strings', () => {
      expect(isCompressed('H4sIAAAAAAAAA')).toBe(true);
    });
  });
});
