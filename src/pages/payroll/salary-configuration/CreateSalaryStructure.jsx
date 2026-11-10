import { useState } from 'react'
import { BadgeDollarSign, Check, ChevronRight, Plus } from 'lucide-react'
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

export default function CreateStructurePage({ createStructure, data, onNotify, onNavigate }) {
  const [form, setForm] = useState({
    name: '',
    basicPercent: 70,
    allowanceName: 'House allowance',
    allowanceAmount: 0,
    deductionName: 'Income tax',
    deductionAmount: 0,
  })
  const submit = (event) => {
    event.preventDefault()
    if (data.structures.some((item) => item.name.toLowerCase() === form.name.trim().toLowerCase()))
      return onNotify('A salary structure with this name already exists.')
    createStructure(form)
    onNavigate('Salary Structures')
  }
  return (
    <>
      <PageHeader
        title="Create Salary Structure"
        subtitle="Define the salary basis and recurring earnings and deductions for a staff category."
        icon={Plus}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Salary Structures')}>
            Structure register <ChevronRight size={15} />
          </Button>
        }
      />
      <form className="pr-form-card" onSubmit={submit}>
        <h2>
          <BadgeDollarSign size={18} />
          Compensation template
        </h2>
        <div className="pr-form-grid">
          <Field label="Structure name">
            <input
              required
              maxLength="70"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Operations Monthly"
            />
          </Field>
          <Field label="Basic pay (% of monthly base)">
            <input
              type="number"
              min="1"
              max="100"
              required
              value={form.basicPercent}
              onChange={(event) => setForm({ ...form, basicPercent: Number(event.target.value) })}
            />
          </Field>
          <Field label="Allowance name">
            <input
              value={form.allowanceName}
              onChange={(event) => setForm({ ...form, allowanceName: event.target.value })}
              placeholder="Optional allowance"
            />
          </Field>
          <Field label="Monthly allowance (PKR)">
            <input
              type="number"
              min="0"
              value={form.allowanceAmount}
              onChange={(event) => setForm({ ...form, allowanceAmount: event.target.value })}
            />
          </Field>
          <Field label="Deduction name">
            <input
              value={form.deductionName}
              onChange={(event) => setForm({ ...form, deductionName: event.target.value })}
              placeholder="Optional deduction"
            />
          </Field>
          <Field label="Monthly deduction (PKR)">
            <input
              type="number"
              min="0"
              value={form.deductionAmount}
              onChange={(event) => setForm({ ...form, deductionAmount: event.target.value })}
            />
          </Field>
        </div>
        <div className="pr-form-actions">
          <span>Assign the saved structure to employees before generating a payroll batch.</span>
          <Button type="submit">
            <Check size={15} />
            Save structure
          </Button>
        </div>
      </form>
    </>
  )
}
