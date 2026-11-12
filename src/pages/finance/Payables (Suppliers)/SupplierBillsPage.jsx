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
import { readInventoryData } from '../../inventory/inventoryStock'
import { readProcurementData, writeProcurementData } from '../../procurement/procurementStore'

const cents = (value) => Math.round((Number(value) || 0) * 100) / 100

function purchaseOrderMatch(order, movements, bills, resolutions) {
  const receipts = movements.filter(
    (item) => item.type === 'GRN' && item.purchaseOrderId === order.id,
  )
  const linkedBills = bills.filter((item) => item.purchaseOrderId === order.id)
  const receivedQuantity = receipts.reduce((sum, item) => sum + Number(item.qty || 0), 0)
  const receivedAmount = cents(
    receipts.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitCost || 0), 0),
  )
  const billedQuantity = linkedBills.reduce((sum, item) => sum + Number(item.billedQty || 0), 0)
  const billedAmount = cents(linkedBills.reduce((sum, item) => sum + Number(item.total || 0), 0))
  const expectedQuantity = Number(order.quantity) || 0
  const expectedAmount = cents(order.expectedAmount)
  const receiptPriceVariance = cents(receivedAmount - receivedQuantity * Number(order.unitPrice))
  const billPriceVariance = cents(billedAmount - billedQuantity * Number(order.unitPrice))
  const issues = []

  if (receivedQuantity > expectedQuantity) issues.push('Received quantity is above the PO')
  if (billedQuantity > receivedQuantity) issues.push('Billed quantity is above received quantity')
  if (Math.abs(receiptPriceVariance) > 0.01) issues.push('Receipt value differs from the PO rate')
  if (Math.abs(billPriceVariance) > 0.01) issues.push('Bill value differs from the PO rate')

  const signature = [
    expectedQuantity,
    expectedAmount,
    receivedQuantity,
    receivedAmount,
    billedQuantity,
    billedAmount,
  ].join('|')
  const latestResolution = resolutions.find((item) => item.orderId === order.id)
  const resolved = issues.length > 0 && latestResolution?.signature === signature
  const status = issues.length
    ? resolved
      ? 'Resolution recorded'
      : 'Needs review'
    : receivedQuantity === 0
      ? 'Awaiting receipt'
      : receivedQuantity < expectedQuantity
        ? 'Partial receipt'
        : billedQuantity === 0
          ? 'Ready to bill'
          : billedQuantity < receivedQuantity
            ? 'Partially billed'
            : 'Matched'

  return {
    expectedQuantity,
    expectedAmount,
    receivedQuantity,
    receivedAmount,
    billedQuantity,
    billedAmount,
    issues,
    signature,
    latestResolution,
    resolved,
    status,
  }
}

