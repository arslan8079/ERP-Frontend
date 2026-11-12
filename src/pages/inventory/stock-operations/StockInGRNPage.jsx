import { useState } from 'react'
import { ArrowDownLeft, Check, ClipboardList, Clock3, PackagePlus, ShieldCheck } from 'lucide-react'
import { Button, Card, Field, Table } from '../InventoryComponents'

export default function StockInGRNPage({ context }) {
  const [purchaseOrderId, setPurchaseOrderId] = useState('')
  const {
    onNavigate,
    data,
    procurementData,
    receivingWarehouseId,
    setReceivingWarehouseId,
    issueProductId,
    setIssueProductId,
    warehouseOptions,
    productOptions,
    receivingLocations,
    movementHeaders,
    movementRows,
    pageHeader,
    saveBatchReceipt,
    day,
  } = context
  const page = 'Stock In (GRN)'
  const opening = page === 'Stock Opening'
  const selectedOrder = procurementData.purchaseOrders.find((item) => item.id === purchaseOrderId)

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        opening
          ? 'Enter a verified opening quantity against a real pesticide lot.'
          : 'Receive supplier stock into quarantine; record the receipt observation separately from inspection.',
        opening ? ClipboardList : ArrowDownLeft,
      )}
      <form
        className="inv-form-card"
        onSubmit={(event) => {
          if (saveBatchReceipt(event, opening)) setPurchaseOrderId('')
        }}
      >
        <h2>
          {opening ? <ClipboardList size={18} /> : <PackagePlus size={18} />}
          {opening ? 'Opening balance' : 'Goods receipt · receipt condition'}
        </h2>
        <div className="inv-form-grid">
          <Field label="Purchase order (optional)">
            <select
              name="purchaseOrderId"
              value={purchaseOrderId}
              onChange={(event) => {
                const nextId = event.target.value
                setPurchaseOrderId(nextId)
                const order = procurementData.purchaseOrders.find((item) => item.id === nextId)
                if (order) setIssueProductId(order.productId)
              }}
            >
              <option value="">Unlinked supplier receipt</option>
              {procurementData.purchaseOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} · {order.supplier}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pesticide product" required>
            <select
              name="productId"
              value={issueProductId}
              onChange={(event) => {
                setIssueProductId(event.target.value)
                setPurchaseOrderId('')
              }}
            >
              {productOptions}
            </select>
          </Field>
          <Field label="Batch / manufacturer lot" required>
            <input name="batchNo" placeholder="Exact lot from product label" required />
          </Field>
          <Field label="Receiving warehouse" required>
            <select
              name="warehouseId"
              value={receivingWarehouseId}
              onChange={(event) => setReceivingWarehouseId(event.target.value)}
            >
              {warehouseOptions}
            </select>
          </Field>
          <Field label="Storage bin" required>
            <select name="location" required>
              {receivingLocations.map((item) => (
                <option key={item.id} value={item.code}>
                  {item.code} · {item.zone}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Manufacture date" required>
            <input name="manufactured" type="date" max={day()} required />
          </Field>
          <Field label="Expiry date" required>
            <input name="expiry" type="date" min={day(1)} required />
          </Field>
          <Field label="Quantity in product base unit" required>
            <input name="qty" type="number" min="0.01" step="any" required />
          </Field>
          <Field label="Unit cost · PKR" required>
            <input
              key={purchaseOrderId}
              name="unitCost"
              type="number"
              min="0.01"
              step="any"
              defaultValue={selectedOrder?.unitPrice}
              required
            />
          </Field>
          {!opening && (
            <>
              <Field label="Supplier / manufacturer">
                <input
                  key={purchaseOrderId}
                  name="supplier"
                  placeholder="Approved supplier"
                  defaultValue={selectedOrder?.supplier}
                  required
                />
              </Field>
              <Field label="Receipt condition · intake observation only" required>
                <select name="receiptCondition" defaultValue="" required>
                  <option value="" disabled>
                    Select observed condition
                  </option>
                  <option value="Appears intact">Packaging appears intact</option>
                  <option value="Packaging damage observed">Packaging damage observed</option>
                  <option value="Storage/transport concern">Storage / transport concern</option>
                  <option value="Not assessed">Not assessed</option>
                </select>
              </Field>
            </>
          )}
          <Field label={opening ? 'Opening reference' : 'GRN / supplier invoice'} required>
            <input
              name="reference"
              placeholder={opening ? 'OB-2026-0002' : 'GRN-2026-0024'}
              required
            />
          </Field>
          {opening && (
            <Field label="Verification note">
              <input name="note" placeholder="Opening stock take / handover reference" />
            </Field>
          )}
          <p className="inv-form-hint">
            <ShieldCheck size={16} />
            {selectedOrder
              ? `Receipt will be linked to ${selectedOrder.id}; quantity and amount variances remain visible for review.`
              : 'Expired, future-manufactured, unregistered or quarantined lots are blocked from issue. Stock is recorded by product, batch, warehouse, bin, and expiry.'}
          </p>
        </div>
        <div className="inv-form-actions">
          <span>
            {opening
              ? 'Opening stock is treated as verified at entry.'
              : 'Every supplier GRN is quarantined until a separate QC inspection decision is recorded.'}
          </span>
          <div>
            <Button kind="secondary" onClick={() => onNavigate('Batch Register')}>
              Batch register
            </Button>
            <Button type="submit">
              <Check size={15} />
              {opening ? 'Record opening stock' : 'Post goods receipt'}
            </Button>
          </div>
        </div>
      </form>
      <Card title="Latest receipts & openings" icon={Clock3}>
        <Table headers={movementHeaders}>
          {movementRows(
            data.movements
              .filter((item) => item.type === 'GRN' || item.type === 'Opening')
              .slice(0, 8),
          )}
        </Table>
      </Card>
    </div>
  )
}
