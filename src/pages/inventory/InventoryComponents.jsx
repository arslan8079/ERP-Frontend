import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  Download,
  Package,
  Trash2,
} from 'lucide-react'

export function Button({ children, kind = '', onClick, type = 'button', disabled = false }) {
  return (
    <button className={`inv-button ${kind}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function PageHeader({ title, subtitle, icon: Icon = Boxes, action, onExport }) {
  return (
    <header className="inv-page-header">
      <div className="inv-page-title">
        <span className="inv-title-icon">
          <Icon size={22} />
        </span>
        <div>
          <span className="inv-eyebrow">GREENFIELD ERP · INVENTORY</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="inv-header-actions">
        {onExport && (
          <Button kind="secondary" onClick={onExport}>
            <Download size={15} />
            Export CSV
          </Button>
        )}
        {action}
      </div>
    </header>
  )
}

export function Stat({ label, value, note, icon: Icon, tone = '' }) {
  return (
    <article className={`inv-stat ${tone}`}>
      <span>
        <Icon size={19} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{note}</em>
      </div>
    </article>
  )
}

export function Card({ title, icon: Icon = ClipboardList, children, action }) {
  return (
    <section className="inv-card">
      <header>
        <span>
          <Icon size={17} />
          {title}
        </span>
        {action}
      </header>
      {children}
    </section>
  )
}

export function Table({ headers, children, empty = 'No records match this view.' }) {
  return (
    <div className="inv-table-wrap">
      <table className="inv-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children.length ? (
            children
          ) : (
            <tr>
              <td className="inv-empty-cell" colSpan={headers.length}>
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Field({ label, children, required = false }) {
  return (
    <label className="inv-field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      {children}
    </label>
  )
}

export function Status({ children }) {
  const status = String(children || 'Active')
  const tone = /expired|rejected|damaged|blocked/i.test(status)
    ? 'danger'
    : /near expiry|pending|quarantine|hold|draft|open/i.test(status)
      ? 'warning'
      : /released|approved|active|completed|available|reconciled/i.test(status)
        ? 'good'
        : 'neutral'
  return <span className={`inv-status ${tone}`}>{status}</span>
}

export function MovementType({ value }) {
  const type = value || 'Movement'
  const Icon =
    type === 'Issue'
      ? ArrowUpRight
      : type === 'Transfer'
        ? ArrowLeftRight
        : /Adjustment out/.test(type)
          ? Trash2
          : /GRN|Opening|Adjustment in/.test(type)
            ? ArrowDownLeft
            : Package
  return (
    <span
      className={`inv-movement ${type === 'Issue' || type === 'Adjustment out' ? 'out' : type === 'Transfer' ? 'transfer' : 'in'} `}
    >
      <Icon size={13} />
      {type}
    </span>
  )
}

export function productRows(items, { stockFor, totalFor, setSelectedProductId, onNavigate }) {
  return items.map((item) => (
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
      <td>{item.active}</td>
      <td>{item.formulation}</td>
      <td>{item.category}</td>
      <td>
        <b>
          {stockFor(item.id)} {item.unit}
        </b>
        <small className="inv-subtle">
          On hand {totalFor(item.id)} {item.unit}
        </small>
      </td>
      <td>
        {item.reorder} {item.unit}
      </td>
      <td>
        <Status>{item.status}</Status>
      </td>
      <td>
        <Button
          kind="small secondary"
          onClick={() => {
            setSelectedProductId(item.id)
            onNavigate('Product Details')
          }}
        >
          Details <ArrowRight size={13} />
        </Button>
      </td>
    </tr>
  ))
}

export function batchRows(
  items,
  { day, lookup, warehouse, product, setSearch, onNavigate, money },
) {
  return items.map((item) => {
    const remaining = Math.ceil(
      (new Date(`${item.expiry}T00:00:00`) - new Date(`${day()}T00:00:00`)) / 86400000,
    )
    return (
      <tr key={item.id}>
        <td>
          <button
            className="inv-table-link"
            onClick={() => {
              setSearch(item.batchNo)
              onNavigate('Batch Traceability')
            }}
          >
            {item.batchNo}
            <small>{lookup(item.productId)}</small>
          </button>
        </td>
        <td>
          {warehouse(item.warehouseId)?.name || '—'}
          <small className="inv-subtle">{item.location}</small>
        </td>
        <td>{item.manufactured}</td>
        <td>{item.expiry}</td>
        <td>
          <Status>
            {remaining < 0
              ? 'Expired'
              : remaining <= 30
                ? `${remaining} days · Near expiry`
                : `${remaining} days`}
          </Status>
        </td>
        <td>
          <b>
            {item.qty} {product(item.productId)?.unit}
          </b>
        </td>
        <td>{money(item.unitCost)}</td>
        <td>
          <Status>{item.quality}</Status>
        </td>
      </tr>
    )
  })
}

export function movementRows(items, { lookup, warehouse, product }) {
  return items.map((item) => (
    <tr key={item.id}>
      <td>{item.date}</td>
      <td>
        <b>{item.reference}</b>
      </td>
      <td>
        <MovementType value={item.type} />
      </td>
      <td>
        {lookup(item.productId)}
        <small className="inv-subtle">{item.batchNo}</small>
      </td>
      <td>
        {item.type === 'Transfer'
          ? `${warehouse(item.warehouseId)?.name || '—'} → ${warehouse(item.toWarehouseId)?.name || '—'}`
          : warehouse(item.warehouseId)?.name || '—'}
      </td>
      <td>
        <b>
          {item.qty} {product(item.productId)?.unit}
        </b>
      </td>
      <td>
        {item.note || '—'}
        <small className="inv-subtle">{item.actor}</small>
      </td>
    </tr>
  ))
}
