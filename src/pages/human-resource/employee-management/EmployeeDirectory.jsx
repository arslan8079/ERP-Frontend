import {
  BadgeCheck,
  ChevronRight,
  Download,
  Filter,
  Laptop,
  Search,
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

export default function EmployeeDirectory({
  employees,
  filteredEmployees,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  selectEmployee,
  onNavigate,
  onNotify,
}) {
  const exportCsv = () => {
    const rows = [
      ['Employee ID', 'Name', 'Job title', 'Department', 'Branch', 'Email', 'Status'],
      ...filteredEmployees.map((item) => [
        item.id,
        item.name,
        item.role,
        item.departmentCode,
        item.branchCode,
        item.email,
        item.status,
      ]),
    ]
    downloadCsv('employee-directory.csv', rows, onNotify)
  }
  return (
    <>
      <PageHeader
        title="Employee Directory"
        subtitle="Search and manage your organization’s employee records."
        icon={Users}
        action={
          <>
            <Button kind="secondary" onClick={exportCsv}>
              <Download size={15} />
              Export
            </Button>
            <Button onClick={() => onNavigate('Add Employee')}>
              <UserPlus size={16} />
              Add employee
            </Button>
          </>
        }
      />
      <div className="hr-stats compact">
        <Stat icon={Users} label="Total employees" value={employees.length} />
        <Stat
          icon={BadgeCheck}
          label="Active"
          value={employees.filter((item) => item.status === 'Active').length}
          tone="blue"
        />
        <Stat
          icon={Laptop}
          label="On contract"
          value={employees.filter((item) => item.employmentType === 'Contract').length}
          tone="purple"
        />
      </div>
      <Card
        title={`Employee records · ${filteredEmployees.length}`}
        icon={Users}
        className="hr-main-card"
      >
        <div className="hr-toolbar">
          <label className="hr-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, ID, email or job title"
            />
          </label>
          <label className="hr-filter">
            <Filter size={15} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>
        <Table
          headers={['Employee', 'Job title', 'Department', 'Branch', 'Employment', 'Status', '']}
        >
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <button
                  className="hr-table-link"
                  onClick={() => {
                    selectEmployee(employee.id)
                    onNavigate('Employee Profile')
                  }}
                >
                  {employee.name}
                  <small>
                    {employee.id} · {employee.email}
                  </small>
                </button>
              </td>
              <td>{employee.role}</td>
              <td>{employee.departmentCode}</td>
              <td>{employee.branchCode}</td>
              <td>{employee.employmentType}</td>
              <td>
                <span className={`hr-status ${employee.status.toLowerCase()}`}>
                  {employee.status}
                </span>
              </td>
              <td>
                <button
                  className="hr-icon-button"
                  aria-label={`View ${employee.name}`}
                  onClick={() => {
                    selectEmployee(employee.id)
                    onNavigate('Employee Profile')
                  }}
                >
                  <ChevronRight size={17} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {!filteredEmployees.length && <EmptyState text="No employees match your search." />}
      </Card>
    </>
  )
}
