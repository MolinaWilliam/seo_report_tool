import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SeRankingClient, RateLimitError, InsufficientFundsError } from '../lib/seranking';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('SeRankingClient', () => {
  let client: SeRankingClient;

  beforeEach(() => {
    client = new SeRankingClient('test-api-key', { enableLogging: true });
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('creates client with API key', () => {
      const client = new SeRankingClient('my-api-key');
      expect(client).toBeDefined();
    });

    it('creates client with custom config', () => {
      const client = new SeRankingClient('my-api-key', {
        mode: 'shared',
        trackCredits: true,
        rateLimit: 10,
      });
      expect(client).toBeDefined();
    });
  });

  describe('getBacklinksSummary', () => {
    it('fetches backlinks summary successfully', async () => {
      const mockResponse = {
        summary: [{
          target: 'example.com',
          backlinks: 1000,
          refdomains: 100,
          subnets: 50,
          ips: 75,
          nofollow_backlinks: 200,
          dofollow_backlinks: 800,
          edu_backlinks: 5,
          gov_backlinks: 3,
          domain_inlink_rank: 45,
          text_backlinks: 900,
          top_anchors_by_backlinks: [{ anchor: 'test', backlinks: 10 }],
          top_anchors_by_refdomains: [{ anchor: 'test', refdomains: 5 }],
          top_tlds: [{ tld: 'com', count: 50 }],
          top_countries: [{ country: 'US', count: 30 }],
        }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getBacklinksSummary('example.com');

      expect(result.backlinks).toBe(1000);
      expect(result.refdomains).toBe(100);
      expect(result.dofollow_backlinks).toBe(800);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('throws error when no data returned', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ summary: [] }),
      });

      await expect(client.getBacklinksSummary('example.com')).rejects.toThrow('No backlinks data returned');
    });
  });

  describe('getBacklinksAuthority', () => {
    it('fetches authority data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          pages: [{
            url: 'example.com',
            domain_inlink_rank: 50,
            inlink_rank: 45,
          }],
        }),
      });

      const result = await client.getBacklinksAuthority('example.com');

      expect(result.domain_inlink_rank).toBe(50);
      expect(result.page_inlink_rank).toBe(45);
    });

    it('returns zeros when no pages returned', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ pages: [] }),
      });

      const result = await client.getBacklinksAuthority('example.com');

      expect(result.domain_inlink_rank).toBe(0);
      expect(result.page_inlink_rank).toBe(0);
    });
  });

  describe('getDomainOverview', () => {
    it('fetches domain overview successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          organic: {
            base_domain: 'example.com',
            traffic_sum: 50000,
            price_sum: 25000,
            keywords_count: 1000,
            top1_5: 50,
            top6_10: 100,
            top11_20: 200,
            top21_50: 300,
            top51_100: 350,
          },
          adv: {
            keywords_count: 50,
          },
        }),
      });

      const result = await client.getDomainOverview('example.com');

      expect(result.domain).toBe('example.com');
      expect(result.traffic).toBe(50000);
      expect(result.keywords).toBe(1000);
      expect(result.ads_keywords).toBe(50);
    });
  });

  describe('getDomainKeywords', () => {
    it('fetches domain keywords successfully', async () => {
      const mockKeywords = [
        {
          keyword: 'test keyword',
          position: 5,
          prev_pos: 7,
          volume: 1000,
          cpc: 2.5,
          competition: 0.5,
          difficulty: 35,
          traffic: 200,
          traffic_percent: 10,
          url: 'https://example.com/page',
          serp_features: ['featured_snippet'],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockKeywords),
      });

      const result = await client.getDomainKeywords('example.com');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].keyword).toBe('test keyword');
      expect(result.data[0].position).toBe(5);
      expect(result.data[0].prev_position).toBe(7);
    });
  });

  describe('error handling', () => {
    it('throws RateLimitError on 429 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limit exceeded'),
      });

      await expect(client.getBacklinksAuthority('example.com')).rejects.toThrow(RateLimitError);
    });

    it('throws InsufficientFundsError on 402 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        text: () => Promise.resolve('Insufficient funds'),
      });

      await expect(client.getBacklinksAuthority('example.com')).rejects.toThrow(InsufficientFundsError);
    });

    it('throws generic error for other status codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal server error'),
      });

      await expect(client.getBacklinksAuthority('example.com')).rejects.toThrow('API Error 500');
    });
  });

  describe('API logging', () => {
    it('logs API responses when enabled', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          pages: [{
            url: 'example.com',
            domain_inlink_rank: 50,
            inlink_rank: 45,
          }],
        }),
      });

      await client.getBacklinksAuthority('example.com');
      const logs = client.getApiLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0].endpoint).toBe('/backlinks/authority');
      expect(logs[0].method).toBe('GET');
      expect(logs[0].timestamp).toBeDefined();
    });

    it('clears API logs', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          pages: [{
            url: 'example.com',
            domain_inlink_rank: 50,
            inlink_rank: 45,
          }],
        }),
      });

      await client.getBacklinksAuthority('example.com');
      expect(client.getApiLogs()).toHaveLength(1);

      client.clearApiLogs();
      expect(client.getApiLogs()).toHaveLength(0);
    });

    it('does not log when logging is disabled', async () => {
      const clientNoLog = new SeRankingClient('test-api-key', { enableLogging: false });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          pages: [{
            url: 'example.com',
            domain_inlink_rank: 50,
            inlink_rank: 45,
          }],
        }),
      });

      await clientNoLog.getBacklinksAuthority('example.com');
      const logs = clientNoLog.getApiLogs();

      expect(logs).toHaveLength(0);
    });
  });

  describe('Multi-Competitor Gap Aggregation', () => {
    describe('getMultiCompetitorKeywordGaps', () => {
      it('aggregates keyword gaps across multiple competitors', async () => {
        // Mock responses for 3 competitors
        // Competitor 1: ranks for "seo tools" and "keyword research"
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'seo tools', volume: 5000, difficulty: 45, position: 3 },
            { keyword: 'keyword research', volume: 3000, difficulty: 35, position: 5 },
          ]),
        });
        // Competitor 2: ranks for "seo tools" and "backlink checker"
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'seo tools', volume: 5000, difficulty: 45, position: 7 },
            { keyword: 'backlink checker', volume: 2000, difficulty: 30, position: 4 },
          ]),
        });
        // Competitor 3: ranks for "seo tools"
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'seo tools', volume: 5000, difficulty: 45, position: 2 },
          ]),
        });

        const result = await client.getMultiCompetitorKeywordGaps(
          'ourdomain.com',
          ['competitor1.com', 'competitor2.com', 'competitor3.com'],
          'us',
          10
        );

        expect(result.length).toBeGreaterThan(0);
        // "seo tools" should appear in all 3 competitors
        const seoToolsGap = result.find(g => g.keyword === 'seo tools');
        expect(seoToolsGap).toBeDefined();
        expect(seoToolsGap?.competitorCount).toBe(3);
        expect(seoToolsGap?.bestPosition).toBe(2);
        expect(seoToolsGap?.avgPosition).toBe(4); // (3+7+2)/3 = 4

        // Results should be sorted by competitorCount desc
        expect(result[0].competitorCount).toBeGreaterThanOrEqual(result[result.length - 1].competitorCount);
      });

      it('returns empty array on error', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        const result = await client.getMultiCompetitorKeywordGaps(
          'ourdomain.com',
          ['competitor1.com'],
          'us'
        );

        expect(result).toEqual([]);
      });
    });

    describe('getMultiCompetitorBacklinkGaps', () => {
      it('aggregates backlink gaps across multiple competitors', async () => {
        // Mock our ref domains
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            refdomains: [
              { refdomain: 'ourdomain-link.com', backlinks: 5, domain_inlink_rank: 40, first_seen: '2024-01-01' },
            ],
          }),
        });
        // Competitor 1 ref domains
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            refdomains: [
              { refdomain: 'shared-link.com', backlinks: 10, domain_inlink_rank: 70, first_seen: '2024-01-01' },
              { refdomain: 'unique-link1.com', backlinks: 5, domain_inlink_rank: 50, first_seen: '2024-01-01' },
            ],
          }),
        });
        // Competitor 2 ref domains
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            refdomains: [
              { refdomain: 'shared-link.com', backlinks: 8, domain_inlink_rank: 70, first_seen: '2024-01-01' },
              { refdomain: 'unique-link2.com', backlinks: 3, domain_inlink_rank: 30, first_seen: '2024-01-01' },
            ],
          }),
        });

        const result = await client.getMultiCompetitorBacklinkGaps(
          'ourdomain.com',
          ['competitor1.com', 'competitor2.com'],
          10
        );

        expect(result.length).toBeGreaterThan(0);
        // "shared-link.com" should appear for both competitors
        const sharedLink = result.find(g => g.domain === 'shared-link.com');
        expect(sharedLink).toBeDefined();
        expect(sharedLink?.competitorCount).toBe(2);
        expect(sharedLink?.totalBacklinksToCompetitors).toBe(18); // 10 + 8

        // Results should be sorted by competitorCount desc
        expect(result[0].competitorCount).toBeGreaterThanOrEqual(result[result.length - 1].competitorCount);
      });

      it('excludes domains we already have links from', async () => {
        // Mock our ref domains - we have a link from shared-link.com
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            refdomains: [
              { refdomain: 'shared-link.com', backlinks: 5, domain_inlink_rank: 70, first_seen: '2024-01-01' },
            ],
          }),
        });
        // Competitor ref domains
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            refdomains: [
              { refdomain: 'shared-link.com', backlinks: 10, domain_inlink_rank: 70, first_seen: '2024-01-01' },
              { refdomain: 'new-opportunity.com', backlinks: 5, domain_inlink_rank: 50, first_seen: '2024-01-01' },
            ],
          }),
        });

        const result = await client.getMultiCompetitorBacklinkGaps(
          'ourdomain.com',
          ['competitor1.com'],
          10
        );

        // shared-link.com should be excluded since we already have it
        expect(result.find(g => g.domain === 'shared-link.com')).toBeUndefined();
        // new-opportunity.com should be included
        expect(result.find(g => g.domain === 'new-opportunity.com')).toBeDefined();
      });
    });

    describe('getMultiCompetitorAnalysis', () => {
      it('returns complete analysis with summary stats', async () => {
        // Mock keyword gaps responses
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'shared keyword', volume: 5000, difficulty: 40, position: 3 },
          ]),
        });
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'shared keyword', volume: 5000, difficulty: 40, position: 5 },
          ]),
        });

        // Mock keyword overlaps responses
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

        // Mock backlink gaps - our ref domains
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ refdomains: [] }),
        });
        // Competitor 1 ref domains
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            refdomains: [
              { refdomain: 'link-source.com', backlinks: 5, domain_inlink_rank: 60, first_seen: '2024-01-01' },
            ],
          }),
        });
        // Competitor 2 ref domains
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            refdomains: [
              { refdomain: 'link-source.com', backlinks: 3, domain_inlink_rank: 60, first_seen: '2024-01-01' },
            ],
          }),
        });

        const result = await client.getMultiCompetitorAnalysis(
          'ourdomain.com',
          ['competitor1.com', 'competitor2.com'],
          'us'
        );

        expect(result.competitorsAnalyzed).toEqual(['competitor1.com', 'competitor2.com']);
        expect(result.keywordGaps.length).toBeGreaterThan(0);
        expect(result.backlinkGaps.length).toBeGreaterThan(0);
        expect(result.summary.keywordGapsMultipleCompetitors).toBeGreaterThanOrEqual(0);
        expect(result.summary.backlinkGapsMultipleCompetitors).toBeGreaterThanOrEqual(0);
        expect(typeof result.summary.potentialTrafficOpportunity).toBe('number');
      });

      it('returns empty analysis on complete failure', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        const result = await client.getMultiCompetitorAnalysis(
          'ourdomain.com',
          ['competitor1.com'],
          'us'
        );

        expect(result.competitorsAnalyzed).toEqual(['competitor1.com']);
        expect(result.keywordGaps).toEqual([]);
        expect(result.keywordOverlaps).toEqual([]);
        expect(result.backlinkGaps).toEqual([]);
        expect(result.summary.totalKeywordGaps).toBe(0);
      });
    });
  });
});
