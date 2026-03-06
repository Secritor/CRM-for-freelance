'use client'

import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import type { RootState } from '@/store/store'
import Title from '../components/Title'
import styles from './analytics.module.css'

type TimePeriod = 3 | 6 | 12

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  pending: '#f59e0b',
  completed: '#3b82f6',
  cancelled: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function Analytics() {
  const deals = useSelector((state: RootState) => state.deals.deals)
  const clients = useSelector((state: RootState) => state.clients.clients)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(6)

  const incomeByMonth = useMemo(() => {
    const now = new Date()
    const months: { month: string; income: number; deals: number }[] = []

    for (let i = timePeriod - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      months.push({ month: monthKey, income: 0, deals: 0 })
    }

    deals
      .filter(d => d.status === 'completed' && d.endDate)
      .forEach(deal => {
        const endDate = new Date(deal.endDate)
        const monthsAgo = (now.getFullYear() - endDate.getFullYear()) * 12 + (now.getMonth() - endDate.getMonth())

        if (monthsAgo >= 0 && monthsAgo < timePeriod) {
          const index = timePeriod - 1 - monthsAgo
          if (months[index]) {
            months[index].income += deal.amount
            months[index].deals += 1
          }
        }
      })

    return months
  }, [deals, timePeriod])

  const dealsByStatus = useMemo(() => {
    const statusCounts: Record<string, number> = {
      active: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    }

    deals.forEach(deal => {
      if (statusCounts[deal.status] !== undefined) {
        statusCounts[deal.status] += 1
      }
    })

    return Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_LABELS[status],
        value: count,
        color: STATUS_COLORS[status],
      }))
  }, [deals])

  const incomeByClient = useMemo(() => {
    const clientIncome: Record<string, { name: string; income: number }> = {}

    deals
      .filter(d => d.status === 'completed')
      .forEach(deal => {
        const clientId = String(deal.clientId)
        if (!clientIncome[clientId]) {
          clientIncome[clientId] = { name: deal.clientName || 'Unknown', income: 0 }
        }
        clientIncome[clientId].income += deal.amount
      })

    return Object.values(clientIncome)
      .sort((a, b) => b.income - a.income)
      .slice(0, 10)
  }, [deals])

  const clientStats = useMemo(() => {
    const stats: Record<
      string,
      {
        clientId: string
        clientName: string
        company: string
        totalIncome: number
        dealsCount: number
        lastDealDate: string
      }
    > = {}

    deals.forEach(deal => {
      const clientId = String(deal.clientId)

      if (!stats[clientId]) {
        const client = clients.find(c => String(c.id) === clientId)
        stats[clientId] = {
          clientId,
          clientName: deal.clientName || 'Unknown',
          company: client?.company || deal.clientCompany || '—',
          totalIncome: 0,
          dealsCount: 0,
          lastDealDate: '',
        }
      }

      if (deal.status === 'completed') {
        stats[clientId].totalIncome += deal.amount
      }
      stats[clientId].dealsCount += 1

      if (deal.endDate && (!stats[clientId].lastDealDate || deal.endDate > stats[clientId].lastDealDate)) {
        stats[clientId].lastDealDate = deal.endDate
      }
    })

    return Object.values(stats).sort((a, b) => b.totalIncome - a.totalIncome)
  }, [deals, clients])

  const formatCurrency = (value: number) => {
    return '$' + value.toLocaleString('en-US')
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const totalIncome = useMemo(
    () => deals.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0),
    [deals]
  )

  const totalDeals = deals.length
  const avgDealValue = totalDeals > 0 ? Math.round(totalIncome / deals.filter(d => d.status === 'completed').length) || 0 : 0

  return (
    <div className={styles.container}>
      <Title titleText="Analytics" subtitleText="Track your business performance and insights" />

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Income</span>
          <span className={styles.summaryValue}>{formatCurrency(totalIncome)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Deals</span>
          <span className={styles.summaryValue}>{totalDeals}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Average Deal</span>
          <span className={styles.summaryValue}>{formatCurrency(avgDealValue)}</span>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Income Trend</h3>
            <div className={styles.periodSelector}>
              {([3, 6, 12] as TimePeriod[]).map(period => (
                <button
                  key={period}
                  className={`${styles.periodButton} ${timePeriod === period ? styles.periodActive : ''}`}
                  onClick={() => setTimePeriod(period)}
                >
                  {period}M
                </button>
              ))}
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={incomeByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Income']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Deals by Status</h3>
          </div>
          <div className={styles.chartWrapper}>
            {dealsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={dealsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dealsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [Number(value ?? 0), String(name)]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noData}>No deals data</div>
            )}
          </div>
          <div className={styles.legend}>
            {dealsByStatus.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Income by Client</h3>
        </div>
        <div className={styles.chartWrapper}>
          {incomeByClient.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeByClient} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Income']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="income" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>No completed deals data</div>
          )}
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Client Statistics</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Total Income</th>
                <th>Deals</th>
                <th>Avg Deal</th>
                <th>Last Deal</th>
              </tr>
            </thead>
            <tbody>
              {clientStats.length > 0 ? (
                clientStats.map(stat => (
                  <tr key={stat.clientId}>
                    <td>{stat.clientName}</td>
                    <td>{stat.company}</td>
                    <td className={styles.moneyCell}>{formatCurrency(stat.totalIncome)}</td>
                    <td>{stat.dealsCount}</td>
                    <td className={styles.moneyCell}>
                      {stat.dealsCount > 0 ? formatCurrency(Math.round(stat.totalIncome / stat.dealsCount)) : '—'}
                    </td>
                    <td>{formatDate(stat.lastDealDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noDataCell}>
                    No client data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
