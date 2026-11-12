import { useState } from 'react'
import { Check, ClipboardCheck, ShieldAlert } from 'lucide-react'
import { Button, Card, Field, Status, Table } from '../InventoryComponents'

export default function QCInspectionsPage({ context }) {
  const { data, product, warehouse, submitQualityInspection, pageHeader, search, searchBox } =
    context
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const query = search.trim().toLowerCase()
  const pendingBatches = data.batches.filter(
    (batch) =>
      batch.quality === 'Quarantine' &&
      Number(batch.qty) > 0 &&
      (batch.status || 'Active') === 'Active' &&
      (!query ||
        `${batch.batchNo} ${product(batch.productId)?.name} ${batch.source} ${batch.receiptCondition}`
          .toLowerCase()
          .includes(query)),
  )
  const selectedBatch = pendingBatches.find((batch) => batch.id === selectedBatchId)
  const currentBatch = selectedBatch || pendingBatches[0]
  const inspections = (data.qcInspections || []).filter(
    (item) =>
      !query ||
      `${item.batchNo} ${product(item.productId)?.name} ${item.reference} ${item.result} ${item.decision} ${item.reason}`
        .toLowerCase()
        .includes(query),
  )

  return (
    <div className="inv-page">
      {pageHeader(
        'QC Inspections',
        'Inspect quarantined supplier receipts before release. Intake condition and QC result are recorded separately.',
        ClipboardCheck,
      )}
      <div className="inv-toolbar">
        {searchBox}
        <span>
          {pendingBatches.length} batch{pendingBatches.length === 1 ? '' : 'es'} awaiting inspection
        </span>
      </div>
      <Card
        title={`Quarantined stock awaiting inspection · ${pendingBatches.length}`}
        icon={ShieldAlert}
      >
        <Table
          headers={[
            'Batch / product',
            'Warehouse',
            'On hand',
            'Receipt reference',
            'Receipt condition',
            'Latest QC',
            'Action',
          ]}
        >
          {pendingBatches.map((batch) => (
            <tr key={batch.id}>
              <td>
                <b>{batch.batchNo}</b>
                <small>{product(batch.productId)?.name || 'Unknown product'}</small>
              </td>
              <td>
                {warehouse(batch.warehouseId)?.name || '—'}
                <small>{batch.location}</small>
              </td>
              <td>
                {batch.qty} {product(batch.productId)?.unit}
              </td>
              <td>{batch.source || 'No receipt reference'}</td>
              <td>{batch.receiptCondition || 'Not recorded (legacy batch)'}</td>
              <td>
                {batch.qcDecision ? (
                  <>
                    <Status>{`${batch.qcDecision} · ${batch.qcResult}`}</Status>
                    <small>{batch.qcReason}</small>
                  </>
                ) : (
                  <Status>Pending inspection</Status>
                )}
              </td>
              <td>
                <Button kind="small secondary" onClick={() => setSelectedBatchId(batch.id)}>
                  Inspect
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="Record inspection and decision" icon={ClipboardCheck}>
        {currentBatch ? (
          <form
            className="inv-form-card"
            onSubmit={(event) => {
              const decision = new FormData(event.currentTarget).get('decision')
              if (submitQualityInspection(event) && decision !== 'Hold') setSelectedBatchId('')
            }}
          >
            <p className="inv-form-hint">
              {currentBatch.batchNo} · {product(currentBatch.productId)?.name} · {currentBatch.qty}{' '}
              {product(currentBatch.productId)?.unit} on hand. Release requires Pass; Reject
              requires Fail. Hold keeps the quantity quarantined.
            </p>
            <div className="inv-form-grid">
              <Field label="Quarantined batch" required>
                <select
                  name="batchId"
                  value={currentBatch.id}
                  onChange={(event) => setSelectedBatchId(event.target.value)}
                >
                  {pendingBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNo} · {product(batch.productId)?.name} · {batch.qty} on hand
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Inspection result" required>
                <select name="result" defaultValue="" required>
                  <option value="" disabled>
                    Select result
                  </option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                  <option value="Further testing required">Further testing required</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="QC decision" required>
                <select name="decision" defaultValue="" required>
                  <option value="" disabled>
                    Select decision
                  </option>
                  <option value="Release">Release · eligible for issue</option>
                  <option value="Hold">Hold · remain quarantined</option>
                  <option value="Reject">Reject · blocked pending separate write-off</option>
                </select>
              </Field>
              <Field label="Inspection findings and decision reason" required>
                <textarea
                  name="reason"
                  rows="3"
                  placeholder="Record the observed findings and why this decision was made"
                  required
                />
              </Field>
            </div>
            <div className="inv-form-actions">
              <span>
                QC decisions do not change quantity. Rejected stock remains on hand but cannot be
                issued; disposal/write-off is a separate workflow.
              </span>
              <Button type="submit">
                <Check size={15} />
                Save QC decision
              </Button>
            </div>
          </form>
        ) : (
          <p className="inv-empty">No active quarantined stock is waiting for inspection.</p>
        )}
      </Card>

      <Card title={`Inspection history · ${inspections.length}`} icon={ClipboardCheck}>
        <Table
          headers={[
            'Date',
            'Batch / product',
            'Receipt reference',
            'Receipt condition',
            'Result',
            'Decision',
            'Reason',
            'Inspector',
          ]}
        >
          {inspections.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>
                <b>{item.batchNo}</b>
                <small>{product(item.productId)?.name || 'Unknown product'}</small>
              </td>
              <td>{item.reference}</td>
              <td>{item.receiptCondition}</td>
              <td>{item.result}</td>
              <td>
                <Status>{`${item.decision} · ${item.qualityAfter}`}</Status>
              </td>
              <td>{item.reason}</td>
              <td>{item.inspector}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
