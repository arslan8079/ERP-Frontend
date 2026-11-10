import { useState } from 'react'
import {
  today,
  money,
  dateLabel,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Field,
  Empty,
  openBills,
  AccountPicker,
  ArrowRight,
  Check,
  ListChecks,
  Plus,
  Receipt,
} from '../financeShared'

function SupplierBillsPage({ data, createBill, onNotify, onNavigate }) {
  const [form, setForm] = useState({
    supplier: '',
    date: today(),
    dueDate: today(),
    total: '',
    expenseAccountId: 'AC-1200',
  })
  const [showForm, setShowForm] = useState(false)
  const bills = openBills(data)
  const submit = (event) => {
    event.preventDefault()
    if (!form.supplier.trim() || Number(form.total) <= 0 || form.dueDate < form.date)
      return onNotify('Enter a supplier, positive bill amount, and valid bill dates.')
    createBill({ ...form, supplier: form.supplier.trim() })
    setForm({
      supplier: '',
      date: today(),
      dueDate: today(),
      total: '',
      expenseAccountId: 'AC-1200',
    })
  }
  return (
    <>
      <PageHeader
        title="Supplier Bills"
        subtitle="Record supplier invoices and post the corresponding payable and expense or inventory entries."
        icon={Receipt}
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={15} />
            {showForm ? 'Close form' : 'Record bill'}
          </Button>
        }
      />
      {showForm && (
        <div className="fa-form-card">
          <h2>
            <Receipt size={17} />
            Post supplier bill
          </h2>
          <form className="fa-inline-form" onSubmit={submit}>
            <Field label="Supplier">
              <input
                required
                value={form.supplier}
                onChange={(event) => setForm({ ...form, supplier: event.target.value })}
                placeholder="Supplier name"
              />
            </Field>
            <Field label="Bill date">
              <input
                type="date"
                required
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </Field>
            <Field label="Due date">
              <input
                type="date"
                required
                min={form.date}
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
            </Field>
            <Field label="Bill total (PKR)">
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.total}
                onChange={(event) => setForm({ ...form, total: event.target.value })}
              />
            </Field>
            <AccountPicker
              data={data}
              types={['Asset', 'Expense']}
              value={form.expenseAccountId}
              onChange={(event) => setForm({ ...form, expenseAccountId: event.target.value })}
              label="Debit account"
            />
            <Button type="submit">
              <Check size={14} />
              Post bill
            </Button>
          </form>
        </div>
      )}
      <Card
        title={`Supplier bill register · ${bills.length} open`}
        icon={ListChecks}
        action={
          <Button kind="link" onClick={() => onNavigate('Payable Aging')}>
            Payable aging <ArrowRight size={13} />
          </Button>
        }
      >
        <Table
          headers={[
            'Bill',
            'Supplier',
            'Bill date',
            'Due date',
            'Original amount',
            'Paid',
            'Balance due',
            'Status',
          ]}
        >
          {data.bills.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>{item.supplier}</td>
              <td>{dateLabel(item.date)}</td>
              <td className={item.dueDate < today() && item.total > item.paid ? 'fa-overdue' : ''}>
                {dateLabel(item.dueDate)}
              </td>
              <td>{money(item.total)}</td>
              <td>{money(item.paid)}</td>
              <td>
                <b>{money(item.total - item.paid)}</b>
              </td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!data.bills.length && <Empty>Record a supplier bill to start the payable register.</Empty>}
      </Card>
    </>
  )
}

export default SupplierBillsPage
