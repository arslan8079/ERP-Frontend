import { Activity, ClipboardCheck, Layers3, TrendingUp } from 'lucide-react'

export default function TransactionAnalysisPage({ context }) {
  const { pageHeader, stat, filteredRows, amountFor, money, pendingCount, table } = context

  return (
    <div className="reports-page">
      {pageHeader(
        'Analyze transaction volume, value, status, and category across ERP modules.',
        Activity,
        { save: true, export: true },
      )}
      <div className="reports-stats compact">
        {stat('Transactions', filteredRows.length, 'Within current filters', Activity)}
        {stat(
          'Recorded value',
          money(amountFor(filteredRows)),
          'Source amounts in PKR',
          TrendingUp,
          'blue',
        )}
        {stat(
          'Modules',
          new Set(filteredRows.map((item) => item.module)).size,
          'With matching activity',
          Layers3,
        )}
        {stat('Pending', pendingCount, 'Awaiting action', ClipboardCheck, 'amber')}
      </div>
      {table('Transaction-level analysis', filteredRows)}
    </div>
  )
}
