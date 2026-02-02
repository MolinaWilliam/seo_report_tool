'use client';

import { Globe, FileText, BarChart3, Layers, DollarSign, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { formatNumber } from '@/lib/utils';
import GaugeChart from '@/components/Charts/GaugeChart';
import DonutChart from '@/components/Charts/DonutChart';
import DeveloperInfo from '@/components/DeveloperInfo';
import type { ReportData, ApiResponseLog, DomainPaidAd, URLOverviewWorldwide } from '@/lib/types';

interface DomainAnalysisProps {
  data: ReportData['domainAnalysis'];
  apiLogs?: ApiResponseLog[];
}

// Country code to flag emoji
function getCountryFlag(code: string): string {
  // Map non-standard codes to ISO 3166-1 alpha-2
  const codeMap: Record<string, string> = {
    uk: 'gb', // SE Ranking uses 'uk' but ISO uses 'gb' for United Kingdom
  };
  const normalizedCode = codeMap[code.toLowerCase()] || code;
  const codePoints = normalizedCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Country code to name
const COUNTRY_NAMES: Record<string, string> = {
  us: 'United States', uk: 'United Kingdom', de: 'Germany', fr: 'France',
  es: 'Spain', it: 'Italy', br: 'Brazil', ca: 'Canada', au: 'Australia',
  in: 'India', jp: 'Japan', mx: 'Mexico', nl: 'Netherlands', pl: 'Poland',
  ru: 'Russia', se: 'Sweden', ch: 'Switzerland', at: 'Austria', be: 'Belgium',
  ar: 'Argentina', cl: 'Chile', co: 'Colombia', pe: 'Peru', pt: 'Portugal',
};

// Color palette for charts
const COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

// Competition level badge
function getCompetitionBadge(competition: number): { label: string; className: string } {
  if (competition >= 0.8) return { label: 'High', className: 'badge badge-red' };
  if (competition >= 0.5) return { label: 'Medium', className: 'badge badge-yellow' };
  if (competition >= 0.2) return { label: 'Low', className: 'badge badge-green' };
  return { label: 'Very Low', className: 'badge badge-gray' };
}

// Paid Ad Row Component with expandable snippet details
function PaidAdRow({
  ad,
  isExpanded,
  onToggle,
}: {
  ad: DomainPaidAd;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const competitionBadge = getCompetitionBadge(ad.competition);
  const latestSnippet = ad.snippets[0]; // Most recent snippet

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="table-cell">
          <span className="font-medium text-gray-800">{ad.keyword}</span>
        </td>
        <td className="table-cell text-right">
          {formatNumber(ad.volume)}
        </td>
        <td className="table-cell text-right font-medium text-green-600">
          ${ad.cpc.toFixed(2)}
        </td>
        <td className="table-cell text-right">
          <span className={competitionBadge.className}>
            {competitionBadge.label}
          </span>
        </td>
        <td className="table-cell text-right">
          {ad.ads_count}
        </td>
        <td className="table-cell text-center">
          {ad.snippets.length > 0 && (
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={isExpanded ? 'Hide ad preview' : 'Show ad preview'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </td>
      </tr>
      {isExpanded && latestSnippet && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="px-4 py-3">
            <div className="max-w-2xl">
              <div className="text-xs text-gray-400 mb-1">
                Ad Preview ({latestSnippet.date})
              </div>
              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <span className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-medium">
                    Ad
                  </span>
                  <span className="truncate">{latestSnippet.snippet_display_url}</span>
                </div>
                <a
                  href={latestSnippet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
                >
                  {latestSnippet.snippet_title}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {latestSnippet.snippet_description}
                </p>
                {latestSnippet.position > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    Position: {latestSnippet.position}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function DomainAnalysis({ data, apiLogs = [] }: DomainAnalysisProps) {
  const {
    authority,
    trafficByCountry,
    topPagesByTraffic,
    topPagesByTrafficCountry2 = [],
    subdomains = [],
    paidAds = [],
    topPagesWorldwide = [],
  } = data;

  const [expandedAd, setExpandedAd] = useState<string | null>(null);

  // Calculate traffic totals for "Other" bucket
  const totalTraffic = trafficByCountry.reduce((sum, c) => sum + c.traffic, 0);
  const topCountriesCount = Math.min(8, trafficByCountry.length);
  const topCountriesTraffic = trafficByCountry.slice(0, topCountriesCount).reduce((sum, c) => sum + c.traffic, 0);
  const otherTraffic = totalTraffic - topCountriesTraffic;
  const otherPercentage = totalTraffic > 0 ? (otherTraffic / totalTraffic) * 100 : 0;

  // Prepare traffic by country data for donut chart (top countries + Other)
  const countryChartData = [
    ...trafficByCountry.slice(0, topCountriesCount).map((c, i) => ({
      name: COUNTRY_NAMES[c.source] || c.source.toUpperCase(),
      value: c.traffic,
      color: COLORS[i % COLORS.length],
    })),
    ...(otherTraffic > 0 ? [{
      name: 'Other',
      value: otherTraffic,
      color: '#9ca3af', // gray-400
    }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Domain Authority */}
        <div className="card flex flex-col items-center py-6">
          <h4 className="card-header flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            Domain Authority
          </h4>
          <GaugeChart value={authority} size="lg" />
          <p className="text-sm text-gray-500 mt-2">InLink Rank Score</p>
        </div>

        {/* Traffic by Country */}
        <div className="card col-span-2">
          <h4 className="card-header flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Traffic by Country
          </h4>
          {countryChartData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="flex-[3]">
                <DonutChart data={countryChartData} showLegend={false} />
              </div>
              <div className="flex-[2] space-y-1.5">
                {trafficByCountry.slice(0, topCountriesCount).map((country) => (
                  <div key={country.source} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base flex-shrink-0">{getCountryFlag(country.source)}</span>
                      <span className="text-xs text-gray-700 truncate">
                        {COUNTRY_NAMES[country.source] || country.source.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-medium">{formatNumber(country.traffic)}</span>
                      <span className="text-[10px] text-gray-400 ml-0.5">
                        ({country.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
                {otherTraffic > 0 && (
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🌍</span>
                      <span className="text-xs text-gray-500">Other</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-gray-500">{formatNumber(otherTraffic)}</span>
                      <span className="text-[10px] text-gray-400 ml-0.5">
                        ({otherPercentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No geographic data available</p>
          )}
        </div>
      </div>

      {/* Top Pages Worldwide Performance */}
      {topPagesWorldwide.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            Top Pages - Worldwide Performance
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Global organic and paid search metrics for your top performing pages
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header">Page</th>
                  <th className="table-header text-right">Organic Keywords</th>
                  <th className="table-header text-right">Organic Traffic</th>
                  <th className="table-header text-right">Traffic Value</th>
                  <th className="table-header text-right">Paid Keywords</th>
                </tr>
              </thead>
              <tbody>
                {topPagesWorldwide.map((page, index) => {
                  const getPagePath = (url: string) => {
                    try {
                      return new URL(url).pathname || '/';
                    } catch {
                      return url;
                    }
                  };
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px] text-sm font-medium" title={page.url}>
                            {getPagePath(page.url)}
                          </span>
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-teal-600 flex-shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="table-cell text-right font-medium">
                        {formatNumber(page.organic.keywords_count)}
                      </td>
                      <td className="table-cell text-right font-medium text-green-600">
                        {formatNumber(page.organic.traffic_sum)}
                      </td>
                      <td className="table-cell text-right text-gray-600">
                        ${formatNumber(page.organic.price_sum)}
                      </td>
                      <td className="table-cell text-right">
                        {page.adv.keywords_count > 0 ? (
                          <span className="text-amber-600 font-medium">
                            {formatNumber(page.adv.keywords_count)}
                          </span>
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
          <div className="mt-4 p-3 bg-teal-50 rounded-lg">
            <p className="text-sm text-teal-700">
              <strong>{topPagesWorldwide.length} pages analyzed</strong> with worldwide performance data.
              Traffic value represents the estimated cost to acquire equivalent traffic via paid search.
            </p>
          </div>
        </div>
      )}

      {/* Top Pages by Traffic (Top 2 Markets) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages by Traffic (Country 1) */}
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Top Pages by Traffic
            {trafficByCountry[0] && (
              <span className="text-xs font-normal text-gray-400 flex items-center gap-1">
                ({getCountryFlag(trafficByCountry[0].source)} {COUNTRY_NAMES[trafficByCountry[0].source] || trafficByCountry[0].source.toUpperCase()})
              </span>
            )}
          </h4>
          {topPagesByTraffic.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="table-header">Page</th>
                    <th className="table-header text-right">Traffic</th>
                    <th className="table-header text-right">Keywords</th>
                  </tr>
                </thead>
                <tbody>
                  {topPagesByTraffic.slice(0, 8).map((page, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="table-cell">
                        <div className="truncate max-w-xs text-sm" title={page.url}>
                          {new URL(page.url).pathname || '/'}
                        </div>
                      </td>
                      <td className="table-cell text-right font-medium text-green-600">
                        {formatNumber(page.traffic)}
                      </td>
                      <td className="table-cell text-right">
                        {formatNumber(page.keywords)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No page data available</p>
          )}
        </div>

        {/* Top Pages by Traffic (Country 2) */}
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Top Pages by Traffic
            {trafficByCountry[1] && (
              <span className="text-xs font-normal text-gray-400 flex items-center gap-1">
                ({getCountryFlag(trafficByCountry[1].source)} {COUNTRY_NAMES[trafficByCountry[1].source] || trafficByCountry[1].source.toUpperCase()})
              </span>
            )}
          </h4>
          {topPagesByTrafficCountry2.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="table-header">Page</th>
                    <th className="table-header text-right">Traffic</th>
                    <th className="table-header text-right">Keywords</th>
                  </tr>
                </thead>
                <tbody>
                  {topPagesByTrafficCountry2.slice(0, 8).map((page, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="table-cell">
                        <div className="truncate max-w-xs text-sm" title={page.url}>
                          {new URL(page.url).pathname || '/'}
                        </div>
                      </td>
                      <td className="table-cell text-right font-medium text-green-600">
                        {formatNumber(page.traffic)}
                      </td>
                      <td className="table-cell text-right">
                        {formatNumber(page.keywords)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No page data available for second market</p>
          )}
        </div>
      </div>

      {/* Subdomains */}
      {subdomains.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-600" />
            Subdomains
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header">Subdomain</th>
                  <th className="table-header text-right">Traffic</th>
                  <th className="table-header text-right">Keywords</th>
                </tr>
              </thead>
              <tbody>
                {subdomains.slice(0, 10).map((sub, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-cell">
                      <span className="text-sm font-medium text-gray-800">{sub.subdomain}</span>
                    </td>
                    <td className="table-cell text-right font-medium text-green-600">
                      {formatNumber(sub.traffic)}
                    </td>
                    <td className="table-cell text-right">
                      {formatNumber(sub.keywords)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paid Ads */}
      {paidAds.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Paid Search Ads
            <span className="ml-auto text-sm font-normal text-gray-500">
              {paidAds.length} keywords
            </span>
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Keywords this domain is bidding on in paid search campaigns
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header">Keyword</th>
                  <th className="table-header text-right">Volume</th>
                  <th className="table-header text-right">CPC</th>
                  <th className="table-header text-right">Competition</th>
                  <th className="table-header text-right">Ads</th>
                  <th className="table-header text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                {paidAds.slice(0, 15).map((ad, index) => (
                  <PaidAdRow
                    key={index}
                    ad={ad}
                    isExpanded={expandedAd === ad.keyword}
                    onToggle={() => setExpandedAd(expandedAd === ad.keyword ? null : ad.keyword)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {paidAds.length > 15 && (
            <p className="text-sm text-gray-400 mt-3 text-center">
              Showing 15 of {paidAds.length} keywords
            </p>
          )}
        </div>
      )}

      {/* Developer Info */}
      <DeveloperInfo
        apiLogs={apiLogs}
        filterEndpoints={['/domain/overview', '/backlinks/indexed-pages', '/domain/subdomains', '/domain/ads', '/domain/overview/worldwide/url']}
        title="API Calls"
      />
    </div>
  );
}
