import { useState } from 'react'
import {
  SystemSettingsHeader,
  approvalDisplayDate,
  SystemSettingsCardHeading,
  SystemSettingsField,
  SystemStatusPill,
} from '../../../App.jsx'
import {
  CalendarDays,
  Plus,
  Clock3,
  Archive,
  Save,
  Check,
  LockKeyhole,
  ShieldCheck,
  Info,
} from 'lucide-react'

export default function FinancialYearPage({ years, onCreate, onUpdateStatus }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' })
  const [error, setError] = useState('')
  const activeYear = years.find((year) => year.status === 'Active')
  const plannedCount = years.filter((year) => year.status === 'Planned').length
  const closedCount = years.filter((year) => year.status === 'Closed').length
  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) return setError('Enter a financial year label.')
    if (!form.startDate || !form.endDate || form.endDate <= form.startDate)
      return setError('The end date must be after the start date.')
    if (years.some((year) => year.name.toLowerCase() === form.name.trim().toLowerCase()))
      return setError('A financial year with this label already exists.')
    if (years.some((year) => form.startDate <= year.endDate && form.endDate >= year.startDate))
      return setError('This date range overlaps an existing financial year.')
    if (onCreate({ ...form, name: form.name.trim() })) {
      setForm({ name: '', startDate: '', endDate: '' })
      setShowForm(false)
      setError('')
    }
  }
  const activate = (year) => {
    if (!activeYear && window.confirm(`Activate ${year.name} as the current financial year?`))
      onUpdateStatus(year.id, 'Active')
  }
  const close = (year) => {
    if (window.confirm(`Close ${year.name}? Closed financial years cannot be reopened.`))
      onUpdateStatus(year.id, 'Closed')
  }

  return (
    <div className="branch-list-page system-settings-page">
      <SystemSettingsHeader
        title="Financial Year"
        description="Schedule accounting periods, control the active year, and preserve closed-period history"
        icon={CalendarDays}
        action={
          <button
            type="button"
            className="branch-report-actions-button"
            onClick={() => {
              setShowForm((value) => !value)
              setError('')
            }}
          >
            <Plus size={15} />
            New financial year
          </button>
        }
      />
      <section className="system-settings-summary">
        <article>
          <span className="system-summary-icon green">
            <CalendarDays size={19} />
          </span>
          <div>
            <span>Current period</span>
            <strong>{activeYear?.name || 'Not set'}</strong>
            <small>
              {activeYear
                ? `${approvalDisplayDate(activeYear.startDate)} – ${approvalDisplayDate(activeYear.endDate)}`
                : 'Activate a planned period'}
            </small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon blue">
            <Clock3 size={19} />
          </span>
          <div>
            <span>Upcoming periods</span>
            <strong>{plannedCount}</strong>
            <small>Prepared for future close</small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon purple">
            <Archive size={19} />
          </span>
          <div>
            <span>Closed periods</span>
            <strong>{closedCount}</strong>
            <small>Read-only historical years</small>
          </div>
        </article>
      </section>
      {showForm && (
        <section className="system-settings-card system-year-create-card">
          <SystemSettingsCardHeading
            icon={CalendarDays}
            title="Schedule a financial year"
            description="Periods cannot overlap. New periods begin in planned status until activated."
          />
          <form className="system-year-form" onSubmit={submit}>
            <SystemSettingsField label="Financial year label">
              <input
                required
                maxLength="40"
                placeholder="e.g. FY 2028–29"
                value={form.name}
                onChange={(event) => {
                  setForm({ ...form, name: event.target.value })
                  setError('')
                }}
              />
            </SystemSettingsField>
            <SystemSettingsField label="Start date">
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(event) => {
                  setForm({ ...form, startDate: event.target.value })
                  setError('')
                }}
              />
            </SystemSettingsField>
            <SystemSettingsField label="End date">
              <input
                type="date"
                required
                min={form.startDate || undefined}
                value={form.endDate}
                onChange={(event) => {
                  setForm({ ...form, endDate: event.target.value })
                  setError('')
                }}
              />
            </SystemSettingsField>
            <button type="submit" className="branch-save-button">
              <Save size={15} />
              Create planned year
            </button>
          </form>
          {error && (
            <p className="system-settings-error" role="alert">
              {error}
            </p>
          )}
        </section>
      )}
      <section className="system-settings-card system-year-list-card">
        <SystemSettingsCardHeading
          icon={CalendarDays}
          title="Financial year register"
          description="Only one period can be active. A year can be closed after its end date."
          badge={`${years.length} periods`}
        />
        <div className="system-settings-table-wrap">
          <table className="system-settings-table financial-year-table">
            <thead>
              <tr>
                <th>Financial year</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year) => (
                <tr key={year.id} className={year.status === 'Active' ? 'current-row' : ''}>
                  <td>
                    <span className="system-primary-cell">
                      <b>{year.name}</b>
                      <small>{year.id}</small>
                    </span>
                  </td>
                  <td>{approvalDisplayDate(year.startDate)}</td>
                  <td>{approvalDisplayDate(year.endDate)}</td>
                  <td>
                    <SystemStatusPill status={year.status} />
                  </td>
                  <td>
                    <div className="system-row-actions">
                      {year.status === 'Planned' && (
                        <button
                          type="button"
                          className="system-action-button activate"
                          disabled={Boolean(activeYear)}
                          title={
                            activeYear
                              ? 'Close the active financial year before activating this period'
                              : 'Activate this period'
                          }
                          onClick={() => activate(year)}
                        >
                          <Check size={14} />
                          Activate
                        </button>
                      )}
                      {year.status === 'Active' && (
                        <button
                          type="button"
                          className="system-action-button close"
                          disabled={new Date(`${year.endDate}T23:59:59`) > new Date()}
                          title={
                            new Date(`${year.endDate}T23:59:59`) > new Date()
                              ? 'This financial year has not ended yet'
                              : 'Close this period'
                          }
                          onClick={() => close(year)}
                        >
                          <LockKeyhole size={14} />
                          Close period
                        </button>
                      )}
                      {year.status === 'Closed' && (
                        <span className="system-retained-note">
                          <ShieldCheck size={14} />
                          Read only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!years.length && (
                <tr>
                  <td className="system-empty-cell" colSpan="5">
                    No financial years are configured. Create a planned period to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="system-settings-card-footer">
          <Info size={15} />
          Closing a period preserves its history and prevents it from being reactivated.
        </footer>
      </section>
    </div>
  )
}
