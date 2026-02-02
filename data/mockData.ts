export interface SalesMetric {
  date: string
  marketplace: string
  account_id: string
  total_orders: number
  total_revenue: number
  net_revenue: number
  units_sold: number
  avg_order_value: number
  refunds_amount: number
  refund_rate: number
  organic_sales: number
  promoted_sales: number
}

export interface AdsMetric {
  date: string
  marketplace: string
  account_id: string
  ad_spend: number
  ad_sales: number
  ad_orders: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  acos: number
  tacos: number
  roas: number
  conversion_rate: number
}

export interface RunLog {
  run_id: string
  start_time: string
  end_time: string
  duration_seconds: number
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL'
  reports_requested: number
  reports_completed: number
  rows_written: number
  errors?: string
}

// Generate last 30 days of sales data
export function getSalesData(): SalesMetric[] {
  const data: SalesMetric[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Simulate some variation
    const baseOrders = 100 + Math.random() * 50
    const baseRevenue = baseOrders * (80 + Math.random() * 40)
    const refundRate = 0.01 + Math.random() * 0.03
    
    data.push({
      date: dateStr,
      marketplace: 'US',
      account_id: 'A123456789',
      total_orders: Math.round(baseOrders),
      total_revenue: Math.round(baseRevenue * 100) / 100,
      net_revenue: Math.round(baseRevenue * (1 - refundRate) * 100) / 100,
      units_sold: Math.round(baseOrders * (1.2 + Math.random() * 0.3)),
      avg_order_value: Math.round((baseRevenue / baseOrders) * 100) / 100,
      refunds_amount: Math.round(baseRevenue * refundRate * 100) / 100,
      refund_rate: Math.round(refundRate * 10000) / 100,
      organic_sales: Math.round(baseRevenue * (0.6 + Math.random() * 0.2) * 100) / 100,
      promoted_sales: Math.round(baseRevenue * (0.2 + Math.random() * 0.2) * 100) / 100,
    })
  }
  
  return data
}

// Generate last 30 days of ads data
export function getAdsData(): AdsMetric[] {
  const data: AdsMetric[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const baseSpend = 500 + Math.random() * 300
    const baseSales = baseSpend * (3 + Math.random() * 2)
    const baseImpressions = 50000 + Math.random() * 30000
    const baseClicks = baseImpressions * (0.008 + Math.random() * 0.004)
    
    data.push({
      date: dateStr,
      marketplace: 'US',
      account_id: 'A123456789',
      ad_spend: Math.round(baseSpend * 100) / 100,
      ad_sales: Math.round(baseSales * 100) / 100,
      ad_orders: Math.round(baseClicks * (0.03 + Math.random() * 0.02)),
      impressions: Math.round(baseImpressions),
      clicks: Math.round(baseClicks),
      ctr: Math.round((baseClicks / baseImpressions) * 10000) / 100,
      cpc: Math.round((baseSpend / baseClicks) * 100) / 100,
      acos: Math.round((baseSpend / baseSales) * 10000) / 100,
      tacos: Math.round((baseSpend / (baseSales * 1.2)) * 10000) / 100,
      roas: Math.round((baseSales / baseSpend) * 100) / 100,
      conversion_rate: Math.round((baseClicks * 0.035 / baseClicks) * 10000) / 100,
    })
  }
  
  return data
}

// Generate run logs
export function getRunLogs(): RunLog[] {
  const logs: RunLog[] = []
  const today = new Date()
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(6, Math.floor(Math.random() * 15), 0, 0)
    
    const startTime = date.toISOString()
    const duration = 120 + Math.random() * 180
    const endTime = new Date(date.getTime() + duration * 1000).toISOString()
    
    const statuses: ('SUCCESS' | 'FAILED' | 'PARTIAL')[] = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'PARTIAL', 'FAILED']
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    logs.push({
      run_id: `RUN-${date.toISOString().split('T')[0].replace(/-/g, '')}-${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`,
      start_time: startTime,
      end_time: endTime,
      duration_seconds: Math.round(duration),
      status,
      reports_requested: 3,
      reports_completed: status === 'SUCCESS' ? 3 : status === 'PARTIAL' ? 2 : 0,
      rows_written: status === 'SUCCESS' ? 150 + Math.floor(Math.random() * 50) : 0,
      errors: status !== 'SUCCESS' ? 'Rate limit exceeded, retrying...' : undefined,
    })
  }
  
  return logs.reverse()
}
