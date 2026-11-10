import { useState } from 'react'
import { ListChecks, Plus, TrendingUp } from 'lucide-react'
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

export default function GoalsPage({ data, updateData, employees, employeeName, onNotify }) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    title: '',
    target: '2026-12-31',
  })
  const add = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    updateData(
      (current) => ({
        ...current,
        goals: [
          {
            ...form,
            title: form.title.trim(),
            id: `GO-${String(Date.now()).slice(-5)}`,
            progress: 0,
            status: 'On track',
          },
          ...current.goals,
        ],
      }),
      'Goal added',
    )
    setForm({ ...form, title: '' })
  }
  const progress = (id, value) =>
    updateData((current) => ({
      ...current,
      goals: current.goals.map((item) =>
        item.id === id
          ? {
              ...item,
              progress: Number(value),
              status: Number(value) >= 70 ? 'On track' : 'Needs focus',
            }
          : item,
      ),
    }))
  return (
    <>
      <PageHeader
        title="Goals & KPIs"
        subtitle="Set measurable outcomes and track progress against target dates."
        icon={TrendingUp}
      />
      <Card title="Add a goal" icon={Plus}>
        <form className="hr-inline-form" onSubmit={add}>
          <label>
            <span>Owner</span>
            <select
              value={form.employeeId}
              onChange={(event) => setForm({ ...form, employeeId: event.target.value })}
            >
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Goal / KPI</span>
            <input
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Define a measurable outcome"
            />
          </label>
          <label>
            <span>Target date</span>
            <input
              type="date"
              required
              value={form.target}
              onChange={(event) => setForm({ ...form, target: event.target.value })}
            />
          </label>
          <Button type="submit">
            <Plus size={15} />
            Add goal
          </Button>
        </form>
      </Card>
      <Card title={`Goals register · ${data.goals.length}`} icon={ListChecks}>
        <Table headers={['Goal', 'Employee', 'Target date', 'Progress', 'Status']}>
          {data.goals.map((goal) => (
            <tr key={goal.id}>
              <td>
                <b>{goal.title}</b>
                <small className="hr-cell-sub">{goal.id}</small>
              </td>
              <td>{employeeName(goal.employeeId)}</td>
              <td>{formatDate(goal.target)}</td>
              <td>
                <label className="hr-progress-cell">
                  <input
                    aria-label={`Progress for ${goal.title}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goal.progress}
                    onChange={(event) => progress(goal.id, event.target.value)}
                  />
                  <b>{goal.progress}%</b>
                </label>
              </td>
              <td>
                <span className={`hr-status ${goal.status === 'On track' ? 'active' : 'pending'}`}>
                  {goal.status}
                </span>
              </td>
            </tr>
          ))}
        </Table>
        {!data.goals.length && <EmptyState text="Add an employee goal to begin tracking KPIs." />}
      </Card>
    </>
  )
}
