import { useState } from 'react'
import { BadgeDollarSign, Check, ListChecks, Users } from 'lucide-react'
import * as Shared from '../shared'
const {
  today,
  monthKey,
  monthLabel,
  money,
  idFor,
  activeEmployees,
  calculateSalary,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  Empty,
  SalarySlip,
  AdvanceTable,
  PayslipTable,
  Field,
  Toolbar,
  Callout,
  ExportButton,
  downloadCsv,
} = Shared

export default function AssignmentsPage({ data, employees, saveAssignment, onNotify }) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    structureId: data.structures[0]?.id || '',
    monthlySalary: '',
    effectiveDate: today(),
  })
  const assignment = data.assignments.find((item) => item.employeeId === form.employeeId)
  const submit = (event) => {
    event.preventDefault()
    if (!employees.some((item) => item.id === form.employeeId))
      return onNotify('Choose an active employee.')
    if (!data.structures.some((item) => item.id === form.structureId))
      return onNotify('Create a salary structure before assigning employee pay.')
    if (Number(form.monthlySalary) <= 0)
      return onNotify('Monthly salary must be greater than zero.')
    saveAssignment(form)
  }
  return (
    <>
      <PageHeader
        title="Employee Salary Assignment"
        subtitle="Assign compensation structures and effective monthly base salaries."
        icon={Users}
      />
      <Card title="Assign or update salary" icon={BadgeDollarSign}>
        <form className="pr-inline-form" onSubmit={submit}>
          <Field label="Employee">
            <select
              required
              value={form.employeeId}
              onChange={(event) => {
                const selected = data.assignments.find(
                  (item) => item.employeeId === event.target.value,
                )
                setForm({
                  ...form,
                  employeeId: event.target.value,
                  structureId: selected?.structureId || data.structures[0]?.id || '',
                  monthlySalary: selected?.monthlySalary || '',
                })
              }}
            >
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.id}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Salary structure">
            <select
              required
              value={form.structureId}
              onChange={(event) => setForm({ ...form, structureId: event.target.value })}
            >
              {data.structures
                .filter((item) => item.status === 'Active')
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Monthly base salary (PKR)">
            <input
              type="number"
              min="1"
              required
              value={form.monthlySalary || (assignment?.monthlySalary ?? '')}
              onChange={(event) => setForm({ ...form, monthlySalary: event.target.value })}
              placeholder="e.g. 85000"
            />
          </Field>
          <Field label="Effective from">
            <input
              type="date"
              required
              value={form.effectiveDate}
              onChange={(event) => setForm({ ...form, effectiveDate: event.target.value })}
            />
          </Field>
          <Button type="submit">
            <Check size={15} />
            Save assignment
          </Button>
        </form>
      </Card>
      <Card title={`Salary assignments · ${data.assignments.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Employee',
            'Department',
            'Structure',
            'Monthly base',
            'Effective date',
            'Status',
          ]}
        >
          {data.assignments.map((item) => {
            const employee = employees.find((row) => row.id === item.employeeId)
            return employee ? (
              <tr key={item.id}>
                <td>
                  <b>{employee.name}</b>
                  <small className="pr-cell-sub">{employee.id}</small>
                </td>
                <td>{employee.departmentCode || '—'}</td>
                <td>
                  {data.structures.find((row) => row.id === item.structureId)?.name || 'Unassigned'}
                </td>
                <td>{money(item.monthlySalary)}</td>
                <td>{item.effectiveDate}</td>
                <td>
                  <Status>{item.status}</Status>
                </td>
              </tr>
            ) : null
          })}
        </Table>
      </Card>
    </>
  )
}
