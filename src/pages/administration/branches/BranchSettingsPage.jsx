import { useState } from 'react'
import {
  loadBranchSettings,
  defaultBranchSettings,
  branchSettingsStorageKey,
} from '../../../App.jsx'
import {
  Settings,
  Warehouse,
  FileText,
  Bell,
  ShieldCheck,
  Building2,
  Info,
  Globe2,
  ClipboardCheck,
  Hash,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCcw,
  Save,
} from 'lucide-react'
import fieldBanner from '../../../field-banner.svg'

export default function BranchSettingsPage({ branches, onNotify }) {
  const [loadedSettings] = useState(loadBranchSettings)
  const [settingsByBranch, setSettingsByBranch] = useState(loadedSettings.settings)
  const [savedSettingsByBranch, setSavedSettingsByBranch] = useState(loadedSettings.settings)
  const [branchCode, setBranchCode] = useState(branches[0]?.code || '')
  const [activeSection, setActiveSection] = useState('General')
  const [error, setError] = useState(loadedSettings.error)
  const currentSettings = settingsByBranch[branchCode] || defaultBranchSettings
  const savedSettings = savedSettingsByBranch[branchCode] || defaultBranchSettings
  const isDirty = JSON.stringify(currentSettings) !== JSON.stringify(savedSettings)
  const branch = branches.find((item) => item.code === branchCode)
  const sections = [
    { label: 'General', icon: Settings },
    { label: 'Operations', icon: Warehouse },
    { label: 'Transactions', icon: FileText },
    { label: 'Notifications', icon: Bell },
    { label: 'Access & Security', icon: ShieldCheck },
  ]

  const updateSetting = (key, value) => {
    setSettingsByBranch((current) => ({
      ...current,
      [branchCode]: { ...(current[branchCode] || defaultBranchSettings), [key]: value },
    }))
    setError('')
  }
  const updateGroup = (group, key, value) => {
    setSettingsByBranch((current) => {
      const currentSettingsForBranch = current[branchCode] || defaultBranchSettings
      return {
        ...current,
        [branchCode]: {
          ...currentSettingsForBranch,
          [group]: { ...currentSettingsForBranch[group], [key]: value },
        },
      }
    })
    setError('')
  }
  const saveSettings = () => {
    const nextSavedSettings = { ...settingsByBranch, [branchCode]: currentSettings }
    try {
      window.localStorage.setItem(branchSettingsStorageKey, JSON.stringify(nextSavedSettings))
      setSettingsByBranch(nextSavedSettings)
      setSavedSettingsByBranch(nextSavedSettings)
      setError('')
      onNotify(`${branch?.name || 'Branch'} settings saved`)
    } catch (saveError) {
      console.error('Unable to save branch settings:', saveError)
      setError('Branch settings could not be saved. Check available browser storage and try again.')
    }
  }
  const restoreDefaults = () => {
    const nextSettings = { ...settingsByBranch, [branchCode]: defaultBranchSettings }
    try {
      window.localStorage.setItem(branchSettingsStorageKey, JSON.stringify(nextSettings))
      setSettingsByBranch(nextSettings)
      setSavedSettingsByBranch(nextSettings)
      setError('')
      onNotify('Branch settings restored to defaults')
    } catch (restoreError) {
      console.error('Unable to restore branch settings:', restoreError)
      setError(
        'Default branch settings could not be restored. Check available browser storage and try again.',
      )
    }
  }
  const settingCheck = (label, checked, onChange, description) => (
    <label className="branch-setting-check" key={label}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <b>{label}</b>
        <small>{description}</small>
      </span>
    </label>
  )

  const sectionContent = {
    General: (
      <div className="branch-settings-grid">
        <section className="branch-setting-card">
          <h2>
            <Building2 size={17} />
            Branch profile
          </h2>
          <div className="branch-setting-fields">
            <label>
              <span>Branch</span>
              <input value={branch?.name || 'No branch available'} readOnly />
            </label>
            <label>
              <span>Branch code</span>
              <input value={branchCode} readOnly />
            </label>
            <label>
              <span>Branch manager</span>
              <input value={branch?.manager || 'Not assigned'} readOnly />
            </label>
            <label>
              <span>Branch status</span>
              <input value={branch?.status || 'Unavailable'} readOnly />
            </label>
          </div>
          <p className="branch-setting-hint">
            <Info size={14} />
            Update branch identity and contact information from Create Branch or Branch Details.
          </p>
        </section>
        <section className="branch-setting-card">
          <h2>
            <Globe2 size={17} />
            Regional preferences
          </h2>
          <div className="branch-setting-fields">
            <label>
              <span>Branch currency</span>
              <select
                value={currentSettings.currency}
                onChange={(event) => updateSetting('currency', event.target.value)}
              >
                <option>PKR – Pakistan Rupee (₨)</option>
                <option>USD – US Dollar ($)</option>
                <option>EUR – Euro (€)</option>
                <option>INR – Indian Rupee (₹)</option>
              </select>
            </label>
            <label>
              <span>Date format</span>
              <select
                value={currentSettings.dateFormat}
                onChange={(event) => updateSetting('dateFormat', event.target.value)}
              >
                <option>DD-MMM-YYYY (26-Nov-2026)</option>
                <option>DD-MM-YYYY (26-11-2026)</option>
                <option>MM/DD/YYYY (11/26/2026)</option>
                <option>YYYY-MM-DD (2026-11-26)</option>
              </select>
            </label>
            <label>
              <span>Time zone</span>
              <select
                value={currentSettings.timezone}
                onChange={(event) => updateSetting('timezone', event.target.value)}
              >
                <option>(UTC+05:00) Pakistan Standard Time</option>
                <option>(UTC+00:00) Greenwich Mean Time</option>
                <option>(UTC+04:00) Gulf Standard Time</option>
              </select>
            </label>
            <label>
              <span>Working hours</span>
              <input
                value={currentSettings.workingHours}
                onChange={(event) => updateSetting('workingHours', event.target.value)}
              />
            </label>
            <label>
              <span>Working days</span>
              <select
                value={currentSettings.workingDays}
                onChange={(event) => updateSetting('workingDays', event.target.value)}
              >
                <option>Monday – Saturday</option>
                <option>Monday – Friday</option>
                <option>Sunday – Thursday</option>
              </select>
            </label>
          </div>
        </section>
      </div>
    ),
    Operations: (
      <div className="branch-settings-grid">
        <section className="branch-setting-card branch-setting-wide">
          <h2>
            <Warehouse size={17} />
            Enabled branch operations
          </h2>
          <p className="branch-setting-description">
            Choose which workflows are available to users working in this branch.
          </p>
          <div className="branch-setting-check-grid">
            {[
              [
                'Sales & dealer orders',
                'sales',
                'Allow branch users to create and process sales orders.',
              ],
              ['Purchasing', 'purchasing', 'Allow purchase requests and purchase orders.'],
              [
                'Inventory & warehouse',
                'inventory',
                'Enable stock receipts, transfers, and adjustments.',
              ],
              [
                'Production',
                'production',
                'Allow production planning and manufacturing transactions.',
              ],
              [
                'Require transaction approvals',
                'requireApproval',
                'Send eligible transactions to the configured approver.',
              ],
              [
                'Allow negative stock',
                'negativeStock',
                'Permit dispatch when available stock is insufficient.',
              ],
            ].map(([label, key, description]) =>
              settingCheck(
                label,
                currentSettings.operations[key],
                (value) => updateGroup('operations', key, value),
                description,
              ),
            )}
          </div>
        </section>
        <aside className="branch-setting-callout">
          <Info size={18} />
          <div>
            <b>Branch-only controls</b>
            <p>
              These workflow preferences apply to {branch?.name || 'this branch'} and do not change
              company-wide settings.
            </p>
          </div>
        </aside>
      </div>
    ),
    Transactions: (
      <div className="branch-settings-grid">
        <section className="branch-setting-card">
          <h2>
            <ClipboardCheck size={17} />
            Approval rules
          </h2>
          <div className="branch-setting-fields">
            <label>
              <span>Approval threshold (PKR)</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={currentSettings.approvalLimit}
                onChange={(event) => updateSetting('approvalLimit', event.target.value)}
              />
            </label>
            <label>
              <span>Default approver role</span>
              <select
                value={currentSettings.approvalRole}
                onChange={(event) => updateSetting('approvalRole', event.target.value)}
              >
                <option>Branch Manager</option>
                <option>Finance Manager</option>
                <option>Operations Manager</option>
                <option>Company Administrator</option>
              </select>
            </label>
          </div>
          <p className="branch-setting-hint">
            <Info size={14} />
            Transactions above the threshold require approval before posting.
          </p>
        </section>
        <section className="branch-setting-card">
          <h2>
            <Hash size={17} />
            Branch document numbering
          </h2>
          <div className="branch-setting-fields">
            <label>
              <span>Sales order prefix</span>
              <input
                maxLength="8"
                value={currentSettings.prefixes.sales}
                onChange={(event) =>
                  updateGroup('prefixes', 'sales', event.target.value.toUpperCase())
                }
              />
            </label>
            <label>
              <span>Purchase order prefix</span>
              <input
                maxLength="8"
                value={currentSettings.prefixes.purchase}
                onChange={(event) =>
                  updateGroup('prefixes', 'purchase', event.target.value.toUpperCase())
                }
              />
            </label>
            <label>
              <span>Inventory receipt prefix</span>
              <input
                maxLength="8"
                value={currentSettings.prefixes.inventory}
                onChange={(event) =>
                  updateGroup('prefixes', 'inventory', event.target.value.toUpperCase())
                }
              />
            </label>
            <label className="branch-setting-inline-check">
              <input
                type="checkbox"
                checked={currentSettings.resetNumberingYearly}
                onChange={(event) => updateSetting('resetNumberingYearly', event.target.checked)}
              />
              <span>Reset sequence every financial year</span>
            </label>
          </div>
          <p className="branch-setting-hint">
            <Info size={14} />
            Branch codes are added to generated document numbers automatically.
          </p>
        </section>
      </div>
    ),
    Notifications: (
      <div className="branch-settings-grid">
        <section className="branch-setting-card branch-setting-wide">
          <h2>
            <Bell size={17} />
            Branch notifications
          </h2>
          <p className="branch-setting-description">
            Choose which alerts are sent to this branch’s team.
          </p>
          <div className="branch-setting-check-grid">
            {[
              [
                'Email notifications',
                'email',
                'Send branch alerts to configured email recipients.',
              ],
              ['In-app notifications', 'inApp', 'Show alerts in the ERP notification center.'],
              [
                'Low stock alerts',
                'lowStock',
                'Notify branch users when inventory falls below reorder level.',
              ],
              [
                'Approval request alerts',
                'approvalRequests',
                'Notify approvers when a transaction needs review.',
              ],
            ].map(([label, key, description]) =>
              settingCheck(
                label,
                currentSettings.notifications[key],
                (value) => updateGroup('notifications', key, value),
                description,
              ),
            )}
          </div>
        </section>
        <aside className="branch-setting-callout">
          <Bell size={18} />
          <div>
            <b>Notification recipients</b>
            <p>
              Branch alerts are delivered to the branch manager and users assigned to this branch.
            </p>
          </div>
        </aside>
      </div>
    ),
    'Access & Security': (
      <div className="branch-settings-grid">
        <section className="branch-setting-card branch-setting-wide">
          <h2>
            <ShieldCheck size={17} />
            Branch access controls
          </h2>
          <p className="branch-setting-description">
            Control how users access branch data and sensitive actions.
          </p>
          <div className="branch-setting-check-grid">
            {[
              [
                'Restrict users to assigned branch',
                'restrictToBranch',
                'Users see only the branch records assigned to their profile.',
              ],
              [
                'Allow cross-branch read access',
                'crossBranchView',
                'Permit authorized users to view records from other branches.',
              ],
              [
                'Allow branch manager to approve',
                'managerCanApprove',
                'Branch manager can approve eligible branch transactions.',
              ],
              [
                'Record branch activity log',
                'activityLog',
                'Keep an audit trail of branch actions and configuration changes.',
              ],
            ].map(([label, key, description]) =>
              settingCheck(
                label,
                currentSettings.access[key],
                (value) => updateGroup('access', key, value),
                description,
              ),
            )}
          </div>
        </section>
        <aside className="branch-setting-callout">
          <ShieldCheck size={18} />
          <div>
            <b>Company security still applies</b>
            <p>
              These options supplement company access policies; they do not override company-level
              security rules.
            </p>
          </div>
        </aside>
      </div>
    ),
  }

  return (
    <div className="branch-list-page branch-settings-page">
      <header className="branch-list-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Settings size={36} />
          <div>
            <h1>Branch Settings</h1>
            <p>Configure branch operations and policies</p>
          </div>
        </div>
        <label className="branch-settings-selector">
          <span>Branch</span>
          <select
            aria-label="Settings branch"
            value={branchCode}
            onChange={(event) => setBranchCode(event.target.value)}
          >
            {branches.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      {error && (
        <div className="branch-settings-error" role="alert">
          {error}
        </div>
      )}
      <nav className="branch-settings-tabs" aria-label="Branch settings sections">
        {sections.map(({ label, icon: Icon }) => (
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
      <div className="branch-settings-body">{sectionContent[activeSection]}</div>
      <footer className="branch-settings-footer">
        <span className={isDirty ? 'unsaved' : 'saved'} role="status">
          {isDirty ? (
            <>
              <AlertTriangle size={15} />
              Unsaved changes
            </>
          ) : (
            <>
              <CheckCircle2 size={15} />
              All settings saved
            </>
          )}
        </span>
        <div>
          <button
            type="button"
            className="branch-cancel-button"
            disabled={!isDirty}
            onClick={() =>
              setSettingsByBranch((current) => ({ ...current, [branchCode]: savedSettings }))
            }
          >
            <X size={15} />
            Discard
          </button>
          <button type="button" className="branch-settings-restore" onClick={restoreDefaults}>
            <RotateCcw size={15} />
            Restore Defaults
          </button>
          <button
            type="button"
            className="branch-save-button"
            disabled={!isDirty || !branch}
            onClick={saveSettings}
          >
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </footer>
    </div>
  )
}
