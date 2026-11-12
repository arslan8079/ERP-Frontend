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
  openBills,
  ArrowUpRight,
  Banknote,
  Check,
  ChevronRight,
  ListChecks,
} from '../financeShared'

function MakePaymentPage({ data, payBill, onNotify, onNavigate }) {
  const bills = openBills(data)
  const accounts = data.accounts.filter(
    (item) => ['Cash', 'Bank'].includes(item.control) && item.status === 'Active',
  )
  const [form, setForm] = useState({
    billId: bills[0]?.id || '',
    accountId: accounts[0]?.id || '',
    date: today(),
    amount: '',
    reference: '',
  })
  const bill = bills.find((item) => item.id === form.billId)
  const submit = (event) => {
    event.preventDefault()
    if (!bill || Number(form.amount) <= 0 || !form.reference.trim())
      return onNotify('Select an outstanding bill, payment amount, and bank reference.')
    payBill({ ...form, reference: form.reference.trim() })
    setForm({ ...form, amount: '', reference: '' })
  }
  return (
    <>
      <PageHeader
        title="Make Payment"
        subtitle="Settle supplier bills through cash or bank and post the payable reduction."
        icon={ArrowUpRight}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Payable Aging')}>
            Payable aging <ChevronRight size={14} />
          </Button>
        }
      />
      <div className="fa-form-card">
        <h2>
          <Banknote size={18} />
          Supplier settlement
        </h2>
        <form className="fa-form-grid" onSubmit={submit}>
          <Field label="Outstanding supplier bill">
            <select
              required
              value={form.billId}
              onChange={(event) => setForm({ ...form, billId: event.target.value, amount: '' })}
            >
              {bills.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} · {item.supplier} · Due {money(item.total - item.paid)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pay from">
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
              max={bill ? bill.total - bill.paid : undefined}
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
          <Field label="Payment / bank reference">
            <input
              required
              value={form.reference}
              onChange={(event) => setForm({ ...form, reference: event.target.value })}
              placeholder="Cheque or bank transfer reference"
            />
          </Field>
          <div className="fa-form-submit">
            <Button type="submit" disabled={!bill || !accounts.length}>
              <Check size={15} />
              Post supplier payment
            </Button>
          </div>
        </form>
        <div className="fa-form-actions">
          <span>
            {bill
              ? `${bill.supplier} · remaining balance ${money(bill.total - bill.paid)}`
              : 'No supplier bills are currently outstanding.'}
          </span>
        </div>
      </div>
      <Card title={`Recent supplier payments · ${data.payments.length}`} icon={ListChecks}>
        <Table headers={['Payment', 'Supplier', 'Date', 'Bank reference', 'Amount', 'Status']}>
          {data.payments.slice(0, 10).map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>{item.supplier || item.counterparty || '—'}</td>
              <td>{dateLabel(item.date)}</td>
              <td>{item.reference || '—'}</td>
              <td>{money(item.amount)}</td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}

export default MakePaymentPage
