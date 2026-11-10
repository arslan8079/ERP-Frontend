import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Package,
  PackagePlus,
  ShieldAlert,
  TrendingDown,
  Warehouse,
} from 'lucide-react'
import { Button, Card, MovementType, Stat, Status, Table } from '../InventoryComponents'

export default function InventoryDashboardPage({ context }) {
  const {
    data,
    day,
    expired,
    expiring,
    lowProducts,
    lookup,
    movementHeaders,
    newAction,
    onNavigate,
    pageHeader,
    pending,
    product,
    stockFor,
    tableExport,
    usable,
    warehouse,
  } = context

  return (
    <div className="inv-page">
      {pageHeader(
        'Inventory Dashboard',
        'Batch-aware stock overview across branches, pesticide families, and expiry controls.',
        Boxes,
        newAction('Stock In (GRN)', PackagePlus),
        tableExport(
          'Inventory dashboard',
          movementHeaders,
          data.movements.map((item) => [
            item.date,
            item.reference,
            item.type,
            lookup(item.productId),
            item.batchNo,
            warehouse(item.warehouseId)?.name,
            item.qty,
            item.note,
          ]),
        ),
      )}
      <div className="inv-stats">
        <Stat
          icon={Package}
          label="Pesticide products"
          value={data.products.length}
          note="Registered catalogue"
        />
        <Stat
          icon={Boxes}
          label="Available quantity"
          value={data.batches.filter(usable).reduce((sum, batch) => sum + Number(batch.qty), 0)}
          note="Released · unexpired batches"
          tone="blue"
        />
        <Stat
          icon={CalendarDays}
          label="Expiring in 90 days"
          value={expiring.length}
          note={`${expiring.reduce((sum, batch) => sum + Number(batch.qty), 0)} units need FEFO attention`}
          tone="amber"
        />
        <Stat
          icon={ShieldAlert}
          label="Expired on hand"
          value={expired.length}
          note={`${expired.reduce((sum, batch) => sum + Number(batch.qty), 0)} units blocked from issue`}
          tone="red"
        />
        <Stat
          icon={TrendingDown}
          label="Low stock products"
          value={lowProducts.length}
          note="At or below reorder point"
          tone="purple"
        />
        <Stat
          icon={ClipboardCheck}
          label="Pending approvals"
          value={pending.length}
          note="Stock remains unchanged until decision"
          tone="amber"
        />
      </div>
      <div className="inv-dashboard-grid">
        <Card
          title="Expiry & quality attention"
          icon={AlertTriangle}
          action={
            <Button kind="link" onClick={() => onNavigate('Near Expiry Stock')}>
              Review batches <ArrowRight size={13} />
            </Button>
          }
        >
          <div className="inv-alert-list">
            {[
              ...expired.map((item) => ({
                ...item,
                alert: 'Expired stock · block from issue',
                tone: 'danger',
              })),
              ...expiring.map((item) => ({
                ...item,
                alert: `Expires ${item.expiry} · ${Math.ceil((new Date(`${item.expiry}T00:00:00`) - new Date(`${day()}T00:00:00`)) / 86400000)} days`,
                tone: 'warning',
              })),
              ...data.batches
                .filter((item) => item.quality === 'Quarantine' && item.qty > 0)
                .map((item) => ({
                  ...item,
                  alert: 'Quality hold · do not issue',
                  tone: 'warning',
                })),
            ]
              .slice(0, 6)
              .map((item) => (
                <div className="inv-alert-row" key={`${item.id}-${item.alert}`}>
                  <span className={`inv-alert-icon ${item.tone}`}>
                    <AlertTriangle size={15} />
                  </span>
                  <div>
                    <b>
                      {item.batchNo} · {lookup(item.productId)}
                    </b>
                    <small>
                      {item.alert} · {warehouse(item.warehouseId)?.name}
                    </small>
                  </div>
                  <Status>{item.quality}</Status>
                </div>
              ))}
          </div>
          {!expired.length &&
            !expiring.length &&
            !data.batches.some((item) => item.quality === 'Quarantine' && item.qty > 0) && (
              <p className="inv-empty">No expiry or QC alerts right now.</p>
            )}
        </Card>
        <Card title="Stock by pesticide category" icon={BarChart3}>
          <div className="inv-category-list">
            {data.categories.map((category) => {
              const items = data.products.filter((item) => item.category === category)
              const quantity = items.reduce((sum, item) => sum + stockFor(item.id), 0)
              const maximum = Math.max(
                1,
                ...data.categories.map((name) =>
                  data.products
                    .filter((item) => item.category === name)
                    .reduce((sum, productItem) => sum + stockFor(productItem.id), 0),
                ),
              )
              return (
                <div className="inv-category-row" key={category}>
                  <span>{category}</span>
                  <div>
                    <i style={{ width: `${(quantity / maximum) * 100}%` }} />
                  </div>
                  <b>{quantity}</b>
                </div>
              )
            })}
          </div>
        </Card>
        <Card
          title="Recent stock ledger"
          icon={Clock3}
          action={
            <Button kind="link" onClick={() => onNavigate('Stock Movement History')}>
              Full history <ArrowRight size={13} />
            </Button>
          }
        >
          <Table
            headers={['Date / reference', 'Movement', 'Product / batch', 'Warehouse', 'Quantity']}
          >
            {data.movements.slice(0, 5).map((item) => (
              <tr key={item.id}>
                <td>
                  {item.date}
                  <small className="inv-subtle">{item.reference}</small>
                </td>
                <td>
                  <MovementType value={item.type} />
                </td>
                <td>
                  {lookup(item.productId)}
                  <small className="inv-subtle">{item.batchNo}</small>
                </td>
                <td>{warehouse(item.warehouseId)?.name}</td>
                <td>
                  <b>
                    {item.qty > 0 ? '+' : ''}
                    {item.qty} {product(item.productId)?.unit}
                  </b>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title="Warehouse capacity" icon={Warehouse}>
          <div className="inv-capacity-list">
            {data.warehouses.map((item) => {
              const occupied = data.batches
                .filter((batch) => batch.warehouseId === item.id)
                .reduce((sum, batch) => sum + Number(batch.qty), 0)
              return (
                <div key={item.id}>
                  <span>
                    {item.name}
                    <small>
                      {item.branch} · {occupied} / {item.capacity}
                    </small>
                  </span>
                  <i>
                    <b style={{ width: `${Math.min(100, (occupied / item.capacity) * 100)}%` }} />
                  </i>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
      <div className="inv-quick-links">
        {[
          ['Stock In (GRN)', PackagePlus],
          ['Stock Out (Issue)', ArrowUpRight],
          ['Stock Transfer', ArrowLeftRight],
          ['Physical Stock Count', ClipboardList],
          ['Low Stock Report', TrendingDown],
          ['Adjustment Approvals', ClipboardCheck],
        ].map(([label, Icon]) => (
          <button key={label} onClick={() => onNavigate(label)}>
            <Icon size={18} />
            {label}
            <ArrowRight size={14} />
          </button>
        ))}
      </div>
    </div>
  )
}
