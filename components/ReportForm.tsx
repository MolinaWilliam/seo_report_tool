'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { validateDomain, cleanDomain } from '@/lib/utils';

interface ProgressState {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
}

export default function ReportForm() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [progressState, setProgressState] = useState<ProgressState>({
    status: 'idle',
    progress: 0,
    currentStep: '',
  });
  const [error, setError] = useState<string | null>(null);

  const isLoading = progressState.status === 'processing';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedDomain = cleanDomain(domain);

    // Validation
    if (!cleanedDomain) {
      setError('Please enter a domain');
      return;
    }

    if (!validateDomain(cleanedDomain)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }

    if (!apiKey) {
      setError('Please enter your API key');
      return;
    }

    setProgressState({
      status: 'processing',
      progress: 0,
      currentStep: 'Initializing...',
    });

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: cleanedDomain,
          apiKey,
        }),
      });

      // Check if we got an error response (non-SSE)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create report');
      }

      // Handle SSE stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        let eventType = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7);
          } else if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (eventType === 'progress') {
              setProgressState({
                status: 'processing',
                progress: data.progress,
                currentStep: data.currentStep,
              });
            } else if (eventType === 'complete') {
              setProgressState({
                status: 'completed',
                progress: 100,
                currentStep: 'Report ready!',
              });
              // Navigate to report page
              router.push(`/report/${data.id}`);
              return;
            } else if (eventType === 'error') {
              throw new Error(data.error || 'Report generation failed');
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setProgressState({
        status: 'error',
        progress: 0,
        currentStep: '',
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Domain Input */}
        <div>
          <label htmlFor="domain" className="label">
            Domain to analyze
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="input"
            disabled={isLoading}
          />
        </div>

        {/* API Key Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="label flex items-center gap-2">
              <Key className="w-4 h-4 text-gray-500" />
              SE Ranking API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="input"
              disabled={isLoading}
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Don&apos;t have an API key?{' '}
              <a
                href="https://online.seranking.com/admin.api.dashboard.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline inline-flex items-center gap-1"
              >
                Get your API key here
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        {/* Progress Display */}
        {isLoading && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {progressState.currentStep}
              </span>
              <span className="text-sm font-bold text-primary-600">
                {progressState.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressState.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              This usually takes 30-60 seconds
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Report...
            </span>
          ) : (
            'Generate Report'
          )}
        </button>

        {/* Trust Indicator */}
        {!isLoading && (
          <p className="text-center text-xs text-gray-500">
            Your API key is used securely and never stored. Report generation typically takes 30-60 seconds.
          </p>
        )}
      </form>
    </div>
  );
}
