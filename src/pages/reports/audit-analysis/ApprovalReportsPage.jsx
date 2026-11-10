import { ClipboardCheck, FileClock, ShieldCheck } from 'lucide-react'

export default function ApprovalReportsPage({ context }) {
  const { pageHeader, stat, allRows, table } = context
  const rows = allRows.filter(
    (item) =>
      item.category.toLowerCase().includes('approval') ||
      /pending|approved|rejected|review/i.test(item.status),
  )

  return (
    <div className="reports-page">
      {pageHeader(
        'Track approval demand, decisions, responsible modules, and unresolved items.',
        ClipboardCheck,
        { save: true, export: true },
      )}
      <div className="reports-stats compact">
        {stat('Approval records', rows.length, 'Requests and decisions', ClipboardCheck)}
        {stat(
          'Awaiting review',
          rows.filter((item) => /pending|review/i.test(item.status)).length,
          'Open decisions',
          FileClock,
          'amber',
        )}
        {stat(
          'Approved',
          rows.filter((item) => /approved/i.test(item.status)).length,
          'Decision recorded',
          ShieldCheck,
          'blue',
        )}
      </div>
      {table('Approval activity', rows)}
    </div>
  )
}
