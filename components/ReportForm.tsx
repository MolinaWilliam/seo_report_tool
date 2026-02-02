'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { validateDomain, cleanDomain } from '@/lib/utils';

export default function ReportForm() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setIsLoading(true);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create report');
      }

      // Navigate to report page
      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
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
        <p className="text-center text-xs text-gray-500">
          Your API key is used securely and never stored. Report generation typically takes 30-60 seconds.
        </p>
      </form>
    </div>
  );
}
