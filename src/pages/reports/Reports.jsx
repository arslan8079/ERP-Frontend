import { useMemo, useState } from 'react'
import { Check, Download, FileBarChart, FileText } from 'lucide-react'
import { Status } from './ReportsComponents'
import ExecutiveOverviewPage from './dashboard/ExecutiveOverviewPage'
import ReportsAnalyticsPage from './dashboard/ReportsAnalyticsPage'
import SalesOverviewPage from './dashboard/SalesOverviewPage'
import FinanceOverviewPage from './dashboard/FinanceOverviewPage'
import InventoryOverviewPage from './dashboard/InventoryOverviewPage'
import HROverviewPage from './dashboard/HROverviewPage'
import AdministrationReportsPage from './operational-reports/AdministrationReportsPage'
import HRMReportsPage from './operational-reports/HRMReportsPage'
import PayrollReportsPage from './operational-reports/PayrollReportsPage'
import FinanceReportsPage from './operational-reports/FinanceReportsPage'
import InventoryReportsPage from './operational-reports/InventoryReportsPage'
import DealerReportsPage from './operational-reports/DealerReportsPage'
import SavedReportsPage from './report-management/SavedReportsPage'
import ReportFiltersPage from './report-management/ReportFiltersPage'
import ScheduledReportsPage from './report-management/ScheduledReportsPage'
import ExportHistoryPage from './report-management/ExportHistoryPage'
import ActivityReportsPage from './audit-analysis/ActivityReportsPage'
import ApprovalReportsPage from './audit-analysis/ApprovalReportsPage'
import TransactionAnalysisPage from './audit-analysis/TransactionAnalysisPage'
import ComparativeReportsPage from './audit-analysis/ComparativeReportsPage'
import DataAuditLogsPage from './audit-analysis/DataAuditLogsPage'
import './Reports.css'

const storageKey = 'greenfield-reports-analytics-v1'
const sources = {
  dealer: 'greenfield-dealer-management-v1',
  inventory: 'greenfield-inventory-warehouse-v1',
  finance: 'greenfield-finance-accounting-v1',
  hr: 'greenfield-human-resource-v1',
  payroll: 'greenfield-payroll-v1',
  approval: 'greenfield-approval-management-v1',
  access: 'greenfield-users-roles-v1',
  system: 'greenfield-system-settings-v1',
}
const money = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
const today = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}
const emptyRecords = () => []

function readStorage(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.error(`Unable to read reporting source ${key}:`, error)
    return fallback
  }
}

function readReportSettings() {
  const data = readStorage(storageKey, {})
  return {
    savedReports: Array.isArray(data.savedReports) ? data.savedReports : [],
    schedules: Array.isArray(data.schedules) ? data.schedules : [],
    exports: Array.isArray(data.exports) ? data.exports : [],
  }
}

