import { ArrowRight, Warehouse, ClipboardList } from 'lucide-react'
import { Button, Status, Card, Table } from '../InventoryComponents'

export default function WarehouseListPage({ context }) {
  const { onNavigate, data, setSearch, filtered, newAction, pageHeader, searchBox, tableExport } =
    context
  const page = 'Warehouse List'

  return (() => {
    const config = {
      title: page,
      subtitle: 'Branch warehouses, responsible managers, and capacity utilization.',
      icon: Warehouse,
      action: newAction('Create Warehouse'),
      headers: [
        'Warehouse / branch',
        'Address',
        'Manager',
        'Capacity',
        'On-hand lines',
        'Status',
        '',
      ],
      items: filtered(
        data.warehouses,
        (item) => `${item.id} ${item.name} ${item.branch} ${item.manager}`,
      ),
      rows: filtered(
        data.warehouses,
        (item) => `${item.id} ${item.name} ${item.branch} ${item.manager}`,
      ).map((item) => {
        const lots = data.batches.filter((batch) => batch.warehouseId === item.id)
        const occupied = lots.reduce((sum, batch) => sum + Number(batch.qty), 0)
        return (
          <tr key={item.id}>
            <td>
              <b>{item.name}</b>
              <small className="inv-subtle">
                {item.id} · {item.branch}
              </small>
            </td>
            <td>{item.address}</td>
            <td>{item.manager}</td>
            <td>
              <b>{occupied}</b> / {item.capacity}
              <div className="inv-progress">
                <i style={{ width: `${Math.min(100, (occupied / item.capacity) * 100)}%` }} />
              </div>
            </td>
            <td>{lots.length}</td>
            <td>
              <Status>{item.status}</Status>
            </td>
            <td>
              <Button
                kind="small secondary"
                onClick={() => {
                  setSearch(item.name)
                  onNavigate('Warehouse Stock')
                }}
              >
                Stock <ArrowRight size={13} />
              </Button>
            </td>
          </tr>
        )
      }),
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