function SupplierBillsPage({ data, createBill, onNotify, onNavigate }) {
  const [form, setForm] = useState({
    supplier: '',
    date: today(),
    dueDate: today(),
    total: '',
    expenseAccountId: 'AC-1200',
    purchaseOrderId: '',
    grnReference: '',
    billedQty: '',
  })
  const [showForm, setShowForm] = useState(false)
  const [procurementData, setProcurementData] = useState(readProcurementData)
  const [inventoryData] = useState(readInventoryData)
  const [resolutionNotes, setResolutionNotes] = useState({})
  const bills = openBills(data)
  const movements = inventoryData?.movements || []
  const selectedOrder = procurementData.purchaseOrders.find(
    (item) => item.id === form.purchaseOrderId,
  )
  const availableReceipts = movements.filter(
    (item) => item.type === 'GRN' && item.purchaseOrderId === selectedOrder?.id,
  )
  const selectPurchaseOrder = (orderId) => {
    const order = procurementData.purchaseOrders.find((item) => item.id === orderId)
    const receipt = movements.find(
      (item) => item.type === 'GRN' && item.purchaseOrderId === orderId,
    )
    setForm({
      ...form,
      purchaseOrderId: orderId,
      grnReference: receipt?.reference || '',
      supplier: order?.supplier || '',
      billedQty: '',
    })
  }
  const submit = (event) => {
    event.preventDefault()
    if (!form.supplier.trim() || Number(form.total) <= 0 || form.dueDate < form.date)
      return onNotify('Enter a supplier, positive bill amount, and valid bill dates.')
    if (form.purchaseOrderId) {
      if (!selectedOrder || !availableReceipts.some((item) => item.reference === form.grnReference))
        return onNotify('Select a goods receipt linked to the chosen purchase order.')
      if (!Number.isFinite(Number(form.billedQty)) || Number(form.billedQty) <= 0)
        return onNotify('Enter the quantity billed on the supplier invoice.')
    }
    const created = createBill({
      ...form,
      supplier: form.supplier.trim(),
      total: Number(form.total),
      billedQty: Number(form.billedQty) || 0,
    })
    if (created) {
      setForm({
        supplier: '',
        date: today(),
        dueDate: today(),
        total: '',
        expenseAccountId: 'AC-1200',
        purchaseOrderId: '',
        grnReference: '',
        billedQty: '',
      })
      setShowForm(false)
    }
  }
  const recordResolution = (orderId, signature) => {
    const note = String(resolutionNotes[orderId] || '').trim()
    if (!note) return onNotify('Enter a note describing how the variance was reviewed.')
    const resolution = {
      id: `RES-${Date.now()}`,
      orderId,
      signature,
      date: today(),
      note,
    }
    const next = {
      ...procurementData,
      resolutions: [resolution, ...procurementData.resolutions],
    }
    try {
      writeProcurementData(next)
      setProcurementData(next)
      onNotify('Variance review note recorded. Stock and ledger values were not changed.')
    } catch (error) {
      console.error('Unable to save procurement resolution:', error)
      onNotify('The variance review note could not be saved. Check browser storage and try again.')
    }
  }
  return (
    <>
      <PageHeader
        title="Supplier Bills"
        subtitle="Link invoices to purchase orders and goods receipts to compare ordered, received, and billed values."
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
            <Field label="Purchase order">
              <select
                value={form.purchaseOrderId}
                onChange={(event) => selectPurchaseOrder(event.target.value)}
              >
                <option value="">Unlinked supplier bill</option>
                {procurementData.purchaseOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id} · {order.supplier}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Supplier">
              <input
                required
                value={form.supplier}
                disabled={Boolean(selectedOrder)}
                onChange={(event) => setForm({ ...form, supplier: event.target.value })}
                placeholder="Supplier name"
              />
            </Field>
            {selectedOrder && (
              <>
                <Field label="Goods receipt" required>
                  <select
                    required
                    value={form.grnReference}
                    onChange={(event) => setForm({ ...form, grnReference: event.target.value })}
                  >
                    <option value="">Select linked GRN</option>
                    {availableReceipts.map((item) => (
                      <option key={item.id} value={item.reference}>
                        {item.reference} · {item.qty} {selectedOrder.unit} ·{' '}
                        {money(item.qty * item.unitCost)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={`Invoice quantity (${selectedOrder.unit})`} required>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    required
                    value={form.billedQty}
                    onChange={(event) => setForm({ ...form, billedQty: event.target.value })}
                  />
                </Field>
              </>
            )}
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
          <p className="fa-match-note">
            Linked bills post to Accounts Payable. Quantity or amount variances are shown for
            review; a resolution note records the review but does not change stock or ledger values.
          </p>
        </div>
      )}
      <Card
        title={`Purchase order matching · ${procurementData.purchaseOrders.length}`}
        icon={ListChecks}
        className="supplier-match-card"
      >
        <Table
          headers={[
            'PO / Supplier',
            'Product',
            'Expected qty / amount',
            'Received qty / amount',
            'Billed qty / amount',
            'Match status',
            'Variance / resolution note',
          ]}
        >
          {procurementData.purchaseOrders.map((order) => {
            const product = inventoryData?.products?.find((item) => item.id === order.productId)
            const match = purchaseOrderMatch(
              order,
              movements,
              data.bills,
              procurementData.resolutions,
            )
            const resolutionValue =
              resolutionNotes[order.id] ??
              (match.resolved ? match.latestResolution?.note || '' : '')
            return (
              <tr key={order.id}>
                <td>
                  <b>{order.id}</b>
                  <br />
                  {order.supplier}
                </td>
                <td>{product?.name || order.productName}</td>
                <td>
                  {match.expectedQuantity} {order.unit}
                  <br />
                  {money(match.expectedAmount)}
                </td>
                <td>
                  {match.receivedQuantity} {order.unit}
                  <br />
                  {money(match.receivedAmount)}
                </td>
                <td>
                  {match.billedQuantity} {order.unit}
                  <br />
                  {money(match.billedAmount)}
                </td>
                <td>
                  <Status>{match.status}</Status>
                </td>
                <td>
                  {match.issues.length ? (
                    <>
                      <div>{match.issues.join('; ')}</div>
                      {match.resolved && (
                        <small>
                          {dateLabel(match.latestResolution.date)} · {match.latestResolution.note}
                        </small>
                      )}
                      <input
                        aria-label={`Resolution note for ${order.id}`}
                        value={resolutionValue}
                        onChange={(event) =>
                          setResolutionNotes({ ...resolutionNotes, [order.id]: event.target.value })
                        }
                        placeholder="Required review note"
                      />
                      <Button
                        kind="secondary"
                        onClick={() => recordResolution(order.id, match.signature)}
                      >
                        Record review
                      </Button>
                    </>
                  ) : (
                    'No quantity or unit-price variance'
                  )}
                </td>
              </tr>
            )
          })}
        </Table>
        {!procurementData.purchaseOrders.length && (
          <Empty>
            Create a purchase order in Inventory to begin matching supplier receipts and bills.
          </Empty>
        )}
      </Card>
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
            'PO / GRN',
            'Billed quantity',
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
              <td>
                {item.purchaseOrderId ? (
                  <>
                    {item.purchaseOrderId}
                    <br />
                    {item.grnReference}
                  </>
                ) : (
                  'Unlinked'
                )}
              </td>
              <td>
                {item.billedQty
                  ? `${item.billedQty} ${
                      procurementData.purchaseOrders.find(
                        (order) => order.id === item.purchaseOrderId,
                      )?.unit || ''
                    }`
                  : '—'}
              </td>
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