function sourceRows() {
  const dealer = readStorage(sources.dealer, {})
  const inventory = readStorage(sources.inventory, {})
  const finance = readStorage(sources.finance, {})
  const hr = readStorage(sources.hr, {})
  const payroll = readStorage(sources.payroll, {})
  const approvals = readStorage(sources.approval, {})
  const access = readStorage(sources.access, {})
  const system = readStorage(sources.system, {})
  const records = []
  const push = (record) =>
    records.push({
      date: record.date || '',
      module: record.module || 'Administration',
      category: record.category || 'Activity',
      reference: record.reference || '—',
      subject: record.subject || '—',
      status: record.status || 'Recorded',
      amount: Number(record.amount) || 0,
      details: record.details || '',
    })

  ;(dealer.orders || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Dealer Management',
      category: 'Sales order',
      reference: item.id,
      subject: dealer.dealers?.find((row) => row.id === item.dealerId)?.name || item.dealerId,
      status: item.status,
      amount: item.total,
      details: (item.items || []).map((line) => `${line.productCode} × ${line.qty}`).join(', '),
    }),
  )
  ;(dealer.dispatches || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Dealer Management',
      category: 'Dispatch',
      reference: item.reference || item.id,
      subject: item.orderId,
      status: item.status,
      details: `${item.carrier || ''} ${item.vehicle || ''}`.trim(),
    }),
  )
  ;(dealer.returns || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Dealer Management',
      category: 'Sales return',
      reference: item.id,
      subject: item.dealerId,
      status: item.status,
      amount: item.amount,
      details: item.reason,
    }),
  )
  ;(dealer.payments || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Dealer Management',
      category: 'Dealer payment',
      reference: item.id,
      subject: item.dealerId,
      status: item.status,
      amount: item.amount,
      details: `${item.method || ''} ${item.reference || ''}`.trim(),
    }),
  )
  ;(inventory.movements || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Inventory & Warehouse',
      category: item.type || 'Stock movement',
      reference: item.reference || item.id,
      subject: item.productId,
      status: 'Recorded',
      amount: Number(item.qty) * Number(item.unitCost || 0),
      details: `${item.batchNo || ''} · ${item.qty || 0} units · ${item.note || ''}`,
    }),
  )
  ;(inventory.batches || []).forEach((item) =>
    push({
      date: item.manufactured,
      module: 'Inventory & Warehouse',
      category: 'Pesticide batch',
      reference: item.batchNo || item.id,
      subject: item.productId,
      status: item.quality || 'Registered',
      amount: Number(item.qty) * Number(item.unitCost || 0),
      details: `Expiry ${item.expiry || '—'} · ${item.warehouseId || ''}`,
    }),
  )
  ;(finance.entries || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Finance & Accounting',
      category: item.source || 'Journal entry',
      reference: item.number || item.id,
      subject: item.description,
      status: item.status,
      amount: (item.lines || []).reduce((sum, line) => sum + Number(line.debit || 0), 0),
      details: `${(item.lines || []).length} journal lines`,
    }),
  )
  ;(finance.invoices || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Finance & Accounting',
      category: 'Customer invoice',
      reference: item.id,
      subject: item.customer,
      status: item.status,
      amount: item.total,
      details: `Due ${item.dueDate || '—'}`,
    }),
  )
  ;(finance.bills || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Finance & Accounting',
      category: 'Supplier bill',
      reference: item.id,
      subject: item.supplier,
      status: item.status,
      amount: item.total,
      details: `Paid ${money(item.paid)}`,
    }),
  )
  ;(finance.receipts || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Finance & Accounting',
      category: 'Cash receipt',
      reference: item.id,
      subject: item.customer || item.counterparty,
      status: item.status,
      amount: item.amount,
      details: item.reference || '',
    }),
  )
  ;(finance.payments || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Finance & Accounting',
      category: 'Cash payment',
      reference: item.id,
      subject: item.supplier || item.counterparty,
      status: item.status,
      amount: item.amount,
      details: item.reference || '',
    }),
  )
  ;(hr.employees || []).forEach((item) =>
    push({
      date: item.hireDate,
      module: 'Human Resource',
      category: 'Employee',
      reference: item.id,
      subject: item.name,
      status: item.status,
      amount: item.salary,
      details: `${item.role || ''} · ${item.departmentCode || ''}`,
    }),
  )
  ;(hr.attendance || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Human Resource',
      category: 'Attendance',
      reference: item.id,
      subject: item.employeeId,
      status: item.status,
      details: `${item.checkIn || '—'}–${item.checkOut || '—'}`,
    }),
  )
  ;(hr.leaveRequests || []).forEach((item) =>
    push({
      date: item.submittedAt || item.startDate,
      module: 'Human Resource',
      category: 'Leave request',
      reference: item.id,
      subject: item.employeeId,
      status: item.status,
      amount: item.days,
      details: `${item.typeId} · ${item.startDate} to ${item.endDate}`,
    }),
  )
  ;(payroll.batches || []).forEach((item) =>
    push({
      date: item.createdAt || item.periodId,
      module: 'Payroll',
      category: 'Payroll batch',
      reference: item.id,
      subject: item.periodId,
      status: item.status,
      amount: item.net,
      details: `${item.employeeCount || 0} employees · gross ${money(item.gross)}`,
    }),
  )
  ;(payroll.payments || []).forEach((item) =>
    push({
      date: item.date,
      module: 'Payroll',
      category: 'Salary payment',
      reference: item.id,
      subject: item.employeeName || item.employeeId,
      status: item.status,
      amount: item.amount,
      details: `${item.method || ''} · ${item.periodId || ''}`,
    }),
  )
  ;(payroll.advances || []).forEach((item) =>
    push({
      date: item.requestedAt,
      module: 'Payroll',
      category: 'Salary advance',
      reference: item.id,
      subject: item.employeeId,
      status: item.status,
      amount: item.amount,
      details: `${item.months || 0} recovery months`,
    }),
  )
  ;(access.loginHistory || []).forEach((item) =>
    push({
      date: item.date?.slice(0, 10),
      module: 'Administration',
      category: item.action || 'User activity',
      reference: item.id,
      subject: item.username || item.userId,
      status: item.result || 'Recorded',
      details: item.details || item.device || '',
    }),
  )
  ;(approvals.history || []).forEach((item) =>
    push({
      date: item.date?.slice(0, 10),
      module: 'Administration',
      category: 'Approval decision',
      reference: item.requestId || item.id,
      subject: item.actorName || item.actorRole || item.userId,
      status: item.decision || item.status || 'Reviewed',
      amount: item.amount,
      details: item.comments || item.commentsText || '',
    }),
  )
  ;(approvals.requests || []).forEach((item) =>
    push({
      date: item.submittedAt || item.createdAt,
      module: 'Administration',
      category: 'Approval request',
      reference: item.id,
      subject: item.type || item.title || item.requestType,
      status: item.status,
      amount: item.amount,
      details: item.description || item.reference || '',
    }),
  )
  ;(system.auditLogs || []).forEach((item) =>
    push({
      date: (item.date || item.timestamp || '').slice(0, 10),
      module: 'Administration',
      category: item.action || item.category || 'System audit',
      reference: item.id,
      subject: item.user || item.actor || 'System',
      status: item.result || 'Recorded',
      details: item.details || item.description || '',
    }),
  )
  const demoRecords = [
    {
      date: '2026-11-10',
      module: 'Administration',
      category: 'Approval request',
      reference: 'APR-DEMO-001',
      subject: 'Purchase order approval',
      status: 'Pending',
      amount: 285000,
      details: 'Demo preview · Operations',
    },
    {
      date: '2026-11-10',
      module: 'Human Resource',
      category: 'Attendance',
      reference: 'ATT-DEMO-001',
      subject: 'EMP-003 · Production',
      status: 'Present',
      details: 'Demo preview · Daily attendance',
    },
    {
      date: '2026-11-10',
      module: 'Payroll',
      category: 'Payroll batch',
      reference: 'PAY-DEMO-202611',
      subject: 'November 2026',
      status: 'In Review',
      amount: 1842500,
      details: 'Demo preview · 20 employees',
    },
    {
      date: '2026-11-09',
      module: 'Finance & Accounting',
      category: 'Customer invoice',
      reference: 'INV-DEMO-0142',
      subject: 'Green Valley Traders',
      status: 'Outstanding',
      amount: 282800,
      details: 'Demo preview · Dealer receivable',
    },
    {
      date: '2026-11-10',
      module: 'Inventory & Warehouse',
      category: 'Pesticide batch',
      reference: 'IMI-DEMO-041',
      subject: 'Imidacloprid 20% SL',
      status: 'Released',
      amount: 70300,
      details: 'Demo preview · Near-expiry lot',
    },
    {
      date: '2026-11-10',
      module: 'Dealer Management',
      category: 'Sales order',
      reference: 'ORD-DEMO-0145',
      subject: 'Green Valley Traders',
      status: 'Pending Approval',
      amount: 111000,
      details: 'Demo preview · Credit review required',
    },
  ]
  const representedModules = new Set(records.map((item) => item.module))
  demoRecords.filter((item) => !representedModules.has(item.module)).forEach(push)
  return records.filter((item) => item.date || item.reference !== '—')
}

