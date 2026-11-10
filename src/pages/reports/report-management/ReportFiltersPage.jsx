import { Filter, Search } from 'lucide-react'

export default function ReportFiltersPage({ context }) {
  const {
    pageHeader,
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
    table,
  } = context

  return (
    <div className="reports-page">
      {pageHeader(
        'Build a report view using module, date range, status, and keyword filters.',
        Filter,
        { export: true },
      )}
      <form className="reports-filter-card" onSubmit={applyFilters}>
        <div className="reports-filter-grid">
          <label>
            <span>ERP module</span>
            <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)}>
              {moduleChoices.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Record status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All statuses</option>
              {filteredOptions}
            </select>
          </label>
          <label>
            <span>From date</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
          <label>
            <span>To date</span>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </label>
          <label className="reports-filter-search">
            <span>Search report records</span>
            <div>
              <Search size={15} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Reference, dealer, batch, employee…"
              />
            </div>
          </label>
        </div>
        <footer>
          <span>{filteredRows.length.toLocaleString()} records match the applied filters</span>
          <button type="button" className="reports-button secondary" onClick={resetFilters}>
            Reset
          </button>
          <button type="submit" className="reports-button">
            <Filter size={14} />
            Apply filters
          </button>
        </footer>
      </form>
      {table('Filtered ERP activity', filteredRows)}
    </div>
  )
}
