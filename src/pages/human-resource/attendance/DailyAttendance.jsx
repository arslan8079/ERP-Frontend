import { CalendarCheck, CalendarDays, Check, CheckCircle2, Clock3, X } from 'lucide-react'
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

export default function AttendancePage({ data, employees, employeeName, onNavigate, onNotify }) {
  const records = data.attendance.filter((item) => item.date === today())
  const rows = employees.map(
    (employee) =>
      records.find((item) => item.employeeId === employee.id) || {
        employeeId: employee.id,
        date: today(),
        status: employee.status === 'Active' ? 'Unmarked' : 'Absent',
        checkIn: '',
        checkOut: '',
      },
  )
  return (
    <>
      <PageHeader
        title="Daily Attendance"
        subtitle={`Attendance register for ${formatDate(today())}.`}
        icon={CalendarCheck}
        action={
          <Button onClick={() => onNavigate('Mark Attendance')}>
            <Check size={15} />
            Mark attendance
          </Button>
        }
      />
      <div className="hr-stats compact">
        <Stat
          icon={CheckCircle2}
          label="Present"
          value={rows.filter((item) => item.status === 'Present').length}
        />
        <Stat
          icon={Clock3}
          label="Late"
          value={rows.filter((item) => item.status === 'Late').length}
          tone="amber"
        />
        <Stat
          icon={X}
          label="Absent"
          value={rows.filter((item) => item.status === 'Absent').length}
          tone="red"
        />
        <Stat
          icon={CalendarDays}
          label="On leave"
          value={rows.filter((item) => item.status === 'On Leave').length}
          tone="blue"
        />
      </div>
      <Card
        title={`Attendance register · ${rows.length} employees`}
        icon={CalendarCheck}
        className="hr-main-card"
      >
        <Table headers={['Employee', 'Department', 'Status', 'Check-in', 'Check-out', 'Note']}>
          {rows.map((item) => {
            const employee = employees.find((person) => person.id === item.employeeId)
            return (
              <tr key={item.employeeId}>
                <td>
                  <b>{employeeName(item.employeeId)}</b>
                  <small className="hr-cell-sub">{item.employeeId}</small>
                </td>
                <td>{employee?.departmentCode}</td>
                <td>
                  <span className={`hr-status ${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.checkIn || '—'}</td>
                <td>{item.checkOut || '—'}</td>
                <td>{item.note || '—'}</td>
              </tr>
            )
          })}
        </Table>
      </Card>
    </>
  )
}
