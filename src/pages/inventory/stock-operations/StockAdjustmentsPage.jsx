import { ClipboardCheck, ClipboardList, ShieldAlert } from 'lucide-react'
import { Button, Card, Field, Status, Table } from '../InventoryComponents'

export default function StockAdjustmentsPage({ context }) {
  const { data, warehouse, lookup, pageHeader, submitAdjustment } = context
  const page = 'Stock Adjustments'

  const damaged = page === 'Damaged Stock'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        damaged
          ? 'Quarantine physical damage and submit the write-off for independent approval.'
          : 'Request a traceable stock correction; quantity changes only after approval.',
        damaged ? ShieldAlert : ClipboardCheck,
      )}
      <form className="inv-form-card" onSubmit={(event) => submitAdjustment(event, damaged)}>
        <h2>
          <ShieldAlert size={18} />
          {damaged ? 'Damaged / leaking pesticide stock' : 'Stock adjustment request'}
        </h2>
        <div className="inv-form-grid">
          <Field label="Batch / pesticide product" required>
            <select name="batchId">
              {data.batches
                .filter((item) => item.qty > 0)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.batchNo} · {lookup(item.productId)} · {warehouse(item.warehouseId)?.name}{' '}
                    · {item.qty} on hand
                  </option>
                ))}
            </select>
          </Field>
          <Field label={damaged ? 'Damaged quantity' : 'Adjustment quantity'} required>
            <input name="qty" type="number" min="0.01" step="any" required />
          </Field>
          {!damaged && (
            <Field label="Adjustment direction" required>
              <select name="direction">
                <option>Decrease</option>
                <option>Increase</option>
              </select>
            </Field>
          )}
          <Field
            label={damaged ? 'Damage / incident reason' : 'Reason and supporting reference'}
            required
          >
            <input
              name="reason"
              placeholder={
                damaged
                  ? 'Leakage, broken seal, contamination…'
                  : 'Count variance, authorised correction…'
              }
              required
            />
          </Field>
          <p className="inv-form-hint">
            <ClipboardCheck size={16} />
            Request remains pending until approved. Damage write-offs reduce stock only when
            approved; do not re-issue contaminated or damaged material.
          </p>
        </div>
        <div className="inv-form-actions">
          <span>
            Stock adjustments require a second person to approve; the ledger remains unchanged while
            pending.
          </span>
          <Button type="submit">
            <ClipboardCheck size={15} />
            Submit for approval
          </Button>
        </div>
      </form>
      <Card title="Adjustment approval queue" icon={ClipboardList}>
        <Table headers={['Request', 'Batch / product', 'Warehouse', 'Change', 'Reason', 'Status']}>
          {data.approvals.slice(0, 6).map((item) => (
            <tr key={item.id}>
              <td>{item.reference}</td>
              <td>
                {item.batchNo}
                <small className="inv-subtle">{lookup(item.productId)}</small>
              </td>
              <td>{warehouse(item.warehouseId)?.name}</td>
              <td>
                {item.direction < 0 ? '−' : '+'}
                {item.qty}
              </td>
              <td>{item.reason}</td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
