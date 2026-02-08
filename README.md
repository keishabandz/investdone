# InvestDone - Investment Forecasting Platform

A SimplyWall.st-style investment analysis app with stock forecasting, financial visualization, and AI-powered insights.

## Tech Stack

- **Frontend:** Next.js 16 (React 19, TypeScript)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Database:** Supabase
- **Stock Data API:** Financial Modeling Prep
- **Hosting:** Vercel

## Features

- Stock search with real-time results
- Price charts with historical data
- 30-day price forecasting (SMA & Linear Regression)
- Investment analysis scoring (Value, Health, Momentum)
- Dashboard with watchlist and recent searches
- Responsive design for mobile and desktop

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd investdone
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Required keys:
- **Supabase:** Get from [supabase.com](https://supabase.com) (Project Settings > API)
- **Financial Modeling Prep:** Get from [financialmodelingprep.com](https://financialmodelingprep.com/developer/docs/)

### 3. Set up Supabase database

Run the SQL schema in your Supabase SQL Editor to create the required tables (`watchlists`, `watchlist_stocks`, `stock_cache`, `analysis_history`).

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
investdone/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── stocks/        # Stock data endpoints
│   │   ├── forecast/      # Forecasting endpoint
│   │   └── analysis/      # Analysis scoring endpoint
│   ├── dashboard/         # Dashboard page
│   └── stock/[symbol]/    # Stock detail page
├── components/            # React components
│   ├── charts/            # Chart components (Price, Forecast)
│   ├── stock/             # Stock components (Search, Card, Overview)
│   ├── analysis/          # Analysis components (Scores, Insights)
│   └── ui/                # Base UI components
├── lib/                   # Utility libraries
│   ├── stockApi.ts        # Stock data API client
│   ├── forecasting.ts     # Forecasting algorithms
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
```

## Deployment

```bash
npm run build
vercel --prod
```

Add environment variables in Vercel Dashboard > Settings > Environment Variables.

## API Rate Limits

| Service | Free Tier | Paid |
|---------|-----------|------|
| Financial Modeling Prep | 250 calls/day | $15/month |
| Supabase | 500MB DB, 2GB bandwidth | $25/month |
| Vercel | 100GB bandwidth | $20/month |
