'use client';

import { Github, Star, GitFork, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SEOIntel</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="https://github.com/seranking/seointel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Star</span>
            </a>
            <a
              href="https://github.com/seranking/seointel/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <GitFork className="w-4 h-4" />
              <span className="text-sm font-medium">Fork</span>
            </a>
            <a
              href="https://github.com/seranking/seointel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a
              href="https://seranking.com/api"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://online.seranking.com/admin.api.dashboard.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-4 py-2"
            >
              Get API Key
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
