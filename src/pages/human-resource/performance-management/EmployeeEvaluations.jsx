import { useState } from 'react'
import { Check, ChevronRight, Info, Star } from 'lucide-react'
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

export default function EvaluationForm({ data, updateData, employees, onNavigate, onNotify }) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    period: 'Q4 2026',
    rating: 3,
    notes: '',
  })
  const submit = (event) => {
    event.preventDefault()
    if (!form.notes.trim()) return onNotify('Add review feedback before saving this evaluation.')
    if (
      !updateData(
        (current) => ({
          ...current,
          reviews: [
            {
              ...form,
              id: `PR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
              rating: Number(form.rating),
              notes: form.notes.trim(),
              status: 'Completed',
            },
            ...current.reviews,
          ],
        }),
        'Performance evaluation saved',
      )
    )
      return
    onNavigate('Performance Reviews')
  }
  return (
    <>
      <PageHeader
        title="Employee Evaluations"
        subtitle="Record a structured performance assessment and manager feedback."
        icon={Star}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Performance Reviews')}>
            Review register <ChevronRight size={15} />
          </Button>
        }
      />
      <form className="hr-form-card" onSubmit={submit}>
        <h2>
          <Star size={18} />
          Performance evaluation
        </h2>
        <div className="hr-form-grid">
          <label>
            <span>Employee</span>
            <select
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
            <span>Review period</span>
            <select
              value={form.period}
              onChange={(event) => setForm({ ...form, period: event.target.value })}
            >
              <option>Q4 2026</option>
              <option>Q3 2026</option>
              <option>H1 2026</option>
              <option>Annual 2026</option>
            </select>
          </label>
          <label>
            <span>Overall rating</span>
            <select
              value={form.rating}
              onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
            >
              <option value="5">5 · Exceptional</option>
              <option value="4">4 · Exceeds expectations</option>
              <option value="3">3 · Meets expectations</option>
              <option value="2">2 · Needs improvement</option>
              <option value="1">1 · Unsatisfactory</option>
            </select>
          </label>
          <label className="wide">
            <span>Manager feedback</span>
            <textarea
              required
              rows="4"
              maxLength="800"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Summarize achievements, strengths, and development areas"
            />
          </label>
        </div>
        <div className="hr-form-actions">
          <span>
            <Info size={15} />
            Evaluation is added to the employee’s review history.
          </span>
          <Button type="submit">
            <Check size={15} />
            Save evaluation
          </Button>
        </div>
      </form>
    </>
  )
}
