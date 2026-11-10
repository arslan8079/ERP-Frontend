import {
  BadgeCheck,
  Boxes,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  Package,
  PackagePlus,
} from 'lucide-react'
import { Card, Stat, Status, Table } from '../InventoryComponents'

export default function ProductDetailsPage({ context }) {
  const {
    data,
    selectedProductId,
    setSelectedProductId,
    product,
    totalFor,
    stockFor,
    newAction,
    batchHeaders,
    batchRows,
    pageHeader,
    money,
  } = context
  const page = 'Product Details'

  const selected = product(selectedProductId) || data.products[0]

  const lots = data.batches.filter((item) => item.productId === selected?.id)

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Label, regulatory registration, stock status, and batch-level controls.',
        FlaskConical,
        newAction('Stock In (GRN)', PackagePlus),
      )}
      <div className="inv-toolbar">
        <label className="inv-filter">
          <span>Product</span>
          <select
            value={selected?.id || ''}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            {data.products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.id}
              </option>
            ))}
          </select>
        </label>
      </div>
      {selected && (
        <>
          <div className="inv-detail-hero">
            <span className="inv-product-mark">
              <FlaskConical size={23} />
            </span>
            <div>
              <span className="inv-eyebrow">
                {selected.id} · {selected.category}
              </span>
              <h2>{selected.name}</h2>
              <p>
                {selected.active} · {selected.formulation} · {selected.hazard}
              </p>
            </div>
            <Status>{selected.status}</Status>
          </div>
          <div className="inv-stats compact">
            <Stat
              icon={Boxes}
              label="Available"
              value={`${stockFor(selected.id)} ${selected.unit}`}
              note="Released, unexpired batches"
            />
            <Stat
              icon={Package}
              label="On hand"
              value={`${totalFor(selected.id)} ${selected.unit}`}
              note="Includes held/expired stock"
              tone="blue"
            />
            <Stat
              icon={CalendarDays}
              label="Registered batches"
              value={lots.length}
              note="Full lot traceability"
              tone="amber"
            />
            <Stat
              icon={BadgeCheck}
              label="Registration"
              value={selected.registration}
              note={money(selected.cost) + ' standard unit cost'}
              tone="purple"
            />
          </div>
          <Card title={`Batch & expiry profile · ${lots.length}`} icon={ClipboardList}>
            <Table headers={batchHeaders}>{batchRows(lots)}</Table>
          </Card>
        </>
      )}
    </div>
  )
}
