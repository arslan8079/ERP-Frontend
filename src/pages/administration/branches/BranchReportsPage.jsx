import { useState } from 'react'
import { reportPeriodFactors, branchReportMetrics } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  FileBarChart,
  Printer,
  ArrowDownToLine,
  Search,
  RotateCcw,
  GitBranch,
  Building2,
  Users,
  Activity,
  MapPin,
  ClipboardList,
  Eye,
  Info,
} from 'lucide-react'

export default function BranchReportsPage({ branches, onSelectBranch, onNavigate }) {
  const [period, setPeriod] = useState('This Month')
  const [branchCode, setBranchCode] = useState('All Branches')
  const [status, setStatus] = useState('All Status')
  const [query, setQuery] = useState('')
  const factor = reportPeriodFactors[period]
  const normalizedQuery = query.trim().toLowerCase()
  const reportRows = branches.map((branch) => {
    const metrics = branchReportMetrics[branch.code] || {
      sales: branch.employees * 32000,
      target: Math.max(branch.employees * 35000, 500000),
      orders: branch.employees * 2,
      stock: branch.employees * 45000,
    }
    return {
      ...branch,
      sales: Math.round(metrics.sales * factor),
      target: Math.round(metrics.target * factor),
      orders: Math.round(metrics.orders * factor),
      stock: Math.round(metrics.stock * factor),
    }
  })
  const filteredRows = reportRows.filter(
    (branch) =>
      (branchCode === 'All Branches' || branch.code === branchCode) &&
      (status === 'All Status' || branch.status === status) &&
      (!normalizedQuery ||
        `${branch.code} ${branch.name} ${branch.location} ${branch.manager}`
          .toLowerCase()
          .includes(normalizedQuery)),
  )
  const activeCount = filteredRows.filter((branch) => branch.status === 'Active').length
  const employeeCount = filteredRows.reduce((total, branch) => total + branch.employees, 0)
  const salesTotal = filteredRows.reduce((total, branch) => total + branch.sales, 0)
  const currency = (amount) =>
    `Rs. ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(amount)}`
  const compactCurrency = (amount) =>
    amount >= 1000000 ? `Rs. ${(amount / 1000000).toFixed(2)}M` : currency(amount)
  const regions = filteredRows.reduce((totals, branch) => {
    const region = branch.location.split(',').slice(1).join(',').trim() || 'Other'
    totals[region] = (totals[region] || 0) + 1
    return totals
  }, {})
  const maxRegionCount = Math.max(1, ...Object.values(regions))

  const exportReport = () => {
    const rows = [
      [
        'Branch Code',
        'Branch Name',
        'Location',
        'Manager',
        'Employees',
        'Sales',
        'Orders',
        'Stock Value',
        'Target Attainment',
        'Status',
      ],
      ...filteredRows.map((branch) => [
        branch.code,
        branch.name,
        branch.location,
        branch.manager,
        branch.employees,
        branch.sales,
        branch.orders,
        branch.stock,
        branch.target ? `${((branch.sales / branch.target) * 100).toFixed(1)}%` : '0%',
        branch.status,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'branch-reports.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  const resetFilters = () => {
    setPeriod('This Month')
    setBranchCode('All Branches')
    setStatus('All Status')
    setQuery('')
  }

  return (
    <div className="branch-list-page branch-reports-page">
      <header className="branch-list-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <FileBarChart size={37} strokeWidth={2.1} />
          <div>
            <h1>Branch Reports</h1>
            <p>Review branch performance, workforce, and operations</p>
          </div>
        </div>
        <div className="branch-report-actions">
          <button type="button" onClick={() => window.print()}>
            <Printer size={15} />
            Print
          </button>
          <button type="button" onClick={exportReport}>
            <ArrowDownToLine size={15} />
            Export CSV
          </button>
        </div>
      </header>

      <section className="branch-report-filters" aria-label="Branch report filters">
        <label>
          <span>Reporting period</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            {Object.keys(reportPeriodFactors).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Branch</span>
          <select value={branchCode} onChange={(event) => setBranchCode(event.target.value)}>
            <option>All Branches</option>
            {branches.map((branch) => (
              <option key={branch.code} value={branch.code}>
                {branch.code} · {branch.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <label className="branch-report-search">
          <span>Search branches</span>
          <span className="branch-report-search-input">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, code, location or manager"
            />
          </span>
        </label>
        <button type="button" className="branch-report-reset" onClick={resetFilters}>
          <RotateCcw size={15} />
          Reset
        </button>
      </section>

      <section className="branch-report-kpis" aria-label="Branch report summary">
        <article>
          <span className="branch-report-kpi-icon green">
            <GitBranch size={21} />
          </span>
          <div>
            <span>Branches in report</span>
            <strong>{filteredRows.length}</strong>
            <small>of {branches.length} company branches</small>
          </div>
        </article>
        <article>
          <span className="branch-report-kpi-icon blue">
            <Building2 size={21} />
          </span>
          <div>
            <span>Active branches</span>
            <strong>{activeCount}</strong>
            <small>{filteredRows.length - activeCount} inactive</small>
          </div>
        </article>
        <article>
          <span className="branch-report-kpi-icon purple">
            <Users size={21} />
          </span>
          <div>
            <span>Total employees</span>
            <strong>{new Intl.NumberFormat('en-PK').format(employeeCount)}</strong>
            <small>Across selected branches</small>
          </div>
        </article>
        <article>
          <span className="branch-report-kpi-icon orange">
            <Activity size={21} />
          </span>
          <div>
            <span>Reported sales</span>
            <strong>{compactCurrency(salesTotal)}</strong>
            <small>{period}</small>
          </div>
        </article>
      </section>

      <div className="branch-report-insights">
        <section className="branch-report-card branch-performance-card">
          <div className="branch-report-card-heading">
            <div>
              <h2>
                <Activity size={17} />
                Sales vs target
              </h2>
              <p>Target attainment by branch · {period}</p>
            </div>
            <span className="branch-report-legend">
              <i />
              Achieved
            </span>
          </div>
          <div className="branch-performance-list">
            {filteredRows.length ? (
              filteredRows.map((branch) => {
                const attainment = branch.target
                  ? Math.round((branch.sales / branch.target) * 100)
                  : 0
                return (
                  <div className="branch-performance-row" key={branch.code}>
                    <span className="branch-performance-name" title={branch.name}>
                      {branch.name}
                    </span>
                    <span className="branch-performance-track">
                      <i style={{ width: `${Math.min(attainment, 100)}%` }} />
                    </span>
                    <b>{attainment}%</b>
                  </div>
                )
              })
            ) : (
              <p className="branch-report-empty">No branches match these filters.</p>
            )}
          </div>
        </section>

        <section className="branch-report-card branch-region-card">
          <div className="branch-report-card-heading">
            <div>
              <h2>
                <MapPin size={17} />
                Branch distribution
              </h2>
              <p>Locations by province or region</p>
            </div>
          </div>
          <div className="branch-region-list">
            {Object.entries(regions).length ? (
              Object.entries(regions).map(([region, count]) => (
                <div className="branch-region-row" key={region}>
                  <span title={region}>{region}</span>
                  <span className="branch-region-track">
                    <i style={{ width: `${(count / maxRegionCount) * 100}%` }} />
                  </span>
                  <b>{count}</b>
                </div>
              ))
            ) : (
              <p className="branch-report-empty">No regional data available.</p>
            )}
          </div>
          <div className="branch-region-summary">
            <span>
              <i className="active-dot" />
              Active <b>{activeCount}</b>
            </span>
            <span>
              <i className="inactive-dot" />
              Inactive <b>{filteredRows.length - activeCount}</b>
            </span>
          </div>
        </section>
      </div>

      <section className="branch-report-table-card">
        <div className="branch-report-table-heading">
          <div>
            <h2>
              <ClipboardList size={17} />
              Branch performance
            </h2>
            <p>
              {filteredRows.length} branch{filteredRows.length === 1 ? '' : 'es'} · {period}
            </p>
          </div>
          <span>Sales and stock values in PKR</span>
        </div>
        <div className="branch-report-table-wrap">
          <table className="branch-report-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Location</th>
                <th>Manager</th>
                <th>Employees</th>
                <th>Sales</th>
                <th>Orders</th>
                <th>Stock value</th>
                <th>Target</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((branch) => {
                const attainment = branch.target
                  ? Math.round((branch.sales / branch.target) * 100)
                  : 0
                return (
                  <tr key={branch.code}>
                    <td>
                      <span className="branch-report-identity">
                        <b>{branch.name}</b>
                        <small>{branch.code}</small>
                      </span>
                    </td>
                    <td>{branch.location}</td>
                    <td>{branch.manager || 'Not assigned'}</td>
                    <td>{new Intl.NumberFormat('en-PK').format(branch.employees)}</td>
                    <td>{currency(branch.sales)}</td>
                    <td>{new Intl.NumberFormat('en-PK').format(branch.orders)}</td>
                    <td>{currency(branch.stock)}</td>
                    <td>
                      <span className={`branch-attainment ${attainment >= 100 ? 'on-target' : ''}`}>
                        {attainment}%
                      </span>
                    </td>
                    <td>
                      <span className={`branch-status-pill ${branch.status.toLowerCase()}`}>
                        {branch.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="branch-report-view"
                        aria-label={`View ${branch.name} details`}
                        title="View branch details"
                        onClick={() => {
                          onSelectBranch(branch.code)
                          onNavigate('Branch Details')
                        }}
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!filteredRows.length && (
                <tr>
                  <td className="branch-report-empty" colSpan="10">
                    No branches match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="branch-report-footer">
        <Info size={15} />
        Performance figures are sample reporting data. Branch status and employee totals reflect
        branch records.
      </footer>
    </div>
  )
}