const operationalPageModule = {
  'Administration Reports': 'Administration',
  'HRM Reports': 'Human Resource',
  'Payroll Reports': 'Payroll',
  'Finance Reports': 'Finance & Accounting',
  'Inventory Reports': 'Inventory & Warehouse',
  'Dealer Reports': 'Dealer Management',
  'Sales Overview': 'Dealer Management',
  'Finance Overview': 'Finance & Accounting',
  'Inventory Overview': 'Inventory & Warehouse',
  'HR Overview': 'Human Resource',
}
const moduleChoices = [
  'All modules',
  'Administration',
  'Human Resource',
  'Payroll',
  'Finance & Accounting',
  'Inventory & Warehouse',
  'Dealer Management',
]
const reportScreens = {
  'Reports & Analytics': ReportsAnalyticsPage,
  'Executive Overview': ExecutiveOverviewPage,
  'Sales Overview': SalesOverviewPage,
  'Finance Overview': FinanceOverviewPage,
  'Inventory Overview': InventoryOverviewPage,
  'HR Overview': HROverviewPage,
  'Administration Reports': AdministrationReportsPage,
  'HRM Reports': HRMReportsPage,
  'Payroll Reports': PayrollReportsPage,
  'Finance Reports': FinanceReportsPage,
  'Inventory Reports': InventoryReportsPage,
  'Dealer Reports': DealerReportsPage,
  'Saved Reports': SavedReportsPage,
  'Report Filters': ReportFiltersPage,
  'Scheduled Reports': ScheduledReportsPage,
  'Export History': ExportHistoryPage,
  'Activity Reports': ActivityReportsPage,
  'Approval Reports': ApprovalReportsPage,
  'Transaction Analysis': TransactionAnalysisPage,
  'Comparative Reports': ComparativeReportsPage,
  'Data Audit Logs': DataAuditLogsPage,
}

