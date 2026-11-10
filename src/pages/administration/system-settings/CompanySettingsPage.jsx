import { useState } from 'react'
import {
  loadCompanySettings,
  companySettingsStorageKey,
  defaultCompanySettings,
  SettingsField,
  approvalDisplayDate,
} from '../../../App.jsx'
import {
  Settings,
  Globe2,
  CalendarDays,
  Hash,
  Bell,
  ShieldCheck,
  Info,
  ArrowRight,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

export default function CompanySettingsPage({ onNotify, onNavigate, systemData }) {
  const [loadedSettings] = useState(loadCompanySettings)
  const [settings, setSettings] = useState(loadedSettings.settings)
  const [activeSection, setActiveSection] = useState('Operations')
  const [error, setError] = useState(loadedSettings.error)
  const [saved, setSaved] = useState(true)
  const flags = settings.flags
  const notifications = settings.notifications
  const security = settings.security
  const activeSystemYear = systemData.financialYears.find((year) => year.status === 'Active')
  const settingTabs = [
    { label: 'Operations', icon: Settings, section: 'general' },
    { label: 'Regional & Localization', icon: Globe2, section: 'regional' },
    { label: 'Financial Year', icon: CalendarDays, section: 'financial' },
    { label: 'Numbering & Codes', icon: Hash, section: 'numbering' },
    { label: 'Notifications', icon: Bell, section: 'notifications' },
    { label: 'Security Preferences', icon: ShieldCheck, section: 'security' },
  ]
  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaved(false)
    setError('')
  }
  const updateGroup = (group, key, value) => {
    setSettings((current) => ({ ...current, [group]: { ...current[group], [key]: value } }))
    setSaved(false)
    setError('')
  }
  const updatePrefix = (index, key, value) => {
    setSettings((current) => ({
      ...current,
      prefixes: current.prefixes.map((prefix, prefixIndex) =>
        prefixIndex === index ? { ...prefix, [key]: value } : prefix,
      ),
    }))
    setSaved(false)
  }
  const saveSettings = (nextSettings = settings, successMessage = 'Company settings saved') => {
    try {
      window.localStorage.setItem(companySettingsStorageKey, JSON.stringify(nextSettings))
      setSettings(nextSettings)
      setSaved(true)
      setError('')
      onNotify(successMessage)
    } catch (saveError) {
      console.error('Unable to save company preferences:', saveError)
      setError(
        'Company settings could not be saved. Check available browser storage and try again.',
      )
    }
  }
  const restoreDefaults = () =>
    saveSettings(defaultCompanySettings, 'Default company settings restored')
  const settingSwitch = (label, checked, onChange) => (
    <label className="settings-switch-row" key={label}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i aria-hidden="true" />
      <Info size={14} aria-hidden="true" />
    </label>
  )
  const settingCheck = (label, checked, onChange) => (
    <label className="settings-check-row" key={label}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
      <Info size={13} aria-hidden="true" />
    </label>
  )
  const operationsSection = (
    <section className="settings-card settings-operations-card">
      <h3>
        <Settings size={17} />
        Core ERP Operations
      </h3>
      <p className="settings-section-description">
        Enable only the workflows your organization uses.
      </p>
      <div className="settings-operations-grid">
        {[
          ['Multi-branch operations', 'multiBranch'],
          ['Department-level organization', 'multiDepartment'],
          ['Approval workflow for transactions', 'approvalWorkflow'],
          ['Allow backdated transactions', 'backdatedTransactions'],
        ].map(([label, key]) =>
          settingSwitch(label, flags[key], (value) => updateGroup('flags', key, value)),
        )}
      </div>
    </section>
  )
  const regionalSection = (
    <section className="settings-card">
      <h3>
        <Globe2 size={16} />
        Regional &amp; Localization
      </h3>
      <div className="settings-card-body">
        <SettingsField label="Default Currency" required>
          <select
            value={settings.currency}
            onChange={(event) => updateSetting('currency', event.target.value)}
          >
            <option>PKR – Pakistan Rupee (₨)</option>
            <option>USD – US Dollar ($)</option>
            <option>EUR – Euro (€)</option>
            <option>INR – Indian Rupee (₹)</option>
          </select>
        </SettingsField>
        <SettingsField label="Date Format" required>
          <select
            value={settings.dateFormat}
            onChange={(event) => updateSetting('dateFormat', event.target.value)}
          >
            <option>DD-MMM-YYYY (26-Nov-2026)</option>
            <option>DD-MM-YYYY (26-11-2026)</option>
            <option>MM/DD/YYYY (11/26/2026)</option>
            <option>YYYY-MM-DD (2026-11-26)</option>
          </select>
        </SettingsField>
        <SettingsField label="Time Zone" required>
          <select
            value={settings.timezone}
            onChange={(event) => updateSetting('timezone', event.target.value)}
          >
            <option>(UTC+05:00) Pakistan Standard Time</option>
            <option>(UTC+00:00) Greenwich Mean Time</option>
            <option>(UTC+04:00) Gulf Standard Time</option>
          </select>
        </SettingsField>
        <SettingsField label="Language" required>
          <select
            value={settings.language}
            onChange={(event) => updateSetting('language', event.target.value)}
          >
            <option>English</option>
            <option>اردو (Urdu)</option>
          </select>
        </SettingsField>
      </div>
    </section>
  )
  const financialSection = (
    <section className="settings-card">
      <h3>
        <CalendarDays size={16} />
        Financial Year
      </h3>
      <div className="system-settings-redirect">
        <span>
          <b>{activeSystemYear?.name || 'No active financial year'}</b>
          <small>
            {activeSystemYear
              ? `${approvalDisplayDate(activeSystemYear.startDate)} – ${approvalDisplayDate(activeSystemYear.endDate)}`
              : 'Set an active period to continue reporting.'}
          </small>
        </span>
        <button type="button" onClick={() => onNavigate('Financial Year')}>
          <CalendarDays size={15} />
          Manage financial years
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  )
  const numberingSection = (
    <section className="settings-card settings-wide-card">
      <h3>
        <Hash size={16} />
        Numbering &amp; Codes (Document Prefixes)
      </h3>
      <div className="settings-table-wrap">
        <table className="settings-number-table">
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Prefix</th>
              <th>Next Sequence</th>
              <th>Reset</th>
            </tr>
          </thead>
          <tbody>
            {systemData.numbering.slice(0, 4).map((item) => (
              <tr key={item.id}>
                <td>{item.documentType}</td>
                <td>{item.prefix}</td>
                <td>{String(item.nextNumber).padStart(item.padding, '0')}</td>
                <td>{item.resetPeriod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="system-settings-card-action">
        <span>Document sequences are managed centrally to prevent duplicate prefixes.</span>
        <button type="button" onClick={() => onNavigate('Document Numbering')}>
          <Hash size={15} />
          Manage numbering
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  )
  const notificationsSection = (
    <section className="settings-card">
      <h3>
        <Bell size={16} />
        Notification Preferences
      </h3>
      <div className="settings-check-list">
        {[
          ['Email Notifications', 'email'],
          ['In-App Notifications (System Alerts)', 'inApp'],
          ['Notify on Approval Requests', 'approvalRequests'],
          ['Notify on Inventory Alerts (Low Stock)', 'inventoryAlerts'],
        ].map(([label, key]) =>
          settingCheck(label, notifications[key], (value) =>
            updateGroup('notifications', key, value),
          ),
        )}
      </div>
    </section>
  )
  const securitySection = (
    <section className="settings-card">
      <h3>
        <ShieldCheck size={16} />
        Security &amp; Access Preferences
      </h3>
      <div className="settings-security-content">
        <div className="settings-fields-column">
          <SettingsField label="Password Policy" required>
            <select
              value={settings.passwordPolicy}
              onChange={(event) => updateSetting('passwordPolicy', event.target.value)}
            >
              <option>Strong (Min 8 chars, A-Z, a-z, 0-9, Special)</option>
              <option>Standard (Min 8 characters)</option>
              <option>Custom policy</option>
            </select>
          </SettingsField>
          <SettingsField label="Password Expiry" required>
            <select
              value={settings.passwordExpiry}
              onChange={(event) => updateSetting('passwordExpiry', event.target.value)}
            >
              <option>30 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
              <option>Never</option>
            </select>
          </SettingsField>
          <SettingsField label="Login Session Timeout" required>
            <select
              value={settings.sessionTimeout}
              onChange={(event) => updateSetting('sessionTimeout', event.target.value)}
            >
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>60 Minutes</option>
            </select>
          </SettingsField>
          <SettingsField label="Max Login Attempts" required>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.maxLoginAttempts}
              onChange={(event) => updateSetting('maxLoginAttempts', event.target.value)}
            />
          </SettingsField>
        </div>
        <div className="settings-check-list">
          {[
            ['Enable Two-Factor Authentication (2FA)', 'twoFactor'],
            ['Restrict Login by IP Address', 'restrictLoginByIp'],
            ['Force Password Change at First Login', 'forcePasswordChange'],
            ['Log User Activities (Audit Trail)', 'userActivityLog'],
          ].map(([label, key]) =>
            settingCheck(label, security[key], (value) => updateGroup('security', key, value)),
          )}
        </div>
      </div>
    </section>
  )
  const sections = {
    general: operationsSection,
    regional: regionalSection,
    financial: financialSection,
    numbering: numberingSection,
    notifications: notificationsSection,
    security: securitySection,
  }
  const sectionForTab = settingTabs.find((tab) => tab.label === activeSection)?.section
  const visibleSections = sectionForTab ? [sectionForTab] : []

  return (
    <div className="company-settings-page">
      <header className="company-settings-heading">
        <div>
          <Settings size={25} />
          <h1>Company Settings</h1>
        </div>
        <span>Manage essential ERP operations and policies</span>
      </header>
      <nav className="company-settings-tabs" aria-label="Company settings sections">
        {settingTabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className={activeSection === label ? 'active' : ''}
            aria-current={activeSection === label ? 'page' : undefined}
            onClick={() => setActiveSection(label)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="company-settings-layout">
        <main className="company-settings-scroll">
          {error && (
            <p className="company-settings-error" role="alert">
              {error}
            </p>
          )}
          <div className="settings-cards-grid">
            {visibleSections.map((section) => (
              <div className={`settings-section-wrapper settings-section-${section}`} key={section}>
                {sections[section]}
              </div>
            ))}
          </div>
        </main>
        <aside className="company-settings-aside">
          <div className="settings-aside-actions">
            <button type="button" className="settings-save-button" onClick={() => saveSettings()}>
              <Save size={18} />
              Save Settings
            </button>
            <button type="button" className="settings-restore-button" onClick={restoreDefaults}>
              <RotateCcw size={18} />
              Restore Defaults
            </button>
          </div>
          <aside className="settings-note">
            <Info size={17} />
            <p>
              <b>Note:</b> These preferences apply company-wide. Save your changes when you are
              done.
            </p>
          </aside>
          <div
            className={`settings-save-status ${saved ? 'is-saved' : 'is-unsaved'}`}
            role="status"
          >
            {saved ? (
              <>
                <CheckCircle2 size={15} />
                All settings saved
              </>
            ) : (
              <>
                <AlertTriangle size={15} />
                Unsaved changes
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
