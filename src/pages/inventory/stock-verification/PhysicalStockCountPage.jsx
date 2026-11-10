import { ClipboardCheck, ClipboardList } from 'lucide-react'
import { Button, Field, Table } from '../InventoryComponents'

export default function PhysicalStockCountPage({ context }) {
  const {
    data,
    countWarehouseId,
    setCountWarehouseId,
    countValues,
    setCountValues,
    product,
    lookup,
    warehouseOptions,
    pageHeader,
    submitPhysicalCount,
  } = context
  const page = 'Physical Stock Count'

  const lines = data.batches.filter((item) => item.warehouseId === countWarehouseId)

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Count lot-by-lot, including quarantined and expired pesticide stock in the selected warehouse.',
        ClipboardList,
      )}
      <form className="inv-card inv-count-card" onSubmit={submitPhysicalCount}>
        <div className="inv-count-header">
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
          <span>{lines.length} counted batch lines</span>
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
          {lines.map((item) => (
            <tr key={item.id}>
              <td>
                {lookup(item.productId)}
                <small className="inv-subtle">{item.batchNo}</small>
              </td>
              <td>{item.location}</td>
              <td>
                <b>
                  {item.qty} {product(item.productId)?.unit}
                </b>
              </td>
              <td>
                <input
                  aria-label={`Physical count for ${item.batchNo}`}
                  className="inv-count-input"
                  type="number"
                  min="0"
                  step="any"
                  value={countValues[item.id] ?? ''}
                  onChange={(event) =>
                    setCountValues({ ...countValues, [item.id]: event.target.value })
                  }
                />
              </td>
              <td>
                {item.expiry}
                <small className="inv-subtle">{item.quality}</small>
              </td>
            </tr>
          ))}
        </Table>
        <div className="inv-form-actions">
          <span>
            Every variance creates a pending approval; book stock is not changed by counting.
          </span>
          <Button type="submit">
            <ClipboardCheck size={15} />
            Submit count & variances
          </Button>
        </div>
      </form>
    </div>
  )
}
