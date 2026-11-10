import { ClipboardCheck, Layers3, ShieldCheck } from 'lucide-react'

export default function DataAuditLogsPage({ context }) {
  const { pageHeader, stat, allRows, table } = context
  const rows = allRows.filter(
    (item) =>
      ['Administration', 'Dealer Management'].includes(item.module) ||
      /audit|approval|verified|rejected/i.test(`${item.category} ${item.status}`),
  )
  const sortedRows = rows.slice().sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="reports-page">
      {pageHeader(
        'Inspect available business and administrative records with traceable references.',
        ShieldCheck,
        { save: true, export: true },
      )}
      <div className="reports-stats compact">
        {stat('Visible events', rows.length, 'Records in the current data set', ShieldCheck)}
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
      {table('Business audit trail', sortedRows)}
    </div>
  )
}
