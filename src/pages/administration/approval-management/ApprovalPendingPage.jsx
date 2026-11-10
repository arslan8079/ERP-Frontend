import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import {
  ClipboardCheck,
  Clock3,
  AlertTriangle,
  Workflow,
  CalendarDays,
  Search,
  RotateCcw,
  ClipboardList,
  ArrowRight,
  Check,
  UserRound,
  X,
  ShieldCheck,
} from 'lucide-react'
import {
  approvalDocumentTypes,
  approvalRoleName,
  approvalMoney,
  approvalAge,
  ApprovalStatusPill,
  approvalDisplayDate,
} from '../../../App.jsx'

export default function ApprovalPendingPage({
  requests,
  rules,
  users,
  roles,
  branches,
  departments,
  delegations,
  onDecide,
  onNavigate,
}) {
  const [query, setQuery] = useState('')
  const [documentType, setDocumentType] = useState('All types')
  const [priority, setPriority] = useState('All priorities')
  const [selectedId, setSelectedId] = useState('')
  const [comments, setComments] = useState('')
  const [actionError, setActionError] = useState('')
  const pendingRequests = requests.filter((request) => request.status === 'Pending')
  const search = query.trim().toLowerCase()
  const visibleRequests = pendingRequests
    .filter((request) => {
      const requester = users.find((user) => user.id === request.requestedById)
      const branch = branches.find((item) => item.code === request.branchCode)
      return (
        (documentType === 'All types' || request.documentType === documentType) &&
        (priority === 'All priorities' || request.priority === priority) &&
        `${request.reference} ${request.documentType} ${request.description} ${requester?.name || ''} ${branch?.name || ''}`
          .toLowerCase()
          .includes(search)
      )
    })
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
  const selected =
    visibleRequests.find((request) => request.id === selectedId) || visibleRequests[0]
  const urgentCount = pendingRequests.filter(
    (request) =>
      request.priority === 'Urgent' ||
      Date.now() - new Date(request.submittedAt).getTime() >= 48 * 3600000,
  ).length
  const secondStageCount = pendingRequests.filter((request) => request.currentStage === 2).length
  const todayCount = pendingRequests.filter(
    (request) => new Date(request.submittedAt).toDateString() === new Date().toDateString(),
  ).length
  const requestRule = selected && rules.find((rule) => rule.id === selected.ruleId)
  const requester = selected && users.find((user) => user.id === selected.requestedById)
  const branch = selected && branches.find((item) => item.code === selected.branchCode)
  const department = selected && departments.find((item) => item.code === selected.departmentCode)
  const activeDelegationFor = (request, rule) => {
    if (!request || !rule) return null
    const roleCode = request.currentStage === 2 ? rule.escalationRoleCode : rule.approverRoleCode
    const today = new Date().toISOString().slice(0, 10)
    return delegations.find((item) => {
      const owner = users.find((user) => user.id === item.delegatorId)
      const delegate = users.find((user) => user.id === item.delegateId)
      const delegateRole = roles.find((role) => role.code === delegate?.roleCode)
      return (
        item.status === 'Active' &&
        item.startDate <= today &&
        item.endDate >= today &&
        (item.documentTypes.includes('All documents') ||
          item.documentTypes.includes(request.documentType)) &&
        owner?.status === 'Active' &&
        owner.roleCode === roleCode &&
        delegate?.status === 'Active' &&
        delegateRole?.status === 'Active' &&
        delegateRole.permissions?.Approvals?.approve
      )
    })
  }
  const currentDelegation = selected && activeDelegationFor(selected, requestRule)
  const submitDecision = (decision) => {
    if ((decision === 'Rejected' || decision === 'Changes Requested') && !comments.trim()) {
      setActionError(
        decision === 'Rejected'
          ? 'Add a reason before rejecting this request.'
          : 'Describe the changes needed before returning this request.',
      )
      return
    }
    if (selected && onDecide(selected.id, decision, comments)) {
      setComments('')
      setActionError('')
      setSelectedId('')
    }
  }
  const resetFilters = () => {
    setQuery('')
    setDocumentType('All types')
    setPriority('All priorities')
    setSelectedId('')
  }

  return (
    <div className="branch-list-page access-page approval-page approval-queue-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <ClipboardCheck size={36} />
          <div>
            <h1>Pending Approvals</h1>
            <p>Review routed ERP requests, verify supporting details, and record a decision</p>
          </div>
        </div>
        <button
          type="button"
          className="branch-report-actions-button"
          onClick={() => onNavigate('Approval History')}
        >
          <Clock3 size={15} />
          Approval history
        </button>
      </header>
      <section className="approval-summary">
        <article>
          <span className="approval-summary-icon amber">
            <Clock3 size={19} />
          </span>
          <div>
            <span>Awaiting decision</span>
            <strong>{pendingRequests.length}</strong>
            <small>Across active workflows</small>
          </div>
        </article>
        <article>
          <span className="approval-summary-icon red">
            <AlertTriangle size={19} />
          </span>
          <div>
            <span>Needs attention</span>
            <strong>{urgentCount}</strong>
            <small>Urgent or older than 48 hours</small>
          </div>
        </article>
        <article>
          <span className="approval-summary-icon blue">
            <Workflow size={19} />
          </span>
          <div>
            <span>Second-stage review</span>
            <strong>{secondStageCount}</strong>
            <small>Escalated by approval rules</small>
          </div>
        </article>
        <article>
          <span className="approval-summary-icon green">
            <CalendarDays size={19} />
          </span>
          <div>
            <span>Submitted today</span>
            <strong>{todayCount}</strong>
            <small>New requests in queue</small>
          </div>
        </article>
      </section>
      <section className="approval-toolbar" aria-label="Filter approval requests">
        <label className="approval-search">
          <span>Find a request</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Reference, requester, branch or description"
            />
          </span>
        </label>
        <label>
          <span>Document type</span>
          <select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
            <option>All types</option>
            {approvalDocumentTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option>All priorities</option>
            <option>Urgent</option>
            <option>High</option>
            <option>Normal</option>
          </select>
        </label>
        <button type="button" className="access-reset" onClick={resetFilters}>
          <RotateCcw size={15} />
          Reset
        </button>
      </section>
      <div className="approval-queue-layout">
        <section className="approval-queue-card">
          <div className="approval-section-heading">
            <div>
              <span className="approval-heading-icon">
                <ClipboardList size={17} />
              </span>
              <div>
                <h2>Review queue</h2>
                <p>
                  {visibleRequests.length} of {pendingRequests.length} requests · oldest first
                </p>
              </div>
            </div>
            <span className="approval-queue-count">{pendingRequests.length} pending</span>
          </div>
          <div className="approval-table-wrap">
            <table className="approval-table-full">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Requested by</th>
                  <th>Amount</th>
                  <th>Waiting</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {visibleRequests.map((request) => {
                  const user = users.find((item) => item.id === request.requestedById)
                  const rule = rules.find((item) => item.id === request.ruleId)
                  const approver = approvalRoleName(
                    request.currentStage === 2 ? rule?.escalationRoleCode : rule?.approverRoleCode,
                    roles,
                  )
                  const delegation = activeDelegationFor(request, rule)
                  const delayed =
                    Date.now() - new Date(request.submittedAt).getTime() >= 48 * 3600000
                  return (
                    <tr
                      key={request.id}
                      className={`${selected?.id === request.id ? 'selected' : ''} ${delayed ? 'overdue' : ''}`}
                      onClick={() => {
                        setSelectedId(request.id)
                        setComments('')
                        setActionError('')
                      }}
                    >
                      <td>
                        <span className="approval-reference-cell">
                          <b>{request.reference}</b>
                          <small>
                            {request.documentType}
                            {request.currentStage === 2 ? ' · Stage 2' : ''}
                          </small>
                        </span>
                      </td>
                      <td>
                        <span className="approval-requester-cell">
                          <b>{user?.name || 'Unknown requester'}</b>
                          <small>
                            {delegation ? `${delegation.delegateName} · delegated cover` : approver}
                          </small>
                        </span>
                      </td>
                      <td className="approval-amount-cell">{approvalMoney(request.amount)}</td>
                      <td>
                        <span className={`approval-age ${delayed ? 'delayed' : ''}`}>
                          {approvalAge(request.submittedAt)}
                        </span>
                      </td>
                      <td>
                        <span className={`approval-priority ${request.priority.toLowerCase()}`}>
                          {request.priority}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {!visibleRequests.length && (
                  <tr>
                    <td className="approval-empty" colSpan="5">
                      <ClipboardCheck size={24} />
                      <b>
                        {pendingRequests.length ? 'No matching approvals' : 'Your queue is clear'}
                      </b>
                      <span>
                        {pendingRequests.length
                          ? 'Try another filter or search term.'
                          : 'New routed requests will appear here.'}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <footer className="approval-queue-footer">
            <span>
              <i className="approval-legend-dot urgent" />
              Urgent / overdue
            </span>
            <span>
              <i className="approval-legend-dot stage" />
              Second-stage review
            </span>
            <button type="button" onClick={() => onNavigate('Approval Rules')}>
              Review routing rules <ArrowRight size={14} />
            </button>
          </footer>
        </section>
        {selected ? (
          <aside className="approval-detail-card">
            <div className="approval-detail-header">
              <div>
                <span className="approval-detail-kicker">REQUEST DETAILS</span>
                <h2>{selected.reference}</h2>
                <span>{selected.documentType}</span>
              </div>
              <ApprovalStatusPill
                status={selected.currentStage === 2 ? 'Escalated' : selected.priority}
              />
            </div>
            <div className="approval-detail-amount">
              <span>Requested amount</span>
              <strong>{approvalMoney(selected.amount)}</strong>
              <small>
                {selected.currency} · Submitted {approvalDisplayDate(selected.submittedAt, true)}
              </small>
            </div>
            <p className="approval-detail-description">{selected.description}</p>
            <dl className="approval-detail-meta">
              <div>
                <dt>Requester</dt>
                <dd>{requester?.name || 'Unknown requester'}</dd>
              </div>
              <div>
                <dt>Branch</dt>
                <dd>{branch?.name || 'Unassigned'}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{department?.name || selected.departmentCode || 'Not specified'}</dd>
              </div>
              <div>
                <dt>Queue age</dt>
                <dd
                  className={
                    Date.now() - new Date(selected.submittedAt).getTime() >= 48 * 3600000
                      ? 'text-overdue'
                      : ''
                  }
                >
                  {approvalAge(selected.submittedAt)}
                </dd>
              </div>
            </dl>
            <section className="approval-route">
              <h3>
                <Workflow size={15} />
                Approval route
              </h3>
              <div className="approval-route-step">
                <span
                  className={`approval-step-marker ${selected.currentStage >= 1 ? 'complete' : ''}`}
                >
                  {selected.currentStage > 1 ? <Check size={13} /> : '1'}
                </span>
                <div>
                  <b>{approvalRoleName(requestRule?.approverRoleCode, roles)}</b>
                  <small>
                    {selected.currentStage > 1
                      ? 'First-stage review complete'
                      : 'Current approval stage'}
                  </small>
                </div>
                {selected.currentStage === 1 && <span className="route-current">CURRENT</span>}
              </div>
              {requestRule?.escalationRoleCode && (
                <div className="approval-route-step">
                  <span
                    className={`approval-step-marker ${selected.currentStage === 2 ? 'current' : ''}`}
                  >
                    {selected.currentStage === 2 ? '2' : '2'}
                  </span>
                  <div>
                    <b>{approvalRoleName(requestRule.escalationRoleCode, roles)}</b>
                    <small>
                      {selected.currentStage === 2
                        ? 'Current escalation review'
                        : `Required above ${approvalMoney(requestRule.escalationAmount)}`}
                    </small>
                  </div>
                  {selected.currentStage === 2 && <span className="route-current">CURRENT</span>}
                </div>
              )}
              {currentDelegation && (
                <div className="approval-route-step approval-delegation-cover">
                  <span className="approval-step-marker current">
                    <UserRound size={12} />
                  </span>
                  <div>
                    <b>{currentDelegation.delegateName}</b>
                    <small>Active delegated coverage for {selected.documentType}</small>
                  </div>
                  <span className="route-current">COVER</span>
                </div>
              )}
            </section>
            <label className="approval-comment">
              <span>Decision note {selected.currentStage === 2 && '· Stage 2'}</span>
              <textarea
                rows="3"
                maxLength="400"
                value={comments}
                onChange={(event) => {
                  setComments(event.target.value)
                  setActionError('')
                }}
                placeholder="Add context, or explain what needs to change..."
              />
            </label>
            {actionError && (
              <p className="access-form-error" role="alert">
                {actionError}
              </p>
            )}
            <div className="approval-decision-actions">
              <button
                type="button"
                className="approval-decision-return"
                onClick={() => submitDecision('Changes Requested')}
              >
                <RotateCcw size={14} />
                Request changes
              </button>
              <button
                type="button"
                className="approval-decision-reject"
                onClick={() => submitDecision('Rejected')}
              >
                <X size={15} />
                Reject
              </button>
              <button
                type="button"
                className="approval-decision-approve"
                onClick={() => submitDecision('Approved')}
              >
                <Check size={15} />
                {selected.currentStage === 2 ? 'Approve final' : 'Approve'}
              </button>
            </div>
            <p className="approval-audit-hint">
              <ShieldCheck size={13} />
              Every decision and note is recorded in Approval History.
            </p>
          </aside>
        ) : (
          <aside className="approval-detail-card approval-detail-empty">
            <ClipboardCheck size={28} />
            <b>Select a request</b>
            <span>Choose an item from the queue to review its route and details.</span>
          </aside>
        )}
      </div>
    </div>
  )
}
