import { useState } from 'react'
import { BadgeCheck, Check, ChevronRight, Info, UserPlus, Users } from 'lucide-react'
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

export default function EmployeeForm({
  employees,
  selectedEmployee,
  branches,
  departments,
  saveEmployee,
  onNavigate,
  editing,
}) {
  const [form, setForm] = useState(() =>
    editing && selectedEmployee
      ? { ...selectedEmployee, salary: selectedEmployee.salary || '' }
      : {
          name: '',
          email: '',
          phone: '',
          role: '',
          branchCode:
            branches.find((item) => item.status === 'Active')?.code || branches[0]?.code || '',
          departmentCode: '',
          employmentType: 'Full-time',
          hireDate: today(),
          status: 'Active',
          gender: 'Prefer not to say',
          salary: '',
          manager: '',
          address: '',
          emergencyContact: '',
        },
  )
  const branchDepartments = departments.filter((item) => item.branchCode === form.branchCode)
  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
      ...(event.target.name === 'branchCode' ? { departmentCode: '' } : {}),
    }))
  return (
    <>
      <PageHeader
        title="Add Employee"
        subtitle="Create a complete employee record and assign their organization details."
        icon={UserPlus}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Employee Directory')}>
            <ChevronRight className="hr-back-arrow" size={15} />
            Directory
          </Button>
        }
      />
      <form
        className="hr-form-layout"
        onSubmit={(event) => {
          event.preventDefault()
          saveEmployee(
            { ...form, salary: Number(form.salary) || 0 },
            editing ? selectedEmployee?.id || '' : '',
          )
        }}
      >
        <Card title="Personal information" icon={Users}>
          <div className="hr-form-grid">
            <label>
              <span>
                Full name <b>*</b>
              </span>
              <input
                name="name"
                required
                maxLength="90"
                value={form.name}
                onChange={update}
                placeholder="Employee full name"
              />
            </label>
            <label>
              <span>
                Email address <b>*</b>
              </span>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={update}
                placeholder="name@company.com"
              />
            </label>
            <label>
              <span>Phone number</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={update}
                placeholder="+92 300 1234567"
              />
            </label>
            <label>
              <span>Gender</span>
              <select name="gender" value={form.gender} onChange={update}>
                <option>Prefer not to say</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>
            <label className="wide">
              <span>Home address</span>
              <input
                name="address"
                value={form.address}
                onChange={update}
                placeholder="City, province"
              />
            </label>
            <label>
              <span>Emergency contact</span>
              <input
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={update}
                placeholder="Contact number"
              />
            </label>
          </div>
        </Card>
        <Card title="Employment details" icon={BadgeCheck}>
          <div className="hr-form-grid">
            <label>
              <span>
                Job title <b>*</b>
              </span>
              <input
                name="role"
                required
                value={form.role}
                onChange={update}
                placeholder="e.g. Sales Executive"
              />
            </label>
            <label>
              <span>Employment type</span>
              <select name="employmentType" value={form.employmentType} onChange={update}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Intern</option>
              </select>
            </label>
            <label>
              <span>Branch</span>
              <select name="branchCode" value={form.branchCode} onChange={update}>
                {branches.map((branch) => (
                  <option key={branch.code} value={branch.code}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Department</span>
              <select name="departmentCode" value={form.departmentCode} onChange={update}>
                <option value="">Select department</option>
                {branchDepartments.map((department) => (
                  <option key={department.code} value={department.code}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Joining date</span>
              <input type="date" name="hireDate" value={form.hireDate} onChange={update} />
            </label>
            <label>
              <span>Reporting manager</span>
              <select name="manager" value={form.manager} onChange={update}>
                <option value="">No manager selected</option>
                {employees
                  .filter((employee) => employee.status === 'Active')
                  .map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span>Monthly salary (PKR)</span>
              <input
                type="number"
                min="0"
                name="salary"
                value={form.salary}
                onChange={update}
                placeholder="0"
              />
            </label>
            <label>
              <span>Employment status</span>
              {editing ? (
                <input readOnly value={form.status} />
              ) : (
                <select name="status" value={form.status} onChange={update}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              )}
            </label>
          </div>
        </Card>
        <div className="hr-form-actions">
          <span>
            <Info size={15} />
            Required fields are marked with an asterisk.
          </span>
          <div>
            <Button
              kind="secondary"
              onClick={() => onNavigate(editing ? 'Employee Profile' : 'Employee Directory')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Check size={16} />
              {editing ? 'Save changes' : 'Save employee'}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
