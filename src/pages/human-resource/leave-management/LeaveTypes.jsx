import { useState } from 'react'
import { CalendarDays, ListChecks, Plus } from 'lucide-react'
import * as Shared from '../shared'

const {
  today,
  formatDate,
  daysBetween,
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

export default function LeaveTypesPage({ data, updateData, onNotify }) {
  const [form, setForm] = useState({ name: '', days: 10, paid: true, carryForward: false })
  const submit = (event) => {
    event.preventDefault()
    if (data.leaveTypes.some((item) => item.name.toLowerCase() === form.name.trim().toLowerCase()))
      return onNotify('A leave type with this name already exists.')
    updateData(
      (current) => ({
        ...current,
        leaveTypes: [
          ...current.leaveTypes,
          {
            ...form,
            id: `LT-${String(Date.now()).slice(-5)}`,
            name: form.name.trim(),
            status: 'Active',
          },
        ],
      }),
      'Leave type created',
    )
    setForm({ name: '', days: 10, paid: true, carryForward: false })
  }
  const toggle = (id) =>
    updateData(
      (current) => ({
        ...current,
        leaveTypes: current.leaveTypes.map((item) =>
          item.id === id
            ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
            : item,
        ),
      }),
      'Leave type status updated',
    )
  return (
    <>
      <PageHeader
        title="Leave Types"
        subtitle="Configure leave categories, annual entitlement and pay treatment."
        icon={CalendarDays}
      />
      <Card title="Create leave type" icon={Plus}>
        <form className="hr-inline-form" onSubmit={submit}>
          <label>
            <span>Leave name</span>
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Study leave"
            />
          </label>
          <label>
            <span>Annual days</span>
            <input
              type="number"
              min="0"
              max="365"
              required
              value={form.days}
              onChange={(event) => setForm({ ...form, days: Number(event.target.value) })}
            />
          </label>
          <label className="hr-check-label">
            <input
              type="checkbox"
              checked={form.paid}
              onChange={(event) => setForm({ ...form, paid: event.target.checked })}
            />
            Paid leave
          </label>
          <label className="hr-check-label">
            <input
              type="checkbox"
              checked={form.carryForward}
              onChange={(event) => setForm({ ...form, carryForward: event.target.checked })}
            />
            Allow carry forward
          </label>
          <Button type="submit">
            <Plus size={15} />
            Add type
          </Button>
        </form>
      </Card>
      <Card title="Leave policy register" icon={ListChecks}>
        <Table
          headers={[
            'Leave type',
            'Annual entitlement',
            'Payment',
            'Carry forward',
            'Status',
            'Action',
          ]}
        >
          {data.leaveTypes.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.name}</b>
                <small className="hr-cell-sub">{item.id}</small>
              </td>
              <td>{item.days} days</td>
              <td>{item.paid ? 'Paid' : 'Unpaid'}</td>
              <td>{item.carryForward ? 'Allowed' : 'No'}</td>
              <td>
                <span className={`hr-status ${item.status.toLowerCase()}`}>{item.status}</span>
              </td>
              <td>
                <button className="hr-inline-action" onClick={() => toggle(item.id)}>
                  {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
