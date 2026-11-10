import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import {
  Users,
  UserRound,
  ShieldCheck,
  Plus,
  CalendarDays,
  X,
  CreditCard,
  Save,
  Info,
} from 'lucide-react'
import {
  userRoleName,
  approvalDocumentTypes,
  approvalDisplayDate,
  ApprovalStatusPill,
  approvalMoney,
} from '../../../App.jsx'

export default function DelegationLimitsPage({
  delegations,
  roleLimits,
  users,
  roles,
  onCreateDelegation,
  onRevokeDelegation,
  onSaveApprovalLimit,
}) {
  const today = new Date().toISOString().slice(0, 10)
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  const [form, setForm] = useState({
    delegatorId: '',
    delegateId: '',
    startDate: today,
    endDate: nextWeek,
    documentType: 'All documents',
  })
  const [error, setError] = useState('')
  const [limitDrafts, setLimitDrafts] = useState({})
  const canApproveUsers = users.filter(
    (user) =>
      user.status === 'Active' &&
      roles.find((role) => role.code === user.roleCode)?.permissions?.Approvals?.approve,
  )
  const approvalRoles = roles.filter(
    (role) => role.status === 'Active' && role.permissions?.Approvals?.approve,
  )
  const activeDelegations = delegations.filter(
    (item) => item.status === 'Active' && item.startDate <= today && item.endDate >= today,
  )
  const overlapping = (candidate, existing) => {
    const overlapsDates =
      candidate.startDate <= existing.endDate && candidate.endDate >= existing.startDate
    const overlapsTypes =
      candidate.documentType === 'All documents' ||
      existing.documentTypes.includes('All documents') ||
      existing.documentTypes.includes(candidate.documentType)
    return (
      existing.status === 'Active' &&
      existing.delegatorId === candidate.delegatorId &&
      overlapsDates &&
      overlapsTypes
    )
  }
  const submitDelegation = (event) => {
    event.preventDefault()
    const owner = users.find((user) => user.id === form.delegatorId)
    const delegate = users.find((user) => user.id === form.delegateId)
    if (!owner || !delegate) return setError('Choose both the approver and their delegate.')
    if (owner.id === delegate.id)
      return setError('An approver cannot delegate decisions to themselves.')
    if (form.startDate < today || form.endDate < form.startDate)
      return setError('Choose a valid date range starting today or later.')
    if (!roles.find((role) => role.code === delegate.roleCode)?.permissions?.Approvals?.approve)
      return setError('The selected delegate does not have approval permission.')
    if (delegations.some((item) => overlapping({ ...form }, item)))
      return setError(
        'This approver already has an overlapping delegation for that document scope.',
      )
    if (
      onCreateDelegation({
        ...form,
        documentTypes:
          form.documentType === 'All documents' ? ['All documents'] : [form.documentType],
        delegatorName: owner.name,
        delegateName: delegate.name,
      })
    ) {
      setForm({
        delegatorId: '',
        delegateId: '',
        startDate: today,
        endDate: nextWeek,
        documentType: 'All documents',
      })
      setError('')
    }
  }
  const setLimitDraft = (code, value) =>
    setLimitDrafts((current) => ({ ...current, [code]: value }))
  return (
    <div className="branch-list-page access-page approval-page approval-delegation-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Users size={36} />
          <div>
            <h1>Delegation &amp; Limits</h1>
            <p>Maintain temporary approver coverage and transaction authority</p>
          </div>
        </div>
        <span className="delegation-active-pill">
          <i />
          {activeDelegations.length} active now
        </span>
      </header>
      <section className="approval-summary approval-delegation-summary">
        <article>
          <span className="approval-summary-icon purple">
            <Users size={19} />
          </span>
          <div>
            <span>Active delegations</span>
            <strong>{activeDelegations.length}</strong>
            <small>In effect today</small>
          </div>
        </article>
        <article>
          <span className="approval-summary-icon blue">
            <UserRound size={19} />
          </span>
          <div>
            <span>Eligible approvers</span>
            <strong>{canApproveUsers.length}</strong>
            <small>Active users with approval access</small>
          </div>
        </article>
        <article>
          <span className="approval-summary-icon green">
            <ShieldCheck size={19} />
          </span>
          <div>
            <span>Approval roles</span>
            <strong>{approvalRoles.length}</strong>
            <small>Configured to approve ERP work</small>
          </div>
        </article>
      </section>
      <section className="delegation-create-card">
        <div className="approval-section-heading">
          <div>
            <span className="approval-heading-icon">
              <Users size={17} />
            </span>
            <div>
              <h2>Schedule a delegation</h2>
              <p>Grant temporary approval coverage with a defined scope and end date.</p>
            </div>
          </div>
        </div>
        <form className="delegation-form" onSubmit={submitDelegation}>
          <label>
            <span>Approver to cover</span>
            <select
              required
              value={form.delegatorId}
              onChange={(event) => {
                setForm({ ...form, delegatorId: event.target.value })
                setError('')
              }}
            >
              <option value="">Select an approver</option>
              {canApproveUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {userRoleName(user, roles)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Delegate approver</span>
            <select
              required
              value={form.delegateId}
              onChange={(event) => {
                setForm({ ...form, delegateId: event.target.value })
                setError('')
              }}
            >
              <option value="">Select an eligible delegate</option>
              {canApproveUsers
                .filter((user) => user.id !== form.delegatorId)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} · {userRoleName(user, roles)}
                  </option>
                ))}
            </select>
          </label>
          <label>
            <span>Document scope</span>
            <select
              value={form.documentType}
              onChange={(event) => setForm({ ...form, documentType: event.target.value })}
            >
              <option>All documents</option>
              {approvalDocumentTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Starts</span>
            <input
              type="date"
              min={today}
              required
              value={form.startDate}
              onChange={(event) => setForm({ ...form, startDate: event.target.value })}
            />
          </label>
          <label>
            <span>Ends</span>
            <input
              type="date"
              min={form.startDate || today}
              required
              value={form.endDate}
              onChange={(event) => setForm({ ...form, endDate: event.target.value })}
            />
          </label>
          <button type="submit" className="branch-save-button">
            <Plus size={15} />
            Schedule delegation
          </button>
        </form>
        {error && (
          <p className="access-form-error delegation-error" role="alert">
            {error}
          </p>
        )}
      </section>
      <section className="delegation-list-card">
        <div className="approval-section-heading">
          <div>
            <span className="approval-heading-icon">
              <CalendarDays size={17} />
            </span>
            <div>
              <h2>Delegation schedule</h2>
              <p>Revoke active coverage at any time; past records remain in audit history.</p>
            </div>
          </div>
        </div>
        <div className="approval-table-wrap">
          <table className="delegation-table">
            <thead>
              <tr>
                <th>Approver</th>
                <th>Delegate</th>
                <th>Document scope</th>
                <th>Coverage dates</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {delegations.map((item) => {
                const current =
                  item.status === 'Active' && item.startDate <= today && item.endDate >= today
                const status =
                  item.status !== 'Active'
                    ? item.status
                    : item.endDate < today
                      ? 'Expired'
                      : item.startDate > today
                        ? 'Scheduled'
                        : 'Active'
                return (
                  <tr key={item.id}>
                    <td>
                      <span className="approval-history-actor">
                        <b>{item.delegatorName}</b>
                        <small>
                          {userRoleName(
                            users.find((user) => user.id === item.delegatorId) || {},
                            roles,
                          )}
                        </small>
                      </span>
                    </td>
                    <td>
                      <span className="approval-history-actor">
                        <b>{item.delegateName}</b>
                        <small>
                          {userRoleName(
                            users.find((user) => user.id === item.delegateId) || {},
                            roles,
                          )}
                        </small>
                      </span>
                    </td>
                    <td>{item.documentTypes.join(', ')}</td>
                    <td>
                      {approvalDisplayDate(item.startDate)} – {approvalDisplayDate(item.endDate)}
                    </td>
                    <td>
                      <ApprovalStatusPill status={status} />
                    </td>
                    <td>
                      {item.status === 'Active' && (
                        <button
                          type="button"
                          className="delegation-revoke"
                          disabled={!current}
                          title={
                            current ? 'Revoke delegation' : 'Only active delegations can be revoked'
                          }
                          onClick={() => onRevokeDelegation(item.id)}
                        >
                          <X size={14} />
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {!delegations.length && (
                <tr>
                  <td className="approval-empty" colSpan="6">
                    No delegation schedules have been created.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <section className="approval-limits-card">
        <div className="approval-section-heading">
          <div>
            <span className="approval-heading-icon">
              <CreditCard size={17} />
            </span>
            <div>
              <h2>Role approval limits</h2>
              <p>Maximum transaction amount a role can approve before escalation is required.</p>
            </div>
          </div>
        </div>
        <div className="approval-limit-grid">
          {approvalRoles.map((role) => {
            const draft = limitDrafts[role.code] ?? roleLimits[role.code] ?? 0
            const limit = Number(roleLimits[role.code] || 0)
            return (
              <article className="approval-limit-card" key={role.code}>
                <div className="approval-limit-heading">
                  <span>
                    <ShieldCheck size={16} />
                  </span>
                  <div>
                    <b>{role.name}</b>
                    <small>
                      {role.code} · {role.scope}
                    </small>
                  </div>
                </div>
                <label>
                  <span>Maximum per decision (PKR)</span>
                  <span className="approval-input-prefix">
                    <b>Rs.</b>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={draft}
                      onChange={(event) => setLimitDraft(role.code, event.target.value)}
                    />
                  </span>
                </label>
                <div className="approval-limit-footer">
                  <small>
                    {limit === 0
                      ? 'No approvals permitted'
                      : `Current limit: ${approvalMoney(limit)}`}
                  </small>
                  <button
                    type="button"
                    className="approval-limit-save"
                    disabled={
                      String(draft) === String(roleLimits[role.code] ?? 0) ||
                      !Number.isFinite(Number(draft)) ||
                      Number(draft) < 0
                    }
                    onClick={() => {
                      if (onSaveApprovalLimit(role.code, draft))
                        setLimitDraft(role.code, Number(draft))
                    }}
                  >
                    <Save size={13} />
                    Save limit
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        <div className="access-notice">
          <Info size={15} />
          Limits cap what each approval stage may authorize. The workflow's configured next stage
          must also have sufficient authority.
        </div>
      </section>
    </div>
  )
}
