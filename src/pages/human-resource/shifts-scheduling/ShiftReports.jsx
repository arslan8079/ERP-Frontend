import { Activity, BadgeCheck, CalendarCheck, Clock3, Download, Users } from 'lucide-react'
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

export default function ShiftReportsPage({ data, employees, onNotify }) {
  const reportRows = data.shifts.map((shift) => ({
    shift,
    count: data.rosters.filter((item) => item.shiftId === shift.id).length,
  }))
  return (
    <>
      <PageHeader
        title="Shift Reports"
        subtitle="Shift coverage and assigned headcount across the organization."
        icon={Activity}
        action={
          <Button
            kind="secondary"
            onClick={() =>
              downloadCsv(
                'shift-report.csv',
                [
                  ['Shift', 'Start', 'End', 'Days', 'Employees', 'Status'],
                  ...reportRows.map(({ shift, count }) => [
                    shift.name,
                    shift.start,
                    shift.end,
                    shift.days,
                    count,
                    shift.status,
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
        <Stat icon={Clock3} label="Defined shifts" value={data.shifts.length} />
        <Stat
          icon={BadgeCheck}
          label="Active shifts"
          value={data.shifts.filter((item) => item.status === 'Active').length}
          tone="blue"
        />
        <Stat
          icon={Users}
          label="Assigned employees"
          value={new Set(data.rosters.map((item) => item.employeeId)).size}
          tone="purple"
        />
      </div>
      <Card title="Shift coverage" icon={CalendarCheck}>
        <Table headers={['Shift', 'Hours', 'Working days', 'Assigned', 'Coverage']}>
          {reportRows.map(({ shift, count }) => (
            <tr key={shift.id}>
              <td>
                <b>{shift.name}</b>
                <small className="hr-cell-sub">{shift.id}</small>
              </td>
              <td>
                {shift.start}–{shift.end}
              </td>
              <td>{shift.days}</td>
              <td>{count}</td>
              <td>
                <div className="hr-inline-progress">
                  <i
                    style={{ width: `${employees.length ? (count / employees.length) * 100 : 0}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
