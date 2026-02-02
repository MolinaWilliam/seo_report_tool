import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReportForm from '@/components/ReportForm';
import {
  Link as LinkIcon,
  Search,
  BarChart3,
  Bot,
  Zap,
  Shield,
  Github,
  GitFork,
  Star,
} from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-gray-600">
                  Powered by SE Ranking Data API
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Free{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  SEO Report
                </span>{' '}
                Generator
              </h1>

              <p className="text-xl text-gray-600 mb-4">
                See what you can build with SE Ranking&apos;s API — in 30 seconds.
              </p>

              <p className="text-gray-500">
                Get a comprehensive SEO analysis powered by the same API you can
                use to build your own tools.
              </p>
            </div>

            {/* Report Form */}
            <ReportForm />

            {/* Features Preview */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LinkIcon className="w-4 h-4 text-primary-500" />
                <span>Backlink Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Search className="w-4 h-4 text-primary-500" />
                <span>Keyword Rankings</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 text-primary-500" />
                <span>Technical Audit</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bot className="w-4 h-4 text-primary-500" />
                <span>AI Search Visibility</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive SEO Analysis
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get deep insights into your website&apos;s SEO performance with data
                from SE Ranking&apos;s extensive database.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards */}
              <div className="card">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Backlink Profile
                </h3>
                <p className="text-gray-600">
                  Analyze your backlink profile with metrics like referring
                  domains, anchor text distribution, and link quality scores.
                </p>
              </div>

              <div className="card">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keyword Rankings
                </h3>
                <p className="text-gray-600">
                  See which keywords you rank for, their positions, search
                  volumes, and traffic potential.
                </p>
              </div>

              <div className="card">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Technical Health
                </h3>
                <p className="text-gray-600">
                  Identify technical SEO issues hurting your rankings with our
                  automated site audit.
                </p>
              </div>

              <div className="card">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI Search Visibility
                </h3>
                <p className="text-gray-600">
                  Discover how visible you are in AI search results from
                  ChatGPT, Perplexity, and more.
                </p>
              </div>

              <div className="card">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Wins
                </h3>
                <p className="text-gray-600">
                  Get actionable recommendations with estimated traffic impact
                  to prioritize your SEO efforts.
                </p>
              </div>

              <div className="card">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Competitive Analysis
                </h3>
                <p className="text-gray-600">
                  See who your organic competitors are and find keyword gaps to
                  target.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Github className="w-8 h-8 text-gray-900" />
                    <span className="text-2xl font-bold text-gray-900">
                      Open Source
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Fork it and build your own
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This tool is completely open source under the MIT license.
                    Fork it, customize it, and build your own SEO tools powered
                    by SE Ranking&apos;s API.
                  </p>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Add your agency&apos;s branding
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Create white-label client reports
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Customize report sections
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Integrate with your CRM
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://github.com/seranking/seointel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Star on GitHub
                    </a>
                    <a
                      href="https://github.com/seranking/seointel/fork"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <GitFork className="w-4 h-4 mr-2" />
                      Fork Repository
                    </a>
                  </div>
                </div>
                <div className="flex-shrink-0 bg-gray-900 rounded-xl p-6 text-sm font-mono text-green-400 shadow-lg">
                  <pre className="whitespace-pre-wrap">
                    {`git clone https://github.com/
  seranking/seointel.git
cd seointel
cp .env.example .env
npm install
npm run dev`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Build Your Own SEO Tools
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              This report was built using SE Ranking&apos;s Data API. Get your API
              key and start building.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://online.seranking.com/admin.api.dashboard.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-primary-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Get Your API Key
              </a>
              <a
                href="https://seranking.com/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                View API Docs
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
