import { useState } from 'react'

const inspectionOptions = [
  'Accepted',
  'Partially accepted',
  'Damaged on receipt',
  'Incorrect delivery',
  'Other',
]
const dispositionOptions = [
  'Restock after inspection',
  'Credit without restock',
  'Write-off and reconcile',
]

export default function ReturnApprovalsPage({ context }) {
  const {
    data,
    decideReturn,
    table,
    header,
    status,
    Check,
    Package,
    X,
    money,
    dealerName,
    productCatalog,
  } = context
  const [reviewingId, setReviewingId] = useState('')
  const [draft, setDraft] = useState({})
  const page = 'Return Approvals'

  const startReview = (item) => {
    const inspection = item.finalInspection || item.inspection || ''
    setReviewingId(item.id)
    setDraft({
      receivedQuantity: item.receivedQuantity ?? item.quantity ?? '',
      acceptedQuantity: '',
      rejectedQuantity: '',
      finalInspection: inspectionOptions.includes(inspection) ? inspection : '',
      finalDisposition: dispositionOptions.includes(item.finalDisposition || item.disposition)
        ? item.finalDisposition || item.disposition
        : '',
      approvedCredit: '',
      decisionReason: '',
    })
  }
  const updateDraft = (key) => (event) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }))
  const reviewItem = data.returns.find((item) => item.id === reviewingId)
  const order = data.orders.find((item) => item.id === reviewItem?.orderId)
  const orderLine = order?.items?.find((line) => line.productCode === reviewItem?.productCode)
  const catalogPrice = productCatalog?.find(
    (product) => product.code === reviewItem?.productCode,
  )?.price
  const unitPrice = Number(orderLine?.unitPrice ?? catalogPrice ?? reviewItem?.unitPrice ?? 0)
  const requestedAmount = Number(reviewItem?.requestedAmount ?? reviewItem?.amount) || 0
  const acceptedQuantity = Number(draft.acceptedQuantity) || 0
  const creditCap = Math.max(0, Math.min(requestedAmount, acceptedQuantity * unitPrice))
  const recordedReceivedQuantity = Number(reviewItem?.receivedQuantity ?? reviewItem?.quantity)

  const submitDecision = (event) => {
    event.preventDefault()
    const decisionStatus = event.nativeEvent.submitter?.value
    if (!reviewItem || !['Approved', 'Rejected'].includes(decisionStatus)) return
    const succeeded = decideReturn(reviewItem.id, decisionStatus, {
      ...draft,
      decisionReason: draft.decisionReason,
    })
    if (succeeded) {
      setReviewingId('')
      setDraft({})
    }
  }

  if (page === 'Return Approvals')
    return (
      <div className="dealer-page">
        {header(
          'Inspect received quantities, split accepted and rejected units, then record stock and local dealer-account outcomes. Approved credit does not post a Finance journal.',
          Package,
        )}
        {table(
          'Return authorization queue',
          [
            'Return',
            'Dealer',
            'Original order',
            'Received / accepted / rejected',
            'Inspection / disposition',
            'Request / decision reason',
            'Requested / approved credit',
            'Date',
            'Decision',
          ],
          data.returns.map((item) => {
            const requested = Number(item.requestedAmount ?? item.amount) || 0
            const approved =
              Number(item.approvedCredit ?? (item.status === 'Approved' ? item.amount : 0)) || 0
            const received = item.receivedQuantity ?? item.quantity
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{dealerName(data, item.dealerId)}</td>
                <td>{item.orderId || 'Not linked'}</td>
                <td>
                  {received ?? 'Not recorded'} {item.productCode || ''}
                  <small>
                    Accepted: {item.acceptedQuantity ?? '—'} · Rejected:{' '}
                    {item.rejectedQuantity ?? '—'}
                  </small>
                  <small>Batch: {item.batchNo || item.batchId || 'Not linked'}</small>
                </td>
                <td>
                  {item.finalInspection || item.inspection || 'Pending review'}
                  <small>
                    {item.finalDisposition || item.disposition || 'Awaiting final disposition'}
                  </small>
                  {item.status !== 'Pending Approval' && (
                    <small>{item.stockOutcome || 'No stock outcome recorded.'}</small>
                  )}
                </td>
                <td>
                  {item.reason || 'No request reason recorded'}
                  <small>
                    {item.decisionReason ? `Decision: ${item.decisionReason}` : item.notes || ''}
                  </small>
                </td>
                <td>
                  {money(requested)}
                  <small>
                    Approved: {money(approved)}
                    {item.creditReference ? ` · ${item.creditReference}` : ''}
                  </small>
                  {item.status !== 'Pending Approval' && (
                    <small>
                      {item.accountOutcome ||
                        (approved > 0
                          ? 'Legacy approved credit accounted in local balance; reference not recorded.'
                          : 'No local credit applied.')}
                    </small>
                  )}
                </td>
                <td>{item.date}</td>
                <td>
                  {item.status === 'Pending Approval' ? (
                    <button className="dealer-mini approve" onClick={() => startReview(item)}>
                      <Check size={13} />
                      Inspect & decide
                    </button>
                  ) : (
                    status(item.status)
                  )}
                </td>
              </tr>
            )
          }),
          'No returns are waiting for review.',
        )}
        {reviewItem && (
          <form className="dealer-form-card" onSubmit={submitDecision}>
            <div className="dealer-form-heading">
              <span>Inspect return {reviewItem.id}</span>
              <small>
                Requested credit {money(requestedAmount)}
                {unitPrice > 0 ? ` · Order unit price ${money(unitPrice)}` : ''}
              </small>
              {(!order || !orderLine || !reviewItem.productCode || unitPrice <= 0) && (
                <small>
                  This legacy return is missing traceable order product or price details; approval
                  is blocked until those details are restored.
                </small>
              )}
            </div>
            <div className="dealer-form-grid">
              <label className="dealer-field">
                <span>Physically received quantity *</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  readOnly={
                    Number.isInteger(recordedReceivedQuantity) && recordedReceivedQuantity > 0
                  }
                  value={draft.receivedQuantity}
                  onChange={updateDraft('receivedQuantity')}
                />
              </label>
              <label className="dealer-field">
                <span>Accepted quantity *</span>
                <input
                  type="number"
                  min="0"
                  max={Number(draft.receivedQuantity) || undefined}
                  step="1"
                  required
                  value={draft.acceptedQuantity}
                  onChange={updateDraft('acceptedQuantity')}
                />
              </label>
              <label className="dealer-field">
                <span>Rejected quantity *</span>
                <input
                  type="number"
                  min="0"
                  max={Number(draft.receivedQuantity) || undefined}
                  step="1"
                  required
                  value={draft.rejectedQuantity}
                  onChange={updateDraft('rejectedQuantity')}
                />
              </label>
              <label className="dealer-field">
                <span>Final inspection result *</span>
                <select
                  required
                  value={draft.finalInspection}
                  onChange={updateDraft('finalInspection')}
                >
                  <option value="" disabled>
                    Select inspection result
                  </option>
                  {inspectionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="dealer-field">
                <span>Final disposition *</span>
                <select
                  required
                  value={draft.finalDisposition}
                  onChange={updateDraft('finalDisposition')}
                >
                  <option value="" disabled>
                    Select final disposition
                  </option>
                  {dispositionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="dealer-field">
                <span>Approved local credit (PKR) *</span>
                <input
                  type="number"
                  min="0"
                  max={creditCap}
                  step="1"
                  required
                  value={draft.approvedCredit}
                  onChange={updateDraft('approvedCredit')}
                />
                <small>Maximum {money(creditCap)} · rejected units receive no credit</small>
              </label>
              <label className="dealer-field wide">
                <span>Decision reason *</span>
                <textarea
                  rows={3}
                  required
                  value={draft.decisionReason}
                  onChange={updateDraft('decisionReason')}
                  placeholder="Explain the inspection and approval/rejection decision"
                />
              </label>
              <p className="dealer-field wide">
                Restock disposition adds accepted units only to the source batch. Other dispositions
                add no stock. Any approved credit updates the local dealer balance; no Finance
                journal is posted.
              </p>
            </div>
            <footer>
              <button
                type="button"
                className="dealer-button secondary"
                onClick={() => setReviewingId('')}
              >
                Cancel
              </button>
              <button
                type="submit"
                value="Rejected"
                formNoValidate
                className="dealer-button secondary"
              >
                <X size={15} />
                Reject return
              </button>
              <button type="submit" value="Approved" className="dealer-button">
                <Check size={15} />
                Approve inspected quantities
              </button>
            </footer>
          </form>
        )}
      </div>
    )

  return null
}
