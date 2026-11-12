import { FlaskConical, Plus, ShieldCheck } from 'lucide-react'
import { Button, Field } from '../InventoryComponents'

export default function CreateBatchPage({ context }) {
  const {
    onNavigate,
    batchWarehouseId,
    setBatchWarehouseId,
    warehouseOptions,
    productOptions,
    registeredBatchLocations,
    pageHeader,
    submitBatch,
    day,
    editingBatch,
    setEditingBatchId,
  } = context
  const page = 'Create Batch'

  return (
    <div className="inv-page">
      {pageHeader(
        editingBatch ? 'Edit Batch' : page,
        editingBatch
          ? 'Update lot identity details. Stock and movement history are preserved.'
          : 'Register a manufacturer lot before receipt; a new batch remains in quarantine until received and QC-released.',
        FlaskConical,
      )}
      <form className="inv-form-card" key={editingBatch?.id || 'new-batch'} onSubmit={submitBatch}>
        <h2>
          <FlaskConical size={18} />
          Manufacturer batch identity
        </h2>
        <div className="inv-form-grid">
          <Field label="Registered pesticide" required>
            <select name="productId" defaultValue={editingBatch?.productId}>
              {productOptions}
            </select>
          </Field>
          <Field label="Manufacturer batch number" required>
            <input name="batchNo" defaultValue={editingBatch?.batchNo || ''} required />
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
            <select name="location" defaultValue={editingBatch?.location}>
              {registeredBatchLocations.map((item) => (
                <option key={item.id} value={item.code}>
                  {item.code} · {item.zone}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Manufacture date" required>
            <input
              name="manufactured"
              type="date"
              max={day()}
              defaultValue={editingBatch?.manufactured || ''}
              required
            />
          </Field>
          <Field label="Expiry date" required>
            <input
              name="expiry"
              type="date"
              min={editingBatch ? undefined : day(1)}
              defaultValue={editingBatch?.expiry || ''}
              required
            />
          </Field>
          <p className="inv-form-hint">
            <ShieldCheck size={16} />
            {editingBatch
              ? 'Batch code remains unique. Batch stock is not editable here; use the stock ledger for quantity changes.'
              : 'New batch starts with zero available stock and quarantine status. Record a GRN, inspect the label/seal, and release QC before issue.'}
          </p>
        </div>
        <div className="inv-form-actions">
          <span>
            {editingBatch
              ? 'Archived and stock-bearing batches retain their existing movement references.'
              : "Batch number and expiry must match the manufacturer's physical label."}
          </span>
          <Button type="submit">
            <Plus size={15} />
            {editingBatch ? 'Save changes' : 'Register batch'}
          </Button>
          {editingBatch && (
            <Button
              kind="secondary"
              onClick={() => {
                setEditingBatchId('')
                onNavigate('Batch Register')
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
