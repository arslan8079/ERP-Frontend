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

export default function CreateStructurePage({
  createStructure,
  saveStructure,
  editingStructure,
  setEditingStructureId,
  data,
  onNotify,
  onNavigate,
}) {
  const [form, setForm] = useState(() => ({
    name: editingStructure?.name || '',
    basicPercent: editingStructure?.basicPercent ?? 70,
    allowanceName: editingStructure?.allowances?.[0]?.name || 'House allowance',
    allowanceAmount: editingStructure?.allowances?.[0]?.amount ?? 0,
    deductionName: editingStructure?.deductions?.[0]?.name || 'Income tax',
    deductionAmount: editingStructure?.deductions?.[0]?.amount ?? 0,
  }))
  const submit = (event) => {
    event.preventDefault()
    if (
      data.structures.some(
        (item) =>
          item.id !== editingStructure?.id &&
          item.name.toLowerCase() === form.name.trim().toLowerCase(),
      )
    )
      return onNotify('A salary structure with this name already exists.')
    const saved = editingStructure
      ? saveStructure(editingStructure.id, form)
      : createStructure(form)
    if (saved) {
      setEditingStructureId('')
      onNavigate('Salary Structures')
    }
  }
  return (
    <>
      <PageHeader
        title={editingStructure ? 'Edit Salary Structure' : 'Create Salary Structure'}
        subtitle={
          editingStructure
            ? 'Update the reusable salary template while retaining its stable ID and payroll history.'
            : 'Define the salary basis and recurring earnings and deductions for a staff category.'
        }
        icon={Plus}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Salary Structures')}>
            Structure register <ChevronRight size={15} />
          </Button>
        }
      />
      <form
        className="pr-form-card"
        key={editingStructure?.id || 'new-structure'}
        onSubmit={submit}
      >
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
          <span>
            {editingStructure
              ? 'Existing payroll batches retain their recorded values; additional components are preserved.'
              : 'Assign the saved structure to employees before generating a payroll batch.'}
          </span>
          {editingStructure && (
            <Button
              kind="secondary"
              onClick={() => {
                setEditingStructureId('')
                onNavigate('Salary Structures')
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">
            <Check size={15} />
            {editingStructure ? 'Save changes' : 'Save structure'}
          </Button>
        </div>
      </form>
    </>
  )
}
