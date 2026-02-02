# SEOIntel - Free SEO Report Tool

> Built with SE Ranking API + Claude Code

Generate comprehensive SEO reports for any domain. See what you can build with SE Ranking's Data API.

## Features

- **Backlink Analysis** - Profile overview, authority distribution, anchor texts, momentum tracking
- **Keyword Rankings** - Position tracking, SERP features, traffic estimates
- **AI Search Visibility** - ChatGPT, Perplexity, Gemini, Google AI Overview presence
- **Competitive Analysis** - Top competitors, keyword gaps
- **Quick Wins** - Actionable recommendations with estimated impact
- **Export Options** - Download reports as JSON or CSV
- **Developer Tools** - View raw API requests and responses

## Quick Start

### Option 1: Use the hosted version

Visit [seointel.io](https://seointel.io) (no setup required)

### Option 2: Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/seranking/seointel.git
   cd seointel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your API key** (optional)

   Get your API key at: https://online.seranking.com/admin.api.dashboard.html

   Add it to `.env.local`:
   ```
   SE_RANKING_API_KEY=your-api-key-here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open** http://localhost:3000

> **Note:** The app works without an API key using mock data for demonstration purposes.

## API Key Setup

1. Sign up at [seranking.com](https://seranking.com)
2. Go to **Admin → API Dashboard**
3. Generate a new API key
4. Add to `.env.local`:
   ```
   SE_RANKING_API_KEY=your-api-key-here
   ```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Language:** TypeScript
- **Testing:** Vitest

## Project Structure

```
seointel/
├── app/
│   ├── page.tsx              # Landing page
│   ├── report/[id]/page.tsx  # Report display
│   └── api/reports/          # API endpoints
├── components/
│   ├── Report/               # Report section components
│   ├── Charts/               # Chart components
│   ├── Skeleton.tsx          # Loading skeleton components
│   └── DeveloperInfo.tsx     # API response viewer
├── lib/
│   ├── seranking.ts          # SE Ranking API client
│   ├── report-generator.ts   # Report orchestration
│   ├── mock-data.ts          # Mock data for demo
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
├── __tests__/                # Test files
└── public/
```

## Rate Limiting

The SE Ranking API has a default rate limit of **5 requests per second**. This app implements automatic rate limiting to prevent hitting the limit.

To configure the rate limit (if you have a higher limit from SE Ranking):

```typescript
// In lib/seranking.ts
const DEFAULT_RATE_LIMIT = 5; // Change this value
```

For higher rate limits, contact api@seranking.com.

## Error Handling

The app handles common API errors:

### Rate Limit (HTTP 429)
If you exceed the rate limit, you'll see a message explaining how to resolve it:
- Reduce request rate
- Adjust the rate limit in `lib/seranking.ts`
- Contact api@seranking.com for higher limits

### Insufficient Funds (HTTP 402)
If your API key is disabled due to insufficient credits:
- Purchase additional credits at: https://online.seranking.com/admin.api.dashboard.html
- Or contact api@seranking.com for assistance

## Fork & Customize

This project is designed to be forked! Ideas:

- Add your agency's branding
- Create white-label client reports
- Add custom report sections
- Integrate with your CRM
- Build automated reporting workflows

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SE_RANKING_API_KEY` | Your SE Ranking API key | No (uses mock data) |
| `NEXT_PUBLIC_APP_URL` | App URL for sharing | No |

## API Endpoints Used

- `/backlinks/summary` - Backlink overview
- `/backlinks/authority` - Domain authority
- `/backlinks/history/count` - Backlink momentum
- `/backlinks/indexed-pages` - Top linked pages
- `/backlinks/authority/domain/distribution` - Authority distribution
- `/domain/overview/db` - Domain traffic overview
- `/domain/keywords` - Keyword rankings
- `/domain/competitors` - Competitor analysis
- `/domain/keywords/comparison` - Keyword gaps
- `/ai-search/overview` - AI search visibility
- `/ai-search/overview/leaderboard` - AI competitive ranking
- `/ai-search/prompts-by-target` - AI query analysis
- `/keywords/questions` - Question keywords

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

- **API:** [SE Ranking Data API](https://seranking.com/api)
- **Built by:** [Guifré Ballester](https://guifreballester.com)
- **AI Assist:** Claude Code (Anthropic)

---

If this project helped you, please consider giving it a star on GitHub!
