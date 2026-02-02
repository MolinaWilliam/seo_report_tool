'use client';

import {
  Rocket,
  BarChart3,
  Bell,
  Plug,
  Bot,
  Code2,
  ExternalLink,
  Github,
  GitFork,
} from 'lucide-react';

export default function CTASection() {
  return (
    <div className="space-y-6">
      {/* Main CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Rocket className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              Want to Track These Metrics Automatically?
            </h3>
            <p className="text-primary-100 mb-6">
              This report was built using SE Ranking&apos;s API. Build your own dashboards,
              alerts, and reports.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-primary-200">✓</span>
                <span className="text-sm">100K free credits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-200">✓</span>
                <span className="text-sm">MCP integration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-200">✓</span>
                <span className="text-sm">Looker Studio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-200">✓</span>
                <span className="text-sm">n8n, Make, Zapier</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://online.seranking.com/admin.api.dashboard.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://seranking.com/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View API Docs
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Section */}
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary-600" />
          What Else Could You Build?
        </h3>
        <p className="text-gray-600 mb-6">
          This report is just one example. Here&apos;s what others build:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Dashboards & Reporting
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Client reporting dashboards (agencies)</li>
              <li>• Looker Studio / Tableau connectors</li>
              <li>• Custom executive SEO dashboards</li>
              <li>• White-label SEO reports for clients</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-amber-600" />
              Automation & Alerts
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Slack/Teams alerts when rankings drop</li>
              <li>• Automated competitor monitoring</li>
              <li>• Weekly SEO digest emails</li>
              <li>• AI-powered SEO recommendations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Plug className="w-4 h-4 text-green-600" />
              Tools & Integrations
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Chrome extension for instant SEO checks</li>
              <li>• CMS plugins (WordPress, Webflow)</li>
              <li>• n8n / Make / Zapier workflows</li>
              <li>• Custom rank tracking for niche needs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-purple-600" />
              AI-Powered Applications
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• SEO chatbot (MCP + Claude)</li>
              <li>• Content optimization assistant</li>
              <li>• Automated technical SEO auditor</li>
              <li>• AI-driven keyword research tool</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Open Source CTA */}
      <div className="card border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fork & Build Your Own
            </h3>
            <p className="text-gray-600 mb-4">
              This tool is open source under MIT license. Fork it, customize it, and build your
              own SEO tools.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/seranking/seointel"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
              <a
                href="https://github.com/seranking/seointel/fork"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                <GitFork className="w-4 h-4 mr-2" />
                Fork Repository
              </a>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 w-full md:w-auto">
            <pre className="whitespace-pre-wrap text-xs">
              {`git clone github.com/
  seranking/seointel`}
            </pre>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="text-center py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Built by{' '}
          <a
            href="https://guifreballester.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            guifreballester.com
          </a>{' '}
          using Claude Code | Powered by{' '}
          <a
            href="https://seranking.com/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            SE Ranking Data API
          </a>
        </p>
      </div>
    </div>
  );
}
