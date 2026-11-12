import { useState } from 'react'
import { CalendarDays, Filter, ListChecks, Plus } from 'lucide-react'
import * as Shared from '../shared'

const { today, formatDate, idFor, leaveBalance, PageHeader, Button, Card, EmptyState, Table } =
  Shared

export default function LeaveBalancesPage({ data, employees, updateData, onNotify }) {
  const [typeId, setTypeId] = useState('All leave types')
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    typeId: data.leaveTypes[0]?.id || '',
    entryType: 'Accrual',
    date: today(),
    days: '',
    reason: '',
  })
  const submit = (event) => {
    event.preventDefault()
    const type = data.leaveTypes.find((item) => item.id === form.typeId)
    const amount = Number(form.days)
    if (!employees.some((item) => item.id === form.employeeId) || !type)
      return onNotify('Choose an employee and leave type.')
    if (!form.date || !form.reason.trim() || !Number.isFinite(amount) || !amount)
      return onNotify('Enter an effective date, non-zero amount and reason.')
    if (form.entryType === 'Carry forward' && !type.carryForward)
      return onNotify(`${type.name} does not allow carry forward.`)
    if (form.entryType !== 'Adjustment' && amount < 0)
      return onNotify('Accrual and carry-forward entries must add leave days.')
    if (leaveBalance(data, form.employeeId, form.typeId, form.date) + amount < 0)
      return onNotify('This adjustment would make the available leave balance negative.')
    const transaction = {
      id: idFor('LA'),
      employeeId: form.employeeId,
      typeId: form.typeId,
      entryType: form.entryType,
      date: form.date,
      days: amount,
      reason: form.reason.trim(),
      createdAt: new Date().toISOString(),
    }
    if (
      !updateData(
        (current) => ({
          ...current,
          leaveBalanceTransactions: [transaction, ...current.leaveBalanceTransactions],
        }),
        'Leave balance entry recorded',
      )
    )
      return
    setForm((current) => ({ ...current, days: '', reason: '', date: today() }))
  }
  const rows = employees.flatMap((employee) =>
    data.leaveTypes
      .filter((type) => typeId === 'All leave types' || type.id === typeId)
      .map((type) => {
        const adjustments = data.leaveBalanceTransactions
          .filter(
            (item) =>
              item.employeeId === employee.id && item.typeId === type.id && item.date <= today(),
          )
          .reduce((sum, item) => sum + Number(item.days || 0), 0)
        const used = data.leaveRequests
          .filter(
            (request) =>
              request.employeeId === employee.id &&
              request.typeId === type.id &&
              request.status === 'Approved' &&
              request.requestType !== 'Withdrawal',
          )
          .reduce((sum, request) => sum + Number(request.days || 0), 0)
        return {
          employee,
          type,
          adjustments,
          used,
          available: Math.max(0, leaveBalance(data, employee.id, type.id)),
        }
      }),
  )
  return (
    <>
      <PageHeader
        title="Leave Balances"
        subtitle="Annual entitlements plus dated manual accrual, carry-forward and adjustment entries, less approved leave."
        icon={CalendarDays}
      />
      <Card title="Record a leave balance entry" icon={Plus}>
        <form className="hr-inline-form" onSubmit={submit}>
          <label>
            <span>Employee</span>
            <select
              required
              value={form.employeeId}
              onChange={(event) => setForm({ ...form, employeeId: event.target.value })}
            >
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.id}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Leave type</span>
            <select
              required
              value={form.typeId}
              onChange={(event) => setForm({ ...form, typeId: event.target.value })}
            >
              {data.leaveTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Entry type</span>
            <select
              value={form.entryType}
              onChange={(event) => setForm({ ...form, entryType: event.target.value })}
            >
              <option>Accrual</option>
              <option>Carry forward</option>
              <option>Adjustment</option>
            </select>
          </label>
          <label>
            <span>Effective date</span>
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>
          <label>
            <span>Days (+ / − for adjustment)</span>
            <input
              type="number"
              step="0.01"
              required
              value={form.days}
              onChange={(event) => setForm({ ...form, days: event.target.value })}
            />
          </label>
          <label>
            <span>Reason / reference</span>
            <input
              required
              maxLength="400"
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
              placeholder="Explain the balance entry"
            />
          </label>
          <Button type="submit" disabled={!employees.length || !data.leaveTypes.length}>
            <Plus size={15} />
            Record entry
          </Button>
        </form>
      </Card>
      <Card
        title="Balance register"
        icon={ListChecks}
        action={
          <label className="hr-select-employee">
            <Filter size={15} />
            <select value={typeId} onChange={(event) => setTypeId(event.target.value)}>
              <option>All leave types</option>
              {data.leaveTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        }
      >
        <Table
          headers={[
            'Employee',
            'Leave type',
            'Annual entitlement',
            'Manual entries',
            'Approved used',
            'Available',
          ]}
        >
          {rows.map(({ employee, type, adjustments, used, available }) => (
            <tr key={`${employee.id}-${type.id}`}>
              <td>
                {employee.name}
                <small className="hr-cell-sub">{employee.id}</small>
              </td>
              <td>{type.name}</td>
              <td>{type.days} days</td>
              <td>
                {adjustments >= 0 ? '+' : ''}
                {adjustments} days
              </td>
              <td>{used} days</td>
              <td>
                <b className={available < 3 ? 'hr-warning-text' : ''}>{available} days</b>
              </td>
            </tr>
          ))}
        </Table>
        {!rows.length && <EmptyState text="No employee leave balances are available." />}
      </Card>
      <Card
        title={`Balance entry history · ${data.leaveBalanceTransactions.length}`}
        icon={ListChecks}
      >
        <Table headers={['Date', 'Employee', 'Leave type', 'Entry', 'Days', 'Reason']}>
          {data.leaveBalanceTransactions.map((item) => (
            <tr key={item.id}>
              <td>{formatDate(item.date)}</td>
              <td>
                {employees.find((employee) => employee.id === item.employeeId)?.name ||
                  'Unknown employee'}
              </td>
              <td>{data.leaveTypes.find((type) => type.id === item.typeId)?.name || 'Leave'}</td>
              <td>{item.entryType}</td>
              <td>
                {item.days > 0 ? '+' : ''}
                {item.days}
              </td>
              <td>{item.reason}</td>
            </tr>
          ))}
        </Table>
        {!data.leaveBalanceTransactions.length && (
          <EmptyState text="Manual accrual and adjustment entries will appear here." />
        )}
      </Card>
    </>
  )
}
