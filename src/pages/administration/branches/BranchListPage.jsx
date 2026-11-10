import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import { Building2, Search, Plus, Info, Eye, Pencil, Power, Network } from 'lucide-react'

export default function BranchListPage({
  branches,
  setBranches,
  onNavigate,
  onNotify,
  onSelectBranch,
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [includeInactive, setIncludeInactive] = useState(false)
  const normalizedQuery = query.trim().toLowerCase()
  const visibleBranches = branches.filter((branch) => {
    const matchesQuery = `${branch.code} ${branch.name} ${branch.location} ${branch.manager}`
      .toLowerCase()
      .includes(normalizedQuery)
    const matchesStatus =
      status === 'All' ||
      branch.status === status ||
      (includeInactive && branch.status === 'Inactive')
    return matchesQuery && matchesStatus
  })
  const activeCount = branches.filter((branch) => branch.status === 'Active').length
  const inactiveCount = branches.length - activeCount

  return (
    <div className="branch-list-page">
      <header className="branch-list-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Building2 size={39} strokeWidth={2.2} />
          <div>
            <h1>Branch List</h1>
            <p>Manage company branches</p>
          </div>
        </div>
      </header>
      <section className="branch-list-toolbar" aria-label="Branch filters">
        <label className="branch-search">
          <b>Search:</b>
          <span>
            <input
              aria-label="Search branches"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by code, name, location or manager..."
            />
            <Search size={18} />
          </span>
        </label>
        <label className="branch-status-filter">
          <b>Status:</b>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <label className="branch-include-inactive">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(event) => setIncludeInactive(event.target.checked)}
          />
          Include Inactive
        </label>
        <button
          type="button"
          className="branch-create-button"
          onClick={() => onNavigate('Create Branch')}
        >
          <Plus size={19} />
          Create Branch
        </button>
      </section>
      <div className="branch-list-notice">
        <Info size={19} fill="currentColor" />
        <span>
          Only permitted branches are shown. Linked branches cannot be hard-deleted (they can be
          deactivated).
        </span>
      </div>
      <div className="branch-table-scroll">
        <table className="branch-table">
          <thead>
            <tr>
              <th>Branch Code</th>
              <th>Name</th>
              <th>Location</th>
              <th>Manager</th>
              <th>Status</th>
              <th>Employee Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleBranches.map((branch) => (
              <tr key={branch.code}>
                <td>{branch.code}</td>
                <td>{branch.name}</td>
                <td>{branch.location}</td>
                <td>{branch.manager}</td>
                <td>
                  <span className={`branch-status-pill ${branch.status.toLowerCase()}`}>
                    {branch.status}
                  </span>
                </td>
                <td>{branch.employees}</td>
                <td>
                  <div className="branch-row-actions">
                    <button
                      type="button"
                      aria-label={`Add linked branch to ${branch.name}`}
                      title="Add linked branch"
                      onClick={() => onNavigate('Create Branch')}
                    >
                      <Plus size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`View ${branch.name}`}
                      title="View branch"
                      onClick={() => {
                        onSelectBranch(branch.code)
                        onNavigate('Branch Details')
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit ${branch.name}`}
                      title="Edit branch"
                      onClick={() =>
                        onNotify(`Selected ${branch.code} · ${branch.name} for editing`)
                      }
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className={branch.status === 'Active' ? 'deactivate' : 'activate'}
                      aria-label={`${branch.status === 'Active' ? 'Deactivate' : 'Activate'} ${branch.name}`}
                      title={branch.status === 'Active' ? 'Deactivate branch' : 'Activate branch'}
                      onClick={() => {
                        setBranches((current) =>
                          current.map((item) =>
                            item.code === branch.code
                              ? {
                                  ...item,
                                  status: item.status === 'Active' ? 'Inactive' : 'Active',
                                }
                              : item,
                          ),
                        )
                        onNotify(
                          `${branch.name} ${branch.status === 'Active' ? 'deactivated' : 'activated'}`,
                        )
                      }}
                    >
                      <Power size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!visibleBranches.length && (
              <tr>
                <td className="branch-empty-state" colSpan="7">
                  No branches match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="branch-list-footer">
        <span>
          Total Branches: <b>{branches.length}</b>
          <i />
          Active: <b>{activeCount}</b>
          <i />
          Inactive: <b>{inactiveCount}</b>
        </span>
        <span className="branch-list-footer-note">
          <Network size={17} />
          Branch selector is reused across all company modules (HRM, Inventory, Finance, etc.).
        </span>
      </footer>
    </div>
  )
}
