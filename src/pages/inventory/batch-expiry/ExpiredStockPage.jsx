import { ArrowRight, FlaskConical, ShieldAlert, ClipboardList } from 'lucide-react'
import { Button, Card, Table } from '../InventoryComponents'

export default function ExpiredStockPage({ context }) {
  const {
    onNavigate,
    data,
    warehouse,
    filtered,
    lookup,
    newAction,
    batchHeaders,
    batchRows,
    expiring,
    expired,
    pageHeader,
    searchBox,
    tableExport,
  } = context
  const page = 'Expired Stock'

  const rows =
    page === 'Near Expiry Stock' ? expiring : page === 'Expired Stock' ? expired : data.batches

  return (() => {
    const config = {
      title: page,
      subtitle:
        page === 'Near Expiry Stock'
          ? 'Unexpired pesticide batches with 90 days or less remaining; plan FEFO dispatch or supplier action.'
          : page === 'Expired Stock'
            ? 'Expired on-hand stock is blocked from issue and transfer until appropriately disposed of.'
            : 'Manufacturer lot register with QC hold/release, label dates, bin assignment, and batch identity.',
      icon: page === 'Expired Stock' ? ShieldAlert : FlaskConical,
      headers: batchHeaders,
      items: filtered(
        rows,
        (item) =>
          `${lookup(item.productId)} ${item.batchNo} ${warehouse(item.warehouseId)?.name} ${item.location} ${item.quality}`,
      ),
      rows: batchRows(
        filtered(
          rows,
          (item) =>
            `${lookup(item.productId)} ${item.batchNo} ${warehouse(item.warehouseId)?.name} ${item.location} ${item.quality}`,
        ),
      ),
      action:
        page === 'Batch Register' ? (
          newAction('Create Batch')
        ) : (
          <Button kind="secondary" onClick={() => onNavigate('Stock Out (Issue)')}>
            FEFO issue <ArrowRight size={14} />
          </Button>
        ),
      empty:
        page === 'Near Expiry Stock'
          ? 'No pesticide batches expire within 90 days.'
          : page === 'Expired Stock'
            ? 'No expired on-hand pesticide batches. Keep reviewing dates routinely.'
            : 'No batches are registered yet.',
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
