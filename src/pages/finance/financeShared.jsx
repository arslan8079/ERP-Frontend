import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Download,
  FileClock,
  FileText,
  Landmark,
  ListChecks,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

const today = () => new Date().toISOString().slice(0, 10)
const monthKey = () => today().slice(0, 7)
let sequence = 0
const newId = (prefix) => `${prefix}-${Date.now()}-${String(++sequence).padStart(3, '0')}`
const money = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(
        new Date(`${value}T00:00:00`),
      )
    : '\u2014'
const monthLabel = (value) => {
  if (!value) return '\u2014'
  const [year, month] = value.slice(0, 7).split('-').map(Number)
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}
const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']
const typeGroups = {
  Asset: ['Current Assets', 'Fixed Assets'],
  Liability: ['Current Liabilities', 'Long-term Liabilities'],
  Equity: ['Equity'],
  Revenue: ['Operating Revenue', 'Other Income'],
  Expense: ['Operating Expense', 'Cost of Sales', 'Other Expense'],
}

function accountById(data, id) {
  return data.accounts.find((account) => account.id === id)
}

function postedLines(data, accountId) {
  return data.entries
    .filter((entry) => entry.status === 'Posted')
    .flatMap((entry) => entry.lines.map((line) => ({ ...line, entry })))
    .filter((line) => !accountId || line.accountId === accountId)
}

function accountNet(data, accountId, asOf = '9999-12-31') {
  const account = accountById(data, accountId)
  const net = postedLines(data, accountId)
    .filter((line) => line.entry.date <= asOf)
    .reduce((sum, line) => sum + Number(line.debit || 0) - Number(line.credit || 0), 0)
  return account?.type === 'Asset' || account?.type === 'Expense' ? net : -net
}

function periodLines(data, start, end) {
  return postedLines(data).filter((line) => line.entry.date >= start && line.entry.date <= end)
}

function agingDays(date) {
  return Math.max(
    0,
    Math.floor((new Date(`${today()}T00:00:00`) - new Date(`${date}T00:00:00`)) / 86400000),
  )
}

function agingBucket(days) {
  return days <= 30
    ? '0–30 days'
    : days <= 60
      ? '31–60 days'
      : days <= 90
        ? '61–90 days'
        : '90+ days'
}

function PageHeader({ title, subtitle, icon: Icon = Landmark, action }) {
  return (
    <header className="fa-page-header">
      <div className="fa-page-title">
        <span className="fa-title-icon">
          <Icon size={22} />
        </span>
        <div>
          <span className="fa-eyebrow">GREENFIELD ERP / FINANCE & ACCOUNTING</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      {action}
    </header>
  )
}

function Button({ children, onClick, kind = 'primary', type = 'button', disabled = false }) {
  return (
    <button className={`fa-button ${kind}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function Stat({ icon: Icon, label, value, tone = 'orange', hint }) {
  return (
    <article className={`fa-stat ${tone}`}>
      <span>
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

function Card({ title, icon: Icon = ListChecks, action, children, className = '' }) {
  return (
    <section className={`fa-card ${className}`}>
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

function Table({ headers, children }) {
  return (
    <div className="fa-table-wrap">
      <table className="fa-table">
        <thead>
          <tr>
            {headers.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function Status({ children }) {
  return (
    <span className={`fa-status ${String(children).toLowerCase().replaceAll(' ', '-')}`}>
      {children}
    </span>
  )
}

function Field({ label, children }) {
  return (
    <label className="fa-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function Empty({ children = 'No records available.' }) {
  return (
    <div className="fa-empty">
      <FileText size={17} />
      {children}
    </div>
  )
}

function Toolbar({ query, setQuery, placeholder = 'Search records...' }) {
  return (
    <label className="fa-search">
      <Search size={15} />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

function accountAmount(data, account) {
  return money(accountNet(data, account.id))
}

function accountName(data, id) {
  return accountById(data, id)?.name || 'Unknown account'
}

function openInvoices(data) {
  return data.invoices.filter((item) => item.total > item.allocated)
}

function openBills(data) {
  return data.bills.filter((item) => item.total > item.paid)
}

function sum(items, amount) {
  return items.reduce((total, item) => total + amount(item), 0)
}

function exportCsv(filename, rows, onNotify) {
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
    onNotify('Finance report downloaded')
  } catch (error) {
    console.error('Unable to export finance report:', error)
    onNotify('Finance report could not be exported. Please try again.')
  }
}

function ExportAction({ filename, rows, onNotify }) {
  return (
    <Button kind="secondary" onClick={() => exportCsv(filename, rows, onNotify)}>
      <Download size={15} />
      Export
    </Button>
  )
}

function AccountPicker({ data, value, onChange, types = accountTypes, label = 'Ledger account' }) {
  return (
    <Field label={label}>
      <select required value={value} onChange={onChange}>
        <option value="">Select account</option>
        {data.accounts
          .filter((item) => item.status === 'Active' && types.includes(item.type))
          .map((item) => (
            <option key={item.id} value={item.id}>
              {item.code} · {item.name}
            </option>
          ))}
      </select>
    </Field>
  )
}

export {
  today,
  monthKey,
  money,
  dateLabel,
  monthLabel,
  accountTypes,
  typeGroups,
  newId,
  accountById,
  postedLines,
  accountNet,
  periodLines,
  agingDays,
  agingBucket,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  Field,
  Empty,
  Toolbar,
  accountAmount,
  accountName,
  openInvoices,
  openBills,
  sum,
  exportCsv,
  ExportAction,
  AccountPicker,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Download,
  FileClock,
  FileText,
  Landmark,
  ListChecks,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
}
