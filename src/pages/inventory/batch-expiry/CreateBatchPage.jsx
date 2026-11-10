import { FlaskConical, Plus, ShieldCheck } from 'lucide-react'
import { Button, Field } from '../InventoryComponents'

export default function CreateBatchPage({ context }) {
  const {
    batchWarehouseId,
    setBatchWarehouseId,
    warehouseOptions,
    productOptions,
    registeredBatchLocations,
    pageHeader,
    submitBatch,
    day,
  } = context
  const page = 'Create Batch'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Register a manufacturer lot before receipt; a new batch remains in quarantine until received and QC-released.',
        FlaskConical,
      )}
      <form className="inv-form-card" onSubmit={submitBatch}>
        <h2>
          <FlaskConical size={18} />
          Manufacturer batch identity
        </h2>
        <div className="inv-form-grid">
          <Field label="Registered pesticide" required>
            <select name="productId">{productOptions}</select>
          </Field>
          <Field label="Manufacturer batch number" required>
            <input name="batchNo" required />
          </Field>
          <Field label="Receiving warehouse" required>
            <select
              name="warehouseId"
              value={batchWarehouseId}
              onChange={(event) => setBatchWarehouseId(event.target.value)}
            >
              {warehouseOptions}
            </select>
          </Field>
          <Field label="Storage bin" required>
            <select name="location">
              {registeredBatchLocations.map((item) => (
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
          <p className="inv-form-hint">
            <ShieldCheck size={16} />
            New batch starts with zero available stock and quarantine status. Record a GRN, inspect
            the label/seal, and release QC before issue.
          </p>
        </div>
        <div className="inv-form-actions">
          <span>Batch number and expiry must match the manufacturer's physical label.</span>
          <Button type="submit">
            <Plus size={15} />
            Register batch
          </Button>
        </div>
      </form>
    </div>
  )
}
