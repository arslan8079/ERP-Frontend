import { useState } from 'react'
import { HandCoins, ListChecks, Plus } from 'lucide-react'
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

export default function AdvanceRequestPage({ employees, data, requestAdvance, onNotify }) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    amount: '',
    months: 3,
    reason: '',
  })
  const submit = (event) => {
    event.preventDefault()
    if (Number(form.amount) <= 0 || !form.reason.trim())
      return onNotify('Enter an advance amount and business reason.')
    requestAdvance({ ...form, reason: form.reason.trim() })
    setForm({ ...form, amount: '', reason: '' })
  }
  return (
    <>
      <PageHeader
        title="Advance Requests"
        subtitle="Submit and track employee salary advances and repayment terms."
        icon={HandCoins}
      />
      <Card title="Request a salary advance" icon={Plus}>
        <form className="pr-inline-form" onSubmit={submit}>
          <Field label="Employee">
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
          </Field>
          <Field label="Advance amount (PKR)">
            <input
              type="number"
              min="1"
              required
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
            />
          </Field>
          <Field label="Repayment months">
            <input
              type="number"
              min="1"
              max="36"
              required
              value={form.months}
              onChange={(event) => setForm({ ...form, months: event.target.value })}
            />
          </Field>
          <Field label="Reason">
            <input
              required
              maxLength="160"
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
              placeholder="Reason for advance"
            />
          </Field>
          <Button type="submit">
            <Plus size={15} />
            Submit request
          </Button>
        </form>
      </Card>
      <Card title={`Advance request register · ${data.advances.length}`} icon={ListChecks}>
        <AdvanceTable
          advances={data.advances}
          employeeName={(id) =>
            employees.find((item) => item.id === id)?.name || 'Unknown employee'
          }
        />
      </Card>
    </>
  )
}
