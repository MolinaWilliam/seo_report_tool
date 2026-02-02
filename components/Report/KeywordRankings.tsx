'use client';

import { useState } from 'react';
import { Search, ArrowUp, ArrowDown, Minus, TrendingUp, Award, BarChart2, Lightbulb, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { formatNumber, getDifficultyColor } from '@/lib/utils';
import BarChart from '@/components/Charts/BarChart';
import DonutChart from '@/components/Charts/DonutChart';
import StackedAreaChart from '@/components/Charts/StackedAreaChart';
import ScatterChart from '@/components/Charts/ScatterChart';
import DeveloperInfo from '@/components/DeveloperInfo';
import type { ReportData, KeywordSuggestion, ApiResponseLog } from '@/lib/types';

interface KeywordRankingsProps {
  data: ReportData['keywords'];
  apiLogs?: ApiResponseLog[];
}

export default function KeywordRankings({ data, apiLogs = [] }: KeywordRankingsProps) {
  const { total, topKeywords, positionDistribution, history, positionChanges, serpFeatures, research } = data;
  const [showResearch, setShowResearch] = useState(true);
  const [activeResearchTab, setActiveResearchTab] = useState<'similar' | 'related' | 'longtail'>('similar');

  // Prepare position distribution data
  const distributionData = [
    { name: 'Top 3', value: positionDistribution.top3, color: '#22c55e' },
    { name: '4-10', value: positionDistribution.top10 - positionDistribution.top3, color: '#84cc16' },
    { name: '11-20', value: positionDistribution.top20 - positionDistribution.top10, color: '#eab308' },
    { name: '21-50', value: positionDistribution.top50 - positionDistribution.top20, color: '#f97316' },
    { name: '51-100', value: positionDistribution.top100 - positionDistribution.top50, color: '#94a3b8' },
  ];

  // Calculate position changes from keywords if not provided
  const changes = positionChanges || topKeywords.reduce(
    (acc, k) => {
      if (k.prev_position === null) {
        acc.new++;
      } else if (k.prev_position > k.position) {
        acc.up++;
      } else if (k.prev_position < k.position) {
        acc.down++;
      }
      return acc;
    },
    { up: 0, down: 0, new: 0, lost: 0 }
  );

  // Calculate SERP features from keywords if not provided
  const serpFeaturesData = serpFeatures || (() => {
    const featureCount: Record<string, number> = {};
    topKeywords.forEach(k => {
      (k.serp_features || []).forEach(f => {
        featureCount[f] = (featureCount[f] || 0) + 1;
      });
    });
    return Object.entries(featureCount)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  })();

  // Prepare SERP features chart data
  const serpChartData = serpFeaturesData.map((sf, i) => ({
    name: formatSerpFeature(sf.feature),
    value: sf.count,
    color: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][i % 6],
  }));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-2xl font-bold text-gray-900">{formatNumber(total)}</div>
          <div className="text-sm text-gray-500">Total Keywords</div>
        </div>
        <div className="metric-card">
          <div className="text-2xl font-bold text-green-600">{formatNumber(positionDistribution.top3)}</div>
          <div className="text-sm text-gray-500">Top 3 Positions</div>
        </div>
        <div className="metric-card">
          <div className="text-2xl font-bold text-blue-600">{formatNumber(positionDistribution.top10)}</div>
          <div className="text-sm text-gray-500">Top 10 Positions</div>
        </div>
        <div className="metric-card">
          <div className="text-2xl font-bold text-amber-600">{formatNumber(positionDistribution.top20 - positionDistribution.top10)}</div>
          <div className="text-sm text-gray-500">Positions 11-20</div>
        </div>
      </div>

      {/* Position Changes & SERP Features Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Changes */}
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Position Changes
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Movement in keyword rankings since last period
          </p>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-xl font-bold">{formatNumber(changes.up)}</span>
              </div>
              <div className="text-xs text-green-600 mt-1">Improved</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-red-500">
                <ArrowDown className="w-4 h-4" />
                <span className="text-xl font-bold">{formatNumber(changes.down)}</span>
              </div>
              <div className="text-xs text-red-500 mt-1">Declined</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{formatNumber(changes.new)}</div>
              <div className="text-xs text-blue-600 mt-1">New</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-500">{formatNumber(changes.lost)}</div>
              <div className="text-xs text-gray-500 mt-1">Lost</div>
            </div>
          </div>
        </div>

        {/* SERP Features */}
        {serpChartData.length > 0 && (
          <div className="card">
            <h4 className="card-header flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              SERP Features Won
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Special search result features your keywords appear in
            </p>
            <DonutChart data={serpChartData} showLegend={true} />
          </div>
        )}
      </div>

      {/* Historical Position Distribution */}
      {history && history.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Historical Keyword Growth
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Keyword position distribution over time with traffic overlay
          </p>
          <StackedAreaChart
            data={history.map(h => ({
              date: h.date,
              top1_5: h.top1_5,
              top6_10: h.top6_10,
              top11_20: h.top11_20,
              top21_50: h.top21_50,
              top51_100: h.top51_100,
              traffic: h.traffic,
            }))}
            showTrafficLine={true}
          />
        </div>
      )}

      {/* Current Position Distribution */}
      <div className="card">
        <h4 className="card-header flex items-center gap-2">
          <Search className="w-5 h-5 text-primary-600" />
          Current Position Distribution
        </h4>
        <BarChart data={distributionData} horizontal={false} />
      </div>

      {/* Top Keywords Table */}
      <div className="card">
        <h4 className="card-header">Top Ranking Keywords</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="table-header">Keyword</th>
                <th className="table-header text-center">Position</th>
                <th className="table-header text-right">Volume</th>
                <th className="table-header text-right">Traffic</th>
                <th className="table-header text-center">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {topKeywords.slice(0, 10).map((keyword, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{keyword.keyword}</span>
                      {keyword.serp_features?.length > 0 && (
                        <div className="flex gap-1">
                          {keyword.serp_features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="badge badge-blue text-xs">
                              {formatSerpFeature(feature)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                      {keyword.url}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-lg">{keyword.position}</span>
                      <PositionChange current={keyword.position} previous={keyword.prev_position} />
                    </div>
                  </td>
                  <td className="table-cell text-right">{formatNumber(keyword.volume)}</td>
                  <td className="table-cell text-right text-green-600">{formatNumber(keyword.traffic)}</td>
                  <td className="table-cell">
                    <div className="flex justify-center">
                      <span className={`badge ${getDifficultyColor(keyword.difficulty)}`}>
                        {keyword.difficulty}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Opportunity Callout */}
      {positionDistribution.top20 - positionDistribution.top10 > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800">Opportunity Detected</h4>
              <p className="text-amber-700 mt-1">
                You have <strong>{positionDistribution.top20 - positionDistribution.top10} keywords</strong> in positions 11-20.
                Small improvements could move these to page 1!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Keyword Research Opportunities Section */}
      {research && (research.similarKeywords.length > 0 || research.relatedKeywords.length > 0 || research.longTailKeywords.length > 0) && (
        <div className="card">
          <button
            onClick={() => setShowResearch(!showResearch)}
            className="w-full flex items-center justify-between"
          >
            <h4 className="card-header flex items-center gap-2 mb-0">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Keyword Expansion Opportunities
            </h4>
            {showResearch ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showResearch && (
            <div className="mt-4 space-y-6">
              <p className="text-sm text-gray-500">
                Based on your top keyword: <strong className="text-gray-700">&quot;{research.seedKeyword}&quot;</strong>
              </p>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveResearchTab('similar')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    activeResearchTab === 'similar'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Similar ({research.similarKeywords.length})
                </button>
                <button
                  onClick={() => setActiveResearchTab('related')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    activeResearchTab === 'related'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Related ({research.relatedKeywords.length})
                </button>
                <button
                  onClick={() => setActiveResearchTab('longtail')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    activeResearchTab === 'longtail'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Long-Tail ({research.longTailKeywords.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="overflow-x-auto">
                <KeywordSuggestionTable
                  keywords={
                    activeResearchTab === 'similar'
                      ? research.similarKeywords
                      : activeResearchTab === 'related'
                        ? research.relatedKeywords
                        : research.longTailKeywords
                  }
                />
              </div>

              {/* Opportunity Finder Chart */}
              {research.sweetSpotKeywords.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    Opportunity Finder
                  </h5>
                  <p className="text-sm text-gray-500 mb-4">
                    Volume vs Difficulty - Sweet spot analysis for all keyword suggestions
                  </p>
                  <ScatterChart
                    data={[
                      ...research.similarKeywords,
                      ...research.relatedKeywords,
                      ...research.longTailKeywords,
                    ]}
                    showSweetSpotZone={true}
                    sweetSpotThresholds={{ minVolume: 1000, maxDifficulty: 40 }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Developer Info Panel */}
      <DeveloperInfo
        apiLogs={apiLogs}
        filterEndpoints={['/domain/', '/keywords/']}
        title="API Calls"
      />
    </div>
  );
}

function KeywordSuggestionTable({ keywords }: { keywords: KeywordSuggestion[] }) {
  if (keywords.length === 0) {
    return <p className="text-gray-500 text-sm py-4">No keyword suggestions available.</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="table-header">Keyword</th>
          <th className="table-header text-right">Volume</th>
          <th className="table-header text-center">Difficulty</th>
          <th className="table-header text-right">CPC</th>
        </tr>
      </thead>
      <tbody>
        {keywords.slice(0, 10).map((kw, index) => (
          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="table-cell font-medium text-gray-900">{kw.keyword}</td>
            <td className="table-cell text-right">{formatNumber(kw.volume)}</td>
            <td className="table-cell">
              <div className="flex justify-center">
                <span className={`badge ${getDifficultyColor(kw.difficulty)}`}>
                  {kw.difficulty}
                </span>
              </div>
            </td>
            <td className="table-cell text-right text-gray-600">
              ${kw.cpc?.toFixed(2) || '0.00'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PositionChange({ current, previous }: { current: number; previous: number | null }) {
  if (previous === null) return <span className="text-gray-400">-</span>;

  const change = previous - current;

  if (change === 0) {
    return <Minus className="w-4 h-4 text-gray-400" />;
  }

  if (change > 0) {
    return (
      <span className="flex items-center text-green-600 text-sm">
        <ArrowUp className="w-3 h-3" />
        {change}
      </span>
    );
  }

  return (
    <span className="flex items-center text-red-500 text-sm">
      <ArrowDown className="w-3 h-3" />
      {Math.abs(change)}
    </span>
  );
}

function formatSerpFeature(feature: string): string {
  const map: Record<string, string> = {
    featured_snippet: 'Snippet',
    people_also_ask: 'PAA',
    video: 'Video',
    image_pack: 'Images',
    local_pack: 'Local',
    knowledge_panel: 'Knowledge',
    reviews: 'Reviews',
  };
  return map[feature] || feature;
}
