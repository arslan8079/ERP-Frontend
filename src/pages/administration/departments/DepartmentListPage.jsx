import { useState } from 'react'
import { departmentEmployees, departmentCurrency } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  Users,
  Plus,
  Building2,
  BadgeCheck,
  Search,
  RotateCcw,
  ClipboardList,
  FileBarChart,
  Eye,
  Pencil,
  UserPlus,
  Power,
  Info,
} from 'lucide-react'

export default function DepartmentListPage({
  departments,
  employees,
  branches,
  onNavigate,
  onNotify,
  onSelectDepartment,
  onUpdateDepartment,
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [branchCode, setBranchCode] = useState('All Branches')
  const searchTerm = query.trim().toLowerCase()
  const branchByCode = Object.fromEntries(branches.map((branch) => [branch.code, branch]))
  const visibleDepartments = departments.filter((department) => {
    const manager = employees.find((employee) => employee.id === department.managerId)
    const matchesQuery =
      `${department.code} ${department.name} ${department.costCenter} ${manager?.name || ''}`
        .toLowerCase()
        .includes(searchTerm)
    return (
      matchesQuery &&
      (status === 'All' || department.status === status) &&
      (branchCode === 'All Branches' || department.branchCode === branchCode)
    )
  })
  const activeCount = departments.filter((department) => department.status === 'Active').length
  const assignedCount = departments.reduce(
    (total, department) => total + departmentEmployees(employees, department.code).length,
    0,
  )

  const toggleStatus = (department) => {
    const nextStatus = department.status === 'Active' ? 'Inactive' : 'Active'
    onUpdateDepartment(department.code, { status: nextStatus })
    onNotify(`${department.name} ${nextStatus === 'Active' ? 'activated' : 'deactivated'}`)
  }

  return (
    <div className="branch-list-page department-page">
      <header className="branch-list-banner department-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Users size={37} />
          <div>
            <h1>Department List</h1>
            <p>Manage teams, ownership, and department operations</p>
          </div>
        </div>
        <button
          type="button"
          className="branch-create-button department-banner-action"
          onClick={() => onNavigate('Create Department')}
        >
          <Plus size={17} />
          Create Department
        </button>
      </header>
      <section className="department-summary">
        <article>
          <span className="department-summary-icon green">
            <Building2 size={20} />
          </span>
          <div>
            <span>Total departments</span>
            <strong>{departments.length}</strong>
          </div>
        </article>
        <article>
          <span className="department-summary-icon blue">
            <BadgeCheck size={20} />
          </span>
          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
        </article>
        <article>
          <span className="department-summary-icon purple">
            <Users size={20} />
          </span>
          <div>
            <span>Assigned employees</span>
            <strong>{assignedCount}</strong>
          </div>
        </article>
      </section>
      <section className="department-toolbar" aria-label="Department filters">
        <label className="department-search">
          <span>Search departments</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, code, manager or cost center"
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
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <button
          type="button"
          className="department-reset"
          onClick={() => {
            setQuery('')
            setStatus('All')
            setBranchCode('All Branches')
          }}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </section>
      <section className="department-table-card">
        <div className="department-table-heading">
          <div>
            <h2>
              <ClipboardList size={17} />
              Departments
            </h2>
            <p>
              {visibleDepartments.length} of {departments.length} records
            </p>
          </div>
          <button
            type="button"
            className="department-subtle-action"
            onClick={() => onNavigate('Department Reports')}
          >
            <FileBarChart size={15} />
            View reports
          </button>
        </div>
        <div className="department-table-wrap">
          <table className="department-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Branch</th>
                <th>Department head</th>
                <th>Employees</th>
                <th>Cost center</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleDepartments.map((department) => {
                const branch = branchByCode[department.branchCode]
                const manager = employees.find((employee) => employee.id === department.managerId)
                return (
                  <tr key={department.code}>
                    <td>
                      <span className="department-identity">
                        <b>{department.name}</b>
                        <small>{department.code}</small>
                      </span>
                    </td>
                    <td>{branch?.name || 'Unassigned'}</td>
                    <td>{manager?.name || 'Not assigned'}</td>
                    <td>{departmentEmployees(employees, department.code).length}</td>
                    <td>{department.costCenter || '—'}</td>
                    <td>{departmentCurrency(department.budget)}</td>
                    <td>
                      <span className={`branch-status-pill ${department.status.toLowerCase()}`}>
                        {department.status}
                      </span>
                    </td>
                    <td>
                      <div className="department-row-actions">
                        <button
                          type="button"
                          aria-label={`View ${department.name}`}
                          title="View department"
                          onClick={() => {
                            onSelectDepartment(department.code)
                            onNavigate('Department Details')
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Edit ${department.name}`}
                          title="Edit department"
                          onClick={() => {
                            onSelectDepartment(department.code)
                            onNavigate('Edit Department')
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Assign employees to ${department.name}`}
                          title="Assign employees"
                          onClick={() => {
                            onSelectDepartment(department.code)
                            onNavigate('Assign Employees')
                          }}
                        >
                          <UserPlus size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`${department.status === 'Active' ? 'Deactivate' : 'Activate'} ${department.name}`}
                          title={`${department.status === 'Active' ? 'Deactivate' : 'Activate'} department`}
                          className={department.status === 'Active' ? 'deactivate' : 'activate'}
                          onClick={() => toggleStatus(department)}
                        >
                          <Power size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!visibleDepartments.length && (
                <tr>
                  <td className="department-empty" colSpan="8">
                    No departments match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="department-list-footer">
          <span>
            Active <b>{activeCount}</b>
            <i />
            Inactive <b>{departments.length - activeCount}</b>
          </span>
          <span>
            <Info size={15} />
            Inactive departments remain in reports; new employee assignments are disabled.
          </span>
        </footer>
      </section>
    </div>
  )
}
