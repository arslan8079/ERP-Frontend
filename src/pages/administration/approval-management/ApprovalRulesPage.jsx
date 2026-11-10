import { useState } from 'react'
import {
  approvalDocumentTypes,
  ApprovalStatusPill,
  approvalRoleName,
  approvalMoney,
} from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  Workflow,
  ShieldCheck,
  BadgeCheck,
  ClipboardList,
  FileText,
  ChevronRight,
  Plus,
  ArrowRight,
  Power,
  Save,
  Info,
} from 'lucide-react'

export default function ApprovalRulesPage({
  rules,
  roles,
  requests,
  onSaveRule,
  onUpdateRule,
  onNavigate,
}) {
  const [selectedId, setSelectedId] = useState(rules[0]?.id || '')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const selectedRule = rules.find((rule) => rule.id === selectedId) || rules[0]
  const activeRule = creating ? null : selectedRule
  const currentForm =
    form ||
    (activeRule
      ? { ...activeRule }
      : {
          name: '',
          documentType: '',
          approverRoleCode: '',
          escalationAmount: 500000,
          escalationRoleCode: '',
          status: 'Active',
        })
  const usedTypes = new Set(
    rules.filter((rule) => rule.id !== activeRule?.id).map((rule) => rule.documentType),
  )
  const activeApproverRoles = roles.filter(
    (role) => role.status === 'Active' && role.permissions?.Approvals?.approve,
  )
  const beginCreate = () => {
    const documentType =
      approvalDocumentTypes.find((type) => !rules.some((rule) => rule.documentType === type)) || ''
    setCreating(true)
    setForm({
      name: '',
      documentType,
      approverRoleCode: activeApproverRoles[0]?.code || '',
      escalationAmount: 500000,
      escalationRoleCode: '',
      status: 'Active',
    })
    setError('')
  }
  const selectRule = (rule) => {
    setSelectedId(rule.id)
    setCreating(false)
    setForm(null)
    setError('')
  }
  const changeForm = (key, value) => {
    setForm({ ...currentForm, [key]: value })
    setError('')
  }
  const save = (event) => {
    event.preventDefault()
    if (!currentForm.name.trim()) return setError('Enter a name for this approval workflow.')
    if (!currentForm.documentType) return setError('Choose a document type.')
    if (usedTypes.has(currentForm.documentType))
      return setError(`An approval workflow already exists for ${currentForm.documentType}.`)
    if (!activeApproverRoles.some((role) => role.code === currentForm.approverRoleCode))
      return setError('Choose an active role with approval permission.')
    if (
      currentForm.escalationRoleCode &&
      currentForm.escalationRoleCode === currentForm.approverRoleCode
    )
      return setError('The escalation approver must be a different role.')
    if (
      currentForm.escalationRoleCode &&
      (!Number.isFinite(Number(currentForm.escalationAmount)) ||
        Number(currentForm.escalationAmount) < 0)
    )
      return setError('Enter a valid escalation amount.')
    const saved = onSaveRule(
      {
        ...currentForm,
        name: currentForm.name.trim(),
        escalationAmount: currentForm.escalationRoleCode ? Number(currentForm.escalationAmount) : 0,
      },
      activeRule?.id || '',
    )
    if (saved) {
      setSelectedId(saved.id)
      setCreating(false)
      setForm(null)
      setError('')
    }
  }
  const ruleRequestCount = (ruleId) =>
    requests.filter((request) => request.ruleId === ruleId && request.status === 'Pending').length

  return (
    <div className="branch-list-page access-page approval-page approval-rules-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Workflow size={36} />
          <div>
            <h1>Approval Rules</h1>
            <p>Set clear approver routes and escalation thresholds for ERP documents</p>
          </div>
        </div>
        <button
          type="button"
          className="branch-report-actions-button"
          onClick={() => onNavigate('Delegation & Limits')}
        >
          <ShieldCheck size={15} />
          Delegation &amp; limits
        </button>
      </header>
      <section className="approval-summary approval-rule-summary">
        <article>
          <span className="approval-summary-icon blue">
            <Workflow size={19} />
          </span>
          <div>
            <span>Configured workflows</span>
            <strong>{rules.length}</strong>
            <small>One per document type</small>
          </div>
        </article>
        <article>
          <span className="approval-summary-icon green">
            <BadgeCheck size={19} />
          </span>
          <div>
            <span>Active rules</span>
            <strong>{rules.filter((rule) => rule.status === 'Active').length}</strong>
            <small>Routing new submissions</small>
          </div>
        </article>
        <article>
          <span className="approval-summary-icon amber">
            <ClipboardList size={19} />
          </span>
          <div>
            <span>Requests in queue</span>
            <strong>{requests.filter((request) => request.status === 'Pending').length}</strong>
            <small>Existing routes remain unchanged</small>
          </div>
        </article>
      </section>
      <div className="approval-rules-layout">
        <section className="approval-rules-list-card">
          <div className="approval-section-heading">
            <div>
              <span className="approval-heading-icon">
                <Workflow size={17} />
              </span>
              <div>
                <h2>Workflow catalogue</h2>
                <p>Select a document route to configure it.</p>
              </div>
            </div>
          </div>
          <div className="approval-rule-list">
            {rules.map((rule) => (
              <button
                type="button"
                key={rule.id}
                className={`approval-rule-item ${!creating && activeRule?.id === rule.id ? 'selected' : ''}`}
                onClick={() => selectRule(rule)}
              >
                <span className="approval-rule-icon">
                  <FileText size={17} />
                </span>
                <span>
                  <b>{rule.name}</b>
                  <small>{rule.documentType}</small>
                  <span>
                    <i className={`role-status-dot ${rule.status.toLowerCase()}`} />
                    {rule.status} · {ruleRequestCount(rule.id)} pending
                  </span>
                </span>
                <ChevronRight size={15} />
              </button>
            ))}
            {!rules.length && (
              <div className="approval-empty-inline">No approval workflows yet.</div>
            )}
          </div>
          <button
            type="button"
            className="approval-add-rule"
            onClick={beginCreate}
            disabled={
              !approvalDocumentTypes.some(
                (type) => !rules.some((rule) => rule.documentType === type),
              )
            }
          >
            <Plus size={15} />
            Add approval rule
          </button>
        </section>
        <form className="approval-rule-editor" onSubmit={save}>
          <div className="approval-rule-editor-heading">
            <span className="approval-rule-editor-icon">
              <Workflow size={20} />
            </span>
            <div>
              <small>{creating ? 'NEW WORKFLOW' : activeRule?.id || 'WORKFLOW SETUP'}</small>
              <h2>{creating ? 'Create approval rule' : activeRule?.name || 'Select a workflow'}</h2>
              <p>Set the first approver and the amount that triggers escalation.</p>
            </div>
            {activeRule && <ApprovalStatusPill status={activeRule.status} />}
          </div>
          {error && (
            <p className="access-form-error" role="alert">
              {error}
            </p>
          )}
          <div className="approval-rule-fields">
            <label>
              <span>
                Workflow name <b>*</b>
              </span>
              <input
                value={currentForm.name}
                maxLength="80"
                onChange={(event) => changeForm('name', event.target.value)}
                placeholder="e.g. Purchase Order Review"
              />
              <small>Easy to recognize in the administration workflow list.</small>
            </label>
            <label>
              <span>
                ERP document type <b>*</b>
              </span>
              <select
                value={currentForm.documentType}
                onChange={(event) => changeForm('documentType', event.target.value)}
              >
                <option value="">Select a document</option>
                {approvalDocumentTypes
                  .filter((type) => !usedTypes.has(type))
                  .map((type) => (
                    <option key={type}>{type}</option>
                  ))}
              </select>
              <small>Each document type can have one active route.</small>
            </label>
            <label>
              <span>
                First-stage approver <b>*</b>
              </span>
              <select
                value={currentForm.approverRoleCode}
                onChange={(event) => changeForm('approverRoleCode', event.target.value)}
              >
                <option value="">Select an approver role</option>
                {activeApproverRoles.map((role) => (
                  <option key={role.code} value={role.code}>
                    {role.name}
                  </option>
                ))}
              </select>
              <small>Requests start with this role's approval queue.</small>
            </label>
            <label>
              <span>Escalate above (PKR)</span>
              <span className="approval-input-prefix">
                <b>Rs.</b>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  disabled={!currentForm.escalationRoleCode}
                  value={currentForm.escalationAmount}
                  onChange={(event) => changeForm('escalationAmount', event.target.value)}
                />
              </span>
              <small>Values above this amount need another approval stage.</small>
            </label>
            <label className="approval-field-full">
              <span>Second-stage approver</span>
              <select
                value={currentForm.escalationRoleCode}
                onChange={(event) => changeForm('escalationRoleCode', event.target.value)}
              >
                <option value="">No second-stage escalation</option>
                {activeApproverRoles
                  .filter((role) => role.code !== currentForm.approverRoleCode)
                  .map((role) => (
                    <option key={role.code} value={role.code}>
                      {role.name}
                    </option>
                  ))}
              </select>
              <small>
                Optional. If set, larger requests advance here after the first approval.
              </small>
            </label>
          </div>
          <div className="approval-route-preview">
            <span>
              <Workflow size={15} />
              ROUTING PREVIEW
            </span>
            <div>
              <b>{currentForm.documentType || 'Document type'}</b>
              <ArrowRight size={14} />
              <b>{approvalRoleName(currentForm.approverRoleCode, roles)}</b>
              {currentForm.escalationRoleCode && (
                <>
                  <ArrowRight size={14} />
                  <small>Above {approvalMoney(currentForm.escalationAmount)}</small>
                  <ArrowRight size={14} />
                  <b>{approvalRoleName(currentForm.escalationRoleCode, roles)}</b>
                </>
              )}
            </div>
          </div>
          <div className="approval-rule-editor-footer">
            <span>
              {activeRule
                ? `${ruleRequestCount(activeRule.id)} pending request${ruleRequestCount(activeRule.id) === 1 ? '' : 's'} use this workflow.`
                : 'New requests only · existing requests retain their assigned route.'}
            </span>
            <div>
              {activeRule && (
                <button
                  type="button"
                  className="approval-rule-toggle"
                  onClick={() =>
                    onUpdateRule(activeRule.id, {
                      status: activeRule.status === 'Active' ? 'Inactive' : 'Active',
                    })
                  }
                >
                  <Power size={14} />
                  {activeRule.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              )}
              <button type="submit" className="branch-save-button">
                <Save size={15} />
                {creating ? 'Create rule' : 'Save workflow'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="access-notice">
        <Info size={15} />
        Deactivating a rule stops routing future submissions; requests already in the queue keep
        their current route.
      </div>
    </div>
  )
}
