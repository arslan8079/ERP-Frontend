import { useState } from 'react'
import {
  SystemSettingsHeader,
  SystemSettingsCardHeading,
  SystemSettingsField,
  systemLandingPages,
  SystemSettingsToggle,
} from '../../../App.jsx'
import {
  Settings,
  Globe2,
  LayoutDashboard,
  ListRestart,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Save,
  Info,
} from 'lucide-react'

export default function SystemGeneralSettingsPage({ settings, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...settings }))
  const [error, setError] = useState('')
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(settings))
  const isDirty = JSON.stringify(draft) !== savedSnapshot
  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError('')
  }
  const submit = (event) => {
    event.preventDefault()
    if (!draft.systemName.trim()) return setError('Enter a system display name.')
    if (
      !Number.isInteger(Number(draft.recordsPerPage)) ||
      Number(draft.recordsPerPage) < 10 ||
      Number(draft.recordsPerPage) > 100
    ) {
      return setError('Records per page must be between 10 and 100.')
    }
    const savedSettings = {
      ...draft,
      systemName: draft.systemName.trim(),
      recordsPerPage: Number(draft.recordsPerPage),
    }
    if (onSave(savedSettings)) {
      setDraft(savedSettings)
      setSavedSnapshot(JSON.stringify(savedSettings))
      setError('')
    }
  }

  return (
    <div className="branch-list-page system-settings-page">
      <SystemSettingsHeader
        title="General Settings"
        description="Configure shared defaults, regional preferences, and system notifications"
        icon={Settings}
      />
      <section className="system-settings-summary">
        <article>
          <span className="system-summary-icon green">
            <Globe2 size={19} />
          </span>
          <div>
            <span>Regional profile</span>
            <strong>{draft.timezone === 'Asia/Karachi' ? 'Pakistan' : draft.timezone}</strong>
            <small>
              {draft.baseCurrency} · {draft.dateFormat}
            </small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon blue">
            <LayoutDashboard size={19} />
          </span>
          <div>
            <span>Default landing page</span>
            <strong>{draft.defaultLandingPage}</strong>
            <small>Shown after opening the ERP</small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon purple">
            <ListRestart size={19} />
          </span>
          <div>
            <span>List page size preference</span>
            <strong>{draft.recordsPerPage}</strong>
            <small>Saved default for pageable views</small>
          </div>
        </article>
      </section>
      <form className="system-settings-form" onSubmit={submit}>
        <section className="system-settings-card">
          <SystemSettingsCardHeading
            icon={Settings}
            title="System defaults"
            description="Set the organization-wide presentation and working defaults."
          />
          <div className="system-settings-fields">
            <SystemSettingsField
              label="System display name"
              hint="Used in system setup screens and notices."
            >
              <input
                required
                maxLength="60"
                value={draft.systemName}
                onChange={(event) => update('systemName', event.target.value)}
              />
            </SystemSettingsField>
            <SystemSettingsField
              label="Default landing page"
              hint="Opens when the application is next launched."
            >
              <select
                value={draft.defaultLandingPage}
                onChange={(event) => update('defaultLandingPage', event.target.value)}
              >
                {systemLandingPages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </SystemSettingsField>
            <SystemSettingsField
              label="Preferred currency"
              hint="Organization default for upcoming financial workflows."
            >
              <select
                value={draft.baseCurrency}
                onChange={(event) => update('baseCurrency', event.target.value)}
              >
                <option value="PKR">PKR · Pakistani Rupee</option>
                <option value="USD">USD · US Dollar</option>
                <option value="EUR">EUR · Euro</option>
                <option value="AED">AED · UAE Dirham</option>
              </select>
            </SystemSettingsField>
            <SystemSettingsField
              label="Time zone"
              hint="Organization time-zone preference for future system workflows."
            >
              <select
                value={draft.timezone}
                onChange={(event) => update('timezone', event.target.value)}
              >
                <option value="Asia/Karachi">Asia/Karachi · UTC+05:00</option>
                <option value="Asia/Dubai">Asia/Dubai · UTC+04:00</option>
                <option value="UTC">UTC · UTC+00:00</option>
              </select>
            </SystemSettingsField>
            <SystemSettingsField
              label="Date format"
              hint="Preferred display for future reports and exports."
            >
              <select
                value={draft.dateFormat}
                onChange={(event) => update('dateFormat', event.target.value)}
              >
                <option>DD MMM YYYY</option>
                <option>DD-MM-YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </SystemSettingsField>
            <SystemSettingsField label="Time format">
              <select
                value={draft.timeFormat}
                onChange={(event) => update('timeFormat', event.target.value)}
              >
                <option>24-hour</option>
                <option>12-hour</option>
              </select>
            </SystemSettingsField>
            <SystemSettingsField
              label="Default list page size"
              hint="Saved preference for pageable views (10–100 rows)."
            >
              <input
                type="number"
                min="10"
                max="100"
                step="5"
                value={draft.recordsPerPage}
                onChange={(event) => update('recordsPerPage', event.target.value)}
              />
            </SystemSettingsField>
          </div>
        </section>
        <section className="system-settings-card">
          <SystemSettingsCardHeading
            icon={Bell}
            title="Notification defaults"
            description="Choose which application events should surface in the administration workspace."
          />
          <div className="system-settings-toggle-grid">
            <SystemSettingsToggle
              label="In-app notifications"
              description="Preference for system notices and configuration updates."
              checked={draft.inAppNotifications}
              onChange={(value) => update('inAppNotifications', value)}
            />
            <SystemSettingsToggle
              label="Email notifications"
              description="Preference for email delivery when a mail service is connected."
              checked={draft.emailNotifications}
              onChange={(value) => update('emailNotifications', value)}
            />
            <SystemSettingsToggle
              label="Approval requests"
              description="Preferred notification setting for approval queue activity."
              checked={draft.approvalNotifications}
              onChange={(value) => update('approvalNotifications', value)}
            />
            <SystemSettingsToggle
              label="Inventory alerts"
              description="Preferred notification setting for stock exceptions."
              checked={draft.inventoryNotifications}
              onChange={(value) => update('inventoryNotifications', value)}
            />
          </div>
        </section>
        <div className="system-settings-form-footer">
          <span className={isDirty ? 'unsaved' : 'saved'}>
            {isDirty ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
            {isDirty ? 'Unsaved changes' : 'All settings saved'}
          </span>
          {error && (
            <span className="system-settings-error" role="alert">
              {error}
            </span>
          )}
          <button type="submit" className="branch-save-button" disabled={!isDirty}>
            <Save size={16} />
            Save system settings
          </button>
        </div>
      </form>
      <p className="system-settings-local-note">
        <Info size={15} />
        Settings are saved in this browser in the current demo. Server-wide enforcement requires the
        ERP backend.
      </p>
    </div>
  )
}
