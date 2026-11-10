import { Package, PackagePlus, ClipboardList } from 'lucide-react'
import { Card, Table } from '../InventoryComponents'

export default function ProductListPage({ context }) {
  const {
    data,
    totalFor,
    stockFor,
    filtered,
    newAction,
    productHeaders,
    productRows,
    pageHeader,
    searchBox,
    tableExport,
  } = context
  const page = 'Product List'

  const products = filtered(
    data.products,
    (item) =>
      `${item.name} ${item.id} ${item.active} ${item.formulation} ${item.category} ${item.registration}`,
  )

  return (() => {
    const config = {
      title: page,
      subtitle:
        'Registered pesticide catalogue with regulatory identifiers and current eligible stock.',
      icon: Package,
      headers: productHeaders,
      items: products,
      rows: productRows(products),
      action: newAction('Add Product', PackagePlus),
      exportRows: products.map((item) => [
        item.id,
        item.name,
        item.active,
        item.formulation,
        item.category,
        item.registration,
        stockFor(item.id),
        totalFor(item.id),
        item.unit,
        item.reorder,
        item.status,
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
