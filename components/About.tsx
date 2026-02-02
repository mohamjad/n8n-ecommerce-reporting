'use client'

import { Zap, Database, BarChart3, Shield, Clock, TrendingUp } from 'lucide-react'

export default function About() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">How It Works</h1>
        <p className="text-gray-600 mt-2">Automated e-commerce reporting solution architecture</p>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Solution Overview</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          This dashboard is powered by an automated workflow system that connects to multiple e-commerce platforms 
          (Amazon SP-API, Amazon Ads, Walmart Seller & Ads APIs) to collect sales and advertising data daily. 
          The system normalizes data from different sources, computes key performance indicators, validates accuracy, 
          and presents everything in an easy-to-understand dashboard interface.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <FeatureCard
            icon={Zap}
            title="Automated Daily Runs"
            description="Scheduled to run every morning, pulling yesterday's data automatically"
          />
          <FeatureCard
            icon={Database}
            title="Multi-Platform Integration"
            description="Connects to Amazon SP-API, Amazon Ads, and Walmart APIs simultaneously"
          />
          <FeatureCard
            icon={BarChart3}
            title="Real-Time Dashboards"
            description="Visual charts and metrics updated automatically as data flows in"
          />
        </div>
      </div>

      {/* Architecture Flow */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Architecture</h2>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scheduled Data Collection</h3>
              <p className="text-gray-600">
                Every morning at 6:00 AM CST, the automation workflow triggers. It calculates yesterday's date 
                range (handling timezone changes automatically) and prepares API requests to all connected platforms.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Integration & Authentication</h3>
              <p className="text-gray-600">
                The system securely authenticates with each platform using OAuth tokens and API credentials. 
                It handles token refresh automatically and manages rate limits with intelligent retry logic.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Generation & Polling</h3>
              <p className="text-gray-600">
                Reports are requested from each platform. Since reports generate asynchronously, the system 
                polls with exponential backoff until reports are ready (typically 2-5 minutes). This ensures 
                reliable data collection even during peak API usage times.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">4</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Processing & Normalization</h3>
              <p className="text-gray-600">
                Raw data comes in different formats (TSV files, GZIP-compressed JSON, etc.). The system 
                automatically detects formats, decompresses files, parses data, and normalizes everything 
                into a unified schema. This allows comparing metrics across platforms seamlessly.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 font-bold text-lg">5</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">KPI Calculation & Validation</h3>
              <p className="text-gray-600">
                Key metrics are computed automatically: ACoS (Advertising Cost of Sales), ROAS (Return on Ad Spend), 
                CTR (Click-Through Rate), conversion rates, and more. The system validates data quality, checks 
                for anomalies, and flags any discrepancies for review.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-lg">6</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Updates & Monitoring</h3>
              <p className="text-gray-600">
                Processed data is written to the dashboard database. The system logs every execution with 
                timestamps, success rates, and any errors. If something goes wrong, alerts are sent immediately. 
                You can view all execution history in the Run Logs section.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Features & Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Reliable & Resilient</h3>
              <p className="text-sm text-gray-600">
                Automatic retry logic handles API rate limits and temporary failures. Exponential backoff 
                ensures the system doesn't overwhelm APIs during high-traffic periods.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Time-Saving Automation</h3>
              <p className="text-sm text-gray-600">
                No more manual data exports or spreadsheet consolidation. Everything runs automatically 
                every morning, giving you fresh insights by the time you start your day.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <TrendingUp className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Unified View</h3>
              <p className="text-sm text-gray-600">
                See all your e-commerce metrics in one place. Compare performance across platforms, 
                track trends over time, and make data-driven decisions faster.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <BarChart3 className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Actionable Insights</h3>
              <p className="text-sm text-gray-600">
                Pre-calculated KPIs like ACoS and ROAS help you optimize ad spend immediately. 
                Week-over-week comparisons highlight trends and opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TechBadge name="n8n" description="Workflow Automation" />
          <TechBadge name="Next.js" description="Dashboard Frontend" />
          <TechBadge name="TypeScript" description="Type Safety" />
          <TechBadge name="Recharts" description="Data Visualization" />
          <TechBadge name="Amazon SP-API" description="Sales Data" />
          <TechBadge name="Amazon Ads API" description="Advertising Data" />
          <TechBadge name="Walmart APIs" description="Multi-Platform" />
          <TechBadge name="Google Sheets" description="Data Storage" />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Automate Your E-commerce Reporting?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          This solution can be customized for your specific needs. Whether you need additional platforms, 
          custom metrics, or integration with your existing tools, we can build it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:your-email@example.com" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started
          </a>
          <a 
            href="https://github.com/mohamjad/n8n-ecommerce-reporting" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: {
  icon: any
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
      <Icon className="h-8 w-8 text-blue-600 mb-3" />
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function TechBadge({ name, description }: { name: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="font-semibold text-gray-900 text-sm">{name}</div>
      <div className="text-xs text-gray-500 mt-1">{description}</div>
    </div>
  )
}
