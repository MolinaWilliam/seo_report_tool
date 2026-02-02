'use client';

import { useState } from 'react';
import { Bot, TrendingUp, Award, Globe, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import DeveloperInfo from '@/components/DeveloperInfo';
import type { ReportData, ApiResponseLog } from '@/lib/types';
import { Google, Gemini, OpenAI, Perplexity } from '@lobehub/icons';

interface AISearchVisibilityProps {
  data: ReportData['aiSearch'];
  apiLogs?: ApiResponseLog[];
}

export default function AISearchVisibility({ data, apiLogs = [] }: AISearchVisibilityProps) {
  const { overview, leaderboard, prompts, market, marketName } = data;
  const [expandedPrompts, setExpandedPrompts] = useState<Set<number>>(new Set());

  const togglePrompt = (index: number) => {
    setExpandedPrompts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Interleave prompts by engine AND type (brand vs link) for variety
  const interleavedPrompts = (() => {
    if (prompts.length === 0) return [];

    // Group prompts by engine + type (brand/brand_link vs link)
    const byEngineAndType = new Map<string, typeof prompts>();
    for (const p of prompts) {
      const isBrand = p.type === 'brand' || p.type === 'brand_link';
      const key = `${p.engine}-${isBrand ? 'brand' : 'link'}`;
      const list = byEngineAndType.get(key) || [];
      list.push(p);
      byEngineAndType.set(key, list);
    }

    // Sort each group by volume
    for (const list of byEngineAndType.values()) {
      list.sort((a, b) => (b.volume || 0) - (a.volume || 0));
    }

    // Get unique engines and create ordered keys: engine-brand, engine-link for each
    const engines = [...new Set(prompts.map(p => p.engine))];
    const orderedKeys: string[] = [];
    for (const engine of engines) {
      orderedKeys.push(`${engine}-brand`);
      orderedKeys.push(`${engine}-link`);
    }

    // Filter to only keys that have prompts
    const activeKeys = orderedKeys.filter(k => byEngineAndType.has(k) && byEngineAndType.get(k)!.length > 0);

    // Round-robin interleave: take one from each key in order
    const result: typeof prompts = [];
    while (activeKeys.length > 0) {
      // Go through each active key and take one prompt
      for (let i = 0; i < activeKeys.length; i++) {
        const key = activeKeys[i];
        const list = byEngineAndType.get(key);
        if (list && list.length > 0) {
          result.push(list.shift()!);
        }
      }
      // Remove keys that are now empty
      for (let i = activeKeys.length - 1; i >= 0; i--) {
        const list = byEngineAndType.get(activeKeys[i]);
        if (!list || list.length === 0) {
          activeKeys.splice(i, 1);
        }
      }
    }
    return result;
  })();

  return (
    <div className="space-y-6">
      {/* Market Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Globe className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-900">
              Showing AI Search data for {marketName || 'United States'}
            </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded uppercase">
              {market || 'us'}
            </span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            This is your top market by organic traffic. AI search visibility data reflects how your brand appears in AI-powered search results in this region.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-6 h-6 text-purple-600" />
          <h4 className="font-semibold text-gray-900">Your Presence in AI Answers</h4>
        </div>
        {overview.engines.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {overview.engines.slice(0, 5).map((engine) => (
              <div key={engine.engine} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <EngineIcon engine={engine.engine} size={18} />
                  <span>{formatEngineName(engine.engine)}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatNumber(engine.brand_presence + engine.link_presence)}
                  </span>
                  <span className="text-sm text-gray-400">citations</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="text-blue-600">{formatNumber(engine.brand_presence)} brand</span>
                  {' · '}
                  <span className="text-green-600">{formatNumber(engine.link_presence)} links</span>
                </div>
                {engine.traffic > 0 && (
                  <div className="text-xs text-purple-600 mt-1">
                    Est. {formatNumber(engine.traffic)} traffic/mo
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No AI search visibility data available yet.</p>
            <p className="text-sm mt-1">Generate a new report with competitors to see AI presence data.</p>
          </div>
        )}
      </div>


      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            AI Competitive Leaderboard
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header w-12">Rank</th>
                  <th className="table-header">Domain</th>
                  <th className="table-header">AI Share of Voice</th>
                  <th className="table-header text-right">Brand Mentions</th>
                  <th className="table-header text-right">Link Citations</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const isCurrentDomain = entry.is_primary_target === true;
                  return (
                    <tr
                      key={entry.rank}
                      className={`border-b border-gray-100 ${
                        isCurrentDomain ? 'bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="table-cell">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            entry.rank === 1
                              ? 'bg-amber-100 text-amber-700'
                              : entry.rank === 2
                              ? 'bg-gray-200 text-gray-700'
                              : entry.rank === 3
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          {isCurrentDomain && (
                            <span className="text-primary-600 font-medium">★</span>
                          )}
                          <span className={isCurrentDomain ? 'font-bold text-primary-700' : ''}>
                            {entry.domain}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[150px]">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${entry.share_of_voice}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{entry.share_of_voice}%</span>
                        </div>
                      </td>
                      <td className="table-cell text-right">{formatNumber(entry.brand_mentions)}</td>
                      <td className="table-cell text-right">{formatNumber(entry.link_citations)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Queries */}
      {interleavedPrompts.length > 0 ? (
        <div className="card">
          <h4 className="card-header">Top Queries Where You Appear in AI</h4>
          <div className="space-y-4">
            {interleavedPrompts.slice(0, 8).map((prompt, index) => {
              const isExpanded = expandedPrompts.has(index);
              const hasMoreContent = prompt.answer_full && prompt.answer_full.length > 200;
              const hasSources = prompt.sources && prompt.sources.length > 0;
              const canExpand = hasMoreContent || hasSources;

              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-lg">&quot;{prompt.prompt}&quot;</div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <EngineBadge engine={prompt.engine} />
                          <span
                            className={`badge ${
                              prompt.type === 'brand_link'
                                ? 'badge-green'
                                : prompt.type === 'brand'
                                ? 'badge-blue'
                                : 'badge-yellow'
                            }`}
                          >
                            {prompt.type === 'brand_link'
                              ? 'Brand + Link'
                              : prompt.type === 'brand'
                              ? 'Brand Only'
                              : 'Link Only'}
                          </span>
                          {prompt.volume && prompt.volume > 0 && (
                            <span className="badge badge-purple">
                              {formatNumber(prompt.volume)} monthly searches
                            </span>
                          )}
                        </div>
                        {(prompt.answer_snippet || prompt.answer_full) && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <div className="text-xs text-gray-500 uppercase font-medium mb-1">AI Answer</div>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {isExpanded ? prompt.answer_full : prompt.answer_snippet}
                              {!isExpanded && hasMoreContent && '...'}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">#{prompt.position}</div>
                    </div>

                    {/* Expanded sources section */}
                    {isExpanded && hasSources && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 uppercase font-medium mb-3 flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Sources ({prompt.sources!.length})
                        </div>
                        <div className="space-y-2">
                          {prompt.sources!.map((source, sourceIndex) => {
                            // Extract domain from URL for display
                            let displayUrl = source;
                            try {
                              const url = new URL(source);
                              displayUrl = url.hostname + (url.pathname !== '/' ? url.pathname : '');
                              if (displayUrl.length > 60) {
                                displayUrl = displayUrl.substring(0, 57) + '...';
                              }
                            } catch {
                              // Keep original if URL parsing fails
                            }
                            return (
                              <a
                                key={sourceIndex}
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors group"
                              >
                                <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-medium text-gray-600">{sourceIndex + 1}</span>
                                </div>
                                <span className="text-sm text-blue-600 group-hover:text-blue-800 group-hover:underline truncate">
                                  {displayUrl}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expand/collapse button */}
                  {canExpand && (
                    <button
                      onClick={() => togglePrompt(index)}
                      className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-600 border-t border-gray-200"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          {hasSources ? `Show full answer & ${prompt.sources!.length} sources` : 'Show full answer'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card">
          <h4 className="card-header">Top Queries Where You Appear in AI</h4>
          <div className="text-center py-8 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No AI search presence detected</p>
            <p className="text-sm mt-1">
              This domain doesn&apos;t appear in AI-generated answers yet.
              Focus on creating authoritative content to get cited by AI engines.
            </p>
          </div>
        </div>
      )}

      {/* Insight Callout */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-purple-800">AI Search is the New Frontier</h4>
            <p className="text-purple-700 mt-1">
              {leaderboard.length > 0 ? (
                <>
                  You&apos;re currently <strong>#{leaderboard.find((e) => e.is_primary_target)?.rank || '-'}</strong> in AI visibility for your category.
                  Target the missing queries to climb the leaderboard!
                </>
              ) : (
                <>
                  AI search is growing rapidly. Optimize your content for AI citations to stay ahead of competitors.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Developer Info */}
      <DeveloperInfo
        apiLogs={apiLogs}
        filterEndpoints={['/ai-search/']}
        title="API Calls"
      />
    </div>
  );
}

function formatEngineName(engine: string): string {
  const names: Record<string, string> = {
    'ai-overview': 'AI Overview',
    'ai-mode': 'AI Mode',
    'chatgpt': 'ChatGPT',
    'perplexity': 'Perplexity',
    'gemini': 'Gemini',
    'all': 'All AI Engines',
    'Google AI Overview': 'AI Overview',
  };
  return names[engine] || engine;
}

function EngineIcon({ engine, size = 16 }: { engine: string; size?: number }) {
  switch (engine.toLowerCase()) {
    case 'ai-overview':
    case 'ai-mode':
      return <Google.Color size={size} />;
    case 'gemini':
      return <Gemini.Color size={size} />;
    case 'chatgpt':
    case 'openai':
      // OpenAI doesn't have a Color variant, use default (Mono)
      return <OpenAI size={size} />;
    case 'perplexity':
      return <Perplexity.Color size={size} />;
    default:
      return <Bot className="w-4 h-4 text-gray-500" />;
  }
}

function EngineBadge({ engine }: { engine: string }) {
  const bgColors: Record<string, string> = {
    'ai-overview': 'bg-blue-50 border-blue-200 text-blue-700',
    'ai-mode': 'bg-blue-50 border-blue-200 text-blue-700',
    'chatgpt': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'perplexity': 'bg-cyan-50 border-cyan-200 text-cyan-700',
    'gemini': 'bg-indigo-50 border-indigo-200 text-indigo-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${bgColors[engine.toLowerCase()] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
      <EngineIcon engine={engine} size={14} />
      {formatEngineName(engine)}
    </span>
  );
}
