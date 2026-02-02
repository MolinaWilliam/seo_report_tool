'use client';

import { Zap, Target, FileText, Wrench, ArrowRight, TrendingUp } from 'lucide-react';
import { formatNumber, getDifficultyColor } from '@/lib/utils';
import DeveloperInfo from '@/components/DeveloperInfo';
import type { ReportData, ApiResponseLog } from '@/lib/types';

interface QuickWinsProps {
  data: ReportData['quickWins'];
  contentOpportunities: ReportData['contentOpportunities'];
  apiLogs?: ApiResponseLog[];
}

export default function QuickWins({ data, contentOpportunities, apiLogs = [] }: QuickWinsProps) {
  const { nearPageOneKeywords, lowHangingFruit } = data;
  const { questionKeywords, gaps } = contentOpportunities;

  // Calculate total potential traffic from near page one keywords
  const totalPotentialTraffic = nearPageOneKeywords.reduce(
    (acc, k) => acc + Math.round(k.volume * 0.15),
    0
  );

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-green-600" />
          <h4 className="font-semibold text-gray-900">Highest ROI Actions</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-medium">Near Page 1</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {nearPageOneKeywords.length} keywords
            </div>
            <div className="text-sm text-gray-500">
              +{formatNumber(totalPotentialTraffic)} potential visits/mo
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Content Gaps</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{gaps.length} keywords</div>
            <div className="text-sm text-gray-500">
              {formatNumber(gaps.reduce((acc, g) => acc + g.volume, 0))} monthly searches
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Wrench className="w-5 h-5" />
              <span className="font-medium">Quick Fixes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {lowHangingFruit.filter((f) => f.effort === 'low').length} actions
            </div>
            <div className="text-sm text-gray-500">Low effort, high impact</div>
          </div>
        </div>
      </div>

      {/* Keywords Almost on Page 1 */}
      {nearPageOneKeywords.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Keywords Almost on Page 1 (Positions 11-20)
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Small optimizations could move these to page 1!
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header">Keyword</th>
                  <th className="table-header text-center">Position</th>
                  <th className="table-header text-right">Volume</th>
                  <th className="table-header text-center">Difficulty</th>
                  <th className="table-header text-right">Est. Traffic if #5</th>
                </tr>
              </thead>
              <tbody>
                {nearPageOneKeywords.map((keyword, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900">{keyword.keyword}</td>
                    <td className="table-cell text-center">
                      <span className="font-bold">{keyword.position}</span>
                    </td>
                    <td className="table-cell text-right">{formatNumber(keyword.volume)}</td>
                    <td className="table-cell">
                      <div className="flex justify-center">
                        <span className={`badge ${getDifficultyColor(keyword.difficulty)}`}>
                          {keyword.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell text-right text-green-600 font-medium">
                      +{formatNumber(Math.round(keyword.volume * 0.15))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">
                Total opportunity: +{formatNumber(totalPotentialTraffic)} visits/month
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Question Keywords */}
      {questionKeywords.length > 0 && (
        <div className="card">
          <h4 className="card-header flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            Questions People Ask
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Create FAQ content or blog posts answering these questions
          </p>
          <div className="space-y-3">
            {questionKeywords.map((question, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">&quot;{question.keyword}&quot;</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    {formatNumber(question.volume)} searches/mo
                  </div>
                  <span className={`badge ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prioritized Recommendations */}
      <div className="card">
        <h4 className="card-header flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-500" />
          Prioritized Recommendations
        </h4>
        <div className="space-y-4">
          {lowHangingFruit.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                item.impact === 'high'
                  ? 'border-green-200 bg-green-50'
                  : item.impact === 'medium'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white ${
                    item.impact === 'high'
                      ? 'bg-green-500'
                      : item.impact === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.description}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-1 bg-white rounded border">
                      Impact: {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white rounded border">
                      Effort: {item.effort.charAt(0).toUpperCase() + item.effort.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">Source: {item.type}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Info */}
      <DeveloperInfo
        apiLogs={apiLogs}
        filterEndpoints={['/keywords/questions']}
        title="API Calls"
      />
    </div>
  );
}
