import {
  Info,
  UserRound,
  ArrowLeft,
  Pencil,
  KeyRound,
  ShieldCheck,
  Eye,
  Clock3,
  ArrowRight,
  Power,
} from 'lucide-react'
import fieldBanner from '../../../field-banner.svg'
import { UserStatusPill, userDisplayDate } from '../../../App.jsx'

export default function UserProfilePage({
  user,
  roles,
  branches,
  departments,
  history,
  onNavigate,
  onUpdateUser,
  onNotify,
}) {
  if (!user)
    return (
      <div className="branch-list-page access-page">
        <div className="branch-list-notice">
          <Info size={18} />
          Select a user account from Users List first.
        </div>
        <button
          type="button"
          className="branch-create-button"
          onClick={() => onNavigate('Users List')}
        >
          Users List
        </button>
      </div>
    )
  const role = roles.find((item) => item.code === user.roleCode)
  const branch = branches.find((item) => item.code === user.branchCode)
  const department = departments.find((item) => item.code === user.departmentCode)
  const recentEvents = history.filter((event) => event.userId === user.id).slice(0, 6)
  const setStatus = () => {
    const status = user.status === 'Active' ? 'Suspended' : 'Active'
    onUpdateUser(user.id, { status }, `User ${status.toLowerCase()}`, user.name)
  }
  const requirePasswordChange = () => {
    if (user.mustChangePassword)
      return onNotify('Password change is already required at next sign-in.')
    onUpdateUser(user.id, { mustChangePassword: true }, 'Password change required', user.name)
  }
  return (
    <div className="branch-list-page access-page user-profile-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <UserRound size={37} />
          <div>
            <h1>User Profile</h1>
            <p>Account identity, organization access, and security activity</p>
          </div>
        </div>
        <button
          type="button"
          className="branch-back-button"
          onClick={() => onNavigate('Users List')}
        >
          <ArrowLeft size={16} />
          Users List
        </button>
      </header>
      <section className="user-profile-summary">
        <span className="user-profile-avatar">
          {user.name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </span>
        <div>
          <small>
            {user.id} · @{user.username}
          </small>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <UserStatusPill status={user.status} />
        <button
          type="button"
          className="access-secondary-button"
          onClick={() => onNavigate('Edit User')}
        >
          <Pencil size={15} />
          Edit user
        </button>
      </section>
      {user.mustChangePassword && (
        <div className="user-security-notice">
          <KeyRound size={17} />
          This account must change its password at the next successful sign-in.
        </div>
      )}
      <div className="user-profile-grid">
        <section className="access-detail-card">
          <h3>
            <UserRound size={17} />
            Account information
          </h3>
          <dl>
            <div>
              <dt>Username</dt>
              <dd>@{user.username}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{user.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Linked employee</dt>
              <dd>{user.employeeId || 'No employee linked'}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{userDisplayDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt>Last sign-in</dt>
              <dd>{userDisplayDate(user.lastLogin, true)}</dd>
            </div>
          </dl>
        </section>
        <section className="access-detail-card">
          <h3>
            <ShieldCheck size={17} />
            Access scope
          </h3>
          <dl>
            <div>
              <dt>Security role</dt>
              <dd>{role?.name || 'Role unavailable'}</dd>
            </div>
            <div>
              <dt>Role scope</dt>
              <dd>{role?.scope || 'Unavailable'}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{branch?.name || 'Not assigned'}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{department?.name || 'Not assigned'}</dd>
            </div>
            <div className="user-detail-wide">
              <dt>Role description</dt>
              <dd>{role?.description || 'No description available.'}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="access-inline-link"
            onClick={() => onNavigate('Permission Matrix')}
          >
            <Eye size={14} />
            Review role permissions
          </button>
        </section>
        <section className="access-detail-card user-activity-card">
          <div className="user-activity-heading">
            <h3>
              <Clock3 size={17} />
              Recent account activity
            </h3>
            <button
              type="button"
              className="access-inline-link"
              onClick={() => onNavigate('Login History')}
            >
              Full history <ArrowRight size={14} />
            </button>
          </div>
          {recentEvents.length ? (
            <div className="user-activity-list">
              {recentEvents.map((event) => (
                <article key={event.id}>
                  <span className={`history-result-dot ${event.result.toLowerCase()}`} />
                  <div>
                    <b>{event.action}</b>
                    <small>{event.details || event.device}</small>
                  </div>
                  <time>{userDisplayDate(event.date, true)}</time>
                </article>
              ))}
            </div>
          ) : (
            <p className="access-muted">No account activity recorded.</p>
          )}
        </section>
        <aside className="access-detail-card user-security-card">
          <h3>
            <KeyRound size={17} />
            Security actions
          </h3>
          <p>
            Control access to this account. Changes are recorded in the login history audit trail.
          </p>
          <button type="button" onClick={requirePasswordChange} disabled={user.mustChangePassword}>
            <KeyRound size={15} />
            Require password change
          </button>
          <button
            type="button"
            className={user.status === 'Active' ? 'danger' : 'safe'}
            onClick={setStatus}
          >
            <Power size={15} />
            {user.status === 'Active' ? 'Suspend account' : 'Activate account'}
          </button>
          <button type="button" onClick={() => onNavigate('Login History')}>
            <Clock3 size={15} />
            Review login history
          </button>
        </aside>
      </div>
    </div>
  )
}
