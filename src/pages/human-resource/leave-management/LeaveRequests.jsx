import { useState } from 'react'
import { CalendarDays, Pencil, Plus, RotateCcw } from 'lucide-react'
import * as Shared from '../shared'

const {
  today,
  formatDate,
  daysBetween,
  idFor,
  leaveBalance,
  PageHeader,
  Button,
  Card,
  EmptyState,
  Table,
} = Shared

const emptyForm = (employeeId, typeId, startDate = today(), endDate = startDate) => ({
  id: '',
  mode: '',
  employeeId,
  typeId,
  startDate,
  endDate,
  reason: '',
  changeReason: '',
})

export default function LeaveRequestsPage({
  data,
  employees,
  employeeName,
  updateData,
  onNotify,
  onNavigate,
}) {
  const activeTypes = data.leaveTypes.filter((item) => item.status === 'Active')
  const [form, setForm] = useState(() =>
    emptyForm(
      employees.find((item) => item.status === 'Active')?.id || '',
      activeTypes[0]?.id || '',
    ),
  )
  const [withdrawal, setWithdrawal] = useState(null)
  const [withdrawalReason, setWithdrawalReason] = useState('')

  const hasPendingChange = (requestId) =>
    data.leaveRequests.some(
      (item) => item.originalRequestId === requestId && item.status === 'Pending',
    )

  const beginEdit = (item) => {
    setWithdrawal(null)
    setForm({
      id: item.id,
      mode: 'edit',
      employeeId: item.employeeId,
      typeId: item.typeId,
      startDate: item.startDate,
      endDate: item.endDate,
      reason: item.reason,
      changeReason: '',
    })
  }

  const beginAmendment = (item) => {
    if (hasPendingChange(item.id))
      return onNotify('A change for this approved request is already under review.')
    setWithdrawal(null)
    setForm({
      id: item.id,
      mode: 'amend',
      employeeId: item.employeeId,
      typeId: item.typeId,
      startDate: item.startDate,
      endDate: item.endDate,
      reason: item.reason,
      changeReason: '',
    })
  }

  const submitForm = (event) => {
    event.preventDefault()
    const count =
      form.startDate && form.endDate && form.endDate >= form.startDate
        ? daysBetween(form.startDate, form.endDate)
        : 0
    if (!form.employeeId || !form.typeId || !count)
      return onNotify('Choose an employee, leave type and valid date range.')
    if (!form.reason.trim() || !form.changeReason.trim())
      return onNotify('Enter the leave reason and reason for the change.')
    const currentRequest = form.id ? data.leaveRequests.find((item) => item.id === form.id) : null
    if (
      (form.mode === 'edit' && currentRequest?.status !== 'Pending') ||
      (form.mode === 'amend' && currentRequest?.status !== 'Approved')
    )
      return onNotify('This leave request changed; reload the register before editing it.')
    const originalRequestId =
      form.mode === 'amend'
        ? form.id
        : currentRequest?.requestType === 'Amendment'
          ? currentRequest.originalRequestId
          : ''
    const available = leaveBalance(
      data,
      form.employeeId,
      form.typeId,
      form.startDate,
      originalRequestId || (form.mode === 'edit' ? form.id : ''),
    )
    if (count > available)
      return onNotify(
        `This request exceeds the available balance of ${Math.max(0, available)} day(s).`,
      )
    const overlaps = data.leaveRequests.some(
      (item) =>
        item.id !== form.id &&
        item.id !== originalRequestId &&
        item.employeeId === form.employeeId &&
        ['Pending', 'Approved'].includes(item.status) &&
        item.requestType !== 'Withdrawal' &&
        form.startDate <= item.endDate &&
        form.endDate >= item.startDate,
    )
    if (overlaps) return onNotify('Another pending or approved leave request overlaps these dates.')

    const now = new Date().toISOString()
    const historyEvent = {
      id: idFor('LH'),
      action: form.mode === 'amend' ? 'Amendment submitted' : 'Pending request amended',
      detail: form.changeReason.trim(),
      occurredAt: now,
    }
    if (form.mode === 'edit') {
      if (
        !updateData((current) => ({
          ...current,
          leaveRequests: current.leaveRequests.map((item) =>
            item.id === form.id && item.status === 'Pending'
              ? {
                  ...item,
                  typeId: form.typeId,
                  startDate: form.startDate,
                  endDate: form.endDate,
                  days: count,
                  reason: form.reason.trim(),
                  changeReason: form.changeReason.trim(),
                  updatedAt: now,
                  history: [historyEvent, ...(item.history || [])],
                }
              : item,
          ),
        }))
      )
        return
    } else {
      const request = {
        id: idFor('LR'),
        employeeId: form.employeeId,
        typeId: form.typeId,
        startDate: form.startDate,
        endDate: form.endDate,
        days: count,
        reason: form.reason.trim(),
        requestType: 'Amendment',
        originalRequestId: form.id,
        changeReason: form.changeReason.trim(),
        status: 'Pending',
        submittedAt: now,
        history: [historyEvent],
      }
      if (
        !updateData((current) => ({
          ...current,
          leaveRequests: [request, ...current.leaveRequests],
        }))
      )
        return
    }
    setForm(emptyForm(form.employeeId, form.typeId))
  }

  const beginWithdrawal = (item) => {
    if (item.status === 'Approved' && hasPendingChange(item.id))
      return onNotify('A change for this approved request is already under review.')
    setForm(emptyForm('', activeTypes[0]?.id || ''))
    setWithdrawal(item)
    setWithdrawalReason('')
  }

  const submitWithdrawal = (event) => {
    event.preventDefault()
    if (!withdrawal || !withdrawalReason.trim())
      return onNotify('Enter a reason for withdrawing or cancelling this request.')
    const now = new Date().toISOString()
    if (withdrawal.status === 'Approved') {
      const request = {
        id: idFor('LR'),
        employeeId: withdrawal.employeeId,
        typeId: withdrawal.typeId,
        startDate: withdrawal.startDate,
        endDate: withdrawal.endDate,
        days: withdrawal.days,
        reason: withdrawal.reason,
        requestType: 'Withdrawal',
        originalRequestId: withdrawal.id,
        changeReason: withdrawalReason.trim(),
        status: 'Pending',
        submittedAt: now,
        history: [
          {
            id: idFor('LH'),
            action: 'Withdrawal submitted',
            detail: withdrawalReason.trim(),
            occurredAt: now,
          },
        ],
      }
      if (
        !updateData((current) => ({
          ...current,
          leaveRequests: [request, ...current.leaveRequests],
        }))
      )
        return
    } else {
      const nextStatus =
        withdrawal.requestType === 'Amendment' || withdrawal.requestType === 'Withdrawal'
          ? 'Cancelled'
          : 'Withdrawn'
      if (
        !updateData((current) => ({
          ...current,
          leaveRequests: current.leaveRequests.map((item) =>
            item.id === withdrawal.id && item.status === 'Pending'
              ? {
                  ...item,
                  status: nextStatus,
                  withdrawalReason: withdrawalReason.trim(),
                  withdrawnAt: now,
                  history: [
                    {
                      id: idFor('LH'),
                      action:
                        nextStatus === 'Cancelled'
                          ? 'Change request cancelled'
                          : 'Request withdrawn',
                      detail: withdrawalReason.trim(),
                      occurredAt: now,
                    },
                    ...(item.history || []),
                  ],
                }
              : item,
          ),
        }))
      )
        return
    }
    setWithdrawal(null)
    setWithdrawalReason('')
  }

  return (
    <>
      <PageHeader
        title="Leave Requests"
        subtitle="Review request history, amend pending requests and submit reviewed changes to approved leave."
        icon={CalendarDays}
        action={
          <Button onClick={() => onNavigate('Apply for Leave')}>
            <Plus size={15} />
            Apply for leave
          </Button>
        }
      />
      {form.mode && (
        <Card
          title={form.mode === 'amend' ? 'Propose an amendment' : 'Edit pending leave request'}
          icon={Pencil}
        >
          <form className="hr-inline-form" onSubmit={submitForm}>
            <label>
              <span>Employee</span>
              <select value={form.employeeId} disabled>
                <option value={form.employeeId}>
                  {employeeName(form.employeeId)} · {form.employeeId}
                </option>
              </select>
            </label>
            <label>
              <span>Leave type</span>
              <select
                required
                value={form.typeId}
                onChange={(event) => setForm({ ...form, typeId: event.target.value })}
              >
                {data.leaveTypes
                  .filter((item) => item.status === 'Active' || item.id === form.typeId)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span>Start date</span>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
              />
            </label>
            <label>
              <span>End date</span>
              <input
                type="date"
                min={form.startDate}
                required
                value={form.endDate}
                onChange={(event) => setForm({ ...form, endDate: event.target.value })}
              />
            </label>
            <label>
              <span>Leave reason</span>
              <input
                required
                maxLength="400"
                value={form.reason}
                onChange={(event) => setForm({ ...form, reason: event.target.value })}
              />
            </label>
            <label>
              <span>Change reason</span>
              <input
                required
                maxLength="400"
                value={form.changeReason}
                onChange={(event) => setForm({ ...form, changeReason: event.target.value })}
                placeholder="Explain why this request is changing"
              />
            </label>
            <Button type="submit">
              {form.mode === 'amend' ? 'Submit amendment for review' : 'Save request'}
            </Button>
            <Button
              kind="secondary"
              onClick={() => setForm(emptyForm('', activeTypes[0]?.id || ''))}
            >
              Cancel
            </Button>
          </form>
          {form.mode === 'amend' && (
            <p className="hr-form-note">
              The current approved request remains in effect until this amendment is approved.
            </p>
          )}
        </Card>
      )}
      {withdrawal && (
        <Card
          title={
            withdrawal.status === 'Approved'
              ? 'Request leave withdrawal'
              : 'Withdraw pending request'
          }
          icon={RotateCcw}
        >
          <form className="hr-inline-form" onSubmit={submitWithdrawal}>
            <label>
              <span>Change reason</span>
              <input
                required
                maxLength="400"
                value={withdrawalReason}
                onChange={(event) => setWithdrawalReason(event.target.value)}
                placeholder="Explain why the leave should be withdrawn"
              />
            </label>
            <Button type="submit">
              {withdrawal.status === 'Approved'
                ? 'Submit withdrawal for review'
                : 'Confirm withdrawal'}
            </Button>
            <Button kind="secondary" onClick={() => setWithdrawal(null)}>
              Cancel
            </Button>
          </form>
          {withdrawal.status === 'Approved' && (
            <p className="hr-form-note">
              Approved leave remains in the balance until the withdrawal is approved.
            </p>
          )}
        </Card>
      )}
      <Card title={`Leave register · ${data.leaveRequests.length} requests`} icon={CalendarDays}>
        <Table
          headers={[
            'Request',
            'Employee',
            'Leave type',
            'Dates',
            'Days',
            'Reason / change',
            'Status',
            'Actions',
          ]}
        >
          {data.leaveRequests.map((item) => {
            const pendingChange = hasPendingChange(item.id)
            return (
              <tr key={item.id}>
                <td>
                  <b>{item.id}</b>
                  {item.requestType && item.requestType !== 'Leave' && (
                    <small className="hr-cell-sub">
                      {item.requestType}
                      {item.originalRequestId ? ` · ${item.originalRequestId}` : ''}
                    </small>
                  )}
                </td>
                <td>{employeeName(item.employeeId)}</td>
                <td>{data.leaveTypes.find((type) => type.id === item.typeId)?.name || 'Leave'}</td>
                <td>
                  {formatDate(item.startDate)} – {formatDate(item.endDate)}
                </td>
                <td>{item.days}</td>
                <td>
                  {item.reason}
                  {item.changeReason && <small className="hr-cell-sub">{item.changeReason}</small>}
                  {item.withdrawalReason && (
                    <small className="hr-cell-sub">Withdrawal: {item.withdrawalReason}</small>
                  )}
                </td>
                <td>
                  <span className={`hr-status ${item.status.toLowerCase()}`}>{item.status}</span>
                  {item.history?.length > 0 && (
                    <details>
                      <summary>History · {item.history.length}</summary>
                      <ul>
                        {item.history.map((event) => (
                          <li key={event.id}>
                            <b>{event.action}</b> · {event.detail}
                            <small>{new Date(event.occurredAt).toLocaleString()}</small>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </td>
                <td>
                  {item.status === 'Pending' && item.requestType !== 'Withdrawal' && (
                    <button className="hr-inline-action" onClick={() => beginEdit(item)}>
                      Edit
                    </button>
                  )}
                  {item.status === 'Pending' && (
                    <button
                      className="hr-inline-action reject"
                      onClick={() => beginWithdrawal(item)}
                    >
                      {item.requestType === 'Amendment' || item.requestType === 'Withdrawal'
                        ? 'Cancel request'
                        : 'Withdraw'}
                    </button>
                  )}
                  {item.status === 'Approved' &&
                    item.requestType !== 'Withdrawal' &&
                    !pendingChange && (
                      <>
                        <button className="hr-inline-action" onClick={() => beginAmendment(item)}>
                          Amend
                        </button>
                        <button
                          className="hr-inline-action reject"
                          onClick={() => beginWithdrawal(item)}
                        >
                          Request withdrawal
                        </button>
                      </>
                    )}
                  {item.status === 'Approved' &&
                    item.requestType !== 'Withdrawal' &&
                    pendingChange && <small className="hr-cell-sub">Change under review</small>}
                </td>
              </tr>
            )
          })}
        </Table>
        {!data.leaveRequests.length && (
          <EmptyState text="No leave applications have been submitted." />
        )}
      </Card>
    </>
  )
}
