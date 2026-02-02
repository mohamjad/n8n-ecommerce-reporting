'use client'

import React, { useMemo } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react'
import { getRunLogs, RunLog } from '../data/mockData'

export default function RunLogs() {
  const logs = useMemo(() => getRunLogs(), [])
  
  const stats = useMemo(() => {
    const successful = logs.filter(l => l.status === 'SUCCESS').length
    const failed = logs.filter(l => l.status === 'FAILED').length
    const partial = logs.filter(l => l.status === 'PARTIAL').length
    const avgDuration = logs.reduce((sum, log) => sum + log.duration_seconds, 0) / logs.length
    
    return { successful, failed, partial, avgDuration, total: logs.length }
  }, [logs])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Run Logs</h1>
        <p className="text-gray-600 mt-1">Workflow execution history and monitoring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Runs"
          value={stats.total.toString()}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Successful"
          value={stats.successful.toString()}
          subtitle={`${((stats.successful / stats.total) * 100).toFixed(0)}% success rate`}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Failed"
          value={stats.failed.toString()}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Avg Duration"
          value={`${Math.round(stats.avgDuration)}s`}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Execution History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Run ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rows Written</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.run_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{log.run_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.start_time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.duration_seconds}s</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.reports_completed}/{log.reports_requested}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.rows_written.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.errors ? (
                      <span className="text-red-600">{log.errors}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string
  value: string
  subtitle?: string
  icon: any
  color: 'blue' | 'green' | 'red' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: RunLog['status'] }) {
  const styles = {
    SUCCESS: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
  }

  const icons = {
    SUCCESS: CheckCircle2,
    FAILED: XCircle,
    PARTIAL: AlertCircle,
  }

  const Icon = icons[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </span>
  )
}
