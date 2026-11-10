import { useState } from 'react'
import { userDisplayDate } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  Clock3,
  ArrowDownToLine,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  RotateCcw,
  ClipboardList,
  ShieldCheck,
  Info,
} from 'lucide-react'

export default function LoginHistoryPage({ history, users }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('All Results')
  const [period, setPeriod] = useState('30 days')
  const cutoff =
    Date.now() - { '24 hours': 86400000, '7 days': 604800000, '30 days': 2592000000 }[period]
  const normalizedQuery = query.trim().toLowerCase()
  const visibleHistory = history.filter(
    (event) =>
      new Date(event.date).getTime() >= cutoff &&
      (result === 'All Results' || event.result === result) &&
      `${event.username} ${event.userId} ${event.action} ${event.details} ${event.ip}`
        .toLowerCase()
        .includes(normalizedQuery),
  )
  const failedCount = history.filter(
    (event) => event.result === 'Failed' && new Date(event.date).getTime() >= cutoff,
  ).length
  const successfulCount = history.filter(
    (event) => event.result === 'Success' && new Date(event.date).getTime() >= cutoff,
  ).length
  const exportHistory = () => {
    const rows = [
      ['Date & Time', 'User', 'User ID', 'Action', 'Result', 'IP Address', 'Device', 'Details'],
      ...visibleHistory.map((event) => [
        userDisplayDate(event.date, true),
        event.username,
        event.userId,
        event.action,
        event.result,
        event.ip,
        event.device,
        event.details,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'user-login-history.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  return (
    <div className="branch-list-page access-page login-history-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Clock3 size={37} />
          <div>
            <h1>Login History</h1>
            <p>Audit sign-ins, account security changes, and access outcomes</p>
          </div>
        </div>
        <button type="button" className="branch-report-actions-button" onClick={exportHistory}>
          <ArrowDownToLine size={15} />
          Export CSV
        </button>
      </header>
      <section className="access-summary history-summary">
        <article>
          <span className="access-summary-icon green">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <span>Successful events</span>
            <strong>{successfulCount}</strong>
            <small>Selected time range</small>
          </div>
        </article>
        <article>
          <span className="access-summary-icon red">
            <AlertTriangle size={20} />
          </span>
          <div>
            <span>Failed sign-ins</span>
            <strong>{failedCount}</strong>
            <small>Review unusual attempts</small>
          </div>
        </article>
        <article>
          <span className="access-summary-icon blue">
            <Users size={20} />
          </span>
          <div>
            <span>Tracked accounts</span>
            <strong>{new Set(history.map((event) => event.userId).filter(Boolean)).size}</strong>
            <small>Recorded in audit log</small>
          </div>
        </article>
      </section>
      <section className="access-toolbar history-toolbar">
        <label className="access-search">
          <span>Search audit history</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Username, action, IP address or details"
            />
          </span>
        </label>
        <label>
          <span>Time range</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option>24 hours</option>
            <option>7 days</option>
            <option>30 days</option>
          </select>
        </label>
        <label>
          <span>Result</span>
          <select value={result} onChange={(event) => setResult(event.target.value)}>
            <option>All Results</option>
            <option>Success</option>
            <option>Failed</option>
          </select>
        </label>
        <button
          type="button"
          className="access-reset"
          onClick={() => {
            setQuery('')
            setPeriod('30 days')
            setResult('All Results')
          }}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </section>
      <section className="access-table-card history-table-card">
        <div className="access-table-heading">
          <div>
            <h2>
              <ClipboardList size={17} />
              Security audit trail
            </h2>
            <p>
              {visibleHistory.length} of {history.length} events · most recent first
            </p>
          </div>
          <span>
            <ShieldCheck size={15} />
            Audit records are retained
          </span>
        </div>
        <div className="access-table-wrap">
          <table className="access-table history-table">
            <thead>
              <tr>
                <th>Date &amp; time</th>
                <th>User</th>
                <th>Event</th>
                <th>IP address</th>
                <th>Device</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {visibleHistory.map((event) => {
                const user = users.find((item) => item.id === event.userId)
                return (
                  <tr key={event.id}>
                    <td>{userDisplayDate(event.date, true)}</td>
                    <td>
                      <span className="history-user-cell">
                        <b>{event.username}</b>
                        <small>{user?.name || event.userId || 'Administrator'}</small>
                      </span>
                    </td>
                    <td>
                      <span className="history-action-cell">
                        <b>{event.action}</b>
                        <small>{event.details || '—'}</small>
                      </span>
                    </td>
                    <td>{event.ip || '—'}</td>
                    <td>{event.device || '—'}</td>
                    <td>
                      <span className={`history-result ${event.result.toLowerCase()}`}>
                        <i />
                        {event.result}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {!visibleHistory.length && (
                <tr>
                  <td className="access-empty" colSpan="6">
                    No audit events match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="access-list-footer">
          <span>
            Showing <b>{visibleHistory.length}</b> events
          </span>
          <span>
            <Info size={15} />
            Historical sign-in examples are sample data; new account changes are recorded locally.
          </span>
        </footer>
      </section>
    </div>
  )
}
