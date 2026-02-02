'use client';

import { useState } from 'react';
import { Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { ApiResponseLog } from '@/lib/types';

interface DeveloperInfoProps {
  apiLogs: ApiResponseLog[];
  filterEndpoints?: string[];
  title?: string;
}

export default function DeveloperInfo({
  apiLogs,
  filterEndpoints,
  title = 'API Calls',
}: DeveloperInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Filter logs based on endpoints if specified
  const filteredLogs = filterEndpoints
    ? apiLogs.filter(log => filterEndpoints.some(ep => log.endpoint.includes(ep)))
    : apiLogs;

  if (filteredLogs.length === 0) return null;

  // Calculate total credits for filtered logs
  const totalCredits = filteredLogs.reduce((sum, log) => sum + (log.credits || 0), 0);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatEndpoint = (log: ApiResponseLog) => {
    const params = Object.entries(log.params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&');
    return `${log.method} ${log.endpoint}${params ? '?' + params : ''}`;
  };

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-sm text-gray-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          {title}
          <span className="text-gray-400">
            ({filteredLogs.length} API calls · {totalCredits.toLocaleString()} credits)
          </span>
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log, index) => (
            <div key={index} className="p-4 space-y-3">
              {/* API Request */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">Request</span>
                  <button
                    onClick={() => copyToClipboard(formatEndpoint(log), index * 2)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Copy request"
                  >
                    {copiedIndex === index * 2 ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <code className="block text-xs bg-gray-900 text-green-400 p-3 rounded-md font-mono overflow-x-auto">
                  {formatEndpoint(log)}
                </code>
              </div>

              {/* API Response */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    Response
                    {(log.duration || log.credits) && (
                      <span className="text-gray-400 font-normal ml-2">
                        ({[
                          log.duration && `${log.duration}ms`,
                          log.credits && `${log.credits.toLocaleString()} credits`
                        ].filter(Boolean).join(' · ')})
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(log.response, null, 2), index * 2 + 1)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Copy response"
                  >
                    {copiedIndex === index * 2 + 1 ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="text-xs bg-gray-900 text-gray-300 p-3 rounded-md font-mono overflow-x-auto max-h-64 overflow-y-auto">
                  {JSON.stringify(log.response, null, 2)}
                </pre>
              </div>

              <div className="text-xs text-gray-400">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
