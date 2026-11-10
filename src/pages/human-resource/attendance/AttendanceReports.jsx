import { Activity, CalendarCheck, CalendarDays, CheckCircle2, Clock3, Download } from 'lucide-react'
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

export default function AttendanceReports({ data, employees, onNotify }) {
  const attendance = data.attendance
  const days = [...new Set(attendance.map((item) => item.date))].sort().reverse()
  const rows = days.map((date) => {
    const records = attendance.filter((item) => item.date === date)
    return {
      date,
      present: records.filter((item) => ['Present', 'Late'].includes(item.status)).length,
      late: records.filter((item) => item.status === 'Late').length,
      absent: records.filter((item) => item.status === 'Absent').length,
      leave: records.filter((item) => item.status === 'On Leave').length,
    }
  })
  return (
    <>
      <PageHeader
        title="Attendance Reports"
        subtitle="Daily attendance totals and punctuality trends."
        icon={Activity}
        action={
          <Button
            kind="secondary"
            onClick={() =>
              downloadCsv(
                'attendance-report.csv',
                [
                  ['Date', 'Present / late', 'Late', 'Absent', 'On leave'],
                  ...rows.map((item) => [
                    item.date,
                    item.present,
                    item.late,
                    item.absent,
                    item.leave,
                  ]),
                ],
                onNotify,
              )
            }
          >
            <Download size={15} />
            Export report
          </Button>
        }
      />
      <div className="hr-stats compact">
        <Stat icon={CalendarDays} label="Days recorded" value={days.length} />
        <Stat
          icon={CheckCircle2}
          label="Average attendance"
          value={`${days.length ? Math.round(rows.reduce((sum, item) => sum + item.present, 0) / days.length) : 0}`}
          tone="blue"
        />
        <Stat
          icon={Clock3}
          label="Late marks"
          value={attendance.filter((item) => item.status === 'Late').length}
          tone="amber"
        />
      </div>
      <Card title="Daily summary" icon={CalendarCheck}>
        <Table
          headers={['Date', 'Present / late', 'Late', 'Absent', 'On leave', 'Attendance rate']}
        >
          {rows.map((item) => (
            <tr key={item.date}>
              <td>{formatDate(item.date)}</td>
              <td>{item.present}</td>
              <td>{item.late}</td>
              <td>{item.absent}</td>
              <td>{item.leave}</td>
              <td>
                {employees.length ? `${Math.round((item.present / employees.length) * 100)}%` : '—'}
              </td>
            </tr>
          ))}
        </Table>
        {!rows.length && (
          <EmptyState text="Attendance records will appear here after daily attendance is marked." />
        )}
      </Card>
    </>
  )
}
