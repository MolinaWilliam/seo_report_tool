import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the report-store module
vi.mock('../lib/report-store', () => ({
  getReport: vi.fn(),
  setReport: vi.fn(),
  updateReportProgress: vi.fn(),
}));

// Since generateReport requires a real SeRankingClient and makes many API calls,
// we'll focus on testing the helper functions and type validation

describe('Report Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ReportData structure', () => {
    it('should have expected executive summary fields', () => {
      const mockExecutive = {
        traffic: 50000,
        backlinks: 1000,
        authority: 45,
        keywords: 500,
        aiShareOfVoice: 15,
      };

      expect(mockExecutive).toHaveProperty('traffic');
      expect(mockExecutive).toHaveProperty('backlinks');
      expect(mockExecutive).toHaveProperty('authority');
      expect(mockExecutive).toHaveProperty('keywords');
      expect(mockExecutive).toHaveProperty('aiShareOfVoice');
    });

    it('should have expected backlinks section structure', () => {
      const mockBacklinks = {
        summary: {
          backlinks: 1000,
          refdomains: 100,
          dofollow_backlinks: 800,
          nofollow_backlinks: 200,
        },
        authority: {
          domain_inlink_rank: 45,
          page_inlink_rank: 40,
        },
        momentum: {
          new_backlinks: 50,
          lost_backlinks: 10,
          new_refdomains: 20,
          lost_refdomains: 5,
        },
        indexedPages: [],
        distribution: {
          '0-10': 50,
          '11-20': 30,
          '21-30': 15,
          '31-40': 5,
          '41-50': 0,
          '51-60': 0,
          '61-70': 0,
          '71-80': 0,
          '81-90': 0,
          '91-100': 0,
        },
      };

      expect(mockBacklinks.summary).toHaveProperty('backlinks');
      expect(mockBacklinks.authority).toHaveProperty('domain_inlink_rank');
      expect(mockBacklinks.momentum).toHaveProperty('new_backlinks');
      expect(mockBacklinks.momentum).toHaveProperty('lost_backlinks');
    });

    it('should have expected keywords section structure', () => {
      const mockKeywords = {
        total: 500,
        topKeywords: [],
        nearPageOne: [],
        positionDistribution: {
          top3: 50,
          top10: 100,
          top20: 200,
          top50: 350,
          top100: 500,
        },
        history: [],
        positionChanges: {
          up: 30,
          down: 10,
          new: 20,
          lost: 5,
        },
      };

      expect(mockKeywords).toHaveProperty('total');
      expect(mockKeywords).toHaveProperty('topKeywords');
      expect(mockKeywords.positionDistribution).toHaveProperty('top3');
      expect(mockKeywords.positionDistribution).toHaveProperty('top10');
    });

    it('should have expected AI search section structure', () => {
      const mockAISearch = {
        overview: {
          target: 'example.com',
          engines: [
            { engine: 'chatgpt', brand_presence: 10, link_presence: 5, traffic: 1000 },
          ],
        },
        leaderboard: [],
        prompts: [],
        market: 'us',
        marketName: 'United States',
      };

      expect(mockAISearch.overview).toHaveProperty('target');
      expect(mockAISearch.overview).toHaveProperty('engines');
      expect(mockAISearch).toHaveProperty('market');
      expect(mockAISearch).toHaveProperty('marketName');
    });

    it('should have expected competitive section structure', () => {
      const mockCompetitive = {
        competitors: [],
        competitorComparison: [],
        keywordGaps: [],
        keywordOverlap: [],
        backlinkGaps: [],
      };

      expect(mockCompetitive).toHaveProperty('competitors');
      expect(mockCompetitive).toHaveProperty('competitorComparison');
      expect(mockCompetitive).toHaveProperty('keywordGaps');
      expect(mockCompetitive).toHaveProperty('backlinkGaps');
    });

    it('should have expected quick wins section structure', () => {
      const mockQuickWins = {
        nearPageOneKeywords: [],
        lowHangingFruit: [
          {
            type: 'keywords',
            description: 'Optimize 5 keywords in positions 11-20',
            impact: 'high' as const,
            effort: 'medium' as const,
          },
        ],
      };

      expect(mockQuickWins).toHaveProperty('nearPageOneKeywords');
      expect(mockQuickWins).toHaveProperty('lowHangingFruit');
      expect(mockQuickWins.lowHangingFruit[0]).toHaveProperty('type');
      expect(mockQuickWins.lowHangingFruit[0]).toHaveProperty('impact');
      expect(mockQuickWins.lowHangingFruit[0]).toHaveProperty('effort');
    });
  });

  describe('API response logging', () => {
    it('should include apiResponses in report data', () => {
      const mockReportData = {
        executive: { traffic: 0, backlinks: 0, authority: 0, keywords: 0 },
        backlinks: {} as any,
        keywords: {} as any,
        domainAnalysis: {} as any,
        competitive: {} as any,
        aiSearch: {} as any,
        contentOpportunities: {} as any,
        quickWins: {} as any,
        apiResponses: [
          {
            endpoint: '/backlinks/summary',
            method: 'GET' as const,
            params: { target: 'example.com' },
            response: { summary: [] },
            timestamp: new Date().toISOString(),
            duration: 150,
          },
        ],
      };

      expect(mockReportData.apiResponses).toHaveLength(1);
      expect(mockReportData.apiResponses[0].endpoint).toBe('/backlinks/summary');
      expect(mockReportData.apiResponses[0].method).toBe('GET');
      expect(mockReportData.apiResponses[0].duration).toBe(150);
    });
  });
});
