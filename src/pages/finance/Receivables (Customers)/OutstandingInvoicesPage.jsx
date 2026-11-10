import { useState } from 'react'
import {
  today,
  money,
  dateLabel,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  Field,
  Empty,
  sum,
  AccountPicker,
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock3,
  ListChecks,
  Plus,
  Receipt,
} from '../financeShared'

function OutstandingInvoicesPage({ data, createInvoice, onNavigate, onNotify }) {
  const [form, setForm] = useState({
    customer: '',
    date: today(),
    dueDate: today(),
    total: '',
    revenueAccountId: 'AC-4000',
  })
  const [showForm, setShowForm] = useState(false)
  const invoices = data.invoices.filter((item) => item.total > item.allocated)
  const submit = (event) => {
    event.preventDefault()
    if (!form.customer.trim() || Number(form.total) <= 0 || form.dueDate < form.date)
      return onNotify('Enter a customer, positive amount, and valid invoice dates.')
    createInvoice({ ...form, customer: form.customer.trim() })
    setForm({
      customer: '',
      date: today(),
      dueDate: today(),
      total: '',
      revenueAccountId: 'AC-4000',
    })
  }
  return (
    <>
      <PageHeader
        title="Outstanding Invoices"
        subtitle="Create customer invoices and track balances due against Accounts Receivable."
        icon={Receipt}
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={15} />
            {showForm ? 'Close form' : 'Create invoice'}
          </Button>
        }
      />
      <div className="fa-stats compact">
        <Stat icon={Receipt} label="Open invoices" value={invoices.length} tone="blue" />
        <Stat
          icon={CircleDollarSign}
          label="Outstanding"
          value={money(sum(invoices, (item) => item.total - item.allocated))}
        />
        <Stat
          icon={Clock3}
          label="Past due"
          value={invoices.filter((item) => item.dueDate < today()).length}
          tone="amber"
        />
      </div>
      {showForm && (
        <div className="fa-form-card">
          <h2>
            <Plus size={17} />
            Post customer invoice
          </h2>
          <form className="fa-inline-form" onSubmit={submit}>
            <Field label="Customer">
              <input
                required
                value={form.customer}
                onChange={(event) => setForm({ ...form, customer: event.target.value })}
                placeholder="Customer / dealer name"
              />
            </Field>
            <Field label="Invoice date">
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
            <Field label="Invoice total (PKR)">
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
              types={['Revenue']}
              value={form.revenueAccountId}
              onChange={(event) => setForm({ ...form, revenueAccountId: event.target.value })}
              label="Revenue account"
            />
            <Button type="submit">
              <Check size={14} />
              Post invoice
            </Button>
          </form>
        </div>
      )}
      <Card
        title={`Receivable invoices · ${invoices.length}`}
        icon={ListChecks}
        action={
          <Button kind="link" onClick={() => onNavigate('Aging Report')}>
            Aging report <ArrowRight size={13} />
          </Button>
        }
      >
        <Table
          headers={[
            'Invoice',
            'Customer',
            'Invoice date',
            'Due date',
            'Original amount',
            'Allocated',
            'Balance due',
            'Status',
          ]}
        >
          {invoices.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>{item.customer}</td>
              <td>{dateLabel(item.date)}</td>
              <td className={item.dueDate < today() ? 'fa-overdue' : ''}>
                {dateLabel(item.dueDate)}
              </td>
              <td>{money(item.total)}</td>
              <td>{money(item.allocated)}</td>
              <td>
                <b>{money(item.total - item.allocated)}</b>
              </td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!invoices.length && <Empty>No outstanding customer invoices.</Empty>}
      </Card>
    </>
  )
}

export default OutstandingInvoicesPage
