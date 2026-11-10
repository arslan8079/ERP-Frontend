import { BarChart3, Boxes, Package, PackagePlus, ShieldAlert, TrendingDown } from 'lucide-react'
import { Card, Stat, Status, Table } from '../InventoryComponents'

export default function StockSummaryPage({ context }) {
  const {
    onNavigate,
    data,
    setSelectedProductId,
    usable,
    stockFor,
    filtered,
    searchBox,
    tableExport,
    newAction,
    pageHeader,
    expired,
    lowProducts,
    money,
  } = context
  const page = 'Stock Summary'

  let products = data.products

  if (page === 'Low Stock Report')
    products = products.filter((item) => stockFor(item.id) <= Number(item.reorder))

  const headers =
    page === 'Stock Valuation'
      ? [
          'Product',
          'Category',
          'Available quantity',
          'On-hand quantity',
          'Weighted value',
          'Average cost',
        ]
      : [
          'Pesticide product / registration',
          'Active ingredient',
          'Category',
          'Available stock',
          'On-hand',
          'Reorder level',
          'Stock status',
        ]

  const exportProducts = filtered(
    products,
    (item) => `${item.name} ${item.id} ${item.active} ${item.category} ${item.registration}`,
  )

  const exportRows = exportProducts.map((item) => {
    const lots = data.batches.filter((batch) => batch.productId === item.id)
    const quantity = lots.reduce((sum, batch) => sum + Number(batch.qty), 0)
    const value = lots.reduce((sum, batch) => sum + Number(batch.qty) * Number(batch.unitCost), 0)
    return page === 'Stock Valuation'
      ? [
          item.name,
          item.category,
          stockFor(item.id),
          quantity,
          money(value),
          money(quantity ? value / quantity : 0),
        ]
      : [
          `${item.name} (${item.id} · ${item.registration})`,
          `${item.active} · ${item.formulation}`,
          item.category,
          `${stockFor(item.id)} ${item.unit}`,
          `${quantity} ${item.unit}`,
          `${item.reorder} ${item.unit}`,
          stockFor(item.id) <= item.reorder ? 'Low stock' : 'In range',
        ]
  })

  const rows = filtered(
    products,
    (item) => `${item.name} ${item.id} ${item.active} ${item.category} ${item.registration}`,
  ).map((item) => {
    const lots = data.batches.filter((batch) => batch.productId === item.id)
    const itemValue = lots.reduce(
      (sum, batch) => sum + Number(batch.qty) * Number(batch.unitCost),
      0,
    )
    const qty = lots.reduce((sum, batch) => sum + Number(batch.qty), 0)
    return page === 'Stock Valuation' ? (
      <tr key={item.id}>
        <td>
          {item.name}
          <small className="inv-subtle">{item.id}</small>
        </td>
        <td>{item.category}</td>
        <td>
          {stockFor(item.id)} {item.unit}
        </td>
        <td>
          {qty} {item.unit}
        </td>
        <td>
          <b>{money(itemValue)}</b>
        </td>
        <td>{money(qty ? itemValue / qty : 0)}</td>
      </tr>
    ) : (
      <tr key={item.id}>
        <td>
          <button
            className="inv-table-link"
            onClick={() => {
              setSelectedProductId(item.id)
              onNavigate('Product Details')
            }}
          >
            {item.name}
            <small>
              {item.id} · Reg. {item.registration}
            </small>
          </button>
        </td>
        <td>
          {item.active} · {item.formulation}
        </td>
        <td>{item.category}</td>
        <td>
          <b>
            {stockFor(item.id)} {item.unit}
          </b>
        </td>
        <td>
          {qty} {item.unit}
        </td>
        <td>
          {item.reorder} {item.unit}
        </td>
        <td>
          <Status>{stockFor(item.id) <= item.reorder ? 'Low stock' : 'In range'}</Status>
        </td>
      </tr>
    )
  })

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        page === 'Low Stock Report'
          ? 'Released and unexpired stock at or below its configured reorder point.'
          : page === 'Stock Valuation'
            ? 'On-hand inventory valued at batch-specific weighted acquisition cost in PKR.'
            : 'Pesticide catalogue and available-stock performance with batch-aware balances.',
        page === 'Low Stock Report' ? TrendingDown : BarChart3,
        newAction('Stock In (GRN)', PackagePlus),
        tableExport(page, headers, exportRows),
      )}
      <div className="inv-toolbar">
        {searchBox}
        <span>
          {
            filtered(products, (item) => `${item.name} ${item.id} ${item.active} ${item.category}`)
              .length
          }{' '}
          products
        </span>
      </div>
      <div className="inv-stats compact">
        <Stat
          icon={Package}
          label="Active products"
          value={data.products.filter((item) => item.status === 'Active').length}
          note="Pesticide catalogue"
        />
        <Stat
          icon={Boxes}
          label="Available stock"
          value={data.batches.filter(usable).reduce((sum, item) => sum + Number(item.qty), 0)}
          note="QC-released · not expired"
          tone="blue"
        />
        <Stat
          icon={TrendingDown}
          label="Below reorder"
          value={lowProducts.length}
          note="Procurement attention"
          tone="amber"
        />
        <Stat
          icon={ShieldAlert}
          label="Quarantine / expired"
          value={data.batches.filter((item) => item.qty > 0 && !usable(item)).length}
          note={`${expired.length} expired · ${data.batches.filter((item) => item.quality === 'Quarantine' && item.qty > 0).length} held`}
          tone="red"
        />
      </div>
      <Card
        title={`${page} · ${filtered(products, (item) => `${item.name} ${item.id} ${item.active} ${item.category}`).length}`}
        icon={BarChart3}
      >
        <Table headers={headers}>{rows}</Table>
      </Card>
    </div>
  )
}