function ReportsModule({ page, onNotify, onNavigate }) {
  const [settings, setSettings] = useState(readReportSettings)
  const [moduleFilter, setModuleFilter] = useState('All modules')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({
    module: 'All modules',
    status: 'All statuses',
    search: '',
    dateFrom: '',
    dateTo: '',
  })
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false)

  const allRows = useMemo(sourceRows, [page])
  const filteredRows = useMemo(
    () =>
      allRows.filter(
        (item) =>
          (appliedFilters.module === 'All modules' || item.module === appliedFilters.module) &&
          (appliedFilters.status === 'All statuses' || item.status === appliedFilters.status) &&
          (!appliedFilters.dateFrom || !item.date || item.date >= appliedFilters.dateFrom) &&
          (!appliedFilters.dateTo || !item.date || item.date <= appliedFilters.dateTo) &&
          (!appliedFilters.search ||
            `${item.module} ${item.category} ${item.reference} ${item.subject} ${item.status} ${item.details}`
              .toLowerCase()
              .includes(appliedFilters.search)),
      ),
    [allRows, appliedFilters],
  )
  const saveSettings = (next, message) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      setSettings(next)
      if (message) onNotify(message)
      return true
    } catch (error) {
      console.error('Unable to save report management settings:', error)
      onNotify('Report settings could not be saved. Check available browser storage and try again.')
      return false
    }
  }
  const notifyExport = (name, count) => {
    const record = {
      id: `EXP-${Date.now()}`,
      name,
      format: 'CSV',
      rows: count,
      createdAt: new Date().toISOString(),
      status: 'Downloaded',
    }
    saveSettings(
      { ...settings, exports: [record, ...settings.exports].slice(0, 100) },
      `${name} exported as CSV`,
    )
  }
  const exportRows = (name, rows = filteredRows) => {
    if (!rows.length) return onNotify('There are no report records to export.')
    const headers = [
      'Date',
      'Module',
      'Category',
      'Reference',
      'Subject',
      'Status',
      'Amount (PKR)',
      'Details',
    ]
    const safeCell = (value) => {
      const text = String(value ?? '')
      return `"${/^[=+\-@]/.test(text) ? `'${text}` : text.replaceAll('"', '""')}"`
    }
    const csv = [
      headers,
      ...rows.map((item) => [
        item.date,
        item.module,
        item.category,
        item.reference,
        item.subject,
        item.status,
        item.amount,
        item.details,
      ]),
    ]
      .map((row) => row.map(safeCell).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`
    link.click()
    URL.revokeObjectURL(url)
    notifyExport(name, rows.length)
  }
  const applyFilters = (event) => {
    event?.preventDefault()
    setAppliedFilters({
      module: moduleFilter,
      status: statusFilter,
      search: search.trim().toLowerCase(),
      dateFrom,
      dateTo,
    })
    onNotify('Report filters applied')
  }
  const resetFilters = () => {
    setModuleFilter('All modules')
    setStatusFilter('All statuses')
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setAppliedFilters({
      module: 'All modules',
      status: 'All statuses',
      search: '',
      dateFrom: '',
      dateTo: '',
    })
    onNotify('Report filters cleared')
  }
  const saveCurrentReport = () => {
    const name = window.prompt(
      'Name this saved report',
      `${page} · ${new Date().toLocaleDateString()}`,
    )
    if (!name?.trim()) return
    const report = {
      id: `SAV-${Date.now()}`,
      name: name.trim(),
      page,
      filters: appliedFilters,
      createdAt: new Date().toISOString(),
    }
    saveSettings({ ...settings, savedReports: [report, ...settings.savedReports] }, 'Report saved')
  }
  const createSchedule = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (!values.name.trim() || !values.recipient.trim())
      return onNotify('Enter a schedule name and recipient.')
    const schedule = {
      id: `SCH-${Date.now()}`,
      name: values.name.trim(),
      report: values.report,
      frequency: values.frequency,
      recipient: values.recipient.trim(),
      nextRun: today(),
      status: 'Active',
      createdAt: new Date().toISOString(),
    }
    if (
      saveSettings(
        { ...settings, schedules: [schedule, ...settings.schedules] },
        'Report schedule created',
      )
    ) {
      setScheduleFormOpen(false)
      event.currentTarget.reset()
    }
  }
  const removeItem = (key, itemId, label) =>
    saveSettings(
      { ...settings, [key]: settings[key].filter((item) => item.id !== itemId) },
      `${label} removed`,
    )
  const table = (
    title,
    items = filteredRows,
    empty = 'No matching records for the selected filters.',
  ) => (
    <section className="reports-card">
      <header>
        <span>
          <FileText size={16} />
          {title}
        </span>
        <small>{items.length.toLocaleString()} records</small>
      </header>
      <div className="reports-table-scroll">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Module</th>
              <th>Type</th>
              <th>Reference</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.slice(0, 100).map((item, index) => (
                <tr key={`${item.reference}-${index}`}>
                  <td>{item.date || '—'}</td>
                  <td>{item.module}</td>
                  <td>{item.category}</td>
                  <td>
                    <b>{item.reference}</b>
                  </td>
                  <td>{item.subject}</td>
                  <td>
                    <Status>{item.status}</Status>
                  </td>
                  <td>{item.amount ? money(item.amount) : '—'}</td>
                  <td>{item.details || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="reports-empty" colSpan={8}>
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
  const stat = (label, value, note, Icon, tone = '') => (
    <article className={`reports-stat ${tone}`} key={label}>
      <span>
        <Icon size={18} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{note}</em>
      </div>
    </article>
  )
  const pageHeader = (subtitle, Icon = FileBarChart, options = {}) => (
    <header className="reports-page-header">
      <div className="reports-page-title">
        <span className="reports-title-icon">
          <Icon size={21} />
        </span>
        <div>
          <span className="reports-eyebrow">GREENFIELD ERP · REPORTING & GOVERNANCE</span>
          <h1>{page}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="reports-actions">
        {options.save && (
          <button className="reports-button secondary" onClick={saveCurrentReport}>
            <Check size={14} />
            Save report
          </button>
        )}
        {options.export && (
          <button className="reports-button" onClick={() => exportRows(page)}>
            <Download size={14} />
            Export CSV
          </button>
        )}
        {options.action}
      </div>
    </header>
  )
  const filteredOptions = [...new Set(allRows.map((item) => item.status).filter(Boolean))]
    .sort()
    .map((status) => <option key={status}>{status}</option>)
  const dataForModule = (module) => allRows.filter((item) => item.module === module)
  const amountFor = (rows) => rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  const countBy = (rows, key) =>
    rows.reduce(
      (map, row) =>
        map.set(row[key] || 'Unspecified', (map.get(row[key] || 'Unspecified') || 0) + 1),
      new Map(),
    )
  const currentReportModule = operationalPageModule[page]
  const moduleRows = currentReportModule ? dataForModule(currentReportModule) : filteredRows
  const monthlyTotals = useMemo(() => {
    const months = new Map()
    moduleRows.forEach((item) => {
      const month = item.date?.slice(0, 7)
      if (!month) return
      const entry = months.get(month) || { month, amount: 0, count: 0 }
      entry.amount += Number(item.amount) || 0
      entry.count += 1
      months.set(month, entry)
    })
    return [...months.values()].sort((a, b) => a.month.localeCompare(b.month)).slice(-8)
  }, [moduleRows])
  const maxMonthlyAmount = Math.max(1, ...monthlyTotals.map((item) => item.amount))
  const moduleCounts = [...countBy(allRows, 'module').entries()].sort((a, b) => b[1] - a[1])
  const maxModuleCount = Math.max(1, ...moduleCounts.map(([, value]) => value))
  const pendingCount = allRows.filter((item) => /pending|review|transit/i.test(item.status)).length
  const dealerData = readStorage(sources.dealer, null)
  const activeDealers = dealerData
    ? (dealerData.dealers || []).filter((item) => item.status === 'Active').length
    : 3
  const inventoryData = readStorage(sources.inventory, null)
  const stockBatches = inventoryData?.batches || []
  const nearExpiry = inventoryData
    ? stockBatches.filter(
        (item) =>
          item.expiry &&
          item.expiry >= today() &&
          (new Date(`${item.expiry}T00:00:00`) - new Date(`${today()}T00:00:00`)) / 86400000 <= 90,
      ).length
    : 1
  const monthLabel = (month) =>
    new Intl.DateTimeFormat('en', { month: 'short', year: '2-digit' }).format(
      new Date(`${month}-01T00:00:00`),
    )

  const reportContext = {
    allRows,
    amountFor,
    dataForModule,
    money,
    activeDealers,
    pendingCount,
    nearExpiry,
    monthlyTotals,
    maxMonthlyAmount,
    monthLabel,
    moduleCounts,
    maxModuleCount,
    moduleRows,
    countBy,
    pageHeader,
    stat,
    table,
    onNavigate,
    settings,
    removeItem,
    moduleChoices,
    moduleFilter,
    setModuleFilter,
    statusFilter,
    setStatusFilter,
    filteredOptions,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    search,
    setSearch,
    filteredRows,
    resetFilters,
    applyFilters,
    scheduleFormOpen,
    setScheduleFormOpen,
    createSchedule,
  }
  const Screen = reportScreens[page] || ReportsAnalyticsPage
  return <Screen context={reportContext} />
}

export default ReportsModule
