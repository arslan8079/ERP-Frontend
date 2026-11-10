import { useState } from 'react'
import { Check, ChevronRight, Clock3, Info } from 'lucide-react'
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

export default function ShiftForm({ data, updateData, onNavigate, onNotify }) {
  const [form, setForm] = useState({
    name: '',
    start: '09:00',
    end: '17:00',
    breakMinutes: 60,
    graceMinutes: 10,
    days: 'Mon–Fri',
  })
  const submit = (event) => {
    event.preventDefault()
    if (form.end <= form.start) return onNotify('Shift end time must be after the start time.')
    if (data.shifts.some((item) => item.name.toLowerCase() === form.name.trim().toLowerCase()))
      return onNotify('A shift with this name already exists.')
    if (
      !updateData(
        (current) => ({
          ...current,
          shifts: [
            ...current.shifts,
            {
              ...form,
              id: `SH-${String(Date.now()).slice(-5)}`,
              name: form.name.trim(),
              status: 'Active',
            },
          ],
        }),
        'Shift created successfully',
      )
    )
      return
    onNavigate('Shift List')
  }
  return (
    <>
      <PageHeader
        title="Create Shift"
        subtitle="Define working hours and grace rules for a new employee shift."
        icon={Clock3}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Shift List')}>
            Shift list <ChevronRight size={15} />
          </Button>
        }
      />
      <form className="hr-form-card hr-shift-form" onSubmit={submit}>
        <h2>
          <Clock3 size={18} />
          Shift details
        </h2>
        <div className="hr-form-grid">
          <label className="wide">
            <span>
              Shift name <b>*</b>
            </span>
            <input
              required
              maxLength="80"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Night production"
            />
          </label>
          <label>
            <span>Start time</span>
            <input
              type="time"
              required
              value={form.start}
              onChange={(event) => setForm({ ...form, start: event.target.value })}
            />
          </label>
          <label>
            <span>End time</span>
            <input
              type="time"
              required
              value={form.end}
              onChange={(event) => setForm({ ...form, end: event.target.value })}
            />
          </label>
          <label>
            <span>Break (minutes)</span>
            <input
              type="number"
              min="0"
              max="240"
              value={form.breakMinutes}
              onChange={(event) => setForm({ ...form, breakMinutes: Number(event.target.value) })}
            />
          </label>
          <label>
            <span>Grace period (minutes)</span>
            <input
              type="number"
              min="0"
              max="120"
              value={form.graceMinutes}
              onChange={(event) => setForm({ ...form, graceMinutes: Number(event.target.value) })}
            />
          </label>
          <label>
            <span>Working days</span>
            <select
              value={form.days}
              onChange={(event) => setForm({ ...form, days: event.target.value })}
            >
              <option>Mon–Fri</option>
              <option>Mon–Sat</option>
              <option>Sun–Thu</option>
              <option>All days</option>
            </select>
          </label>
        </div>
        <div className="hr-form-actions">
          <span>
            <Info size={15} />
            Shift rules apply to future assignments.
          </span>
          <div>
            <Button kind="secondary" onClick={() => onNavigate('Shift List')}>
              Cancel
            </Button>
            <Button type="submit">
              <Check size={15} />
              Save shift
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
