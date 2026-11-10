import { Check, ClipboardCheck, X, ClipboardList } from 'lucide-react'
import { Button, Status, Card, Table } from '../InventoryComponents'

export default function AdjustmentApprovalsPage({ context }) {
  const {
    data,
    product,
    warehouse,
    filtered,
    lookup,
    decideApproval,
    pageHeader,
    searchBox,
    tableExport,
  } = context
  const page = 'Adjustment Approvals'

  return (() => {
    const config = {
      title: page,
      subtitle:
        'Independent review of stock adjustments, physical variances, and pesticide damage write-offs.',
      icon: ClipboardCheck,
      headers: [
        'Request / reference',
        'Batch / product',
        'Warehouse',
        'Adjustment',
        'Reason',
        'Requested',
        'Decision',
      ],
      items: filtered(
        data.approvals,
        (item) =>
          `${item.reference} ${item.batchNo} ${lookup(item.productId)} ${warehouse(item.warehouseId)?.name} ${item.reason} ${item.status}`,
      ),
      rows: filtered(
        data.approvals,
        (item) =>
          `${item.reference} ${item.batchNo} ${lookup(item.productId)} ${warehouse(item.warehouseId)?.name} ${item.reason} ${item.status}`,
      ).map((item) => (
        <tr key={item.id}>
          <td>
            <b>{item.reference}</b>
            <small className="inv-subtle">{item.type}</small>
          </td>
          <td>
            {item.batchNo}
            <small className="inv-subtle">{lookup(item.productId)}</small>
          </td>
          <td>{warehouse(item.warehouseId)?.name}</td>
          <td>
            {item.direction < 0 ? '−' : '+'}
            {item.qty} {product(item.productId)?.unit}
          </td>
          <td>{item.reason}</td>
          <td>{item.date}</td>
          <td>
            {item.status === 'Pending' ? (
              <div className="inv-row-actions">
                <Button kind="small approve" onClick={() => decideApproval(item, 'Approved')}>
                  <Check size={13} />
                  Approve
                </Button>
                <Button kind="small reject" onClick={() => decideApproval(item, 'Rejected')}>
                  <X size={13} />
                  Reject
                </Button>
              </div>
            ) : (
              <Status>{item.status}</Status>
            )}
          </td>
        </tr>
      )),
      empty: 'No inventory adjustments are waiting for approval.',
    }
    const title = config.title === undefined ? page : config.title
    const subtitle = config.subtitle
    const icon = config.icon === undefined ? ClipboardList : config.icon
    const headers = config.headers
    const items = config.items
    const action = config.action
    const exportHeaders = config.exportHeaders
    const exportRows = config.exportRows
    const empty = config.empty
    const tableRows = config.rows
    return (
      <div className="inv-page">
        {pageHeader(
          title,
          subtitle ||
            'Review pesticide inventory records with batch, warehouse and traceability context.',
          icon,
          action,
          exportRows ? tableExport(title, exportHeaders || headers, exportRows) : null,
        )}
        <div className="inv-toolbar">
          {searchBox}
          <span>
            {items.length} record{items.length === 1 ? '' : 's'}
          </span>
        </div>
        <Card title={`${title} \u00b7 ${items.length}`} icon={icon}>
          <Table headers={headers} empty={empty}>
            {tableRows}
          </Table>
        </Card>
      </div>
    )
  })()
}
