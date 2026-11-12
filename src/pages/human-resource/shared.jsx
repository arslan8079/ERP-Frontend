import { Info, ListChecks, Users } from 'lucide-react'

export const today = () => new Date().toISOString().slice(0, 10)

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(
        new Date(`${value}T00:00:00`),
      )
    : '—'

export const daysBetween = (start, end) =>
  Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000) + 1

let idSequence = 0
export const idFor = (prefix) => `${prefix}-${Date.now()}-${String(++idSequence).padStart(3, '0')}`

export const leaveBalance = (
  data,
  employeeId,
  typeId,
  asOfDate = today(),
  excludedRequestId = '',
) => {
  const type = data.leaveTypes.find((item) => item.id === typeId)
  if (!type) return 0
  const adjustments = (data.leaveBalanceTransactions || [])
    .filter(
      (item) => item.employeeId === employeeId && item.typeId === typeId && item.date <= asOfDate,
    )
    .reduce((sum, item) => sum + Number(item.days || 0), 0)
  const used = data.leaveRequests
    .filter(
      (item) =>
        item.employeeId === employeeId &&
        item.typeId === typeId &&
        item.status === 'Approved' &&
        item.requestType !== 'Withdrawal' &&
        item.id !== excludedRequestId,
    )
    .reduce((sum, item) => sum + Number(item.days || 0), 0)
  return type.days + adjustments - used
}

export function PageHeader({ title, subtitle, icon: Icon = Users, action }) {
  return (
    <header className="hr-page-header">
      <div className="hr-page-title">
        <span className="hr-title-icon">
          <Icon size={22} />
        </span>
        <div>
          <span className="hr-eyebrow">GREENFIELD ERP / HUMAN RESOURCE</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      {action}
    </header>
  )
}

export function Button({ children, onClick, kind = 'primary', type = 'button', disabled = false }) {
  return (
    <button type={type} className={`hr-button ${kind}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function Stat({ icon: Icon, label, value, tone = 'green', hint }) {
  return (
    <article className={`hr-stat ${tone}`}>
      <span className="hr-stat-icon">
        <Icon size={19} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {hint && <em>{hint}</em>}
      </div>
    </article>
  )
}

export function Card({ title, icon: Icon = ListChecks, action, children, className = '' }) {
  return (
    <section className={`hr-card ${className}`}>
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

export function EmptyState({ text }) {
  return (
    <div className="hr-empty">
      <Info size={17} />
      {text}
    </div>
  )
}

export function Table({ headers, children, className = '' }) {
  return (
    <div className="hr-table-wrap">
      <table className={`hr-table ${className}`}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function MetricBar({ label, value, max }) {
  return (
    <div className="hr-metric-bar">
      <span>{label}</span>
      <div>
        <i style={{ width: `${max ? Math.max(4, (value / max) * 100) : 0}%` }} />
      </div>
      <b>{value}</b>
    </div>
  )
}

export function LeaveRequestTable({ data, employeeName, onApprove }) {
  return (
    <Card title={`Leave register · ${data.leaveRequests.length} requests`} icon={ListChecks}>
      <Table
        headers={[
          'Request',
          'Employee',
          'Leave type',
          'Dates',
          'Days',
          'Reason',
          'Status',
          ...(onApprove ? ['Decision'] : []),
        ]}
      >
        {data.leaveRequests.map((item) => (
          <tr key={item.id}>
            <td>
              <b>{item.id}</b>
              {item.requestType && item.requestType !== 'Leave' && (
                <small className="hr-cell-sub">
                  {item.requestType}
                  {item.originalRequestId ? ` · ${item.originalRequestId}` : ''}
                </small>
              )}
            </td>
            <td>{employeeName(item.employeeId)}</td>
            <td>{data.leaveTypes.find((type) => type.id === item.typeId)?.name || 'Leave'}</td>
            <td>
              {formatDate(item.startDate)} – {formatDate(item.endDate)}
            </td>
            <td>{item.days}</td>
            <td>{item.reason}</td>
            <td>
              <span className={`hr-status ${item.status.toLowerCase()}`}>{item.status}</span>
            </td>
            {onApprove && (
              <td>
                {item.status === 'Pending' && (
                  <>
                    <button
                      className="hr-inline-action approve"
                      onClick={() => onApprove(item.id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="hr-inline-action reject"
                      onClick={() => onApprove(item.id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </Table>
      {!data.leaveRequests.length && (
        <EmptyState text="No leave applications have been submitted." />
      )}
    </Card>
  )
}

export function downloadCsv(filename, rows, onNotify) {
  try {
    const csv = rows
      .map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    onNotify('Report downloaded')
  } catch (error) {
    console.error('Unable to export Human Resource report:', error)
    onNotify('Report could not be exported. Please try again.')
  }
}
