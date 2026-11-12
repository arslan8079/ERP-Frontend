import { Fragment, useState } from 'react'
import { ClipboardCheck, Plus, ClipboardList, RotateCcw } from 'lucide-react'
import { Button, Status, Card, Table } from '../InventoryComponents'

export default function StockReconciliationPage({ context }) {
  const {
    onNavigate,
    data,
    warehouse,
    product,
    filtered,
    pageHeader,
    searchBox,
    tableExport,
    resumePhysicalCount,
    startPhysicalCount,
  } = context
  const [expandedCountId, setExpandedCountId] = useState('')
  const page = 'Stock Reconciliation'
  const counts = filtered(
    data.counts,
    (item) => `${item.id} ${warehouse(item.warehouseId)?.name} ${item.status}`,
  )

  const rows = counts.map((count) => {
    const countApprovals = data.approvals.filter((approval) => approval.countId === count.id)
    const hasPendingApproval = countApprovals.some((approval) => approval.status === 'Pending')
    const canRecount = count.status !== 'Superseded' && !hasPendingApproval

    return (
      <Fragment key={count.id}>
        <tr>
          <td>
            <b>{count.id}</b>
            {count.recountOf && <small className="inv-subtle">Recount of {count.recountOf}</small>}
          </td>
          <td>{count.date}</td>
          <td>{warehouse(count.warehouseId)?.name}</td>
          <td>{count.lines.length}</td>
          <td>{countApprovals.length}</td>
          <td>
            <Status>{count.status}</Status>
          </td>
          <td>
            <div className="inv-row-actions">
              <Button
                kind="link"
                onClick={() => setExpandedCountId(expandedCountId === count.id ? '' : count.id)}
              >
                {expandedCountId === count.id ? 'Hide details' : 'View details'}
              </Button>
              {count.status === 'In progress' && (
                <Button kind="link" onClick={() => resumePhysicalCount(count.id)}>
                  Resume
                </Button>
              )}
              {canRecount && (
                <Button
                  kind="link"
                  onClick={() => {
                    if (startPhysicalCount(count.warehouseId, count.id))
                      onNavigate('Physical Stock Count')
                  }}
                >
                  <RotateCcw size={13} />
                  Recount
                </Button>
              )}
            </div>
          </td>
        </tr>
        {expandedCountId === count.id && (
          <tr>
            <td colSpan={7}>
              <div className="inv-count-details">
                <b>
                  {count.status === 'In progress'
                    ? 'Saved count progress'
                    : `Count result · ${count.status}`}
                </b>
                <Table
                  headers={[
                    'Product / batch',
                    'Book quantity',
                    'Physical count',
                    'Variance decision',
                    'Adjustment history',
                  ]}
                >
                  {count.lines.map((line) => {
                    const unit = product(line.productId)?.unit || ''
                    const variance =
                      line.countedQty == null
                        ? null
                        : Number(line.countedQty) - Number(line.bookQty)
                    const approval = countApprovals.find((item) => item.batchId === line.batchId)
                    const movement = data.movements.find(
                      (item) =>
                        item.reference === count.id &&
                        item.batchNo === line.batchNo &&
                        String(item.type).startsWith('Adjustment'),
                    )
                    return (
                      <tr key={line.batchId}>
                        <td>
                          {product(line.productId)?.name || line.productId}
                          <small className="inv-subtle">{line.batchNo}</small>
                        </td>
                        <td>
                          {line.bookQty} {unit}
                        </td>
                        <td>
                          {line.countedQty == null ? 'Not entered' : `${line.countedQty} ${unit}`}
                          {variance !== null && variance !== 0 && (
                            <small className="inv-subtle">
                              Variance: {variance > 0 ? '+' : ''}
                              {variance} {unit}
                            </small>
                          )}
                        </td>
                        <td>
                          {variance === null || variance === 0
                            ? 'No variance'
                            : approval
                              ? `${approval.status}${approval.decidedAt ? ` · ${approval.decidedAt}` : ''}`
                              : 'No approval record'}
                        </td>
                        <td>
                          {movement
                            ? `${movement.date} · ${movement.type} · ${movement.qty} ${unit}`
                            : 'No adjustment posted'}
                        </td>
                      </tr>
                    )
                  })}
                </Table>
                {count.status === 'In progress' && (
                  <p className="inv-subtle">
                    This count is saved but not submitted. Resume it to continue entering physical
                    quantities.
                  </p>
                )}
                {count.status === 'Superseded' && (
                  <p className="inv-subtle">A newer recount replaced this unfinished count.</p>
                )}
              </div>
            </td>
          </tr>
        )}
      </Fragment>
    )
  })

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Resume saved counts, review variance decisions, and inspect posted stock adjustments.',
        ClipboardCheck,
        <Button onClick={() => onNavigate('Physical Stock Count')}>
          <Plus size={15} />
          Start count
        </Button>,
        tableExport(
          page,
          ['Count reference', 'Date', 'Warehouse', 'Lines counted', 'Variance requests', 'Status'],
          counts.map((item) => [
            item.id,
            item.date,
            warehouse(item.warehouseId)?.name || '',
            item.lines.length,
            data.approvals.filter((approval) => approval.countId === item.id).length,
            item.status,
          ]),
        ),
      )}
      <div className="inv-toolbar">
        {searchBox}
        <span>
          {counts.length} record{counts.length === 1 ? '' : 's'}
        </span>
      </div>
      <Card title={`${page} · ${counts.length}`} icon={ClipboardList}>
        <Table
          headers={[
            'Count reference',
            'Date',
            'Warehouse',
            'Lines counted',
            'Variance requests',
            'Status',
            'Actions',
          ]}
          empty="No stock counts yet. Start a count to capture a book-to-physical snapshot."
        >
          {rows}
        </Table>
      </Card>
    </div>
  )
}
