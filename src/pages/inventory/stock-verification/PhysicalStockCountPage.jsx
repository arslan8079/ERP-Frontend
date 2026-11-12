import { ClipboardCheck, ClipboardList, RotateCcw, Save } from 'lucide-react'
import { Button, Field, Table } from '../InventoryComponents'

export default function PhysicalStockCountPage({ context }) {
  const {
    data,
    countWarehouseId,
    setCountWarehouseId,
    countValues,
    setCountValues,
    activeCount,
    startPhysicalCount,
    savePhysicalCount,
    product,
    lookup,
    warehouse,
    warehouseOptions,
    pageHeader,
    submitPhysicalCount,
  } = context
  const page = 'Physical Stock Count'
  const lines = activeCount
    ? activeCount.lines
    : data.batches
        .filter((item) => item.warehouseId === countWarehouseId)
        .map((item) => ({
          batchId: item.id,
          batchNo: item.batchNo,
          productId: item.productId,
          bookQty: Number(item.qty),
        }))

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Count lot-by-lot, including quarantined and expired pesticide stock in the selected warehouse.',
        ClipboardList,
      )}
      <form className="inv-card inv-count-card" onSubmit={submitPhysicalCount}>
        <div className="inv-count-header">
          {activeCount ? (
            <div>
              <b>{activeCount.id}</b>
              <span className="inv-subtle">
                {warehouse(activeCount.warehouseId)?.name || 'Unknown warehouse'}
                {activeCount.recountOf ? ` · Recount of ${activeCount.recountOf}` : ''}
              </span>
            </div>
          ) : (
            <Field label="Warehouse to count" required>
              <select
                name="warehouseId"
                value={countWarehouseId}
                onChange={(event) => {
                  setCountWarehouseId(event.target.value)
                  setCountValues({})
                }}
              >
                {warehouseOptions}
              </select>
            </Field>
          )}
          <span>{lines.length} batch lines</span>
        </div>
        <Table
          headers={[
            'Product / batch',
            'Storage bin',
            'Book quantity',
            'Physical count',
            'Expiry / QC',
          ]}
        >
          {lines.map((line) => {
            const batch = data.batches.find((item) => item.id === line.batchId)
            const unit = product(line.productId)?.unit
            return (
              <tr key={line.batchId}>
                <td>
                  {lookup(line.productId)}
                  <small className="inv-subtle">{line.batchNo}</small>
                </td>
                <td>{batch?.location || 'Batch no longer registered'}</td>
                <td>
                  <b>
                    {line.bookQty} {unit}
                  </b>
                </td>
                <td>
                  {activeCount ? (
                    <input
                      aria-label={`Physical count for ${line.batchNo}`}
                      className="inv-count-input"
                      type="number"
                      min="0"
                      step="any"
                      value={countValues[line.batchId] ?? ''}
                      onChange={(event) =>
                        setCountValues({ ...countValues, [line.batchId]: event.target.value })
                      }
                    />
                  ) : (
                    'Not started'
                  )}
                </td>
                <td>
                  {batch?.expiry || '—'}
                  <small className="inv-subtle">{batch?.quality || '—'}</small>
                </td>
              </tr>
            )
          })}
        </Table>
        <div className="inv-form-actions">
          <span>
            {activeCount
              ? 'Progress is saved in this browser. Book stock changes only after variance approval.'
              : 'Start a count to save progress and resume it later. Book stock is not changed by counting.'}
          </span>
          {activeCount ? (
            <div>
              <Button type="button" kind="secondary" onClick={savePhysicalCount}>
                <Save size={15} />
                Save progress
              </Button>
              <Button type="submit">
                <ClipboardCheck size={15} />
                Submit count & variances
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => startPhysicalCount(countWarehouseId)}
              disabled={!lines.length}
            >
              <RotateCcw size={15} />
              Start new count
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
