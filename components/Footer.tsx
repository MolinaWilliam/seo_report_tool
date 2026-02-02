'use client';

import { Github, GitFork, ExternalLink, Code2, Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-xl font-bold text-white">SEOIntel</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              This free tool demonstrates what you can build with SE Ranking&apos;s Data API.
              Generate comprehensive SEO reports, analyze backlinks, track keywords, and more.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/seranking/seointel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/seranking/seointel/fork"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <GitFork className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://seranking.com/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  API Documentation
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://online.seranking.com/admin.api.dashboard.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Get API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/seranking/seointel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Source Code
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Built With */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Built With
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Code2 className="w-4 h-4 text-primary-400" />
                <span>SE Ranking Data API</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Bot className="w-4 h-4 text-accent-400" />
                <span>Claude Code (Anthropic)</span>
              </li>
              <li>
                <a
                  href="https://guifreballester.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  guifreballester.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SE Ranking. Open source under MIT License.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://seranking.com/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://seranking.com/terms-of-service.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
