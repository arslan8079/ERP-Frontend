import { useState } from 'react'
import { Check, Clock3, TrendingUp } from 'lucide-react'
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

export default function TransfersPage({
  data,
  updateData,
  employees,
  branches,
  departments,
  employeeName,
  onEmployeesChange,
  onNotify,
}) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    branchCode: '',
    departmentCode: '',
    role: '',
    effectiveDate: today(),
  })
  const current = employees.find((item) => item.id === form.employeeId)
  const submit = (event) => {
    event.preventDefault()
    if (!form.role.trim())
      return onNotify('Enter the new job title for this transfer or promotion.')
    const nextRole = form.role.trim()
    const transfer = {
      id: `TR-${new Date().getFullYear()}-${String(data.transfers.length + 1).padStart(3, '0')}`,
      employeeId: form.employeeId,
      effectiveDate: form.effectiveDate,
      from: `${current?.role} · ${current?.branchCode}`,
      to: `${nextRole} · ${form.branchCode || current?.branchCode}`,
      status: 'Completed',
    }
    if (!current) return onNotify('Select an employee before recording a career change.')
    const updatedEmployee = {
      ...current,
      role: nextRole,
      branchCode: form.branchCode || current.branchCode,
      departmentCode: form.departmentCode || current.departmentCode,
    }
    if (
      !updateData(
        (state) => ({
          ...state,
          employees: state.employees.map((item) =>
            item.id === form.employeeId ? updatedEmployee : item,
          ),
          transfers: [transfer, ...state.transfers],
        }),
        'Transfer or promotion recorded',
      )
    )
      return
    onEmployeesChange(updatedEmployee, form.employeeId)
  }
  return (
    <>
      <PageHeader
        title="Transfers & Promotions"
        subtitle="Record employee movements and career progression with an effective date."
        icon={TrendingUp}
      />
      <Card title="Record a transfer or promotion" icon={TrendingUp}>
        <form className="hr-form-grid hr-transfer-form" onSubmit={submit}>
          <label>
            <span>Employee</span>
            <select
              value={form.employeeId}
              onChange={(event) => setForm({ ...form, employeeId: event.target.value })}
            >
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.id}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>New job title</span>
            <input
              required
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              placeholder="New title or grade"
            />
          </label>
          <label>
            <span>New branch</span>
            <select
              value={form.branchCode}
              onChange={(event) =>
                setForm({ ...form, branchCode: event.target.value, departmentCode: '' })
              }
            >
              <option value="">Keep current branch</option>
              {branches.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>New department</span>
            <select
              value={form.departmentCode}
              onChange={(event) => setForm({ ...form, departmentCode: event.target.value })}
            >
              <option value="">Keep current department</option>
              {departments
                .filter((item) => item.branchCode === (form.branchCode || current?.branchCode))
                .map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            <span>Effective date</span>
            <input
              type="date"
              required
              value={form.effectiveDate}
              onChange={(event) => setForm({ ...form, effectiveDate: event.target.value })}
            />
          </label>
          <div className="hr-form-submit">
            <Button type="submit">
              <Check size={15} />
              Record change
            </Button>
          </div>
        </form>
      </Card>
      <Card title="Movement history" icon={Clock3}>
        <Table
          headers={[
            'Reference',
            'Employee',
            'Effective date',
            'Previous assignment',
            'New assignment',
            'Status',
          ]}
        >
          {data.transfers.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{employeeName(item.employeeId)}</td>
              <td>{formatDate(item.effectiveDate)}</td>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>
                <span className="hr-status active">{item.status}</span>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
