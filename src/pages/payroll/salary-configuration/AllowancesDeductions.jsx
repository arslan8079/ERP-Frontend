import { useState } from 'react'
import { Coins, ListChecks, Plus } from 'lucide-react'
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

export default function ComponentsPage({
  data,
  createComponent,
  saveComponent,
  toggleComponentStatus,
  onNotify,
}) {
  const [editingComponentId, setEditingComponentId] = useState('')
  const [form, setForm] = useState({
    name: '',
    type: 'Allowance',
    calculation: 'Fixed',
    amount: 0,
    taxable: true,
  })
  const submit = (event) => {
    event.preventDefault()
    if (
      data.components.some(
        (item) =>
          item.id !== editingComponentId &&
          item.name.toLowerCase() === form.name.trim().toLowerCase(),
      )
    )
      return onNotify('A payroll component with this name already exists.')
    const saved = editingComponentId
      ? saveComponent(editingComponentId, { ...form, name: form.name.trim() })
      : createComponent({ ...form, name: form.name.trim() })
    if (saved) {
      setEditingComponentId('')
      setForm({ name: '', type: 'Allowance', calculation: 'Fixed', amount: 0, taxable: true })
    }
  }
  return (
    <>
      <PageHeader
        title="Allowances & Deductions"
        subtitle="Maintain standard payroll earning and deduction components."
        icon={Coins}
      />
      <Card
        title={editingComponentId ? 'Edit payroll component' : 'Add payroll component'}
        icon={Plus}
      >
        <form className="pr-inline-form" onSubmit={submit}>
          <Field label="Component name">
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Meal allowance"
            />
          </Field>
          <Field label="Component type">
            <select
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
            >
              <option>Allowance</option>
              <option>Deduction</option>
            </select>
          </Field>
          <Field label="Calculation">
            <select
              value={form.calculation}
              onChange={(event) => setForm({ ...form, calculation: event.target.value })}
            >
              <option>Fixed</option>
              <option>Percentage</option>
            </select>
          </Field>
          <Field label={form.calculation === 'Fixed' ? 'Amount (PKR)' : 'Rate (% of basic)'}>
            <input
              type="number"
              min="0"
              required
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
            />
          </Field>
          <label className="pr-check">
            <input
              type="checkbox"
              checked={form.taxable}
              onChange={(event) => setForm({ ...form, taxable: event.target.checked })}
            />
            Taxable
          </label>
          {editingComponentId && (
            <Button
              kind="secondary"
              onClick={() => {
                setEditingComponentId('')
                setForm({
                  name: '',
                  type: 'Allowance',
                  calculation: 'Fixed',
                  amount: 0,
                  taxable: true,
                })
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">
            <Plus size={15} />
            {editingComponentId ? 'Save changes' : 'Add component'}
          </Button>
        </form>
      </Card>
      <Card title={`Component register · ${data.components.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Component',
            'Type',
            'Calculation',
            'Default value',
            'Tax treatment',
            'Status',
            'Actions',
          ]}
        >
          {data.components.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.name}</b>
                <small className="pr-cell-sub">{item.id}</small>
              </td>
              <td>
                <Status>{item.type}</Status>
              </td>
              <td>{item.calculation}</td>
              <td>{item.calculation === 'Fixed' ? money(item.amount) : `${item.amount}%`}</td>
              <td>{item.taxable ? 'Taxable' : 'Non-taxable'}</td>
              <td>
                <Status>{item.status}</Status>
              </td>
              <td>
                <button
                  className="pr-link"
                  onClick={() => {
                    setEditingComponentId(item.id)
                    setForm({
                      name: item.name,
                      type: item.type,
                      calculation: item.calculation,
                      amount: item.amount,
                      taxable: Boolean(item.taxable),
                    })
                  }}
                >
                  Edit
                </button>
                <button className="pr-link" onClick={() => toggleComponentStatus(item.id)}>
                  {item.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      <Card title="Payroll component change history" icon={ListChecks}>
        <Table headers={['Date', 'Component', 'Change', 'Details']}>
          {(data.masterHistory || [])
            .filter((item) => item.entityType === 'Payroll component')
            .slice(0, 20)
            .map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.entityName}</td>
                <td>{item.action}</td>
                <td>{item.details}</td>
              </tr>
            ))}
        </Table>
      </Card>
      <Callout
        title="Apply components through structures"
        text="Component definitions are a payroll catalogue. Add recurring values to a salary structure, then assign that structure to the employee."
      />
    </>
  )
}
