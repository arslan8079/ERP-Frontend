import { useState } from 'react'
import {
  money,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Field,
  Empty,
  openInvoices,
  ArrowRight,
  Check,
  ListChecks,
  Receipt,
} from '../financeShared'

function PaymentAllocationPage({ data, allocateReceipt, onNotify }) {
  const receipts = data.receipts.filter(
    (item) => item.amount > item.allocated && item.offsetAccountId === 'AC-1100',
  )
  const invoices = openInvoices(data)
  const [receiptId, setReceiptId] = useState(receipts[0]?.id || '')
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id || '')
  const [amount, setAmount] = useState('')
  const receipt = receipts.find((item) => item.id === receiptId)
  const invoice = invoices.find((item) => item.id === invoiceId)
  const submit = (event) => {
    event.preventDefault()
    allocateReceipt(receiptId, invoiceId, amount)
    setAmount('')
  }
  return (
    <>
      <PageHeader
        title="Payment Allocation"
        subtitle="Apply unallocated customer receipts to one or more outstanding invoices."
        icon={ArrowRight}
      />
      <Card title="Allocate an unassigned receipt" icon={Receipt}>
        <form className="fa-inline-form" onSubmit={submit}>
          <Field label="Unallocated receipt">
            <select
              required
              value={receiptId}
              onChange={(event) => setReceiptId(event.target.value)}
            >
              {receipts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} · {item.customer} · Balance {money(item.amount - item.allocated)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Open customer invoice">
            <select
              required
              value={invoiceId}
              onChange={(event) => setInvoiceId(event.target.value)}
            >
              {invoices
                .filter((item) => !receipt || item.customer === receipt.customer)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} · {item.customer} · Due {money(item.total - item.allocated)}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Allocation amount (PKR)">
            <input
              type="number"
              min="0.01"
              step="0.01"
              max={Math.min(
                receipt ? receipt.amount - receipt.allocated : Infinity,
                invoice ? invoice.total - invoice.allocated : Infinity,
              )}
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          <Button type="submit" disabled={!receipt || !invoice}>
            <Check size={15} />
            Allocate payment
          </Button>
        </form>
        {!receipts.length && <Empty>All recorded receipts have been allocated.</Empty>}
        {receipts.length > 0 && !invoices.length && (
          <Empty>No open customer invoices are available.</Empty>
        )}
      </Card>
      <Card
        title={`Allocation history · ${data.receipts.filter((item) => item.allocated > 0).length} allocated receipt(s)`}
        icon={ListChecks}
      >
        <Table
          headers={['Receipt', 'Customer', 'Receipt amount', 'Allocated', 'Unallocated', 'Status']}
        >
          {data.receipts.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>{item.customer}</td>
              <td>{money(item.amount)}</td>
              <td>{money(item.allocated)}</td>
              <td>{money(item.amount - item.allocated)}</td>
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

export default PaymentAllocationPage
