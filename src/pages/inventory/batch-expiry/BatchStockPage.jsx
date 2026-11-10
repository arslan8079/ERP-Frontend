import { PackagePlus, Warehouse, ClipboardList } from 'lucide-react'
import { Card, Table } from '../InventoryComponents'

export default function BatchStockPage({ context }) {
  const {
    data,
    warehouse,
    filtered,
    lookup,
    newAction,
    batchHeaders,
    batchRows,
    pageHeader,
    searchBox,
    tableExport,
  } = context
  const page = 'Batch Stock'

  const rows = filtered(
    data.batches,
    (item) =>
      `${lookup(item.productId)} ${item.batchNo} ${warehouse(item.warehouseId)?.name} ${item.location} ${item.quality}`,
  )

  return (() => {
    const config = {
      title: page,
      subtitle:
        'Batch, expiry and bin-aware on-hand inventory; expired and quarantined quantities cannot be issued.',
      icon: Warehouse,
      headers: batchHeaders,
      items: rows,
      rows: batchRows(rows),
      action: newAction('Stock In (GRN)', PackagePlus),
      exportRows: rows.map((item) => [
        item.batchNo,
        lookup(item.productId),
        warehouse(item.warehouseId)?.name,
        item.location,
        item.manufactured,
        item.expiry,
        item.qty,
        item.unitCost,
        item.quality,
      ]),
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
