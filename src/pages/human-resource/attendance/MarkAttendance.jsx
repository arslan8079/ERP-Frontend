import { useState } from 'react'
import { CalendarCheck, Check, CheckCircle2, Info } from 'lucide-react'
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

export default function MarkAttendance({ data, employees, onMarkMany }) {
  const current = data.attendance.filter((item) => item.date === today())
  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries(
      employees.map((employee) => [
        employee.id,
        current.find((item) => item.employeeId === employee.id)?.status || 'Present',
      ]),
    ),
  )
  const save = () => onMarkMany(statuses)
  return (
    <>
      <PageHeader
        title="Mark Attendance"
        subtitle={`Set attendance status for ${formatDate(today())}. Changes are saved to the daily register.`}
        icon={CalendarCheck}
        action={
          <Button onClick={save}>
            <Check size={16} />
            Save attendance
          </Button>
        }
      />
      <Card title={`Mark attendance · ${employees.length} employees`} icon={CheckCircle2}>
        <div className="hr-attendance-list-form">
          {employees.map((employee) => (
            <label key={employee.id}>
              <span className="hr-person-chip">
                <b>{employee.name}</b>
                <small>
                  {employee.id} · {employee.role}
                </small>
              </span>
              <select
                aria-label={`Attendance status for ${employee.name}`}
                value={statuses[employee.id]}
                onChange={(event) =>
                  setStatuses({ ...statuses, [employee.id]: event.target.value })
                }
              >
                <option>Present</option>
                <option>Late</option>
                <option>Absent</option>
                <option>On Leave</option>
              </select>
            </label>
          ))}
        </div>
        <div className="hr-form-actions">
          <span>
            <Info size={15} />
            Selecting “Save attendance” updates the day register.
          </span>
          <Button onClick={save}>
            <Check size={16} />
            Save attendance
          </Button>
        </div>
      </Card>
    </>
  )
}
