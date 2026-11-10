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
  openInvoices,
  ArrowDownLeft,
  Banknote,
  Check,
  ChevronRight,
  ListChecks,
} from '../financeShared'

function ReceivePaymentPage({ data, receivePayment, onNotify, onNavigate }) {
  const invoices = openInvoices(data)
  const accounts = data.accounts.filter((item) => ['Cash', 'Bank'].includes(item.control))
  const [form, setForm] = useState({
    invoiceId: invoices[0]?.id || '',
    accountId: accounts[0]?.id || '',
    date: today(),
    amount: '',
    reference: '',
  })
  const invoice = invoices.find((item) => item.id === form.invoiceId)
  const submit = (event) => {
    event.preventDefault()
    if (!invoice || Number(form.amount) <= 0 || !form.reference.trim())
      return onNotify('Select an open invoice, enter the received amount, and add a reference.')
    receivePayment({ ...form, reference: form.reference.trim() })
    setForm({ ...form, amount: '', reference: '' })
  }
  return (
    <>
      <PageHeader
        title="Receive Payment"
        subtitle="Post customer collections to cash or bank and allocate them against an open invoice."
        icon={ArrowDownLeft}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Payment Allocation')}>
            Payment allocation <ChevronRight size={14} />
          </Button>
        }
      />
      <div className="fa-form-card">
        <h2>
          <Banknote size={18} />
          Customer receipt
        </h2>
        <form className="fa-form-grid" onSubmit={submit}>
          <Field label="Open invoice">
            <select
              required
              value={form.invoiceId}
              onChange={(event) => setForm({ ...form, invoiceId: event.target.value, amount: '' })}
            >
              {invoices.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} · {item.customer} · Due {money(item.total - item.allocated)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Deposit account">
            <select
              required
              value={form.accountId}
              onChange={(event) => setForm({ ...form, accountId: event.target.value })}
            >
              {accounts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} · {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Payment amount (PKR)">
            <input
              type="number"
              min="0.01"
              max={invoice ? invoice.total - invoice.allocated : undefined}
              step="0.01"
              required
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
            />
          </Field>
          <Field label="Payment date">
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </Field>
          <Field label="Receipt / bank reference">
            <input
              required
              value={form.reference}
              onChange={(event) => setForm({ ...form, reference: event.target.value })}
              placeholder="Receipt number or bank reference"
            />
          </Field>
          <div className="fa-form-submit">
            <Button type="submit" disabled={!invoice || !accounts.length}>
              <Check size={15} />
              Post receipt
            </Button>
          </div>
        </form>
        <div className="fa-form-actions">
          <span>
            {invoice
              ? `${invoice.customer} · remaining invoice balance ${money(invoice.total - invoice.allocated)}`
              : 'No open customer invoices to receive against.'}
          </span>
        </div>
      </div>
      <Card title={`Recent receipts · ${data.receipts.length}`} icon={ListChecks}>
        <Table headers={['Receipt', 'Customer', 'Date', 'Amount', 'Allocated', 'Status']}>
          {data.receipts.slice(0, 10).map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
                <small className="fa-cell-sub">{item.reference}</small>
              </td>
              <td>{item.customer}</td>
              <td>{dateLabel(item.date)}</td>
              <td>{money(item.amount)}</td>
              <td>{money(item.allocated)}</td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!data.receipts.length && <Empty>Customer receipts will appear after posting.</Empty>}
      </Card>
    </>
  )
}

export default ReceivePaymentPage
