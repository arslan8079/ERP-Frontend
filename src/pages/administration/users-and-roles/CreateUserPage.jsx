import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import {
  UserPlus,
  ArrowLeft,
  UserRound,
  ShieldCheck,
  Save,
  Info,
  KeyRound,
  Building2,
} from 'lucide-react'

export default function CreateUserPage({
  users,
  roles,
  branches,
  departments,
  employees,
  user,
  onNavigate,
  onSaveUser,
}) {
  const isEditing = Boolean(user)
  const [form, setForm] = useState(
    () =>
      user || {
        name: '',
        username: '',
        email: '',
        phone: '',
        roleCode: '',
        branchCode: branches.find((item) => item.status === 'Active')?.code || '',
        departmentCode: '',
        employeeId: '',
        status: 'Active',
      },
  )
  const [error, setError] = useState('')
  const activeRoles = roles.filter((role) => role.status === 'Active')
  const activeBranches = branches.filter((branch) => branch.status === 'Active')
  const selectedBranch = branches.find((branch) => branch.code === form.branchCode)
  const branchDepartments = departments.filter(
    (department) => department.branchCode === form.branchCode && department.status === 'Active',
  )
  const userId =
    user?.id ||
    `USR-${String(Math.max(0, ...users.map((item) => Number(item.id.replace('USR-', '')) || 0)) + 1).padStart(4, '0')}`
  const updateField = (event) => {
    const { name, value } = event.target
    if (name === 'branchCode')
      setForm((current) => ({ ...current, branchCode: value, departmentCode: '', employeeId: '' }))
    else if (name === 'employeeId') {
      const employee = employees.find((item) => item.id === value)
      setForm((current) =>
        employee
          ? {
              ...current,
              employeeId: value,
              name: employee.name,
              email: employee.email,
              phone: '',
              branchCode: employee.branchCode,
              departmentCode: employee.departmentCode,
            }
          : { ...current, employeeId: '' },
      )
    } else setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }
  const submit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const username = form.username.trim().toLowerCase()
    const email = form.email.trim().toLowerCase()
    if (!name || !username || !email) return setError('Name, username, and email are required.')
    if (!/^[a-z0-9._-]{3,32}$/.test(username))
      return setError(
        'Username must be 3–32 characters and contain only letters, numbers, dots, underscores, or hyphens.',
      )
    if (users.some((item) => item.id !== user?.id && item.username.toLowerCase() === username))
      return setError('This username is already in use.')
    if (users.some((item) => item.id !== user?.id && item.email.toLowerCase() === email))
      return setError('An account already uses this email address.')
    if (
      users.some(
        (item) => item.id !== user?.id && form.employeeId && item.employeeId === form.employeeId,
      )
    )
      return setError('This employee already has a sign-in account.')
    if (!activeRoles.some((role) => role.code === form.roleCode))
      return setError('Select an active security role.')
    if (!activeBranches.some((branch) => branch.code === form.branchCode))
      return setError('Select an active branch.')
    if (
      form.departmentCode &&
      !branchDepartments.some((department) => department.code === form.departmentCode)
    )
      return setError('Select an active department from the selected branch.')
    const savedUser = onSaveUser(
      {
        ...form,
        name,
        username,
        email,
        phone: form.phone.trim(),
        roleName: activeRoles.find((role) => role.code === form.roleCode)?.name || '',
      },
      user?.id || '',
    )
    if (savedUser) onNavigate('Users List')
  }

  return (
    <div className="branch-list-page access-page access-form-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <UserPlus size={37} />
          <div>
            <h1>{isEditing ? 'Edit User' : 'Create User'}</h1>
            <p>
              {isEditing
                ? 'Update sign-in identity, role, and organization access'
                : 'Create an ERP account with the right role and branch scope'}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="branch-back-button"
          onClick={() => onNavigate('Users List')}
        >
          <ArrowLeft size={16} />
          Users List
        </button>
      </header>
      <div className="access-form-layout">
        <form className="access-form-card" onSubmit={submit}>
          <div className="access-form-section-heading">
            <span>
              <UserRound size={18} />
            </span>
            <div>
              <h2>Account identity</h2>
              <p>Sign-in information and employee linkage.</p>
            </div>
          </div>
          {error && (
            <p className="access-form-error" role="alert">
              {error}
            </p>
          )}
          <div className="access-form-grid">
            <label>
              <span>Employee record</span>
              <select name="employeeId" value={form.employeeId || ''} onChange={updateField}>
                <option value="">No linked employee</option>
                {employees
                  .filter(
                    (employee) =>
                      employee.status === 'Active' &&
                      !users.some(
                        (item) => item.id !== user?.id && item.employeeId === employee.id,
                      ),
                  )
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} · {employee.id}
                    </option>
                  ))}
              </select>
              <small>Linking an employee fills their name and email.</small>
            </label>
            <label>
              <span>
                Full name <b>*</b>
              </span>
              <input
                name="name"
                required
                maxLength="90"
                value={form.name}
                onChange={updateField}
                placeholder="Enter the user's name"
                autoComplete="name"
              />
            </label>
            <label>
              <span>
                Username <b>*</b>
              </span>
              <input
                name="username"
                required
                minLength="3"
                maxLength="32"
                value={form.username}
                onChange={updateField}
                placeholder="e.g. sara.ahmed"
                autoComplete="username"
              />
              <small>Letters, numbers, dot, underscore, or hyphen.</small>
            </label>
            <label>
              <span>
                Email address <b>*</b>
              </span>
              <input
                name="email"
                type="email"
                required
                maxLength="120"
                value={form.email}
                onChange={updateField}
                placeholder="user@company.com"
                autoComplete="email"
              />
            </label>
            <label>
              <span>Contact number</span>
              <input
                name="phone"
                type="tel"
                maxLength="32"
                value={form.phone}
                onChange={updateField}
                placeholder="+92 300 1234567"
                autoComplete="tel"
              />
            </label>
            <label>
              <span>Account status</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </label>
          </div>
          <div className="access-form-section-heading">
            <span>
              <ShieldCheck size={18} />
            </span>
            <div>
              <h2>Access assignment</h2>
              <p>Choose an active role and scope the account to an organization branch.</p>
            </div>
          </div>
          <div className="access-form-grid">
            <label>
              <span>
                Security role <b>*</b>
              </span>
              <select name="roleCode" required value={form.roleCode} onChange={updateField}>
                <option value="">Select a role</option>
                {activeRoles.map((role) => (
                  <option key={role.code} value={role.code}>
                    {role.name}
                  </option>
                ))}
              </select>
              <small>
                {roles.find((role) => role.code === form.roleCode)?.description ||
                  'Role permissions control available ERP actions.'}
              </small>
            </label>
            <label>
              <span>
                Branch <b>*</b>
              </span>
              <select name="branchCode" required value={form.branchCode} onChange={updateField}>
                <option value="">Select a branch</option>
                {activeBranches.map((branch) => (
                  <option key={branch.code} value={branch.code}>
                    {branch.code} · {branch.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Department</span>
              <select
                name="departmentCode"
                value={form.departmentCode || ''}
                onChange={updateField}
              >
                <option value="">No department</option>
                {branchDepartments.map((department) => (
                  <option key={department.code} value={department.code}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="access-form-actions">
            <span>
              <b>*</b> Required fields · User ID {userId}
            </span>
            <div>
              <button
                type="button"
                className="branch-cancel-button"
                onClick={() => onNavigate('Users List')}
              >
                Cancel
              </button>
              <button type="submit" className="branch-save-button">
                <Save size={16} />
                {isEditing ? 'Save User' : 'Create User'}
              </button>
            </div>
          </div>
        </form>
        <aside className="access-form-aside">
          <section>
            <h3>
              <Info size={16} />
              Account setup
            </h3>
            <p>
              Assign only the permissions required for the user's responsibilities. Branch and
              department assignments narrow data visibility for scoped roles.
            </p>
            <p>
              Passwords are handled by your organization's identity service, not stored in this
              interface.
            </p>
          </section>
          <section className="access-form-role-preview">
            <span>SELECTED ROLE</span>
            <strong>
              <KeyRound size={17} />
              {roles.find((role) => role.code === form.roleCode)?.name || 'Choose a role'}
            </strong>
            <small>
              {roles.find((role) => role.code === form.roleCode)?.scope ||
                'Role scope appears here'}
            </small>
          </section>
          <section className="access-form-role-preview">
            <span>ACCOUNT SCOPE</span>
            <strong>
              <Building2 size={17} />
              {selectedBranch?.name || 'Choose a branch'}
            </strong>
            <small>
              {departments.find((item) => item.code === form.departmentCode)?.name ||
                'No department assigned'}
            </small>
          </section>
        </aside>
      </div>
    </div>
  )
}
