import { ArrowRight, BarChart3, FileClock, PieChart } from 'lucide-react'

export function Status({ children }) {
  const value = String(children || 'Recorded')
  const tone = /approved|verified|active|delivered|posted|paid/i.test(value)
    ? 'good'
    : /pending|review|transit/i.test(value)
      ? 'pending'
      : /rejected|inactive|expired/i.test(value)
        ? 'bad'
        : 'neutral'
  return (
    <span className={`reports-status ${tone}`}>
      <i />
      {value}
    </span>
  )
}

export function EmptyState({ title, detail, action, actionLabel }) {
  return (
    <div className="reports-empty-state">
      <span>
        <FileClock size={21} />
      </span>
      <b>{title}</b>
      <p>{detail}</p>
      {action && (
        <button className="reports-button secondary" onClick={action}>
          {actionLabel}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}

export function MonthlyValueChart({
  totals,
  maxAmount,
  monthLabel,
  title = 'Monthly value',
  detail = 'PKR',
  emptyMessage = 'Module records will display here.',
}) {
  return (
    <section className="reports-card reports-chart-card">
      <header>
        <span>
          <BarChart3 size={16} />
          {title}
        </span>
        <small>{detail}</small>
      </header>
      <div className="reports-bar-chart">
        {totals.length ? (
          totals.map((item) => (
            <div className="reports-bar-column" key={item.month}>
              <strong>
                {item.amount
                  ? new Intl.NumberFormat('en-PK', {
                      style: 'currency',
                      currency: 'PKR',
                      maximumFractionDigits: 0,
                    }).format(item.amount)
                  : '—'}
              </strong>
              <div>
                <i style={{ height: `${Math.max(4, (item.amount / maxAmount) * 100)}%` }} />
              </div>
              <small>{monthLabel(item.month)}</small>
            </div>
          ))
        ) : (
          <div className="reports-empty-chart">{emptyMessage}</div>
        )}
      </div>
    </section>
  )
}

export function CategoryActivityChart({ categories, maxCount, title, detail }) {
  return (
    <section className="reports-card reports-module-card">
      <header>
        <span>
          <PieChart size={16} />
          {title}
        </span>
        <small>{detail}</small>
      </header>
      <div className="reports-module-bars">
        {categories.map(([name, count]) => (
          <div key={name}>
            <span>{name}</span>
            <div>
              <i style={{ width: `${(count / maxCount) * 100}%` }} />
            </div>
            <b>{count}</b>
          </div>
        ))}
      </div>
    </section>
  )
}
