'use client';

import { useState } from 'react';
import { Users, ExternalLink, BarChart2, Link2, Repeat, TrendingUp, FileText, ArrowRight, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { formatNumber, getDifficultyColor } from '@/lib/utils';
import BarChart from '@/components/Charts/BarChart';
import DeveloperInfo from '@/components/DeveloperInfo';
import type { ReportData, ApiResponseLog, PageComparison, PaidAdsByKeyword } from '@/lib/types';

interface CompetitiveLandscapeProps {
  data: ReportData['competitive'];
  ourDomain?: string;
  ourTraffic?: number;
  ourAuthority?: number;
  apiLogs?: ApiResponseLog[];
}

export default function CompetitiveLandscape({ data, ourDomain, ourTraffic, ourAuthority, apiLogs = [] }: CompetitiveLandscapeProps) {
  const { competitors, competitorComparison, multiCompetitorAnalysis, pageComparisons, paidSearchCompetitors } = data;
  const [showPaidSearch, setShowPaidSearch] = useState(true);
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);

  // Filter multi-competitor gaps to show only items with 2+ competitors (validated opportunities)
  const validatedKeywordGaps = multiCompetitorAnalysis?.keywordGaps.filter(g => g.competitorCount >= 2) || [];
  const validatedBacklinkGaps = multiCompetitorAnalysis?.backlinkGaps.filter(g => g.competitorCount >= 2) || [];

  // Get top competitor for page comparison label
  const topCompetitor = competitors[0];

  // Prepare traffic comparison data
  const trafficComparisonData = [
    ...(ourDomain && ourTraffic ? [{ name: 'You', value: ourTraffic, color: '#3b82f6' }] : []),
    ...competitors.slice(0, 5).map((c, i) => ({
      name: c.domain.split('.')[0],
      value: c.traffic,
      color: ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][i % 5],
    })),
  ];

  // Prepare authority comparison data
  const authorityComparisonData = [
    ...(ourDomain && ourAuthority !== undefined ? [{ name: 'You', value: ourAuthority, color: '#3b82f6' }] : []),
    ...(competitorComparison || []).slice(0, 5).filter(c => c.authority > 0).map((c, i) => ({
      name: c.domain.split('.')[0],
      value: c.authority,
      color: ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][i % 5],
    })),
  ];

  // Helper to extract page path from URL
  const getPagePath = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname || '/';
    } catch {
      return url;
    }
  };

  // Helper to extract domain from URL
  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      {/* Comparison Charts Row */}
      {(trafficComparisonData.length > 1 || authorityComparisonData.length > 1) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Comparison */}
          {trafficComparisonData.length > 1 && (
            <div className="card">
              <h4 className="card-header flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                Traffic Comparison
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Estimated monthly organic traffic
              </p>
              <BarChart data={trafficComparisonData} horizontal={true} />
            </div>
          )}

          {/* Authority Comparison */}
          {authorityComparisonData.length > 1 && (
            <div className="card">
              <h4 className="card-header flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                Domain Authority Comparison
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                InLink Rank score (0-100)
              </p>
              <BarChart data={authorityComparisonData} horizontal={true} />
            </div>
          )}
        </div>
      )}

      {/* Top Competitors */}
      <div className="card">
        <h4 className="card-header flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          Your Top Organic Competitors
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="table-header">Competitor</th>
                <th className="table-header text-center">Overlap</th>
                <th className="table-header text-right">Traffic</th>
                <th className="table-header text-right">Keywords</th>
                <th className="table-header text-right">Common</th>
              </tr>
            </thead>
            <tbody>
              {competitors.slice(0, 5).map((competitor, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded">
                          #1
                        </span>
                      )}
                      <span className="font-medium text-gray-900">{competitor.domain}</span>
                      <a
                        href={`https://${competitor.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${competitor.overlap}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{competitor.overlap}%</span>
                    </div>
                  </td>
                  <td className="table-cell text-right">{formatNumber(competitor.traffic)}</td>
                  <td className="table-cell text-right">{formatNumber(competitor.keywords)}</td>
                  <td className="table-cell text-right font-medium text-blue-600">
                    {formatNumber(competitor.common_keywords)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Competitor Keyword Opportunities */}
      {validatedKeywordGaps.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Multi-Competitor Keyword Opportunities
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Keywords multiple competitors rank for that you don&apos;t - validated opportunities
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header">Keyword</th>
                  <th className="table-header text-center">Competitors</th>
                  <th className="table-header text-right">Volume</th>
                  <th className="table-header text-center">Difficulty</th>
                  <th className="table-header text-center">Avg Position</th>
                </tr>
              </thead>
              <tbody>
                {validatedKeywordGaps.slice(0, 15).map((gap, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900">{gap.keyword}</td>
                    <td className="table-cell text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        gap.competitorCount >= 4 ? 'bg-green-100 text-green-700' :
                        gap.competitorCount >= 3 ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {gap.competitorCount}
                      </span>
                    </td>
                    <td className="table-cell text-right">{formatNumber(gap.volume)}</td>
                    <td className="table-cell">
                      <div className="flex justify-center">
                        <span className={`badge ${getDifficultyColor(gap.difficulty)}`}>
                          {gap.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell text-center font-medium">#{gap.avgPosition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {multiCompetitorAnalysis?.summary && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>{validatedKeywordGaps.length} validated keyword gaps</strong> found across {multiCompetitorAnalysis.competitorsAnalyzed.length} competitors.
                Potential traffic opportunity: <strong>{formatNumber(multiCompetitorAnalysis.summary.potentialTrafficOpportunity)}</strong> visits/mo.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Multi-Competitor Backlink Opportunities */}
      {validatedBacklinkGaps.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-600" />
            Multi-Competitor Backlink Opportunities
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Domains linking to multiple competitors but not to you - high-priority outreach targets
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header">Referring Domain</th>
                  <th className="table-header text-center">Competitors</th>
                  <th className="table-header text-center">Domain Authority</th>
                  <th className="table-header text-right">Total Links</th>
                </tr>
              </thead>
              <tbody>
                {validatedBacklinkGaps.slice(0, 15).map((gap, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{gap.domain}</span>
                        <a
                          href={`https://${gap.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-600"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        gap.competitorCount >= 4 ? 'bg-green-100 text-green-700' :
                        gap.competitorCount >= 3 ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {gap.competitorCount}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      <span className={`badge ${
                        gap.domainInlinkRank >= 70 ? 'badge-green' :
                        gap.domainInlinkRank >= 40 ? 'badge-yellow' :
                        'badge-gray'
                      }`}>
                        {gap.domainInlinkRank}
                      </span>
                    </td>
                    <td className="table-cell text-right">{formatNumber(gap.totalBacklinksToCompetitors)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {multiCompetitorAnalysis?.summary && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-700">
                <strong>{validatedBacklinkGaps.length} high-priority link opportunities</strong> found.
                These domains link to multiple competitors - they&apos;re more likely to link to relevant sites in your niche.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 1:1 Page Comparison vs Top Competitor */}
      {pageComparisons && pageComparisons.length > 0 && topCompetitor && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600" />
            1:1 Page Comparison vs {topCompetitor.domain}
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Direct keyword comparison between your top pages and your #1 competitor&apos;s pages
          </p>
          <div className="space-y-6">
            {pageComparisons.map((comparison, index) => {
              const competitorDomain = getDomainFromUrl(comparison.competitorUrl);

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  {/* Page URLs Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-xs text-blue-600 font-semibold uppercase">You</span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]" title={comparison.ourUrl}>
                        {getPagePath(comparison.ourUrl)}
                      </span>
                      <a href={comparison.ourUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                      <span className="text-xs text-orange-600 font-semibold uppercase">{competitorDomain}</span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]" title={comparison.competitorUrl}>
                        {getPagePath(comparison.competitorUrl)}
                      </span>
                      <a href={comparison.competitorUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Common Keywords */}
                  {comparison.commonKeywords.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-blue-500" />
                        Common Keywords ({comparison.commonKeywords.length})
                        <span className="text-xs text-gray-400 font-normal">- keywords both pages rank for</span>
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="table-header text-left">Keyword</th>
                              <th className="table-header text-right">Volume</th>
                              <th className="table-header text-center">Your Pos</th>
                              <th className="table-header text-center">{competitorDomain.split('.')[0]} Pos</th>
                              <th className="table-header text-center">Gap</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparison.commonKeywords.slice(0, 5).map((kw, kwIndex) => {
                              const gap = (kw.compare_position || 0) - (kw.position || 0);
                              return (
                                <tr key={kwIndex} className="border-b border-gray-50">
                                  <td className="table-cell font-medium text-gray-900">{kw.keyword}</td>
                                  <td className="table-cell text-right">{formatNumber(kw.volume)}</td>
                                  <td className="table-cell text-center font-bold text-blue-600">#{kw.position || '-'}</td>
                                  <td className="table-cell text-center font-bold text-orange-600">#{kw.compare_position || '-'}</td>
                                  <td className="table-cell text-center">
                                    <span className={`font-medium ${gap > 0 ? 'text-green-600' : gap < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                      {gap > 0 ? `+${gap}` : gap}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Your Unique Keywords */}
                  {comparison.ourUniqueKeywords.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Your Advantages ({comparison.ourUniqueKeywords.length})
                        <span className="text-xs text-gray-400 font-normal">- keywords only your page ranks for</span>
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="table-header text-left">Keyword</th>
                              <th className="table-header text-right">Volume</th>
                              <th className="table-header text-center">Your Pos</th>
                              <th className="table-header text-right">Traffic</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparison.ourUniqueKeywords.slice(0, 5).map((kw, kwIndex) => (
                              <tr key={kwIndex} className="border-b border-gray-50">
                                <td className="table-cell font-medium text-gray-900">{kw.keyword}</td>
                                <td className="table-cell text-right">{formatNumber(kw.volume)}</td>
                                <td className="table-cell text-center font-bold text-green-600">#{kw.position || '-'}</td>
                                <td className="table-cell text-right">{formatNumber(kw.traffic || 0)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {comparison.commonKeywords.length === 0 && comparison.ourUniqueKeywords.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No keyword data available for this page comparison</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-cyan-50 rounded-lg">
            <p className="text-sm text-cyan-700">
              <strong>{pageComparisons.length} page{pageComparisons.length > 1 ? 's' : ''} compared</strong> against {topCompetitor.domain}.
              Use this to understand direct competition at the page level.
            </p>
          </div>
        </div>
      )}

      {/* Paid Search Competitors */}
      {paidSearchCompetitors && paidSearchCompetitors.length > 0 && (
        <div className="card">
          <button
            onClick={() => setShowPaidSearch(!showPaidSearch)}
            className="w-full flex items-center justify-between"
          >
            <h4 className="card-header flex items-center gap-2 mb-0">
              <DollarSign className="w-5 h-5 text-green-600" />
              Paid Search Competitors
            </h4>
            {showPaidSearch ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showPaidSearch && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-500">
                Competitors bidding on the same keywords you&apos;re advertising on.
                Analyzing your top {paidSearchCompetitors.length} paid keywords.
              </p>

              {paidSearchCompetitors.map((insight) => (
                <div key={insight.keyword} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedKeyword(expandedKeyword === insight.keyword ? null : insight.keyword)}
                    className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">&quot;{insight.keyword}&quot;</span>
                      <span className="badge badge-green">
                        {insight.advertisers.length} competitor{insight.advertisers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {expandedKeyword === insight.keyword ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {expandedKeyword === insight.keyword && (
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="table-header">Advertiser</th>
                              <th className="table-header text-center">Ads</th>
                              <th className="table-header text-right">Traffic</th>
                              <th className="table-header text-right">Ad Spend</th>
                              <th className="table-header">Latest Ad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {insight.advertisers.map((advertiser, idx) => {
                              const latestSnippet = advertiser.snippets[0];
                              return (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="table-cell">
                                    <a
                                      href={`https://${advertiser.domain}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                    >
                                      {advertiser.domain}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {formatNumber(advertiser.keywords_count)} total ad keywords
                                    </div>
                                  </td>
                                  <td className="table-cell text-center">
                                    <span className="font-semibold">{advertiser.ads_count}</span>
                                  </td>
                                  <td className="table-cell text-right text-green-600">
                                    {formatNumber(advertiser.traffic_sum)}
                                  </td>
                                  <td className="table-cell text-right">
                                    <span className="text-amber-600 font-medium">
                                      ${formatNumber(Math.round(advertiser.price_sum))}
                                    </span>
                                  </td>
                                  <td className="table-cell">
                                    {latestSnippet ? (
                                      <div className="max-w-xs">
                                        <div className="text-sm font-medium text-blue-600 truncate">
                                          {latestSnippet.snippet_title}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate mt-1">
                                          {latestSnippet.snippet_description}
                                        </div>
                                        <div className="text-xs text-green-600 mt-1">
                                          {latestSnippet.snippet_display_url}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Insight Summary */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-green-800">Paid Search Competition</h5>
                    <p className="text-sm text-green-700 mt-1">
                      {paidSearchCompetitors.reduce((sum, i) => sum + i.advertisers.length, 0)} total competitor ads found
                      across {paidSearchCompetitors.length} keyword{paidSearchCompetitors.length !== 1 ? 's' : ''} you&apos;re bidding on.
                      Analyze their ad copy and landing pages to improve your campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Competitors State */}
      {competitors.length === 0 && (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700">No Competitors Found</h4>
            <p className="text-gray-500 mt-2 max-w-md">
              We couldn&apos;t identify organic competitors for this domain. This might be a new or
              niche website.
            </p>
          </div>
        </div>
      )}

      {/* Developer Info */}
      <DeveloperInfo
        apiLogs={apiLogs}
        filterEndpoints={['/domain/competitors', '/domain/keywords/comparison', '/backlinks/refdomains']}
        title="API Calls"
      />
    </div>
  );
}
