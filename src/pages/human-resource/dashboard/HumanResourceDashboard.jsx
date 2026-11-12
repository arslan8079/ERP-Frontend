import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  Pencil,
  ShieldCheck,
  Star,
  TrendingUp,
  UserPlus,
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

export default function HRDashboard({ data, employees, departmentName, onNavigate }) {
  const present = data.attendance.filter(
    (item) => item.date === today() && item.status === 'Present',
  ).length
  const late = data.attendance.filter(
    (item) => item.date === today() && item.status === 'Late',
  ).length
  const checkedIn = present + late
  const pendingLeave = data.leaveRequests.filter((item) => item.status === 'Pending').length
  const active = employees.filter((item) => item.status === 'Active').length
  const quickLinks = [
    'Employee Directory',
    'Daily Attendance',
    'Leave Approvals',
    'Employee Exit & Clearance',
    'Employee Rosters',
  ]
  return (
    <>
      <PageHeader
        title="Human Resource Management"
        subtitle="People, attendance, leave and performance at a glance."
        icon={Users}
        action={
          <Button onClick={() => onNavigate('Add Employee')}>
            <UserPlus size={16} />
            Add Employee
          </Button>
        }
      />
      <div className="hr-stats">
        <Stat
          icon={Users}
          label="Active employees"
          value={active}
          hint={`${employees.length} total records`}
        />
        <Stat
          icon={CalendarCheck}
          label="Checked in today"
          value={`${checkedIn}/${active}`}
          tone="blue"
        />
        <Stat
          icon={CalendarDays}
          label="Leave requests"
          value={pendingLeave}
          tone="amber"
          hint="Awaiting review"
        />
        <Stat
          icon={TrendingUp}
          label="Reviews completed"
          value={data.reviews.length}
          tone="purple"
          hint="Current cycle"
        />
      </div>
      <div className="hr-dashboard-grid">
        <Card
          title="Today’s attendance"
          icon={Clock3}
          action={
            <Button kind="link" onClick={() => onNavigate('Daily Attendance')}>
              View attendance <ArrowRight size={14} />
            </Button>
          }
        >
          <div className="hr-attendance-overview">
            <div
              className="hr-donut"
              style={{ '--percent': `${active ? (checkedIn / active) * 100 : 0}%` }}
            >
              <strong>{active ? Math.round((checkedIn / active) * 100) : 0}%</strong>
              <small>on site</small>
            </div>
            <div className="hr-legend">
              <span>
                <i className="present-dot" />
                Present <b>{present}</b>
              </span>
              <span>
                <i className="late-dot" />
                Late <b>{late}</b>
              </span>
              <span>
                <i className="absent-dot" />
                Absent / leave <b>{Math.max(0, active - checkedIn)}</b>
              </span>
            </div>
          </div>
        </Card>
        <Card title="Needs your attention" icon={ShieldCheck}>
          <div className="hr-attention-list">
            <button onClick={() => onNavigate('Leave Approvals')}>
              <span className="hr-attention-icon amber">
                <CalendarDays size={17} />
              </span>
              <span>
                <b>{pendingLeave} leave requests</b>
                <small>Waiting for manager review</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => onNavigate('Attendance Corrections')}>
              <span className="hr-attention-icon blue">
                <Pencil size={17} />
              </span>
              <span>
                <b>
                  {data.corrections.filter((item) => item.status === 'Pending').length} attendance
                  corrections
                </b>
                <small>Submitted by employees</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => onNavigate('Performance Reviews')}>
              <span className="hr-attention-icon purple">
                <Star size={17} />
              </span>
              <span>
                <b>Performance cycle</b>
                <small>{data.reviews.length} reviews recorded this cycle</small>
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </Card>
        <Card title="Quick access" icon={Activity} className="hr-quick-card">
          <div className="hr-quick-links">
            {quickLinks.map((item) => (
              <button key={item} onClick={() => onNavigate(item)}>
                <ArrowRight size={15} />
                {item}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Recent people updates" icon={Clock3} className="hr-recent-card">
          <Table headers={['Employee', 'Department', 'Status']}>
            {employees.slice(0, 5).map((employee) => (
              <tr key={employee.id}>
                <td>
                  <button className="hr-table-link" onClick={() => onNavigate('Employee Profile')}>
                    {employee.name}
                    <small>{employee.id}</small>
                  </button>
                </td>
                <td>{departmentName(employee.departmentCode)}</td>
                <td>
                  <span className={`hr-status ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </>
  )
}
