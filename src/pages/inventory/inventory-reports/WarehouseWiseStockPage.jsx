import { Warehouse, ClipboardList } from 'lucide-react'
import { Status, Card, Table } from '../InventoryComponents'

export default function WarehouseWiseStockPage({ context }) {
  const { data, usable, filtered, money, pageHeader, searchBox, tableExport } = context
  const page = 'Warehouse-wise Stock'

  const warehouseRows = filtered(
    data.warehouses,
    (item) => `${item.name} ${item.branch} ${item.id}`,
  )

  return (() => {
    const config = {
      title: page,
      subtitle:
        'Stock and value by branch warehouse, with expired and quarantined lots separately identified.',
      icon: Warehouse,
      headers: [
        'Warehouse / branch',
        'Distinct products',
        'Batch lines',
        'Available quantity',
        'Held / expired',
        'Inventory value',
      ],
      items: warehouseRows,
      rows: warehouseRows.map((item) => {
        const lots = data.batches.filter((batch) => batch.warehouseId === item.id)
        const good = lots.filter(usable)
        const held = lots.filter((batch) => batch.qty > 0 && !usable(batch))
        return (
          <tr key={item.id}>
            <td>
              <b>{item.name}</b>
              <small className="inv-subtle">
                {item.id} · {item.branch}
              </small>
            </td>
            <td>{new Set(lots.map((batch) => batch.productId)).size}</td>
            <td>{lots.length}</td>
            <td>
              <b>{good.reduce((sum, batch) => sum + Number(batch.qty), 0)}</b>
            </td>
            <td>
              <Status>{held.reduce((sum, batch) => sum + Number(batch.qty), 0)} units held</Status>
            </td>
            <td>
              {money(
                lots.reduce((sum, batch) => sum + Number(batch.qty) * Number(batch.unitCost), 0),
              )}
            </td>
          </tr>
        )
      }),
      exportRows: warehouseRows.map((item) => [
        item.name,
        item.branch,
        data.batches.filter((batch) => batch.warehouseId === item.id).length,
        data.batches
          .filter((batch) => batch.warehouseId === item.id && usable(batch))
          .reduce((sum, batch) => sum + batch.qty, 0),
        money(
          data.batches
            .filter((batch) => batch.warehouseId === item.id)
            .reduce((sum, batch) => sum + batch.qty * batch.unitCost, 0),
        ),
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
