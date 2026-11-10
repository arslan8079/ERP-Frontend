import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import { UserPlus, Search, Users, Save, Building2 } from 'lucide-react'

export default function AssignEmployeesPage({
  departments,
  employees,
  branches,
  onAssign,
  onSelectDepartment,
  selectedDepartmentCode,
}) {
  const [departmentCode, setDepartmentCode] = useState(
    selectedDepartmentCode || departments[0]?.code || '',
  )
  const [selectedIds, setSelectedIds] = useState(() =>
    employees
      .filter(
        (employee) => employee.departmentCode === (selectedDepartmentCode || departments[0]?.code),
      )
      .map((employee) => employee.id),
  )
  const [query, setQuery] = useState('')
  const department = departments.find((item) => item.code === departmentCode)
  const branch = branches.find((item) => item.code === department?.branchCode)
  const normalizedQuery = query.trim().toLowerCase()
  const currentAssignedIds = employees
    .filter((employee) => employee.departmentCode === departmentCode)
    .map((employee) => employee.id)
  const pendingAssignmentChanges =
    selectedIds.filter((id) => !currentAssignedIds.includes(id)).length +
    currentAssignedIds.filter((id) => !selectedIds.includes(id)).length
  const availableEmployees = employees.filter(
    (employee) =>
      (employee.status === 'Active' || employee.departmentCode === departmentCode) &&
      `${employee.name} ${employee.id} ${employee.role} ${employee.email}`
        .toLowerCase()
        .includes(normalizedQuery),
  )
  const toggleEmployee = (employeeId) =>
    setSelectedIds((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    )
  const changeDepartment = (nextCode) => {
    setDepartmentCode(nextCode)
    onSelectDepartment(nextCode)
    setSelectedIds(
      employees
        .filter((employee) => employee.departmentCode === nextCode)
        .map((employee) => employee.id),
    )
  }
  const save = () => {
    if (!department || department.status !== 'Active') return
    onAssign(department.code, selectedIds)
  }

  return (
    <div className="branch-list-page department-page department-assign-page">
      <header className="branch-list-banner department-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <UserPlus size={37} />
          <div>
            <h1>Assign Employees</h1>
            <p>Manage department membership and team ownership</p>
          </div>
        </div>
      </header>
      <section className="department-assignment-toolbar">
        <label>
          <span>Department</span>
          <select value={departmentCode} onChange={(event) => changeDepartment(event.target.value)}>
            {departments.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="department-assignment-search">
          <span>Find employees</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, employee ID, role..."
            />
          </span>
        </label>
        <div className="department-assignment-count">
          <Users size={17} />
          <b>{selectedIds.length}</b> selected
        </div>
        <button
          type="button"
          className="branch-save-button"
          disabled={!department || department.status !== 'Active'}
          onClick={save}
        >
          <Save size={16} />
          Save assignments
        </button>
      </section>
      {department?.status === 'Inactive' && (
        <p className="department-form-error" role="status">
          Activate this department before changing employee assignments.
        </p>
      )}
      <div className="department-assignment-layout">
        <section className="department-assignment-card">
          <div className="department-assignment-heading">
            <div>
              <h2>
                <Users size={17} />
                Employee directory
              </h2>
              <p>Employees assigned to other departments will move when selected.</p>
            </div>
            <span>{availableEmployees.length} employees</span>
          </div>
          <div className="department-employee-list">
            {availableEmployees.map((employee) => {
              const currentDepartment = departments.find(
                (item) => item.code === employee.departmentCode,
              )
              const checked = selectedIds.includes(employee.id)
              return (
                <label
                  className={`department-employee-row ${checked ? 'selected' : ''}`}
                  key={employee.id}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={
                      !department ||
                      department.status !== 'Active' ||
                      (employee.status !== 'Active' && employee.departmentCode !== departmentCode)
                    }
                    onChange={() => toggleEmployee(employee.id)}
                  />
                  <span className="department-member-avatar">
                    {employee.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <span className="department-employee-copy">
                    <b>{employee.name}</b>
                    <small>
                      {employee.role} · {employee.id}
                      {employee.status !== 'Active' ? ' · Inactive' : ''}
                    </small>
                  </span>
                  <span className="department-employee-current">
                    {employee.departmentCode === departmentCode
                      ? 'This department'
                      : currentDepartment?.name || 'Unassigned'}
                  </span>
                  <span className="department-employee-branch">
                    {branches.find((item) => item.code === employee.branchCode)?.name ||
                      employee.branchCode}
                  </span>
                </label>
              )
            })}
            {!availableEmployees.length && (
              <p className="department-empty">No active employees match your search.</p>
            )}
          </div>
        </section>
        <aside className="department-assignment-aside">
          <span className="department-summary-icon green">
            <Building2 size={22} />
          </span>
          <h2>{department?.name || 'Select a department'}</h2>
          <p>{branch?.name || 'No branch selected'}</p>
          <div>
            <span>Department code</span>
            <b>{department?.code || '—'}</b>
          </div>
          <div>
            <span>Department head</span>
            <b>
              {employees.find((employee) => employee.id === department?.managerId)?.name ||
                'Not assigned'}
            </b>
          </div>
          <div>
            <span>Currently assigned</span>
            <b>{currentAssignedIds.length}</b>
          </div>
          <div>
            <span>Changes to save</span>
            <b>{pendingAssignmentChanges} employee(s)</b>
          </div>
        </aside>
      </div>
    </div>
  )
}
