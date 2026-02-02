'use client'

import { ShoppingCart, TrendingUp, FileText, BarChart3, Info } from 'lucide-react'
import { Tab } from '../types'

interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'sales' as Tab, label: 'Sales Dashboard', icon: ShoppingCart },
    { id: 'ads' as Tab, label: 'Ads Performance', icon: TrendingUp },
    { id: 'logs' as Tab, label: 'Run Logs', icon: FileText },
    { id: 'about' as Tab, label: 'How It Works', icon: Info },
  ]

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <BarChart3 className="h-6 w-6 mr-2" />
        <h1 className="text-xl font-bold">E-commerce Dashboard</h1>
      </div>
      
      <nav className="mt-8 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          )
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          <div className="font-semibold text-gray-300 mb-1">Status</div>
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            All systems operational
          </div>
        </div>
      </div>
    </div>
  )
}
