import { ArrowLeftRight, ShieldCheck } from 'lucide-react'
import { Button, Field } from '../InventoryComponents'

export default function StockTransferPage({ context }) {
  const {
    data,
    transferBatchId,
    setTransferBatchId,
    transferWarehouseId,
    setTransferWarehouseId,
    warehouse,
    usable,
    lookup,
    transferSource,
    transferLocations,
    pageHeader,
    submitTransfer,
  } = context
  const page = 'Stock Transfer'

  const eligible = data.batches.filter(usable)

  const destinationWarehouses = data.warehouses.filter(
    (item) => item.id !== transferSource?.warehouseId,
  )

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Move an unexpired, QC-released lot between branch warehouses with full batch lineage.',
        ArrowLeftRight,
      )}
      <form className="inv-form-card" onSubmit={submitTransfer}>
        <h2>
          <ArrowLeftRight size={18} />
          Inter-warehouse batch transfer
        </h2>
        <div className="inv-form-grid">
          <Field label="Source batch" required>
            <select
              name="batchId"
              value={transferBatchId}
              onChange={(event) => {
                const selected = data.batches.find((item) => item.id === event.target.value)
                setTransferBatchId(event.target.value)
                if (selected?.warehouseId === transferWarehouseId)
                  setTransferWarehouseId(
                    data.warehouses.find((item) => item.id !== selected.warehouseId)?.id || '',
                  )
              }}
            >
              {eligible.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.batchNo} · {lookup(item.productId)} · {warehouse(item.warehouseId)?.name} ·{' '}
                  {item.qty} available
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity to transfer" required>
            <input name="qty" type="number" min="0.01" step="any" required />
          </Field>
          <Field label="Destination warehouse" required>
            <select
              name="toWarehouseId"
              value={transferWarehouseId}
              onChange={(event) => setTransferWarehouseId(event.target.value)}
            >
              {destinationWarehouses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Destination bin" required>
            <select name="toLocation" required>
              {transferLocations.map((item) => (
                <option key={item.id} value={item.code}>
                  {item.code} · {item.zone}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transfer reference">
            <input name="reference" placeholder="TRF-2026-0001" />
          </Field>
          <p className="inv-form-hint">
            <ShieldCheck size={16} />
            Transfers preserve the original manufacturer lot, manufacture/expiry dates, unit cost,
            and QC status. Expired and held batches cannot be transferred.
          </p>
        </div>
        <div className="inv-form-actions">
          <span>Choose a destination bin belonging to the selected destination warehouse.</span>
          <div>
            <Button type="submit">
              <ArrowLeftRight size={15} />
              Post transfer
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
