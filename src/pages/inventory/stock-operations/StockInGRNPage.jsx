import { ArrowDownLeft, Check, ClipboardList, Clock3, PackagePlus, ShieldCheck } from 'lucide-react'
import { Button, Card, Field, Table } from '../InventoryComponents'

export default function StockInGRNPage({ context }) {
  const {
    onNavigate,
    data,
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

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        opening
          ? 'Enter a verified opening quantity against a real pesticide lot.'
          : 'Receive supplier stock into a controlled bin with lot, expiry, and QC status.',
        opening ? ClipboardList : ArrowDownLeft,
      )}
      <form className="inv-form-card" onSubmit={(event) => saveBatchReceipt(event, opening)}>
        <h2>
          {opening ? <ClipboardList size={18} /> : <PackagePlus size={18} />}
          {opening ? 'Opening balance' : 'Goods receipt · batch and quality check'}
        </h2>
        <div className="inv-form-grid">
          <Field label="Pesticide product" required>
            <select
              name="productId"
              value={issueProductId}
              onChange={(event) => setIssueProductId(event.target.value)}
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
            <input name="unitCost" type="number" min="0.01" step="any" required />
          </Field>
          {!opening && (
            <>
              <Field label="Supplier / manufacturer">
                <input name="supplier" placeholder="Approved supplier" required />
              </Field>
              <Field label="Quality release status" required>
                <select name="quality">
                  <option value="Released">QC released · eligible for issue</option>
                  <option value="Quarantine">Quarantine · hold pending QC</option>
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
            Expired, future-manufactured, unregistered or quarantined lots are blocked from issue.
            Stock is recorded by product, batch, warehouse, bin, and expiry.
          </p>
        </div>
        <div className="inv-form-actions">
          <span>
            GRN updates the batch ledger immediately; select quarantine when quality release is
            pending.
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
