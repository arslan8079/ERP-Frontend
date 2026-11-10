import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  TrendingUp,
  Users,
} from 'lucide-react'
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

export default function LeaveReportsPage({ data, employees, onNotify }) {
  const requests = data.leaveRequests
  const exportData = [
    ['Request', 'Employee ID', 'Leave type', 'Start', 'End', 'Days', 'Status'],
    ...requests.map((item) => [
      item.id,
      item.employeeId,
      data.leaveTypes.find((type) => type.id === item.typeId)?.name,
      item.startDate,
      item.endDate,
      item.days,
      item.status,
    ]),
  ]
  return (
    <>
      <PageHeader
        title="Leave Reports"
        subtitle="Leave utilization, request outcomes and workforce availability."
        icon={Activity}
        action={
          <Button
            kind="secondary"
            onClick={() => downloadCsv('leave-report.csv', exportData, onNotify)}
          >
            <Download size={15} />
            Export report
          </Button>
        }
      />
      <div className="hr-stats compact">
        <Stat icon={CalendarDays} label="Leave requests" value={requests.length} />
        <Stat
          icon={CheckCircle2}
          label="Approved days"
          value={requests
            .filter((item) => item.status === 'Approved')
            .reduce((sum, item) => sum + item.days, 0)}
          tone="blue"
        />
        <Stat
          icon={Clock3}
          label="Awaiting review"
          value={requests.filter((item) => item.status === 'Pending').length}
          tone="amber"
        />
        <Stat icon={Users} label="Employees" value={employees.length} tone="purple" />
      </div>
      <Card title="Leave utilization by type" icon={TrendingUp}>
        {data.leaveTypes.map((type) => {
          const used = requests
            .filter((item) => item.typeId === type.id && item.status === 'Approved')
            .reduce((sum, item) => sum + item.days, 0)
          return (
            <MetricBar
              key={type.id}
              label={`${type.name} · ${used}/${type.days} days used`}
              value={used}
              max={type.days}
            />
          )
        })}
      </Card>
    </>
  )
}
