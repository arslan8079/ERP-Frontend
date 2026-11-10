import { CalendarDays, ClipboardList } from 'lucide-react'
import { Card, Table } from '../InventoryComponents'

export default function ExpiryReportPage({ context }) {
  const {
    data,
    warehouse,
    filtered,
    lookup,
    batchHeaders,
    batchRows,
    pageHeader,
    searchBox,
    tableExport,
  } = context
  const page = 'Expiry Report'

  const rows = filtered(
    data.batches.filter((batch) => batch.qty > 0).sort((a, b) => a.expiry.localeCompare(b.expiry)),
    (item) =>
      `${lookup(item.productId)} ${item.batchNo} ${warehouse(item.warehouseId)?.name} ${item.quality}`,
  )

  return (() => {
    const config = {
      title: page,
      subtitle:
        'Expiry horizon for on-hand pesticide products; expired batches are blocked from transactions.',
      icon: CalendarDays,
      headers: batchHeaders,
      items: rows,
      rows: batchRows(rows),
      exportRows: rows.map((item) => [
        item.batchNo,
        lookup(item.productId),
        warehouse(item.warehouseId)?.name,
        item.expiry,
        item.qty,
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
