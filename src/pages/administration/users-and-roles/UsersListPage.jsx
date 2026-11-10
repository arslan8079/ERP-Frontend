import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import {
  UserCog,
  UserPlus,
  Users,
  BadgeCheck,
  ShieldCheck,
  KeyRound,
  Search,
  RotateCcw,
  Clock3,
  Eye,
  Pencil,
  Power,
} from 'lucide-react'
import { userRoleName, userDisplayDate, UserStatusPill } from '../../../App.jsx'

export default function UsersListPage({
  users,
  roles,
  branches,
  departments,
  onNavigate,
  onNotify,
  onSelectUser,
  onUpdateUser,
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All Status')
  const [roleCode, setRoleCode] = useState('All Roles')
  const [branchCode, setBranchCode] = useState('All Branches')
  const searchTerm = query.trim().toLowerCase()
  const visibleUsers = users.filter((user) => {
    const role = roles.find((item) => item.code === user.roleCode)
    const branch = branches.find((item) => item.code === user.branchCode)
    const matchesText = `${user.name} ${user.username} ${user.email} ${user.id} ${role?.name || ''}`
      .toLowerCase()
      .includes(searchTerm)
    return (
      matchesText &&
      (status === 'All Status' || user.status === status) &&
      (roleCode === 'All Roles' || user.roleCode === roleCode) &&
      (branchCode === 'All Branches' || user.branchCode === branchCode)
    )
  })
  const activeCount = users.filter((user) => user.status === 'Active').length
  const suspendedCount = users.filter((user) => user.status === 'Suspended').length
  const resetRequiredCount = users.filter((user) => user.mustChangePassword).length
  const toggleStatus = (user) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active'
    onUpdateUser(user.id, { status: nextStatus }, `User ${nextStatus.toLowerCase()}`, user.name)
  }
  const resetFilters = () => {
    setQuery('')
    setStatus('All Status')
    setRoleCode('All Roles')
    setBranchCode('All Branches')
  }

  return (
    <div className="branch-list-page access-page users-list-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <UserCog size={37} />
          <div>
            <h1>Users &amp; Roles</h1>
            <p>Manage sign-in accounts, organization access, and security</p>
          </div>
        </div>
        <button
          type="button"
          className="branch-create-button access-banner-action"
          onClick={() => onNavigate('Create User')}
        >
          <UserPlus size={16} />
          Create User
        </button>
      </header>
      <section className="access-summary">
        <article>
          <span className="access-summary-icon green">
            <Users size={20} />
          </span>
          <div>
            <span>Total accounts</span>
            <strong>{users.length}</strong>
            <small>Across {roles.length} roles</small>
          </div>
        </article>
        <article>
          <span className="access-summary-icon blue">
            <BadgeCheck size={20} />
          </span>
          <div>
            <span>Active accounts</span>
            <strong>{activeCount}</strong>
            <small>Can sign in</small>
          </div>
        </article>
        <article>
          <span className="access-summary-icon red">
            <ShieldCheck size={20} />
          </span>
          <div>
            <span>Suspended</span>
            <strong>{suspendedCount}</strong>
            <small>Sign-in blocked</small>
          </div>
        </article>
        <article>
          <span className="access-summary-icon amber">
            <KeyRound size={20} />
          </span>
          <div>
            <span>Reset required</span>
            <strong>{resetRequiredCount}</strong>
            <small>Change password at sign-in</small>
          </div>
        </article>
      </section>
      <section className="access-toolbar" aria-label="Filter users">
        <label className="access-search">
          <span>Search users</span>
          <span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, username, email or user ID"
            />
          </span>
        </label>
        <label>
          <span>Role</span>
          <select value={roleCode} onChange={(event) => setRoleCode(event.target.value)}>
            <option>All Roles</option>
            {roles.map((role) => (
              <option key={role.code} value={role.code}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Branch</span>
          <select value={branchCode} onChange={(event) => setBranchCode(event.target.value)}>
            <option>All Branches</option>
            {branches.map((branch) => (
              <option key={branch.code} value={branch.code}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </label>
        <button type="button" className="access-reset" onClick={resetFilters}>
          <RotateCcw size={15} />
          Reset
        </button>
      </section>
      <section className="access-table-card">
        <div className="access-table-heading">
          <div>
            <h2>
              <Users size={17} />
              User accounts
            </h2>
            <p>
              {visibleUsers.length} of {users.length} accounts
            </p>
          </div>
          <div className="access-heading-actions">
            <button
              type="button"
              className="access-secondary-button"
              onClick={() => onNavigate('Roles Management')}
            >
              <KeyRound size={15} />
              Manage roles
            </button>
            <button
              type="button"
              className="access-secondary-button"
              onClick={() => onNavigate('Login History')}
            >
              <Clock3 size={15} />
              Login history
            </button>
          </div>
        </div>
        <div className="access-table-wrap">
          <table className="access-table users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Branch / Department</th>
                <th>Last sign-in</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => {
                const branch = branches.find((item) => item.code === user.branchCode)
                const department = departments.find((item) => item.code === user.departmentCode)
                return (
                  <tr key={user.id}>
                    <td>
                      <span className="access-user-cell">
                        <span className="access-avatar">
                          {user.name
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                        </span>
                        <span>
                          <b>{user.name}</b>
                          <small>{user.email}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="access-username">@{user.username}</span>
                      <small className="access-user-id">{user.id}</small>
                    </td>
                    <td>
                      {userRoleName(user, roles)}
                      {user.mustChangePassword && (
                        <small className="access-required-note">
                          <KeyRound size={12} />
                          Password change required
                        </small>
                      )}
                    </td>
                    <td>
                      <span className="access-org-cell">
                        {branch?.name || 'Unassigned'}
                        {branch?.status === 'Inactive' && (
                          <small className="access-branch-inactive">Branch inactive</small>
                        )}
                        <small>{department?.name || 'No department'}</small>
                      </span>
                    </td>
                    <td>{userDisplayDate(user.lastLogin, true)}</td>
                    <td>
                      <UserStatusPill status={user.status} />
                    </td>
                    <td>
                      <div className="access-row-actions">
                        <button
                          type="button"
                          aria-label={`View ${user.name}`}
                          title="View profile"
                          onClick={() => {
                            onSelectUser(user.id)
                            onNavigate('User Profile')
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Edit ${user.name}`}
                          title="Edit account"
                          onClick={() => {
                            onSelectUser(user.id)
                            onNavigate('Edit User')
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className={user.status === 'Active' ? 'suspend' : 'activate'}
                          aria-label={`${user.status === 'Active' ? 'Suspend' : 'Activate'} ${user.name}`}
                          title={`${user.status === 'Active' ? 'Suspend' : 'Activate'} account`}
                          onClick={() => toggleStatus(user)}
                        >
                          <Power size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!visibleUsers.length && (
                <tr>
                  <td className="access-empty" colSpan="7">
                    No user accounts match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="access-list-footer">
          <span>
            Active <b>{activeCount}</b>
            <i />
            Suspended <b>{suspendedCount}</b>
            <i />
            Password reset required <b>{resetRequiredCount}</b>
          </span>
          <span>
            <ShieldCheck size={15} />
            The last active system administrator cannot be suspended.
          </span>
        </footer>
      </section>
    </div>
  )
}
