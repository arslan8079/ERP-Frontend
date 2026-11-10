import { ArrowLeftRight, ClipboardList } from 'lucide-react'
import { Card, Table } from '../InventoryComponents'

export default function ProductMovementPage({ context }) {
  const {
    data,
    warehouse,
    filtered,
    lookup,
    movementHeaders,
    movementRows,
    pageHeader,
    searchBox,
    tableExport,
  } = context
  const page = 'Product Movement'

  const movements = filtered(
    data.movements,
    (item) =>
      `${lookup(item.productId)} ${item.batchNo} ${item.reference} ${item.type} ${warehouse(item.warehouseId)?.name} ${item.note}`,
  ).sort((a, b) => b.date.localeCompare(a.date))

  return (() => {
    const config = {
      title: page,
      subtitle:
        'Immutable stock ledger: each receipt, FEFO issue, transfer, opening balance, and approved correction.',
      icon: ArrowLeftRight,
      headers: movementHeaders,
      items: movements,
      rows: movementRows(movements),
      exportRows: movements.map((item) => [
        item.date,
        item.reference,
        item.type,
        lookup(item.productId),
        item.batchNo,
        warehouse(item.warehouseId)?.name,
        item.qty,
        item.unitCost,
        item.note,
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
