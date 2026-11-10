import { useState } from 'react'
import { approvalDisplayDate, ApprovalStatusPill, approvalMoney } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  Clock3,
  ArrowDownToLine,
  ShieldCheck,
  Search,
  RotateCcw,
  ClipboardList,
  ClipboardCheck,
  Info,
} from 'lucide-react'

export default function ApprovalHistoryPage({ history, users, onNavigate }) {
  const [query, setQuery] = useState('')
  const [action, setAction] = useState('All actions')
  const [period, setPeriod] = useState('30 days')
  const cutoff =
    period === 'All time'
      ? 0
      : Date.now() - { '7 days': 604800000, '30 days': 2592000000, '90 days': 7776000000 }[period]
  const search = query.trim().toLowerCase()
  const filtered = history.filter(
    (event) =>
      new Date(event.date).getTime() >= cutoff &&
      (action === 'All actions' || event.action === action) &&
      `${event.reference} ${event.documentType} ${event.actor} ${event.actorRole} ${event.comments}`
        .toLowerCase()
        .includes(search),
  )
  const exportCsv = () => {
    const rows = [
      [
        'Date & time',
        'Reference',
        'Document type',
        'Action',
        'Actor',
        'Role',
        'Amount',
        'Comments',
      ],
      ...filtered.map((event) => [
        approvalDisplayDate(event.date, true),
        event.reference,
        event.documentType,
        event.action,
        event.actor,
        event.actorRole,
        event.amount,
        event.comments,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'approval-history.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  return (
    <div className="branch-list-page access-page approval-page approval-history-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Clock3 size={36} />
          <div>
            <h1>Approval History</h1>
            <p>Trace every approval decision, route change, and administrator action</p>
          </div>
        </div>
        <button type="button" className="branch-report-actions-button" onClick={exportCsv}>
          <ArrowDownToLine size={15} />
          Export CSV
        </button>
      </header>
      <section className="approval-history-banner">
        <span>
          <ShieldCheck size={19} />
        </span>
        <div>
          <b>Auditable decision trail</b>
          <small>
            Approval decisions, rule edits, role limits, and delegations are recorded with their
            actor and timestamp.
          </small>
        </div>
        <strong>{history.length} events</strong>
      </section>
      <section className="approval-toolbar approval-history-toolbar">
        <label className="approval-search">
          <span>Search history</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Reference, approver, document or notes"
            />
          </span>
        </label>
        <label>
          <span>Decision / action</span>
          <select value={action} onChange={(event) => setAction(event.target.value)}>
            <option>All actions</option>
            {[...new Set(history.map((event) => event.action))].sort().map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Time period</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option>7 days</option>
            <option>30 days</option>
            <option>90 days</option>
            <option>All time</option>
          </select>
        </label>
        <button
          type="button"
          className="access-reset"
          onClick={() => {
            setQuery('')
            setAction('All actions')
            setPeriod('30 days')
          }}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </section>
      <section className="approval-history-card">
        <div className="approval-section-heading">
          <div>
            <span className="approval-heading-icon">
              <ClipboardList size={17} />
            </span>
            <div>
              <h2>Decision log</h2>
              <p>
                {filtered.length} of {history.length} recorded events · newest first
              </p>
            </div>
          </div>
          <button
            type="button"
            className="approval-link-button"
            onClick={() => onNavigate('Pending Approvals')}
          >
            <ClipboardCheck size={14} />
            Open pending queue
          </button>
        </div>
        <div className="approval-table-wrap">
          <table className="approval-history-table">
            <thead>
              <tr>
                <th>Date &amp; time</th>
                <th>Reference</th>
                <th>Document</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Amount / note</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => {
                const user = users.find((item) => item.username === event.actor)
                return (
                  <tr key={event.id}>
                    <td>{approvalDisplayDate(event.date, true)}</td>
                    <td>
                      <b>{event.reference || '—'}</b>
                    </td>
                    <td>{event.documentType}</td>
                    <td>
                      <ApprovalStatusPill status={event.action} />
                    </td>
                    <td>
                      <span className="approval-history-actor">
                        <b>{user?.name || event.actor}</b>
                        <small>{event.actorRole}</small>
                      </span>
                    </td>
                    <td>
                      <span className="approval-history-note">
                        <b>{event.amount ? approvalMoney(event.amount) : '—'}</b>
                        <small>{event.comments || 'No note provided'}</small>
                      </span>
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr>
                  <td className="approval-empty" colSpan="6">
                    <Search size={22} />
                    <b>No matching history</b>
                    <span>Change your search or filters to see other events.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="approval-history-footer">
          <span>Audit records are retained locally in this browser.</span>
          <span>
            <Info size={14} />
            Sample historical transactions are demonstration data.
          </span>
        </footer>
      </section>
    </div>
  )
}
