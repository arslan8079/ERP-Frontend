import { useState } from 'react'
import {
  today,
  money,
  dateLabel,
  accountName,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Field,
  AccountPicker,
  Check,
  ListChecks,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
} from '../financeShared'

function CashReceiptsPage({ data, recordCashTransaction, onNotify }) {
  const control = 'Cash'
  const direction = 'Receipt'
  const incoming = direction === 'Receipt'
  const cashAccounts = data.accounts.filter(
    (item) => item.control === control && item.status === 'Active',
  )
  const offsetTypes = incoming
    ? ['Revenue', 'Liability', 'Asset']
    : ['Expense', 'Asset', 'Liability']
  const [form, setForm] = useState({
    date: today(),
    cashAccountId: cashAccounts[0]?.id || '',
    offsetAccountId: '',
    counterparty: '',
    amount: '',
    description: '',
  })
  const submit = (event) => {
    event.preventDefault()
    if (!form.counterparty.trim() || !form.description.trim())
      return onNotify('Enter the counterparty and transaction description.')
    recordCashTransaction(
      { ...form, counterparty: form.counterparty.trim(), description: form.description.trim() },
      direction,
    )
    setForm({ ...form, amount: '', counterparty: '', description: '' })
  }
  const entries = incoming ? data.receipts : data.payments
  const recent = entries
    .filter((item) => item.accountId === form.cashAccountId || !item.accountId)
    .slice(0, 10)
  return (
    <>
      <PageHeader
        title={incoming ? 'Cash Receipts' : 'Cash Payments'}
        subtitle={
          incoming
            ? 'Record customer and other cash collections with their ledger counterpart.'
            : 'Record cash disbursements with expense or liability coding.'
        }
        icon={incoming ? ArrowDownLeft : ArrowUpRight}
      />
      <div className="fa-form-card">
        <h2>
          <Receipt size={18} />
          {incoming ? 'New cash receipt' : 'New cash payment'}
        </h2>
        <form className="fa-form-grid" onSubmit={submit}>
          <Field label={control === 'Cash' ? 'Cash account' : 'Bank account'}>
            <select
              required
              value={form.cashAccountId}
              onChange={(event) => setForm({ ...form, cashAccountId: event.target.value })}
            >
              {cashAccounts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} {'\u00b7'} {item.name}
                </option>
              ))}
            </select>
          </Field>
          <AccountPicker
            data={data}
            types={offsetTypes}
            value={form.offsetAccountId}
            onChange={(event) => setForm({ ...form, offsetAccountId: event.target.value })}
            label={incoming ? 'Credit / offset account' : 'Debit / offset account'}
          />
          <Field label={incoming ? 'Received from' : 'Paid to'}>
            <input
              required
              value={form.counterparty}
              onChange={(event) => setForm({ ...form, counterparty: event.target.value })}
              placeholder={incoming ? 'Customer or payer name' : 'Supplier or payee name'}
            />
          </Field>
          <Field label="Amount (PKR)">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
            />
          </Field>
          <Field label="Transaction date">
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </Field>
          <Field label="Description / reference">
            <input
              required
              maxLength="120"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Receipt number, purpose or document reference"
            />
          </Field>
          <div className="fa-form-submit">
            <Button type="submit" disabled={!cashAccounts.length}>
              <Check size={15} />
              Post {incoming ? 'receipt' : 'payment'}
            </Button>
          </div>
        </form>
      </div>
      <Card
        title={`Recent ${incoming ? 'receipts' : 'payments'} \u00b7 ${recent.length}`}
        icon={ListChecks}
      >
        <Table
          headers={[
            'Reference',
            'Date',
            incoming ? 'Received from' : 'Paid to',
            'Ledger',
            'Amount',
            'Status',
          ]}
        >
          {recent.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>{dateLabel(item.date)}</td>
              <td>{item.customer || item.supplier || item.counterparty || '\u2014'}</td>
              <td>{accountName(data, item.accountId)}</td>
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

export default CashReceiptsPage
