'use client'

import { useState } from 'react'
import SalesDashboard from '../components/SalesDashboard'
import AdsDashboard from '../components/AdsDashboard'
import RunLogs from '../components/RunLogs'
import Sidebar from '../components/Sidebar'

type Tab = 'sales' | 'ads' | 'logs'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('sales')

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === 'sales' && <SalesDashboard />}
          {activeTab === 'ads' && <AdsDashboard />}
          {activeTab === 'logs' && <RunLogs />}
        </div>
      </main>
    </div>
  )
}
