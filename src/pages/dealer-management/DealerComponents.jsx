import { Download } from 'lucide-react'

export function PageHeader({ page, subtitle, icon: Icon, action, onExport }) {
  return (
    <header className="dealer-page-header">
      <div className="dealer-page-title">
        <span className="dealer-title-icon">
          <Icon size={21} />
        </span>
        <div>
          <span className="dealer-eyebrow">GREENFIELD ERP · DEALER MANAGEMENT</span>
          <h1>{page}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="dealer-header-actions">
        {onExport && (
          <button className="dealer-button secondary" onClick={onExport}>
            <Download size={15} />
            Export CSV
          </button>
        )}
        {action}
      </div>
    </header>
  )
}

export function Stat({ label, value, note, icon: Icon, tone = '' }) {
  return (
    <article className={`dealer-stat ${tone}`}>
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

export function Status({ children }) {
  const value = String(children || 'Active')
  const tone = /approved|verified|active|delivered|posted|paid/i.test(value)
    ? 'good'
    : /pending|transit|review/i.test(value)
      ? 'pending'
      : /rejected|inactive/i.test(value)
        ? 'bad'
        : 'neutral'
  return (
    <span className={`dealer-status ${tone}`}>
      <i />
      {value}
    </span>
  )
}
