import { useState } from 'react'
import { ArrowDownLeft, ClipboardList, Plus } from 'lucide-react'
import { Button, Card, Field, PageHeader, Status, Table } from '../InventoryComponents'

const emptyForm = {
  supplier: '',
  productId: '',
  quantity: '',
  unitPrice: '',
}

export default function PurchaseOrdersPage({ context }) {
  const { data, procurementData, createPurchaseOrder, onNavigate, money } = context
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const products = data.products.filter((item) => item.status !== 'Inactive')
  const orders = procurementData.purchaseOrders

  const submit = (event) => {
    event.preventDefault()
    const saved = createPurchaseOrder({
      ...form,
      supplier: form.supplier.trim(),
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
    })
    if (saved) {
      setForm(emptyForm)
      setShowForm(false)
    }
  }

  return (
    <div className="inv-page">
      <PageHeader
        title="Purchase Orders"
        subtitle="Create supplier orders and follow their ordered, received, and outstanding quantities."
        icon={ClipboardList}
        action={
          <Button onClick={() => setShowForm((current) => !current)}>
            <Plus size={15} />
            {showForm ? 'Close form' : 'Create purchase order'}
          </Button>
        }
      />
      {showForm && (
        <form className="inv-form-card" onSubmit={submit}>
          <h2>
            <ClipboardList size={18} />
            New supplier purchase order
          </h2>
          <div className="inv-form-grid">
            <Field label="Supplier" required>
              <input
                required
                value={form.supplier}
                onChange={(event) => setForm({ ...form, supplier: event.target.value })}
                placeholder="Supplier name"
              />
            </Field>
            <Field label="Pesticide product" required>
              <select
                required
                value={form.productId}
                onChange={(event) => setForm({ ...form, productId: event.target.value })}
              >
                <option value="">Select product</option>
                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.unit}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ordered quantity" required>
              <input
                required
                type="number"
                min="0.01"
                step="any"
                value={form.quantity}
                onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              />
            </Field>
            <Field label="Agreed unit price · PKR" required>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.unitPrice}
                onChange={(event) => setForm({ ...form, unitPrice: event.target.value })}
              />
            </Field>
            <p className="inv-form-hint">
              Expected line amount:{' '}
              {money(Number(form.quantity || 0) * Number(form.unitPrice || 0))}. Use a separate
              order for each product line.
            </p>
          </div>
          <div className="inv-form-actions">
            <span>Purchase order records are saved in this browser prototype.</span>
            <Button type="submit">
              <Plus size={15} />
              Save purchase order
            </Button>
          </div>
        </form>
      )}

      <Card
        title={`Supplier purchase orders · ${orders.length}`}
        icon={ClipboardList}
        action={
          <Button kind="link" onClick={() => onNavigate('Stock In (GRN)')}>
            Receive stock <ArrowDownLeft size={13} />
          </Button>
        }
      >
        <Table
          headers={[
            'Purchase order',
            'Supplier',
            'Product',
            'Ordered',
            'Received',
            'Remaining',
            'Expected amount',
            'Receipt amount',
            'Status',
            'Action',
          ]}
          empty="Create a supplier purchase order to start tracking receipts."
        >
          {orders.map((order) => {
            const product = data.products.find((item) => item.id === order.productId)
            const receipts = data.movements.filter(
              (item) => item.type === 'GRN' && item.purchaseOrderId === order.id,
            )
            const receivedQuantity = receipts.reduce((sum, item) => sum + Number(item.qty || 0), 0)
            const receivedAmount = receipts.reduce(
              (sum, item) => sum + Number(item.qty || 0) * Number(item.unitCost || 0),
              0,
            )
            const remaining = Number(order.quantity) - receivedQuantity
            const status =
              remaining < 0
                ? 'Over received'
                : remaining === 0
                  ? 'Received'
                  : receivedQuantity
                    ? 'Partial receipt'
                    : 'Open'

            return (
              <tr key={order.id}>
                <td>
                  <b>{order.id}</b>
                </td>
                <td>{order.supplier}</td>
                <td>{product?.name || order.productName}</td>
                <td>
                  {Number(order.quantity).toLocaleString('en-PK')} {order.unit}
                </td>
                <td>
                  {receivedQuantity.toLocaleString('en-PK')} {order.unit}
                </td>
                <td>
                  {remaining.toLocaleString('en-PK')} {order.unit}
                </td>
                <td>{money(order.expectedAmount)}</td>
                <td>{money(receivedAmount)}</td>
                <td>
                  <Status>{status}</Status>
                </td>
                <td>
                  <Button kind="link" onClick={() => onNavigate('Stock In (GRN)')}>
                    Receive
                  </Button>
                </td>
              </tr>
            )
          })}
        </Table>
      </Card>
    </div>
  )
}
