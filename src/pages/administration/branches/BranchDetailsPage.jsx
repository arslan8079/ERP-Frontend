import { Info, Plus, Building2, ArrowLeft, MapPin, Users, Power } from 'lucide-react'
import fieldBanner from '../../../field-banner.svg'

export default function BranchDetailsPage({
  branch,
  onNavigate,
  onNotify,
  setBranches,
  onSelectBranch,
}) {
  if (!branch)
    return (
      <div className="branch-list-page">
        <div className="branch-list-notice">
          <Info size={19} />
          <span>No branch is available. Create a branch first, then view its details here.</span>
        </div>
        <button
          type="button"
          className="branch-create-button"
          onClick={() => onNavigate('Create Branch')}
        >
          <Plus size={18} />
          Create Branch
        </button>
      </div>
    )
  const [city, ...region] = branch.location.split(',').map((part) => part.trim())
  const changeStatus = () => {
    const nextStatus = branch.status === 'Active' ? 'Inactive' : 'Active'
    setBranches((current) =>
      current.map((item) => (item.code === branch.code ? { ...item, status: nextStatus } : item)),
    )
    onNotify(`${branch.name} ${nextStatus === 'Active' ? 'activated' : 'deactivated'}`)
  }

  return (
    <div className="branch-list-page branch-details-page">
      <header className="branch-list-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Building2 size={39} strokeWidth={2.2} />
          <div>
            <h1>Branch Details</h1>
            <p>View company branch information</p>
          </div>
        </div>
        <div className="branch-header-actions">
          <button
            type="button"
            className="branch-secondary-button"
            onClick={() => {
              onSelectBranch?.(branch.code)
              onNavigate('Edit Branch')
            }}
          >
            Edit Branch
          </button>
          <button
            type="button"
            className="branch-back-button"
            onClick={() => onNavigate('Branch List')}
          >
            <ArrowLeft size={16} />
            Branch List
          </button>
        </div>
      </header>
      <div className="branch-details-content">
        <section className="branch-detail-summary">
          <div className="branch-detail-summary-icon">
            <Building2 size={28} />
          </div>
          <div className="branch-detail-summary-name">
            <span>{branch.code}</span>
            <h2>{branch.name}</h2>
            <p>
              <MapPin size={14} />
              {branch.location}
            </p>
          </div>
          <span className={`branch-status-pill ${branch.status.toLowerCase()}`}>
            {branch.status}
          </span>
        </section>
        <div className="branch-details-grid">
          <section className="branch-detail-card">
            <div className="branch-detail-card-heading">
              <Building2 size={17} />
              <h3>Branch information</h3>
            </div>
            <dl className="branch-detail-fields">
              <div>
                <dt>Branch Code</dt>
                <dd>{branch.code}</dd>
              </div>
              <div>
                <dt>Branch Name</dt>
                <dd>{branch.name}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`branch-status-pill ${branch.status.toLowerCase()}`}>
                    {branch.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Employee Count</dt>
                <dd>{branch.employees}</dd>
              </div>
            </dl>
          </section>
          <section className="branch-detail-card">
            <div className="branch-detail-card-heading">
              <MapPin size={17} />
              <h3>Location</h3>
            </div>
            <dl className="branch-detail-fields">
              <div>
                <dt>City</dt>
                <dd>{city || 'Not specified'}</dd>
              </div>
              <div>
                <dt>Province / Region</dt>
                <dd>{region.join(', ') || 'Not specified'}</dd>
              </div>
              <div className="branch-detail-field-full">
                <dt>Street Address</dt>
                <dd>{branch.address || 'No street address provided'}</dd>
              </div>
            </dl>
          </section>
          <section className="branch-detail-card">
            <div className="branch-detail-card-heading">
              <Users size={17} />
              <h3>Branch contact</h3>
            </div>
            <dl className="branch-detail-fields">
              <div>
                <dt>Branch Manager</dt>
                <dd>{branch.manager || 'Not assigned'}</dd>
              </div>
              <div>
                <dt>Contact Number</dt>
                <dd>{branch.phone || 'Not provided'}</dd>
              </div>
              <div className="branch-detail-field-full">
                <dt>Email Address</dt>
                <dd>{branch.email || 'Not provided'}</dd>
              </div>
            </dl>
          </section>
          <aside className="branch-detail-card branch-detail-note">
            <div className="branch-detail-card-heading">
              <Info size={17} />
              <h3>Branch status</h3>
            </div>
            <p>
              {branch.status === 'Active'
                ? 'This branch is active and available for use across company modules.'
                : 'This branch is inactive and unavailable for new transactions.'}
            </p>
            <button
              type="button"
              className={
                branch.status === 'Active' ? 'branch-detail-deactivate' : 'branch-detail-activate'
              }
              onClick={changeStatus}
            >
              <Power size={15} />
              {branch.status === 'Active' ? 'Deactivate branch' : 'Activate branch'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}
