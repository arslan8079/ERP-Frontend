import { useState } from 'react'
import { ArrowRight, CalendarDays, Check, Heart, Info } from 'lucide-react'
import * as Shared from '../shared'

const {
  today,
  formatDate,
  daysBetween,
  leaveBalance,
  PageHeader,
  Button,
  Stat,
  Card,
  EmptyState,
  Table,
  MetricBar,
  LeaveRequestTable,
  downloadCsv,
} = Shared

export default function ApplyLeavePage({
  data,
  employees,
  employeeName,
  updateData,
  onNotify,
  onNavigate,
}) {
  const activeTypes = data.leaveTypes.filter((item) => item.status === 'Active')
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    typeId: activeTypes[0]?.id || '',
    startDate: today(),
    endDate: today(),
    reason: '',
  })
  const count =
    form.startDate && form.endDate && form.endDate >= form.startDate
      ? daysBetween(form.startDate, form.endDate)
      : 0
  const submit = (event) => {
    event.preventDefault()
    if (form.endDate < form.startDate || !count) return onNotify('Choose a valid leave end date.')
    if (!form.reason.trim()) return onNotify('Add a reason for the leave request.')
    const leaveType = activeTypes.find((item) => item.id === form.typeId)
    if (!leaveType) return onNotify('Choose an active leave category.')
    const available = leaveBalance(data, form.employeeId, form.typeId, form.startDate)
    if (count > available)
      return onNotify(
        `This request exceeds the ${leaveType.name} balance of ${Math.max(0, available)} day(s).`,
      )
    const overlaps = data.leaveRequests.some(
      (item) =>
        item.employeeId === form.employeeId &&
        ['Pending', 'Approved'].includes(item.status) &&
        item.requestType !== 'Withdrawal' &&
        form.startDate <= item.endDate &&
        form.endDate >= item.startDate,
    )
    if (overlaps)
      return onNotify(
        'This employee already has a pending or approved leave request during those dates.',
      )
    if (
      !updateData(
        (current) => ({
          ...current,
          leaveRequests: [
            {
              ...form,
              id: `LR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
              days: count,
              reason: form.reason.trim(),
              status: 'Pending',
              submittedAt: today(),
            },
            ...current.leaveRequests,
          ],
        }),
        'Leave request submitted for approval',
      )
    )
      return
    onNavigate('Leave Requests')
  }
  return (
    <>
      <PageHeader
        title="Apply for Leave"
        subtitle="Submit a dated leave request for manager approval."
        icon={CalendarDays}
      />
      <div className="hr-apply-layout">
        <form className="hr-form-card" onSubmit={submit}>
          <h2>
            <CalendarDays size={18} />
            Leave application
          </h2>
          <div className="hr-form-grid">
            <label>
              <span>Employee</span>
              <select
                value={form.employeeId}
                onChange={(event) => setForm({ ...form, employeeId: event.target.value })}
              >
                {employees
                  .filter((item) => item.status === 'Active')
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} · {item.id}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span>Leave category</span>
              <select
                required
                value={form.typeId}
                onChange={(event) => setForm({ ...form, typeId: event.target.value })}
              >
                {activeTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.days} days/year
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
            <label className="wide">
              <span>Reason</span>
              <textarea
                required
                rows="3"
                maxLength="400"
                value={form.reason}
                onChange={(event) => setForm({ ...form, reason: event.target.value })}
                placeholder="Briefly explain the request"
              />
            </label>
          </div>
          <div className="hr-form-actions">
            <span>
              <Info size={15} />
              Requesting {count || 0} calendar day(s) for {employeeName(form.employeeId)}.
            </span>
            <Button type="submit">
              <Check size={16} />
              Submit request
            </Button>
          </div>
        </form>
        <aside className="hr-leave-note">
          <span>
            <Heart size={20} />
          </span>
          <h3>Leave request workflow</h3>
          <p>
            Your request is recorded as pending and appears in Leave Approvals for manager review.
            Approved requests are reflected in leave balances.
          </p>
          <Button kind="link" onClick={() => onNavigate('Leave Balances')}>
            Check leave balances <ArrowRight size={14} />
          </Button>
        </aside>
      </div>
    </>
  )
}
