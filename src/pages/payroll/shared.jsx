import { Download, FileText, ListChecks, Search, ShieldCheck, Wallet } from 'lucide-react'

export const today = () => new Date().toISOString().slice(0, 10)

export const monthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

export const monthLabel = (key) => {
  const [year, month] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

export const money = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

export const idFor = (prefix) => `${prefix}-${Date.now()}-${String(++idSequence).padStart(3, '0')}`

export const activeEmployees = (employees) =>
  employees.filter((employee) => employee.status === 'Active')

let idSequence = 0

export function calculateSalary(employee, assignment, structures, loans = []) {
  const structure = structures.find((item) => item.id === assignment?.structureId) || structures[0]
  const monthlySalary = Number(assignment?.monthlySalary) || 0
  const basic = Math.round((monthlySalary * (Number(structure?.basicPercent) || 0)) / 100)
  const allowances = (structure?.allowances || []).map((item) => ({
    name: item.name,
    amount:
      item.type === 'Percentage'
        ? Math.round((basic * item.amount) / 100)
        : Number(item.amount) || 0,
  }))
  const deductions = (structure?.deductions || []).map((item) => ({
    name: item.name,
    amount:
      item.type === 'Percentage'
        ? Math.round((basic * item.amount) / 100)
        : Number(item.amount) || 0,
  }))
  const loanDeductions = loans
    .filter((loan) => loan.employeeId === employee.id && loan.status === 'Active')
    .map((loan) => ({
      loanId: loan.id,
      name: `Loan installment · ${loan.id}`,
      amount: Math.min(
        Number(loan.installment) || 0,
        Math.max(0, Number(loan.amount) - Number(loan.recovered)),
      ),
    }))
    .filter((item) => item.amount > 0)
  const gross = basic + allowances.reduce((sum, item) => sum + item.amount, 0)
  const totalDeductions =
    deductions.reduce((sum, item) => sum + item.amount, 0) +
    loanDeductions.reduce((sum, item) => sum + item.amount, 0)
  return {
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.departmentCode || '—',
    branch: employee.branchCode || '—',
    structureName: structure?.name || 'Unassigned',
    basic,
    allowances,
    deductions: [...deductions, ...loanDeductions],
    loanDeductions,
    gross,
    totalDeductions,
    net: Math.max(0, gross - totalDeductions),
    paymentStatus: 'Pending',
  }
}

export function PageHeader({ title, subtitle, icon: Icon = Wallet, action }) {
  return (
    <header className="pr-page-header">
      <div className="pr-page-title">
        <span className="pr-title-icon">
          <Icon size={22} />
        </span>
        <div>
          <span className="pr-eyebrow">GREENFIELD ERP / PAYROLL</span>
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
    <button type={type} className={`pr-button ${kind}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function Stat({ icon: Icon, label, value, tone = 'purple', hint }) {
  return (
    <article className={`pr-stat ${tone}`}>
      <span className="pr-stat-icon">
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
    <section className={`pr-card ${className}`}>
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

export function Table({ headers, children, className = '' }) {
  return (
    <div className="pr-table-wrap">
      <table className={`pr-table ${className}`}>
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

export function Status({ children }) {
  const style = String(children).toLowerCase().replaceAll(' ', '-')
  return <span className={`pr-status ${style}`}>{children}</span>
}

export function Empty({ children = 'No records are available yet.' }) {
  return (
    <div className="pr-empty">
      <FileText size={17} />
      {children}
    </div>
  )
}

export function SalarySlip({ slip, batch, periodName }) {
  return (
    <section className="pr-slip">
      <header>
        <div>
          <span className="pr-eyebrow">GREENFIELD AGROCHEMICALS</span>
          <h2>Salary Statement</h2>
          <p>
            {periodName(batch.periodId)} · {batch.id}
          </p>
        </div>
        <Status>{batch.status}</Status>
      </header>
      <div className="pr-slip-employee">
        <div>
          <small>EMPLOYEE</small>
          <b>{slip.employeeName}</b>
        </div>
        <div>
          <small>EMPLOYEE ID</small>
          <b>{slip.employeeId}</b>
        </div>
        <div>
          <small>DEPARTMENT / BRANCH</small>
          <b>
            {slip.department} / {slip.branch}
          </b>
        </div>
      </div>
      <div className="pr-slip-columns">
        <div>
          <h3>Earnings</h3>
          <p>
            <span>Basic salary</span>
            <b>{money(slip.basic)}</b>
          </p>
          {slip.allowances.map((item) => (
            <p key={item.name}>
              <span>{item.name}</span>
              <b>{money(item.amount)}</b>
            </p>
          ))}
          <p className="total">
            <span>Gross earnings</span>
            <b>{money(slip.gross)}</b>
          </p>
        </div>
        <div>
          <h3>Deductions</h3>
          {slip.deductions.map((item, index) => (
            <p key={`${item.name}-${index}`}>
              <span>{item.name}</span>
              <b>{money(item.amount)}</b>
            </p>
          ))}
          <p className="total">
            <span>Total deductions</span>
            <b>{money(slip.totalDeductions)}</b>
          </p>
          <p className="net">
            <span>Net salary</span>
            <b>{money(slip.net)}</b>
          </p>
        </div>
      </div>
    </section>
  )
}

export function AdvanceTable({ advances, employeeName, actions }) {
  return (
    <Table
      headers={[
        'Request',
        'Employee',
        'Amount',
        'Repayment plan',
        'Reason',
        'Requested',
        'Status',
        ...(actions ? ['Decision'] : []),
      ]}
    >
      {advances.map((item) => (
        <tr key={item.id}>
          <td>
            <b>{item.id}</b>
          </td>
          <td>{employeeName(item.employeeId)}</td>
          <td>{money(item.amount)}</td>
          <td>
            {item.months} months · {money(Math.ceil(item.amount / item.months))}/month
          </td>
          <td>{item.reason}</td>
          <td>{item.requestedAt}</td>
          <td>
            <Status>{item.status}</Status>
          </td>
          {actions && (
            <td>
              {item.status === 'Pending' ? (
                <div className="pr-row-actions">
                  <button
                    className="pr-inline-action approve"
                    onClick={() => actions(item.id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="pr-inline-action reject"
                    onClick={() => actions(item.id, 'Rejected')}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                '—'
              )}
            </td>
          )}
        </tr>
      ))}
    </Table>
  )
}

export function PayslipTable({ slips }) {
  return (
    <Table headers={['Employee', 'Department', 'Basic', 'Allowances', 'Deductions', 'Net pay']}>
      {slips.map((slip) => (
        <tr key={slip.employeeId}>
          <td>
            <b>{slip.employeeName}</b>
            <small className="pr-cell-sub">{slip.employeeId}</small>
          </td>
          <td>{slip.department}</td>
          <td>{money(slip.basic)}</td>
          <td>{money(slip.allowances.reduce((sum, item) => sum + item.amount, 0))}</td>
          <td>{money(slip.totalDeductions)}</td>
          <td>
            <b>{money(slip.net)}</b>
          </td>
        </tr>
      ))}
    </Table>
  )
}

export function Field({ label, children }) {
  return (
    <label className="pr-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Toolbar({ query, setQuery, placeholder }) {
  return (
    <label className="pr-search">
      <Search size={15} />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

export function Callout({ title, text, action }) {
  return (
    <aside className="pr-callout">
      <span>
        <ShieldCheck size={18} />
      </span>
      <div>
        <b>{title}</b>
        <p>{text}</p>
      </div>
      {action}
    </aside>
  )
}

export function ExportButton({ filename, rows, onNotify }) {
  return (
    <Button kind="secondary" onClick={() => downloadCsv(filename, rows, onNotify)}>
      <Download size={15} />
      Export
    </Button>
  )
}

export function downloadCsv(filename, rows, onNotify) {
  try {
    const csv = rows
      .map((row) =>
        (Array.isArray(row) ? row : [row])
          .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    onNotify('Payroll report downloaded')
  } catch (error) {
    console.error('Unable to export payroll report:', error)
    onNotify('Payroll report could not be exported. Please try again.')
  }
}
