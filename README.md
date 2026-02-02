# E-commerce Reporting Dashboard

A modern, interactive dashboard for visualizing sales and advertising metrics from multiple e-commerce platforms.

## Features

- 📊 **Sales Dashboard** - Track orders, revenue, units sold, and refund rates
- 📈 **Ads Performance** - Monitor ad spend, ACoS, ROAS, CTR, and conversion metrics
- 📋 **Run Logs** - View workflow execution history and monitoring
- 🎨 **Modern UI** - Clean, responsive design with interactive charts
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

```bash
npm run build
npm start
```

## Dashboard Sections

### Sales Dashboard
- Total revenue and orders tracking
- Week-over-week comparisons
- Revenue and orders trend charts
- Daily sales data table
- Key metrics: AOV, refund rate, units sold

### Ads Performance
- Ad spend vs sales analysis
- ACoS and ROAS tracking
- CTR and CPC metrics
- Impressions and clicks visualization
- Campaign performance data

### Run Logs
- Workflow execution history
- Success/failure rates
- Average execution duration
- Report completion tracking
- Error monitoring

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── SalesDashboard.tsx  # Sales metrics dashboard
│   ├── AdsDashboard.tsx    # Ads performance dashboard
│   └── RunLogs.tsx         # Execution logs view
├── data/
│   └── mockData.ts         # Mock data generators
└── public/                 # Static assets
```

## Data

Currently uses mock data generated in `data/mockData.ts`. To connect to real APIs:

1. Create API routes in `app/api/`
2. Update data fetching in components
3. Replace mock data generators with API calls

## License

MIT License
