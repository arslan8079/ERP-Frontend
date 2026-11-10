import { Activity, BadgeCheck, Download, FileText, Laptop, MapPin, Users } from 'lucide-react'
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

export default function EmployeeReports({ employees, branches, departments, data, onNotify }) {
  const exportRows = [
    ['Employee ID', 'Name', 'Title', 'Department', 'Branch', 'Status'],
    ...employees.map((item) => [
      item.id,
      item.name,
      item.role,
      item.departmentCode,
      item.branchCode,
      item.status,
    ]),
  ]
  return (
    <>
      <PageHeader
        title="Employee Reports"
        subtitle="Review workforce composition and export the current employee register."
        icon={Activity}
        action={
          <Button
            kind="secondary"
            onClick={() => downloadCsv('employee-report.csv', exportRows, onNotify)}
          >
            <Download size={15} />
            Export report
          </Button>
        }
      />
      <div className="hr-report-grid">
        <Stat icon={Users} label="Total headcount" value={employees.length} />
        <Stat
          icon={BadgeCheck}
          label="Active employees"
          value={employees.filter((item) => item.status === 'Active').length}
          tone="blue"
        />
        <Stat
          icon={Laptop}
          label="Contract workforce"
          value={employees.filter((item) => item.employmentType === 'Contract').length}
          tone="purple"
        />
        <Stat
          icon={FileText}
          label="Documents on file"
          value={data.documents.length}
          tone="amber"
        />
      </div>
      <div className="hr-profile-grid">
        <Card title="Employees by department" icon={Users}>
          {departments.map((department) => {
            const count = employees.filter((item) => item.departmentCode === department.code).length
            return (
              <MetricBar
                key={department.code}
                label={department.name}
                value={count}
                max={employees.length}
              />
            )
          })}
        </Card>
        <Card title="Employees by branch" icon={MapPin}>
          {branches.map((branch) => {
            const count = employees.filter((item) => item.branchCode === branch.code).length
            return (
              <MetricBar
                key={branch.code}
                label={branch.name}
                value={count}
                max={employees.length}
              />
            )
          })}
        </Card>
      </div>
    </>
  )
}
