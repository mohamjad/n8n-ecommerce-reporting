'use client'

import React, { useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarSign, MousePointerClick, Target, TrendingUp, TrendingDown } from 'lucide-react'
import { getAdsData, AdsMetric } from '../data/mockData'

export default function AdsDashboard() {
  const adsData = useMemo(() => getAdsData(), [])
  
  const totals = useMemo(() => {
    return adsData.reduce((acc, day) => ({
      spend: acc.spend + day.ad_spend,
      sales: acc.sales + day.ad_sales,
      orders: acc.orders + day.ad_orders,
      impressions: acc.impressions + day.impressions,
      clicks: acc.clicks + day.clicks,
    }), { spend: 0, sales: 0, orders: 0, impressions: 0, clicks: 0 })
  }, [adsData])
  
  const avgAcos = totals.sales > 0 ? (totals.spend / totals.sales) * 100 : 0
  const avgRoas = totals.spend > 0 ? totals.sales / totals.spend : 0
  const avgCtr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0
  const avgCpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0
  
  const recentData = adsData.slice(-7)
  const previousWeek = adsData.slice(-14, -7)
  const weekOverWeek = previousWeek.length > 0 ? {
    spend: ((recentData.reduce((a, b) => a + b.ad_spend, 0) - previousWeek.reduce((a, b) => a + b.ad_spend, 0)) / previousWeek.reduce((a, b) => a + b.ad_spend, 0)) * 100,
    roas: ((recentData.reduce((a, b) => a + b.roas, 0) / recentData.length) - (previousWeek.reduce((a, b) => a + b.roas, 0) / previousWeek.length)) / (previousWeek.reduce((a, b) => a + b.roas, 0) / previousWeek.length) * 100,
  } : { spend: 0, roas: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ads Performance</h1>
        <p className="text-gray-600 mt-1">Last 30 days advertising metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Ad Spend"
          value={`$${totals.spend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={weekOverWeek.spend}
          icon={DollarSign}
          color="blue"
        />
        <KPICard
          title="Ad Sales"
          value={`$${totals.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Avg ACoS"
          value={`${avgAcos.toFixed(2)}%`}
          subtitle={`ROAS: ${avgRoas.toFixed(2)}x`}
          icon={Target}
          color={avgAcos < 25 ? 'green' : avgAcos < 35 ? 'orange' : 'red'}
        />
        <KPICard
          title="CTR"
          value={`${avgCtr.toFixed(2)}%`}
          subtitle={`CPC: $${avgCpc.toFixed(2)}`}
          icon={MousePointerClick}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Spend vs Sales">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Legend />
              <Line type="monotone" dataKey="ad_spend" stroke="#ef4444" name="Ad Spend" strokeWidth={2} />
              <Line type="monotone" dataKey="ad_sales" stroke="#10b981" name="Ad Sales" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ACoS & ROAS">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="acos" stroke="#f59e0b" name="ACoS %" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#3b82f6" name="ROAS" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Impressions & Clicks">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Legend />
              <Bar yAxisId="left" dataKey="impressions" fill="#8b5cf6" name="Impressions" />
              <Bar yAxisId="right" dataKey="clicks" fill="#3b82f6" name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CTR & CPC">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="ctr" stroke="#10b981" name="CTR %" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="cpc" stroke="#ef4444" name="CPC $" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Data Table */}
      <ChartCard title="Daily Ads Data">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACoS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROAS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adsData.slice().reverse().map((day) => (
                <tr key={day.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${day.ad_spend.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${day.ad_sales.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.ad_orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.impressions.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.ctr.toFixed(2)}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    day.acos < 25 ? 'text-green-600' : day.acos < 35 ? 'text-orange-600' : 'text-red-600'
                  }`}>{day.acos.toFixed(2)}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    day.roas > 4 ? 'text-green-600' : day.roas > 2 ? 'text-orange-600' : 'text-red-600'
                  }`}>{day.roas.toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}

function KPICard({ title, value, change, icon: Icon, color, subtitle }: {
  title: string
  value: string
  change?: number
  icon: any
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  subtitle?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
      <div className={`${colorClasses[color]} p-3 rounded-lg absolute top-4 right-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {change !== undefined && (
          <div className="flex items-center mt-2">
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change).toFixed(1)}% vs last week
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

