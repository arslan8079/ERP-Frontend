import { ArrowUpRight, Clock3, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Button, Card, Field, Table } from '../InventoryComponents'

export default function StockOutIssuePage({ context }) {
  const {
    onNavigate,
    data,
    issueWarehouseId,
    setIssueWarehouseId,
    warehouseOptions,
    productOptions,
    issueBatches,
    movementHeaders,
    movementRows,
    pageHeader,
    submitIssue,
  } = context
  const page = 'Stock Out (Issue)'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Issue approved stock to dealer orders, production, field teams, or internal consumption.',
        ArrowUpRight,
      )}
      <form className="inv-form-card" onSubmit={submitIssue}>
        <h2>
          <ShieldCheck size={18} />
          Controlled stock issue · FEFO
        </h2>
        <div className="inv-form-grid">
          <Field label="Pesticide product" required>
            <select name="productId">{productOptions}</select>
          </Field>{' '}
          <Field label="Issue warehouse" required>
            <select
              name="warehouseId"
              value={issueWarehouseId}
              onChange={(event) => setIssueWarehouseId(event.target.value)}
            >
              {warehouseOptions}
            </select>
          </Field>
          <Field label="Specific batch (optional)">
            <select name="batchNo">
              <option value="">Automatic FEFO · earliest expiry first</option>
              {issueBatches.map((item) => (
                <option key={item.id} value={item.batchNo}>
                  {item.batchNo} · {item.qty} · exp {item.expiry}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Issue quantity · base unit" required>
            <input name="qty" type="number" min="0.01" step="any" required />
          </Field>
          <Field label="Issue purpose" required>
            <select name="purpose">
              <option>Dealer sales dispatch</option>
              <option>Production / repacking</option>
              <option>Field trial / demonstration</option>
              <option>Internal transfer / consumption</option>
              <option>Approved write-off</option>
            </select>
          </Field>
          <Field label="Sales order / issue reference" required>
            <input name="reference" placeholder="SO-2026-0042 / ISSUE-0001" required />
          </Field>
          <p className="inv-form-hint">
            <ShieldAlert size={16} />
            Only QC-released, unexpired quantity is issuable. FEFO selects the earliest-expiry batch
            first; issues never consume quarantine or expired stock.
          </p>
        </div>
        <div className="inv-form-actions">
          <span>
            Issue records are permanent movements; corrections use a separately approved adjustment.
          </span>
          <div>
            <Button kind="secondary" onClick={() => onNavigate('Batch Stock')}>
              Check batch stock
            </Button>
            <Button type="submit">
              <ArrowUpRight size={15} />
              Post stock issue
            </Button>
          </div>
        </div>
      </form>
      <Card title="Recent issues" icon={Clock3}>
        <Table headers={movementHeaders}>
          {movementRows(data.movements.filter((item) => item.type === 'Issue').slice(0, 8))}
        </Table>
      </Card>
    </div>
  )
}
