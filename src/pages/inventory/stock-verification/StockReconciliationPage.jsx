import { ClipboardCheck, Plus, ClipboardList } from 'lucide-react'
import { Button, Status, Card, Table } from '../InventoryComponents'

export default function StockReconciliationPage({ context }) {
  const { onNavigate, data, warehouse, filtered, pageHeader, searchBox, tableExport } = context
  const page = 'Stock Reconciliation'

  return (() => {
    const config = {
      title: page,
      subtitle: 'Physical count status and book-to-count variance approvals.',
      icon: ClipboardCheck,
      headers: [
        'Count reference',
        'Date',
        'Warehouse',
        'Lines counted',
        'Variance requests',
        'Status',
      ],
      items: filtered(
        data.counts,
        (item) => `${item.id} ${warehouse(item.warehouseId)?.name} ${item.status}`,
      ),
      rows: filtered(
        data.counts,
        (item) => `${item.id} ${warehouse(item.warehouseId)?.name} ${item.status}`,
      ).map((item) => (
        <tr key={item.id}>
          <td>
            <b>{item.id}</b>
          </td>
          <td>{item.date}</td>
          <td>{warehouse(item.warehouseId)?.name}</td>
          <td>{item.lines.length}</td>
          <td>{data.approvals.filter((approval) => approval.countId === item.id).length}</td>
          <td>
            <Status>{item.status}</Status>
          </td>
        </tr>
      )),
      action: (
        <Button onClick={() => onNavigate('Physical Stock Count')}>
          <Plus size={15} />
          Start count
        </Button>
      ),
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
