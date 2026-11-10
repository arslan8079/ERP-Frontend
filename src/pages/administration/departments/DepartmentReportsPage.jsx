import { useState } from 'react'
import { departmentEmployees, departmentCurrency } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  FileBarChart,
  Printer,
  ArrowDownToLine,
  Search,
  RotateCcw,
  Building2,
  BadgeCheck,
  Users,
  Landmark,
  Activity,
  ClipboardList,
  Eye,
  Info,
} from 'lucide-react'

export default function DepartmentReportsPage({
  departments,
  employees,
  branches,
  onSelectDepartment,
  onNavigate,
}) {
  const [branchCode, setBranchCode] = useState('All Branches')
  const [status, setStatus] = useState('All Status')
  const [query, setQuery] = useState('')
  const searchTerm = query.trim().toLowerCase()
  const branchByCode = Object.fromEntries(branches.map((branch) => [branch.code, branch]))
  const reportRows = departments
    .map((department) => {
      const members = departmentEmployees(employees, department.code)
      return {
        ...department,
        employees: members.length,
        activeEmployees: members.filter((employee) => employee.status === 'Active').length,
        manager: employees.find((employee) => employee.id === department.managerId),
      }
    })
    .filter(
      (department) =>
        (branchCode === 'All Branches' || department.branchCode === branchCode) &&
        (status === 'All Status' || department.status === status) &&
        `${department.code} ${department.name} ${department.costCenter} ${department.manager?.name || ''}`
          .toLowerCase()
          .includes(searchTerm),
    )
  const headcount = reportRows.reduce((total, department) => total + department.employees, 0)
  const totalBudget = reportRows.reduce(
    (total, department) => total + (Number(department.budget) || 0),
    0,
  )
  const activeDepartments = reportRows.filter((department) => department.status === 'Active').length
  const maxEmployees = Math.max(1, ...reportRows.map((department) => department.employees))
  const exportReport = () => {
    const rows = [
      [
        'Department Code',
        'Department',
        'Branch',
        'Department Head',
        'Employees',
        'Active Employees',
        'Cost Center',
        'Annual Budget (PKR)',
        'Status',
      ],
      ...reportRows.map((department) => [
        department.code,
        department.name,
        branchByCode[department.branchCode]?.name || department.branchCode,
        department.manager?.name || '',
        department.employees,
        department.activeEmployees,
        department.costCenter,
        department.budget,
        department.status,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'department-reports.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  return (
    <div className="branch-list-page department-page department-reports-page">
      <header className="branch-list-banner department-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <FileBarChart size={37} />
          <div>
            <h1>Department Reports</h1>
            <p>Review workforce distribution and department budgets</p>
          </div>
        </div>
        <div className="branch-report-actions">
          <button type="button" onClick={() => window.print()}>
            <Printer size={15} />
            Print
          </button>
          <button type="button" onClick={exportReport}>
            <ArrowDownToLine size={15} />
            Export CSV
          </button>
        </div>
      </header>
      <section
        className="department-toolbar department-report-filters"
        aria-label="Department report filters"
      >
        <label className="department-search">
          <span>Search departments</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Department, code, head or cost center"
            />
          </span>
        </label>
        <label>
          <span>Branch</span>
          <select value={branchCode} onChange={(event) => setBranchCode(event.target.value)}>
            <option>All Branches</option>
            {branches.map((branch) => (
              <option key={branch.code} value={branch.code}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <button
          type="button"
          className="department-reset"
          onClick={() => {
            setQuery('')
            setBranchCode('All Branches')
            setStatus('All Status')
          }}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </section>
      <section className="department-summary department-report-summary">
        <article>
          <span className="department-summary-icon green">
            <Building2 size={20} />
          </span>
          <div>
            <span>Departments</span>
            <strong>{reportRows.length}</strong>
          </div>
        </article>
        <article>
          <span className="department-summary-icon blue">
            <BadgeCheck size={20} />
          </span>
          <div>
            <span>Active departments</span>
            <strong>{activeDepartments}</strong>
          </div>
        </article>
        <article>
          <span className="department-summary-icon purple">
            <Users size={20} />
          </span>
          <div>
            <span>Assigned employees</span>
            <strong>{headcount}</strong>
          </div>
        </article>
        <article>
          <span className="department-summary-icon orange">
            <Landmark size={20} />
          </span>
          <div>
            <span>Annual budget</span>
            <strong>{departmentCurrency(totalBudget)}</strong>
          </div>
        </article>
      </section>
      <div className="department-report-chart-card">
        <div className="department-table-heading">
          <div>
            <h2>
              <Activity size={17} />
              Workforce by department
            </h2>
            <p>Assigned employee count for selected departments</p>
          </div>
        </div>
        <div className="department-headcount-chart">
          {reportRows.map((department) => (
            <div className="department-headcount-row" key={department.code}>
              <span title={department.name}>{department.name}</span>
              <span>
                <i style={{ width: `${(department.employees / maxEmployees) * 100}%` }} />
              </span>
              <b>{department.employees}</b>
            </div>
          ))}
          {!reportRows.length && (
            <p className="department-empty">No departments match your filters.</p>
          )}
        </div>
      </div>
      <section className="department-table-card department-report-table-card">
        <div className="department-table-heading">
          <div>
            <h2>
              <ClipboardList size={17} />
              Department summary
            </h2>
            <p>{reportRows.length} records</p>
          </div>
          <span className="department-report-currency">Budget values in PKR</span>
        </div>
        <div className="department-table-wrap">
          <table className="department-table department-report-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Branch</th>
                <th>Department head</th>
                <th>Employees</th>
                <th>Active employees</th>
                <th>Cost center</th>
                <th>Annual budget</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((department) => (
                <tr key={department.code}>
                  <td>
                    <span className="department-identity">
                      <b>{department.name}</b>
                      <small>{department.code}</small>
                    </span>
                  </td>
                  <td>{branchByCode[department.branchCode]?.name || department.branchCode}</td>
                  <td>{department.manager?.name || 'Not assigned'}</td>
                  <td>{department.employees}</td>
                  <td>{department.activeEmployees}</td>
                  <td>{department.costCenter || '—'}</td>
                  <td>{departmentCurrency(department.budget)}</td>
                  <td>
                    <span className={`branch-status-pill ${department.status.toLowerCase()}`}>
                      {department.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="branch-report-view"
                      aria-label={`View ${department.name} details`}
                      onClick={() => {
                        onSelectDepartment(department.code)
                        onNavigate('Department Details')
                      }}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {!reportRows.length && (
                <tr>
                  <td className="department-empty" colSpan="9">
                    No departments match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="department-report-note">
        <Info size={15} />
        Reports reflect current department assignments and configured annual budgets.
      </footer>
    </div>
  )
}
