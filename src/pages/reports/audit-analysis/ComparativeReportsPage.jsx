import { BarChart3, TrendingUp } from 'lucide-react'

export default function ComparativeReportsPage({ context }) {
  const { pageHeader, monthlyTotals, maxMonthlyAmount, monthLabel, money, filteredRows, table } =
    context

  return (
    <div className="reports-page">
      {pageHeader(
        'Compare transaction value and volume across recent reporting periods.',
        TrendingUp,
        { save: true, export: true },
      )}
      <section className="reports-card reports-chart-card">
        <header>
          <span>
            <BarChart3 size={16} />
            Period comparison
          </span>
          <small>Monthly · PKR</small>
        </header>
        <div className="reports-comparison">
          {monthlyTotals.length ? (
            monthlyTotals.map((item) => (
              <div key={item.month}>
                <span>{monthLabel(item.month)}</span>
                <div>
                  <i style={{ width: `${(item.amount / maxMonthlyAmount) * 100}%` }} />
                </div>
                <b>{money(item.amount)}</b>
                <small>{item.count} records</small>
              </div>
            ))
          ) : (
            <div className="reports-empty-chart">
              Monthly comparisons appear when dated ERP transactions are available.
            </div>
          )}
        </div>
      </section>
      {table('Period transactions', filteredRows)}
    </div>
  )
}
