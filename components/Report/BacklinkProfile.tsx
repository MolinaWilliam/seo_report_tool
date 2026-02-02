'use client';

import { useState } from 'react';
import { Link as LinkIcon, TrendingUp, TrendingDown, ExternalLink, History, Activity, Shield, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Anchor, Globe, ArrowUpRight, ArrowDownRight, Image as ImageIcon, Network, Download, Database, Coins, FileDown, Loader2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import DonutChart from '@/components/Charts/DonutChart';
import BarChart from '@/components/Charts/BarChart';
import TimelineChart from '@/components/Charts/TimelineChart';
import DeveloperInfo from '@/components/DeveloperInfo';
import type { ReportData, DetailedBacklink, IPConcentration, ApiResponseLog, EnhancedAnchor, IndividualBacklink, RefDomainChange, PageAuthorityPoint } from '@/lib/types';

interface BacklinkProfileProps {
  data: ReportData['backlinks'];
  apiLogs?: ApiResponseLog[];
  reportId?: string;
  totalBacklinks?: number;
}

export default function BacklinkProfile({ data, apiLogs = [], reportId, totalBacklinks }: BacklinkProfileProps) {
  const { summary, authority, momentum, indexedPages, distribution, intelligence } = data;
  const [showIntelligence, setShowIntelligence] = useState(true);

  // Prepare dofollow/nofollow chart data
  const linkTypeData = [
    { name: 'Dofollow', value: summary.dofollow_backlinks, color: '#22c55e' },
    { name: 'Nofollow', value: summary.nofollow_backlinks, color: '#94a3b8' },
  ];

  // Prepare authority distribution data
  const distributionData = Object.entries(distribution).map(([range, value]) => ({
    name: range,
    value,
    color: getDistributionColor(range),
  }));

  const netChange = momentum.new_backlinks - momentum.lost_backlinks;

  return (
    <div className="space-y-6">
      {/* Backlink Momentum */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
        <h4 className="font-medium text-gray-900 mb-4">Backlink Momentum (Last 30 Days)</h4>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">+{formatNumber(momentum.new_backlinks)}</span>
            <span className="text-gray-500">new</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-red-500">-{formatNumber(momentum.lost_backlinks)}</span>
            <span className="text-gray-500">lost</span>
          </div>
          <div className={`px-4 py-2 rounded-lg font-medium ${
            netChange > 0 ? 'bg-green-100 text-green-700' : netChange < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            Net: {netChange > 0 ? '+' : ''}{formatNumber(netChange)} {netChange > 0 ? 'Growing' : netChange < 0 ? 'Declining' : 'Stable'}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Link Quality */}
        <div className="card">
          <h4 className="card-header">Link Quality</h4>
          <DonutChart data={linkTypeData} showLegend={true} />
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{authority.domain_inlink_rank}</div>
              <div className="text-sm text-gray-500">Domain Authority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summary.refdomains)}</div>
              <div className="text-sm text-gray-500">Referring Domains</div>
            </div>
          </div>
        </div>

        {/* Authority Distribution */}
        <div className="card">
          <h4 className="card-header">Authority Distribution</h4>
          <BarChart data={distributionData} horizontal color="#0ea5e9" />
        </div>
      </div>

      {/* Top Linked Pages */}
      <div className="card">
        <h4 className="card-header flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-primary-600" />
          Top Linked Pages
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="table-header">Page</th>
                <th className="table-header text-right">Backlinks</th>
                <th className="table-header text-right">Ref Domains</th>
                <th className="table-header text-right">Dofollow</th>
              </tr>
            </thead>
            <tbody>
              {indexedPages.slice(0, 5).map((page, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium truncate max-w-xs">
                        {page.page}
                      </span>
                      <a
                        href={`https://${page.page}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="table-cell text-right font-medium">{formatNumber(page.backlinks)}</td>
                  <td className="table-cell text-right">{formatNumber(page.refdomains)}</td>
                  <td className="table-cell text-right text-green-600">{formatNumber(page.dofollow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Anchor Diversity Analysis */}
      {intelligence?.enhancedAnchors && intelligence.enhancedAnchors.length > 0 && (
        <AnchorDiversityAnalysis anchors={intelligence.enhancedAnchors} />
      )}

      {/* Backlink Intelligence Section */}
      {intelligence && (
        intelligence.history.length > 0 ||
        intelligence.newBacklinks.length > 0 ||
        intelligence.ipConcentration.length > 0 ||
        (intelligence.topBacklinks && intelligence.topBacklinks.length > 0) ||
        (intelligence.authorityTrend && intelligence.authorityTrend.length > 0) ||
        (intelligence.refDomainChanges && (intelligence.refDomainChanges.new.length > 0 || intelligence.refDomainChanges.lost.length > 0)) ||
        reportId
      ) && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Backlink Intelligence
            </h3>
            <button
              onClick={() => setShowIntelligence(!showIntelligence)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showIntelligence ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {showIntelligence && (
            <>
              {/* Historical Growth Chart */}
              {intelligence.history.length > 0 && (
                <div className="card">
                  <h4 className="card-header flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Backlink Growth History
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Cumulative backlinks and referring domains over time
                  </p>
                  <TimelineChart
                    data={intelligence.history}
                    showRefDomainsLine={true}
                    height={300}
                  />
                </div>
              )}

              {/* Authority Trend Chart */}
              {intelligence.authorityTrend && intelligence.authorityTrend.length > 0 && (
                <AuthorityTrendChart
                  authorityTrend={intelligence.authorityTrend}
                  subnetCount={intelligence.subnetCount}
                />
              )}

              {/* Recent Activity Feed */}
              {(intelligence.newBacklinks.length > 0 || intelligence.lostBacklinks.length > 0) && (
                <div className="card">
                  <h4 className="card-header flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Recent Backlink Activity
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Last 30 days • Net change: <span className={intelligence.netChange.backlinks >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {intelligence.netChange.backlinks >= 0 ? '+' : ''}{intelligence.netChange.backlinks}
                    </span> backlinks, <span className={intelligence.netChange.refdomains >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {intelligence.netChange.refdomains >= 0 ? '+' : ''}{intelligence.netChange.refdomains}
                    </span> ref. domains
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* New Backlinks */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-medium text-gray-900">New Backlinks ({intelligence.newBacklinks.length})</span>
                      </div>
                      <BacklinkActivityList backlinks={intelligence.newBacklinks.slice(0, 5)} type="new" />
                    </div>

                    {/* Lost Backlinks */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="font-medium text-gray-900">Lost Backlinks ({intelligence.lostBacklinks.length})</span>
                      </div>
                      <BacklinkActivityList backlinks={intelligence.lostBacklinks.slice(0, 5)} type="lost" />
                    </div>
                  </div>
                </div>
              )}

              {/* Referring Domain Changes */}
              {intelligence.refDomainChanges && (intelligence.refDomainChanges.new.length > 0 || intelligence.refDomainChanges.lost.length > 0) && (
                <RefDomainChangesPanel refDomainChanges={intelligence.refDomainChanges} />
              )}

              {/* Top High-Authority Backlinks */}
              {intelligence.topBacklinks && intelligence.topBacklinks.length > 0 && (
                <TopBacklinksPanel backlinks={intelligence.topBacklinks} />
              )}

              {/* IP Concentration Analysis */}
              {intelligence.ipConcentration.length > 0 && (
                <div className="card">
                  <h4 className="card-header flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    Link Diversity Analysis
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    IP concentration can indicate potential PBN links or link spam
                  </p>

                  <IPConcentrationAnalysis ipData={intelligence.ipConcentration} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Export All Backlinks - Always visible when reportId is provided */}
      {reportId && (
        <BacklinkExportPanel
          reportId={reportId}
          totalBacklinks={totalBacklinks || summary.backlinks}
        />
      )}

      {/* Developer Info Panel */}
      <DeveloperInfo
        apiLogs={apiLogs}
        filterEndpoints={['/backlinks/']}
        title="API Calls"
      />
    </div>
  );
}

function BacklinkActivityList({ backlinks, type }: { backlinks: DetailedBacklink[]; type: 'new' | 'lost' }) {
  if (backlinks.length === 0) {
    return <p className="text-sm text-gray-500">No {type} backlinks in this period.</p>;
  }

  return (
    <div className="space-y-2">
      {backlinks.map((bl, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <a
                href={bl.url_from}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
              >
                {extractDomain(bl.url_from)}
              </a>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {bl.anchor || '(no anchor text)'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded ${bl.dofollow ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {bl.dofollow ? 'dofollow' : 'nofollow'}
              </span>
              <span className="text-xs font-medium text-gray-500">
                DA {bl.domain_inlink_rank}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {type === 'new' ? bl.date_found : bl.date_lost}
          </p>
        </div>
      ))}
    </div>
  );
}

function IPConcentrationAnalysis({ ipData }: { ipData: IPConcentration[] }) {
  const totalBacklinks = ipData.reduce((sum, ip) => sum + ip.backlinks, 0);
  const topIpPercentage = ipData[0]?.percentage || 0;
  const hasHighConcentration = ipData.some(ip => ip.riskLevel === 'high');
  const hasMediumConcentration = ipData.some(ip => ip.riskLevel === 'medium');

  return (
    <div className="space-y-4">
      {/* Concentration Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Top 10 IPs Concentration</span>
          <span className="text-sm font-medium text-gray-900">
            {ipData.slice(0, 10).reduce((sum, ip) => sum + ip.percentage, 0).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${hasHighConcentration ? 'bg-red-500' : hasMediumConcentration ? 'bg-amber-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, ipData.slice(0, 10).reduce((sum, ip) => sum + ip.percentage, 0))}%` }}
          />
        </div>
      </div>

      {/* Warning if high concentration */}
      {hasHighConcentration && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">High IP Concentration Detected</p>
            <p className="text-xs text-amber-700 mt-1">
              Some IPs have unusually high backlink concentration. This could indicate PBN links - review recommended.
            </p>
          </div>
        </div>
      )}

      {!hasHighConcentration && !hasMediumConcentration && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Healthy Link Diversity</p>
            <p className="text-xs text-green-700 mt-1">
              Your backlinks come from a diverse range of IP addresses.
            </p>
          </div>
        </div>
      )}

      {/* IP Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="table-header">IP Range</th>
              <th className="table-header text-right">Backlinks</th>
              <th className="table-header text-right">% of Total</th>
              <th className="table-header text-center">Risk</th>
            </tr>
          </thead>
          <tbody>
            {ipData.slice(0, 5).map((ip, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="table-cell font-mono text-gray-900">{ip.ip}</td>
                <td className="table-cell text-right">{formatNumber(ip.backlinks)}</td>
                <td className="table-cell text-right">{ip.percentage.toFixed(1)}%</td>
                <td className="table-cell text-center">
                  <RiskBadge level={ip.riskLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const styles = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    // Try to extract domain manually if URL parsing fails
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

// ============================================================
// Enhanced Backlink Report Components
// ============================================================

interface AnchorDiversityAnalysisProps {
  anchors: EnhancedAnchor[];
}

function AnchorDiversityAnalysis({ anchors }: AnchorDiversityAnalysisProps) {
  // Calculate anchor diversity metrics
  const totalBacklinks = anchors.reduce((sum, a) => sum + a.backlinks, 0);

  // Categorize anchors
  const categorized = anchors.reduce(
    (acc, anchor) => {
      const text = anchor.anchor.toLowerCase();
      const backlinks = anchor.backlinks;

      if (text === '' || text.includes('[image]')) {
        acc.image += backlinks;
      } else if (text.match(/^(click here|here|read more|learn more|website|site|link)$/i)) {
        acc.generic += backlinks;
      } else if (text.match(/^[a-z0-9-]+\.(com|org|net|io|co|dev|app)/i)) {
        acc.branded += backlinks;
      } else {
        acc.exactMatch += backlinks;
      }
      return acc;
    },
    { branded: 0, exactMatch: 0, generic: 0, image: 0 }
  );

  const brandedPct = totalBacklinks > 0 ? (categorized.branded / totalBacklinks) * 100 : 0;
  const exactMatchPct = totalBacklinks > 0 ? (categorized.exactMatch / totalBacklinks) * 100 : 0;
  const genericPct = totalBacklinks > 0 ? (categorized.generic / totalBacklinks) * 100 : 0;
  const imagePct = totalBacklinks > 0 ? (categorized.image / totalBacklinks) * 100 : 0;

  const isOverOptimized = exactMatchPct > 30;

  return (
    <div className="card">
      <h4 className="card-header flex items-center gap-2">
        <Anchor className="w-5 h-5 text-purple-600" />
        Anchor Diversity Analysis
      </h4>
      <p className="text-sm text-gray-500 mb-4">
        Anchor text diversity helps assess link profile health
      </p>

      {/* Diversity Score Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Anchor Distribution</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden flex">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${brandedPct}%` }}
            title={`Branded: ${brandedPct.toFixed(1)}%`}
          />
          <div
            className="bg-purple-500 h-full"
            style={{ width: `${exactMatchPct}%` }}
            title={`Exact Match: ${exactMatchPct.toFixed(1)}%`}
          />
          <div
            className="bg-gray-400 h-full"
            style={{ width: `${genericPct}%` }}
            title={`Generic: ${genericPct.toFixed(1)}%`}
          />
          <div
            className="bg-amber-400 h-full"
            style={{ width: `${imagePct}%` }}
            title={`Image: ${imagePct.toFixed(1)}%`}
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Branded ({brandedPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span>Exact Match ({exactMatchPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-400" />
            <span>Generic ({genericPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-400" />
            <span>Image ({imagePct.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Over-optimization Warning */}
      {isOverOptimized && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Potential Over-Optimization</p>
            <p className="text-xs text-amber-700 mt-1">
              {exactMatchPct.toFixed(0)}% of backlinks use exact match anchors. Consider diversifying to avoid penalties.
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Anchor Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="table-header">Anchor Text</th>
              <th className="table-header text-right">Ref Domains</th>
              <th className="table-header text-right">Dofollow %</th>
              <th className="table-header text-right">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {anchors.slice(0, 8).map((anchor, index) => {
              const dofollowPct = anchor.backlinks > 0
                ? ((anchor.dofollow_backlinks / anchor.backlinks) * 100).toFixed(0)
                : '0';
              return (
                <tr key={index} className="border-b border-gray-100">
                  <td className="table-cell">
                    <span className="truncate max-w-xs block">
                      {anchor.anchor === '' ? '(image/no text)' : anchor.anchor.length > 40 ? anchor.anchor.slice(0, 40) + '...' : anchor.anchor}
                    </span>
                  </td>
                  <td className="table-cell text-right">{formatNumber(anchor.refdomains)}</td>
                  <td className="table-cell text-right">
                    <span className={dofollowPct === '100' ? 'text-green-600' : 'text-gray-600'}>
                      {dofollowPct}%
                    </span>
                  </td>
                  <td className="table-cell text-right text-gray-500">
                    {anchor.last_visited ? formatDate(anchor.last_visited) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AuthorityTrendChartProps {
  authorityTrend: PageAuthorityPoint[];
  subnetCount?: number;
}

function AuthorityTrendChart({ authorityTrend, subnetCount }: AuthorityTrendChartProps) {
  const latestAuthority = authorityTrend[authorityTrend.length - 1]?.inlink_rank || 0;
  const firstAuthority = authorityTrend[0]?.inlink_rank || 0;
  const trendDirection = latestAuthority > firstAuthority ? 'up' : latestAuthority < firstAuthority ? 'down' : 'stable';

  // Prepare data for bar chart
  const chartData = authorityTrend.slice(-12).map(point => ({
    name: formatMonthYear(point.date),
    value: point.inlink_rank,
    color: '#0ea5e9',
  }));

  return (
    <div className="card">
      <h4 className="card-header flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-cyan-600" />
        Page Authority Trend
      </h4>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{latestAuthority}</span>
          {trendDirection === 'up' && (
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          )}
          {trendDirection === 'down' && (
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm text-gray-500">Current Authority</span>
        </div>
        {subnetCount !== undefined && subnetCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
            <Network className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              {formatNumber(subnetCount)} unique subnets
            </span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Authority score over the last {authorityTrend.length} months
      </p>
      <BarChart data={chartData} horizontal={false} color="#0ea5e9" />
    </div>
  );
}

interface RefDomainChangesPanelProps {
  refDomainChanges: {
    new: RefDomainChange[];
    lost: RefDomainChange[];
    qualityGained: number;
    qualityLost: number;
  };
}

function RefDomainChangesPanel({ refDomainChanges }: RefDomainChangesPanelProps) {
  const { new: newDomains, lost: lostDomains, qualityGained, qualityLost } = refDomainChanges;
  const qualityDiff = qualityGained - qualityLost;

  return (
    <div className="card">
      <h4 className="card-header flex items-center gap-2">
        <Globe className="w-5 h-5 text-indigo-600" />
        Referring Domain Changes
      </h4>
      <p className="text-sm text-gray-500 mb-4">Last 30 days • New vs lost referring domains</p>

      {/* Quality Comparison */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{qualityGained}</div>
          <div className="text-xs text-gray-500">Avg DA Gained</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-500">{qualityLost}</div>
          <div className="text-xs text-gray-500">Avg DA Lost</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${qualityDiff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {qualityDiff >= 0 ? '+' : ''}{qualityDiff}
          </div>
          <div className="text-xs text-gray-500">Quality Change</div>
        </div>
      </div>

      {/* Alert if losing high-authority domains */}
      {lostDomains.some(d => d.domain_inlink_rank >= 50) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">High-Authority Links Lost</p>
            <p className="text-xs text-red-700 mt-1">
              You&apos;ve lost links from domains with DA 50+. Consider reaching out to restore these links.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* New Domains */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium text-gray-900">New Domains ({newDomains.length})</span>
          </div>
          <div className="space-y-2">
            {newDomains.slice(0, 5).map((domain, index) => (
              <div key={index} className="p-2 bg-green-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-900 truncate">{domain.refdomain}</span>
                <span className="text-xs font-medium text-green-700">DA {domain.domain_inlink_rank}</span>
              </div>
            ))}
            {newDomains.length === 0 && (
              <p className="text-sm text-gray-500">No new referring domains in this period.</p>
            )}
          </div>
        </div>

        {/* Lost Domains */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-medium text-gray-900">Lost Domains ({lostDomains.length})</span>
          </div>
          <div className="space-y-2">
            {lostDomains.slice(0, 5).map((domain, index) => (
              <div key={index} className="p-2 bg-red-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-900 truncate">{domain.refdomain}</span>
                <span className="text-xs font-medium text-red-700">DA {domain.domain_inlink_rank}</span>
              </div>
            ))}
            {lostDomains.length === 0 && (
              <p className="text-sm text-gray-500">No lost referring domains in this period.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TopBacklinksPanelProps {
  backlinks: IndividualBacklink[];
}

function TopBacklinksPanel({ backlinks }: TopBacklinksPanelProps) {
  return (
    <div className="card">
      <h4 className="card-header flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-emerald-600" />
        Sample Raw Backlinks
      </h4>
      <p className="text-sm text-gray-500 mb-4">
        Diverse sample using <code className="bg-gray-100 px-1 rounded text-xs">/backlinks/raw</code> with <code className="bg-gray-100 px-1 rounded text-xs">per_domain=2</code> (configurable 1-100 via API)
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="table-header">Source</th>
              <th className="table-header">Anchor</th>
              <th className="table-header text-right">DA</th>
              <th className="table-header text-center">Type</th>
              <th className="table-header text-right">First Seen</th>
            </tr>
          </thead>
          <tbody>
            {backlinks.slice(0, 10).map((bl, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <a
                      href={bl.url_from}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 truncate max-w-[200px] block"
                    >
                      {extractDomain(bl.url_from)}
                    </a>
                    <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  </div>
                  {bl.title && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{bl.title}</p>
                  )}
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-1">
                    {bl.image && <ImageIcon className="w-3 h-3 text-amber-500" />}
                    <span className="truncate max-w-[150px]">
                      {bl.anchor || (bl.image ? '(image)' : '(no text)')}
                    </span>
                  </div>
                </td>
                <td className="table-cell text-right font-medium">{bl.domain_inlink_rank}</td>
                <td className="table-cell text-center">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    bl.nofollow ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'
                  }`}>
                    {bl.nofollow ? 'nofollow' : 'dofollow'}
                  </span>
                </td>
                <td className="table-cell text-right text-gray-500">
                  {bl.first_seen ? formatDate(bl.first_seen) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
}

// ============================================================
// Export All Backlinks Panel
// ============================================================

interface BacklinkExportPanelProps {
  reportId: string;
  totalBacklinks: number;
}

function BacklinkExportPanel({ reportId, totalBacklinks }: BacklinkExportPanelProps) {
  const [apiKey, setApiKey] = useState('');
  const [exportTaskId, setExportTaskId] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<'idle' | 'starting' | 'queued_for_processing' | 'processing' | 'complete' | 'rejected' | 'error'>('idle');
  const [exportDownloadUrl, setExportDownloadUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Handle the single button click - starts export, checks status, or downloads
  const handleButtonClick = async () => {
    // If we have a download URL, open it
    if (exportDownloadUrl) {
      window.open(exportDownloadUrl, '_blank');
      return;
    }

    // If we have a task ID, check status
    if (exportTaskId && exportStatus !== 'idle' && exportStatus !== 'error') {
      await checkExportStatus(exportTaskId);
      return;
    }

    // Otherwise, start a new export
    await startExport();
  };

  const startExport = async () => {
    if (!apiKey) {
      setExportError('Please enter your SE Ranking API key');
      return;
    }

    setExportStatus('starting');
    setExportError(null);

    try {
      const response = await fetch(`/api/reports/${reportId}/export-backlinks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, action: 'start-export' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start export');
      }

      const data = await response.json();

      if (data.status === 'rejected') {
        throw new Error('Another export is already in progress. Please wait.');
      }

      setExportTaskId(data.taskId);
      setExportStatus(data.status as 'queued_for_processing' | 'processing');
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Failed to start export');
      setExportStatus('error');
    }
  };

  const checkExportStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/export-backlinks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, action: 'check-status', taskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to check status');
      }

      const data = await response.json();
      setExportStatus(data.status);

      if (data.status === 'complete' && data.downloadUrl) {
        setExportDownloadUrl(data.downloadUrl);
      } else if (data.status === 'rejected') {
        throw new Error('Export was rejected');
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Failed to check status');
      setExportStatus('error');
    }
  };

  const getButtonText = () => {
    if (exportDownloadUrl) return 'Download .csv.gz File';
    if (exportStatus === 'starting') return 'Starting Export...';
    if (exportStatus === 'queued_for_processing') return 'Check Status (Queued)';
    if (exportStatus === 'processing') return 'Check Status (Processing)';
    if (exportStatus === 'complete') return 'Download Ready';
    return `Export All ${formatNumber(totalBacklinks)} Backlinks`;
  };

  const getButtonStyle = () => {
    if (exportDownloadUrl || exportStatus === 'complete') {
      return 'bg-green-600 hover:bg-green-700';
    }
    if (exportStatus === 'queued_for_processing' || exportStatus === 'processing') {
      return 'bg-amber-600 hover:bg-amber-700';
    }
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const isLoading = exportStatus === 'starting';

  return (
    <div className="card">
      <h4 className="card-header flex items-center gap-2">
        <Database className="w-5 h-5 text-blue-600" />
        Export All Backlinks
      </h4>

      <p className="text-sm text-gray-500 mb-4">
        Download all <strong>{formatNumber(totalBacklinks)}</strong> backlinks as a compressed CSV file.
        Cost: <strong>{formatNumber(totalBacklinks)} credits</strong> (1 credit per backlink)
      </p>

      <div className="space-y-4">
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SE Ranking API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Message */}
          {exportStatus !== 'idle' && exportStatus !== 'error' && !exportDownloadUrl && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                {exportStatus === 'starting' && <Loader2 className="w-4 h-4 animate-spin" />}
                {exportStatus === 'queued_for_processing' && 'Export is queued. Click button to check status.'}
                {exportStatus === 'processing' && 'Export is processing. Click button to check status.'}
                {exportStatus === 'starting' && 'Starting export...'}
                {exportTaskId && <span className="text-xs text-blue-600 ml-2">Task: {exportTaskId}</span>}
              </div>
            </div>
          )}

          {/* Success Message */}
          {exportDownloadUrl && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4" />
                Export complete! Click the button below to download.
              </div>
            </div>
          )}

          {/* Error Message */}
          {exportError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{exportError}</p>
            </div>
          )}

          {/* Single Action Button */}
          <button
            onClick={handleButtonClick}
            disabled={isLoading || !apiKey}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle()}`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : exportDownloadUrl ? (
              <FileDown className="w-5 h-5" />
            ) : (
              <Database className="w-5 h-5" />
            )}
            {getButtonText()}
          </button>

        {/* API Info */}
        <p className="text-xs text-gray-500 text-center">
          Uses <code className="bg-gray-100 px-1 rounded">/backlinks/export</code> for async bulk download
        </p>
      </div>
    </div>
  );
}

function getDistributionColor(range: string): string {
  const colors: Record<string, string> = {
    '0-10': '#ef4444',
    '11-20': '#f97316',
    '21-30': '#f59e0b',
    '31-40': '#eab308',
    '41-50': '#84cc16',
    '51-60': '#22c55e',
    '61-70': '#10b981',
    '71-80': '#14b8a6',
    '81-90': '#06b6d4',
    '91-100': '#0ea5e9',
  };
  return colors[range] || '#94a3b8';
}
