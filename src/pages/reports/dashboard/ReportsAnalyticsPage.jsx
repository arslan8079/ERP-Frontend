import {
  Activity,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileBarChart,
  Layers3,
  TrendingUp,
  Users,
} from 'lucide-react'
import { MonthlyValueChart, CategoryActivityChart } from '../ReportsComponents'

export default function ReportsAnalyticsPage({ context }) {
  const {
    allRows,
    amountFor,
    dataForModule,
    money,
    activeDealers,
    pendingCount,
    nearExpiry,
    monthlyTotals,
    maxMonthlyAmount,
    monthLabel,
    moduleCounts,
    maxModuleCount,
    stat,
    pageHeader,
    table,
    onNavigate,
  } = context

  return (
    <div className="reports-page">
      {pageHeader(
        'Cross-functional business performance, risk, and decision-support for the pesticide operation.',
        TrendingUp,
        { export: true },
      )}
      <div className="reports-stats">
        {stat(
          'Activity records',
          allRows.length.toLocaleString(),
          'Across connected ERP modules',
          Layers3,
        )}
        {stat(
          'Dealer order value',
          money(
            amountFor(
              dataForModule('Dealer Management').filter((item) => item.category === 'Sales order'),
            ),
          ),
          `${activeDealers} active dealer accounts`,
          Users,
          'blue',
        )}
        {stat(
          'Pending actions',
          pendingCount,
          'Orders, reviews, and open approvals',
          ClipboardCheck,
          'amber',
        )}
        {stat('Batches near expiry', nearExpiry, 'Within the next 90 days', CalendarDays, 'red')}
      </div>
      <div className="reports-overview-grid">
        <MonthlyValueChart
          totals={monthlyTotals}
          maxAmount={maxMonthlyAmount}
          monthLabel={monthLabel}
          title="Monthly transaction value"
          detail="Recent activity · PKR"
          emptyMessage="Transaction dates will appear here as your teams record activity."
        />
        <CategoryActivityChart
          categories={moduleCounts}
          maxCount={maxModuleCount}
          title="Activity by module"
          detail="Records"
        />
      </div>
      <section className="reports-quick-grid">
        {[
          ['Sales Overview', 'Dealer orders, dispatches, returns, and collections.', Users],
          [
            'Finance Overview',
            'Journal activity, receivables, payables, and cash movement.',
            FileBarChart,
          ],
          ['Inventory Overview', 'Batch movements, stock value, and expiry exposure.', Database],
          ['HR Overview', 'Workforce, attendance, and leave activity.', Activity],
        ].map(([label, detail, Icon]) => (
          <button key={label} onClick={() => onNavigate(label)}>
            <span>
              <Icon size={17} />
            </span>
            <div>
              <b>{label}</b>
              <small>{detail}</small>
            </div>
            <ChevronRight size={15} />
          </button>
        ))}
      </section>
      {table(
        'Latest cross-functional activity',
        allRows
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 8),
      )}
    </div>
  )
}
