import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import { Building2, ArrowLeft, Save, Info, Users } from 'lucide-react'

export default function CreateDepartmentPage({
  departments,
  employees,
  branches,
  department,
  onNavigate,
  onCreateDepartment,
  onUpdateDepartment,
  onNotify,
}) {
  const isEditing = Boolean(department)
  const [form, setForm] = useState(
    () =>
      department || {
        name: '',
        branchCode: branches.find((branch) => branch.status === 'Active')?.code || '',
        managerId: '',
        email: '',
        phone: '',
        costCenter: '',
        budget: '',
        description: '',
        status: 'Active',
      },
  )
  const [error, setError] = useState('')
  const activeEmployees = employees.filter((employee) => employee.status === 'Active')
  const branch = branches.find((item) => item.code === form.branchCode)
  const code =
    department?.code ||
    `DPT-${String(Math.max(0, ...departments.map((item) => Number(item.code.replace('DPT-', '')) || 0)) + 1).padStart(3, '0')}`
  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }
  const submit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    if (!name) return setError('Department name is required.')
    const duplicate = departments.some(
      (item) =>
        item.code !== department?.code &&
        item.name.trim().toLowerCase() === name.toLowerCase() &&
        item.branchCode === form.branchCode,
    )
    if (duplicate)
      return setError('A department with this name already exists in the selected branch.')
    if (
      !form.branchCode ||
      !branches.some((item) => item.code === form.branchCode && item.status === 'Active')
    )
      return setError('Select an active branch for this department.')
    if (!form.managerId || !activeEmployees.some((employee) => employee.id === form.managerId))
      return setError('Select an active department head.')
    const budget = Number(form.budget)
    if (!Number.isFinite(budget) || budget < 0)
      return setError('Enter a valid non-negative department budget.')
    const values = {
      ...form,
      name,
      budget,
      email: form.email.trim(),
      phone: form.phone.trim(),
      costCenter: form.costCenter.trim().toUpperCase(),
      description: form.description.trim(),
    }
    if (isEditing) {
      onUpdateDepartment(department.code, values)
      onNotify(`${name} updated successfully`)
    } else {
      onCreateDepartment(values)
    }
    onNavigate('Department List')
  }

  return (
    <div className="branch-list-page department-page department-form-page">
      <header className="branch-list-banner department-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Building2 size={37} />
          <div>
            <h1>{isEditing ? 'Edit Department' : 'Create Department'}</h1>
            <p>
              {isEditing
                ? 'Update department ownership and profile'
                : 'Set up a team within your company structure'}
            </p>
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
      <div className="department-form-layout">
        <form className="department-form-card" onSubmit={submit}>
          <div className="department-form-section-heading">
            <span>
              <Building2 size={18} />
            </span>
            <div>
              <h2>Department profile</h2>
              <p>Define the department identity, branch, and budget owner.</p>
            </div>
          </div>
          {error && (
            <p className="department-form-error" role="alert">
              {error}
            </p>
          )}
          <div className="department-form-grid">
            <label>
              <span>
                Department name <b>*</b>
              </span>
              <input
                name="name"
                required
                maxLength="80"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Regulatory Affairs"
              />
            </label>
            <label>
              <span>Department code</span>
              <input value={code} readOnly />
              <small>Automatically assigned</small>
            </label>
            <label>
              <span>
                Branch <b>*</b>
              </span>
              <select name="branchCode" required value={form.branchCode} onChange={updateField}>
                <option value="">Select a branch</option>
                {branches
                  .filter((item) => item.status === 'Active')
                  .map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} · {item.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span>
                Department head <b>*</b>
              </span>
              <select name="managerId" required value={form.managerId} onChange={updateField}>
                <option value="">Select an employee</option>
                {activeEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} · {employee.id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Cost center</span>
              <input
                name="costCenter"
                maxLength="24"
                value={form.costCenter}
                onChange={updateField}
                placeholder="e.g. CC-9001"
              />
            </label>
            <label>
              <span>
                Annual budget (PKR) <b>*</b>
              </span>
              <input
                name="budget"
                type="number"
                min="0"
                step="1000"
                required
                value={form.budget}
                onChange={updateField}
                placeholder="0"
              />
            </label>
            <label>
              <span>Contact email</span>
              <input
                name="email"
                type="email"
                maxLength="120"
                value={form.email}
                onChange={updateField}
                placeholder="department@company.com"
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
                placeholder="+92 42 1234567"
              />
            </label>
            <label className="department-form-full">
              <span>Description</span>
              <textarea
                name="description"
                rows="3"
                maxLength="300"
                value={form.description}
                onChange={updateField}
                placeholder="Describe this department's responsibilities and scope."
              />
            </label>
            <label>
              <span>Status</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>
          <div className="department-form-actions">
            <span>
              <b>*</b> Required fields
            </span>
            <div>
              <button
                type="button"
                className="branch-cancel-button"
                onClick={() => onNavigate('Department List')}
              >
                Cancel
              </button>
              <button type="submit" className="branch-save-button">
                <Save size={16} />
                {isEditing ? 'Save Department' : 'Create Department'}
              </button>
            </div>
          </div>
        </form>
        <aside className="department-form-aside">
          <section>
            <h3>
              <Info size={16} />
              Department setup
            </h3>
            <p>
              Each department belongs to one active branch and has one accountable department head.
            </p>
            <p>Cost centers and budgets help Finance track spending by team.</p>
          </section>
          <section className="department-code-preview">
            <span>DEPARTMENT CODE</span>
            <strong>
              <Users size={17} />
              {code}
            </strong>
            <small>{branch?.name || 'Select a branch'}</small>
          </section>
        </aside>
      </div>
    </div>
  )
}
