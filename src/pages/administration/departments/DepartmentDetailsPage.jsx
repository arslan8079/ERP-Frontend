import {
  Info,
  Users,
  ArrowLeft,
  Building2,
  UserPlus,
  Activity,
  Pencil,
  Power,
  Settings,
} from 'lucide-react'
import { departmentEmployees, departmentCurrency } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'

export default function DepartmentDetailsPage({
  department,
  employees,
  branches,
  onNavigate,
  onNotify,
  onUpdateDepartment,
}) {
  if (!department)
    return (
      <div className="branch-list-page department-page">
        <div className="branch-list-notice">
          <Info size={18} />
          Select a department from the Department List first.
        </div>
        <button
          type="button"
          className="branch-create-button"
          onClick={() => onNavigate('Department List')}
        >
          Department List
        </button>
      </div>
    )
  const members = departmentEmployees(employees, department.code)
  const manager = employees.find((employee) => employee.id === department.managerId)
  const branch = branches.find((item) => item.code === department.branchCode)
  const toggleStatus = () => {
    const status = department.status === 'Active' ? 'Inactive' : 'Active'
    onUpdateDepartment(department.code, { status })
    onNotify(`${department.name} ${status === 'Active' ? 'activated' : 'deactivated'}`)
  }
  return (
    <div className="branch-list-page department-page department-details-page">
      <header className="branch-list-banner department-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Users size={37} />
          <div>
            <h1>Department Details</h1>
            <p>Department profile, leadership, and assigned employees</p>
          </div>
        </div>
        <button
          type="button"
          className="branch-back-button"
          onClick={() => onNavigate('Department List')}
        >
          <ArrowLeft size={16} />
          Department List
        </button>
      </header>
      <section className="department-detail-summary">
        <span>
          <Users size={25} />
        </span>
        <div>
          <small>
            {department.code} · {department.costCenter || 'No cost center'}
          </small>
          <h2>{department.name}</h2>
          <p>
            <Building2 size={14} />
            {branch?.name || 'Branch not assigned'}
          </p>
        </div>
        <span className={`branch-status-pill ${department.status.toLowerCase()}`}>
          {department.status}
        </span>
      </section>
      <div className="department-detail-grid">
        <section className="department-detail-card">
          <h3>
            <Building2 size={17} />
            Department information
          </h3>
          <dl>
            <div>
              <dt>Department code</dt>
              <dd>{department.code}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{department.branchName || department.branchCode}</dd>
            </div>
            <div>
              <dt>Department head</dt>
              <dd>{manager?.name || 'Not assigned'}</dd>
            </div>
            <div>
              <dt>Annual budget</dt>
              <dd>{departmentCurrency(department.budget)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`branch-status-pill ${department.status.toLowerCase()}`}>
                  {department.status}
                </span>
              </dd>
            </div>
            <div>
              <dt>Cost center</dt>
              <dd>{department.costCenter || 'Not set'}</dd>
            </div>
            <div>
              <dt>Contact email</dt>
              <dd>{department.email || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Contact number</dt>
              <dd>{department.phone || 'Not provided'}</dd>
            </div>
            <div className="department-detail-full">
              <dt>Description</dt>
              <dd>{department.description || 'No description provided.'}</dd>
            </div>
          </dl>
        </section>
        <section className="department-detail-card department-members-card">
          <div className="department-detail-members-heading">
            <h3>
              <Users size={17} />
              Team members
            </h3>
            <span>{members.length} employees</span>
            <button
              type="button"
              className="department-subtle-action"
              onClick={() => onNavigate('Assign Employees')}
            >
              <UserPlus size={15} />
              Assign
            </button>
          </div>
          <div className="department-members-list">
            {members.length ? (
              members.map((employee) => (
                <article key={employee.id}>
                  <span className="department-member-avatar">
                    {employee.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <div>
                    <b>{employee.name}</b>
                    <small>
                      {employee.role} · {employee.id}
                    </small>
                  </div>
                  <span className={`department-employee-status ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </article>
              ))
            ) : (
              <p className="department-empty">No employees are assigned to this department.</p>
            )}
          </div>
        </section>
        <aside className="department-detail-card department-status-card">
          <h3>
            <Activity size={17} />
            Department status
          </h3>
          <p>
            {department.status === 'Active'
              ? 'This department is available for employee assignments and operational workflows.'
              : 'This department is inactive. Existing employee records remain available, but new assignments are disabled.'}
          </p>
          <div className="department-status-actions">
            <button
              type="button"
              className="department-subtle-action"
              onClick={() => onNavigate('Edit Department')}
            >
              <Pencil size={15} />
              Edit profile
            </button>
            <button
              type="button"
              className={
                department.status === 'Active'
                  ? 'branch-detail-deactivate'
                  : 'branch-detail-activate'
              }
              onClick={toggleStatus}
            >
              <Power size={15} />
              {department.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
            <button
              type="button"
              className="department-subtle-action"
              onClick={() => onNavigate('Department Settings')}
            >
              <Settings size={15} />
              Settings
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
