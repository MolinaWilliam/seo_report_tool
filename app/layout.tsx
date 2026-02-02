import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEOIntel - Free SEO Report Tool | Powered by SE Ranking API',
  description: 'Generate comprehensive SEO reports for any domain. Analyze backlinks, keywords, technical health, AI search visibility, and more. Built with SE Ranking API.',
  keywords: 'SEO report, SEO audit, backlink checker, keyword analysis, site audit, free SEO tool',
  authors: [{ name: 'Guifré Ballester', url: 'https://guifreballester.com' }],
  openGraph: {
    title: 'SEOIntel - Free SEO Report Tool',
    description: 'Generate comprehensive SEO reports powered by SE Ranking API',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEOIntel - Free SEO Report Tool',
    description: 'Generate comprehensive SEO reports powered by SE Ranking API',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
