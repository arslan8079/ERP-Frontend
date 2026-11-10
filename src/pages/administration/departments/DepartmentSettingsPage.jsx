import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import {
  Settings,
  ClipboardCheck,
  ShieldCheck,
  Info,
  CheckCircle2,
  RotateCcw,
  Save,
} from 'lucide-react'

export default function DepartmentSettingsPage({
  departments,
  onUpdateDepartment,
  onNotify,
  selectedDepartmentCode,
}) {
  const [departmentCode, setDepartmentCode] = useState(
    selectedDepartmentCode || departments[0]?.code || '',
  )
  const [section, setSection] = useState('Operations')
  const department = departments.find((item) => item.code === departmentCode)
  const settings = department?.settings || {
    approvalRequired: true,
    approvalLimit: '250000',
    restrictBranchData: true,
    emailNotifications: true,
  }
  const update = (key, value) =>
    onUpdateDepartment(departmentCode, { settings: { ...settings, [key]: value } })
  const settingRow = (title, description, key) => (
    <label className="department-setting-option" key={key}>
      <span>
        <b>{title}</b>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={Boolean(settings[key])}
        onChange={(event) => update(key, event.target.checked)}
      />
    </label>
  )
  const saveSettings = () => onNotify(`${department?.name || 'Department'} settings saved`)
  const restoreDefaults = () => {
    if (!department) return
    onUpdateDepartment(departmentCode, {
      settings: {
        approvalRequired: true,
        approvalLimit: '250000',
        restrictBranchData: true,
        emailNotifications: true,
      },
    })
    onNotify('Department settings restored to defaults')
  }
  return (
    <div className="branch-list-page department-page department-settings-page">
      <header className="branch-list-banner department-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Settings size={35} />
          <div>
            <h1>Department Settings</h1>
            <p>Configure approvals, access, and notifications</p>
          </div>
        </div>
        <label className="department-settings-select">
          <span>Department</span>
          <select
            value={departmentCode}
            onChange={(event) => setDepartmentCode(event.target.value)}
          >
            {departments.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <nav className="department-settings-tabs" aria-label="Department setting sections">
        {['Operations', 'Access & notifications'].map((item) => (
          <button
            type="button"
            className={section === item ? 'active' : ''}
            key={item}
            onClick={() => setSection(item)}
          >
            {item === 'Operations' ? <ClipboardCheck size={16} /> : <ShieldCheck size={16} />}
            {item}
          </button>
        ))}
      </nav>
      <div className="department-settings-content">
        {section === 'Operations' ? (
          <section className="department-settings-card">
            <h2>
              <ClipboardCheck size={17} />
              Approval rules
            </h2>
            <p>Set the review requirements applied to this department's transactions.</p>
            <label className="department-settings-budget">
              <span>Approval threshold (PKR)</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={settings.approvalLimit}
                onChange={(event) => update('approvalLimit', event.target.value)}
              />
            </label>
            {settingRow(
              'Require approval for transactions',
              'Route transactions above the threshold to an authorized approver.',
              'approvalRequired',
            )}
          </section>
        ) : (
          <section className="department-settings-card">
            <h2>
              <ShieldCheck size={17} />
              Access & notifications
            </h2>
            <p>Choose department data visibility and alert preferences.</p>
            {settingRow(
              'Restrict records to assigned branch',
              'Limit this department view to its selected branch records.',
              'restrictBranchData',
            )}
            {settingRow(
              'Email notifications',
              'Send department workflow and approval alerts to the team.',
              'emailNotifications',
            )}
          </section>
        )}
        <aside className="department-settings-aside">
          <Info size={18} />
          <div>
            <b>{department?.name || 'Department'} settings</b>
            <p>
              These preferences apply to this department. Company-wide security and approval
              policies still take precedence.
            </p>
          </div>
        </aside>
      </div>
      <footer className="branch-settings-footer">
        <span className="saved">
          <CheckCircle2 size={15} />
          Changes saved automatically
        </span>
        <div>
          <button type="button" onClick={restoreDefaults}>
            <RotateCcw size={15} />
            Restore Defaults
          </button>
          <button type="button" className="branch-save-button" onClick={saveSettings}>
            <Save size={15} />
            Done
          </button>
        </div>
      </footer>
    </div>
  )
}
