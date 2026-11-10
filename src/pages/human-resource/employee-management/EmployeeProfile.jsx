import { BadgeCheck, FileText, Pencil, TrendingUp, Users } from 'lucide-react'
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

export default function EmployeeProfile({
  selectedEmployee: employee,
  selectEmployee,
  employees,
  branches,
  departments,
  onNavigate,
}) {
  if (!employee) return <EmptyState text="Add an employee before opening a profile." />
  return (
    <>
      <PageHeader
        title="Employee Profile"
        subtitle="Review employment details and manage an employee’s record."
        icon={Users}
        action={
          <label className="hr-select-employee">
            <Users size={15} />
            <select value={employee.id} onChange={(event) => selectEmployee(event.target.value)}>
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.id}
                </option>
              ))}
            </select>
          </label>
        }
      />
      <section className="hr-profile-hero">
        <div className="hr-avatar">
          {employee.name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="hr-profile-identity">
          <span>
            {employee.id} · {employee.employmentType}
          </span>
          <h2>{employee.name}</h2>
          <p>
            {employee.role} <i />{' '}
            {departments.find((item) => item.code === employee.departmentCode)?.name ||
              employee.departmentCode}
          </p>
        </div>
        <span className={`hr-status ${employee.status.toLowerCase()}`}>{employee.status}</span>
        <div className="hr-profile-actions">
          <Button kind="secondary" onClick={() => onNavigate('Edit Employee')}>
            <Pencil size={15} />
            Edit profile
          </Button>
          <Button kind="secondary" onClick={() => onNavigate('Employee Documents')}>
            <FileText size={15} />
            Documents
          </Button>
          <Button onClick={() => onNavigate('Transfers & Promotions')}>
            <TrendingUp size={15} />
            Career change
          </Button>
        </div>
      </section>
      <div className="hr-profile-grid">
        <Card title="Personal details" icon={Users}>
          <dl className="hr-details">
            <div>
              <dt>Email</dt>
              <dd>{employee.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{employee.phone}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{employee.gender}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{employee.address}</dd>
            </div>
            <div>
              <dt>Emergency contact</dt>
              <dd>{employee.emergencyContact}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Employment information" icon={BadgeCheck}>
          <dl className="hr-details">
            <div>
              <dt>Job title</dt>
              <dd>{employee.role}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>
                {departments.find((item) => item.code === employee.departmentCode)?.name ||
                  employee.departmentCode}
              </dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>
                {branches.find((item) => item.code === employee.branchCode)?.name ||
                  employee.branchCode}
              </dd>
            </div>
            <div>
              <dt>Joining date</dt>
              <dd>{formatDate(employee.hireDate)}</dd>
            </div>
            <div>
              <dt>Reporting manager</dt>
              <dd>{employee.manager}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  )
}
