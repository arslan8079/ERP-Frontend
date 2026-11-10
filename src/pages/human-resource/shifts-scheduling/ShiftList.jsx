import { Clock3, Plus } from 'lucide-react'
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

export default function ShiftListPage({ data, updateData, onNavigate, onNotify }) {
  const toggle = (id) =>
    updateData(
      (current) => ({
        ...current,
        shifts: current.shifts.map((item) =>
          item.id === id
            ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
            : item,
        ),
      }),
      'Shift status updated',
    )
  return (
    <>
      <PageHeader
        title="Shift List"
        subtitle="Manage shift hours, break rules and working days."
        icon={Clock3}
        action={
          <Button onClick={() => onNavigate('Create Shift')}>
            <Plus size={15} />
            Create shift
          </Button>
        }
      />
      <div className="hr-shift-grid">
        {data.shifts.map((shift) => (
          <article className="hr-shift-card" key={shift.id}>
            <span className="hr-shift-icon">
              <Clock3 size={20} />
            </span>
            <span className={`hr-status ${shift.status.toLowerCase()}`}>{shift.status}</span>
            <h2>{shift.name}</h2>
            <p>{shift.id}</p>
            <div className="hr-shift-time">
              {shift.start}
              <i />
              {shift.end}
            </div>
            <dl>
              <div>
                <dt>Break</dt>
                <dd>{shift.breakMinutes} min</dd>
              </div>
              <div>
                <dt>Grace period</dt>
                <dd>{shift.graceMinutes} min</dd>
              </div>
              <div>
                <dt>Work days</dt>
                <dd>{shift.days}</dd>
              </div>
            </dl>
            <button className="hr-inline-action" onClick={() => toggle(shift.id)}>
              {shift.status === 'Active' ? 'Deactivate shift' : 'Activate shift'}
            </button>
          </article>
        ))}
      </div>
      {!data.shifts.length && (
        <Card title="No shifts created" icon={Clock3}>
          <EmptyState text="Create a shift to start assigning employees." />
        </Card>
      )}
    </>
  )
}
