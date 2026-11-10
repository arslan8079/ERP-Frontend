import { BarChart3, ClipboardCheck, FileBarChart, Layers3, TrendingUp } from 'lucide-react'
import { CategoryActivityChart, MonthlyValueChart } from '../ReportsComponents'

export default function InventoryOverviewPage({ context }) {
  const {
    pageHeader,
    stat,
    moduleRows,
    amountFor,
    money,
    monthlyTotals,
    maxMonthlyAmount,
    monthLabel,
    countBy,
    table,
  } = context
  const byCategory = [...countBy(moduleRows, 'category').entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const maxCategory = Math.max(1, ...byCategory.map(([, count]) => count))

  return (
    <div className="reports-page">
      {pageHeader(
        'Inventory & Warehouse performance and operational records sourced from the current ERP workspace.',
        BarChart3,
        { save: true, export: true },
      )}
      <div className="reports-stats compact">
        {stat(
          'Report records',
          moduleRows.length.toLocaleString(),
          'Inventory & Warehouse',
          Layers3,
        )}
        {stat(
          'Stock valuation',
          money(amountFor(moduleRows)),
          'Available source values',
          TrendingUp,
          'blue',
        )}
        {stat(
          'Pending / review',
          moduleRows.filter((item) => /pending|review|transit/i.test(item.status)).length,
          'Needs operational follow-up',
          ClipboardCheck,
          'amber',
        )}
        {stat('Reporting categories', byCategory.length, 'Record types represented', FileBarChart)}
      </div>
      <div className="reports-overview-grid">
        <CategoryActivityChart
          categories={byCategory}
          maxCount={maxCategory}
          title="Activity by record type"
          detail="Inventory & Warehouse"
        />
        <MonthlyValueChart
          totals={monthlyTotals}
          maxAmount={maxMonthlyAmount}
          monthLabel={monthLabel}
        />
      </div>
      {table('Inventory & Warehouse operational details', moduleRows)}
    </div>
  )
}
