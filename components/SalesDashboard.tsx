'use client'

import React, { useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarSign, ShoppingCart, Package, TrendingUp, TrendingDown } from 'lucide-react'
import { getSalesData, SalesMetric } from '../data/mockData'

export default function SalesDashboard() {
  const salesData = useMemo(() => getSalesData(), [])
  
  const totals = useMemo(() => {
    return salesData.reduce((acc, day) => ({
      revenue: acc.revenue + day.total_revenue,
      orders: acc.orders + day.total_orders,
      units: acc.units + day.units_sold,
      refunds: acc.refunds + day.refunds_amount,
    }), { revenue: 0, orders: 0, units: 0, refunds: 0 })
  }, [salesData])
  
  const avgOrderValue = totals.orders > 0 ? totals.revenue / totals.orders : 0
  const refundRate = totals.revenue > 0 ? (totals.refunds / totals.revenue) * 100 : 0
  
  const recentData = salesData.slice(-7)
  const previousWeek = salesData.slice(-14, -7)
  const weekOverWeek = previousWeek.length > 0 ? {
    revenue: ((recentData.reduce((a, b) => a + b.total_revenue, 0) - previousWeek.reduce((a, b) => a + b.total_revenue, 0)) / previousWeek.reduce((a, b) => a + b.total_revenue, 0)) * 100,
    orders: ((recentData.reduce((a, b) => a + b.total_orders, 0) - previousWeek.reduce((a, b) => a + b.total_orders, 0)) / previousWeek.reduce((a, b) => a + b.total_orders, 0)) * 100,
  } : { revenue: 0, orders: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
        <p className="text-gray-600 mt-1">Last 30 days performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={`$${totals.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={weekOverWeek.revenue}
          icon={DollarSign}
          color="blue"
        />
        <KPICard
          title="Total Orders"
          value={totals.orders.toLocaleString()}
          change={weekOverWeek.orders}
          icon={ShoppingCart}
          color="green"
        />
        <KPICard
          title="Units Sold"
          value={totals.units.toLocaleString()}
          icon={Package}
          color="purple"
        />
        <KPICard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          subtitle={`Refund Rate: ${refundRate.toFixed(2)}%`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Legend />
              <Line type="monotone" dataKey="total_revenue" stroke="#3b82f6" name="Total Revenue" strokeWidth={2} />
              <Line type="monotone" dataKey="net_revenue" stroke="#10b981" name="Net Revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders & Units">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Legend />
              <Bar yAxisId="left" dataKey="total_orders" fill="#3b82f6" name="Orders" />
              <Bar yAxisId="right" dataKey="units_sold" fill="#8b5cf6" name="Units" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Data Table */}
      <ChartCard title="Daily Sales Data">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AOV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.slice().reverse().map((day) => (
                <tr key={day.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.total_orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${day.total_revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${day.net_revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.units_sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${day.avg_order_value.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.refund_rate.toFixed(2)}%</td>
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
  color: 'blue' | 'green' | 'purple' | 'orange'
  subtitle?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
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
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
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
