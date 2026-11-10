import { Activity, ClipboardCheck, Layers3 } from 'lucide-react'

export default function ActivityReportsPage({ context }) {
  const { pageHeader, stat, allRows, table } = context
  const rows = allRows
  const sortedRows = rows.slice().sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="reports-page">
      {pageHeader('Review dated business events recorded across the ERP modules.', Activity, {
        save: true,
        export: true,
      })}
      <div className="reports-stats compact">
        {stat('Visible events', rows.length, 'Records in the current data set', Activity)}
        {stat(
          'Modules represented',
          new Set(rows.map((item) => item.module)).size,
          'Cross-functional coverage',
          Layers3,
        )}
        {stat(
          'Pending items',
          rows.filter((item) => /pending|review/i.test(item.status)).length,
          'Require follow-up',
          ClipboardCheck,
          'amber',
        )}
      </div>
      {table('ERP activity stream', sortedRows)}
    </div>
  )
}
