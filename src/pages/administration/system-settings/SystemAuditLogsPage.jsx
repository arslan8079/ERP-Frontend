import { useState } from 'react'
import {
  approvalDisplayDate,
  SystemSettingsHeader,
  SystemSettingsCardHeading,
} from '../../../App.jsx'
import {
  ClipboardList,
  Download,
  Settings,
  UserCog,
  ClipboardCheck,
  ShieldCheck,
  Clock3,
  ArrowRight,
  Search,
  RotateCcw,
  ListRestart,
  UserRound,
  Info,
} from 'lucide-react'

export default function SystemAuditLogsPage({
  systemLogs,
  loginHistory,
  approvalHistory,
  users,
  onNavigate,
}) {
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('All sources')
  const [period, setPeriod] = useState('30 days')
  const cutoff =
    period === 'All time'
      ? 0
      : Date.now() - { '7 days': 604800000, '30 days': 2592000000, '90 days': 7776000000 }[period]
  const userByName = new Map(users.map((user) => [user.username, user.name]))
  const events = [
    ...systemLogs.map((event) => ({
      ...event,
      source: 'System Settings',
      area: event.area || 'System',
      actor: event.actor || 'admin',
    })),
    ...loginHistory.map((event) => ({
      id: `LOGIN-${event.id}`,
      date: event.date,
      source: 'Users & Roles',
      area: event.action,
      action: event.action,
      actor: event.username || 'system',
      details: `${event.result || ''} · ${event.details || ''}`,
    })),
    ...approvalHistory.map((event) => ({
      id: event.id,
      date: event.date,
      source: 'Approval Management',
      area: event.documentType,
      action: event.action,
      actor: event.actor || 'system',
      details: `${event.reference || ''}${event.comments ? ` · ${event.comments}` : ''}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const search = query.trim().toLowerCase()
  const filtered = events.filter(
    (event) =>
      new Date(event.date).getTime() >= cutoff &&
      (source === 'All sources' || event.source === source) &&
      `${event.action} ${event.actor} ${event.details} ${event.area} ${event.source}`
        .toLowerCase()
        .includes(search),
  )
  const exportCsv = () => {
    const cell = (value) => {
      const text = String(value ?? '')
      const safe = /^[=+\-@]/.test(text) ? `'${text}` : text
      return `"${safe.replaceAll('"', '""')}"`
    }
    const rows = [
      ['Date & time', 'Source', 'Area', 'Action', 'Actor', 'Details'],
      ...filtered.map((event) => [
        approvalDisplayDate(event.date, true),
        event.source,
        event.area,
        event.action,
        userByName.get(event.actor) || event.actor,
        event.details,
      ]),
    ]
    const csv = rows.map((row) => row.map(cell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'system-audit-logs.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  const settingsEvents = events.filter((event) => event.source === 'System Settings').length
  const accessEvents = events.filter((event) => event.source === 'Users & Roles').length
  const approvalEvents = events.filter((event) => event.source === 'Approval Management').length
  const reset = () => {
    setQuery('')
    setSource('All sources')
    setPeriod('30 days')
  }

  return (
    <div className="branch-list-page system-settings-page system-audit-page">
      <SystemSettingsHeader
        title="Audit Logs"
        description="Search a unified, exportable record of configuration, access, and approval activity"
        icon={ClipboardList}
        action={
          <button type="button" className="branch-report-actions-button" onClick={exportCsv}>
            <Download size={15} />
            Export CSV
          </button>
        }
      />
      <section className="system-settings-summary system-audit-summary">
        <article>
          <span className="system-summary-icon green">
            <ClipboardList size={19} />
          </span>
          <div>
            <span>Total events</span>
            <strong>{events.length}</strong>
            <small>Across tracked system modules</small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon blue">
            <Settings size={19} />
          </span>
          <div>
            <span>System settings</span>
            <strong>{settingsEvents}</strong>
            <small>Configuration changes</small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon purple">
            <UserCog size={19} />
          </span>
          <div>
            <span>Access events</span>
            <strong>{accessEvents}</strong>
            <small>User and role activity</small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon amber">
            <ClipboardCheck size={19} />
          </span>
          <div>
            <span>Approval events</span>
            <strong>{approvalEvents}</strong>
            <small>Decisions and workflow changes</small>
          </div>
        </article>
      </section>
      <section className="system-audit-notice">
        <ShieldCheck size={17} />
        <span>
          <b>Audit trail</b>
          <small>
            Events are assembled from the system, account, and approval logs saved in this browser.
          </small>
        </span>
        <button type="button" onClick={() => onNavigate('Login History')}>
          <Clock3 size={14} />
          Login history
          <ArrowRight size={14} />
        </button>
      </section>
      <section className="system-audit-toolbar" aria-label="Filter audit logs">
        <label className="system-audit-search">
          <span>Search audit trail</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Actor, action, module, or details"
            />
          </span>
        </label>
        <label>
          <span>Source module</span>
          <select value={source} onChange={(event) => setSource(event.target.value)}>
            <option>All sources</option>
            <option>System Settings</option>
            <option>Users &amp; Roles</option>
            <option>Approval Management</option>
          </select>
        </label>
        <label>
          <span>Time range</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option>7 days</option>
            <option>30 days</option>
            <option>90 days</option>
            <option>All time</option>
          </select>
        </label>
        <button type="button" className="access-reset" onClick={reset}>
          <RotateCcw size={15} />
          Reset
        </button>
      </section>
      <section className="system-settings-card system-audit-table-card">
        <SystemSettingsCardHeading
          icon={ListRestart}
          title="System activity"
          description={`${filtered.length} of ${events.length} events · newest first`}
          badge="Read only"
        />
        <div className="system-settings-table-wrap">
          <table className="system-settings-table system-audit-table">
            <thead>
              <tr>
                <th>Date &amp; time</th>
                <th>Source / area</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr key={`${event.source}-${event.id}`}>
                  <td>{approvalDisplayDate(event.date, true)}</td>
                  <td>
                    <span className="system-source-cell">
                      <b>{event.source}</b>
                      <small>{event.area}</small>
                    </span>
                  </td>
                  <td>
                    <b>{event.action}</b>
                  </td>
                  <td>
                    <span className="system-actor-cell">
                      <UserRound size={14} />
                      {userByName.get(event.actor) || event.actor}
                    </span>
                  </td>
                  <td className="system-audit-details">{event.details || '—'}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td className="system-empty-cell" colSpan="5">
                    <Search size={20} />
                    No audit events match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="system-settings-card-footer">
          <Info size={15} />
          Showing the combined audit data currently available in the local ERP demo.
        </footer>
      </section>
    </div>
  )
}
