import { useState } from 'react'
import { buildRolePermissions, UserStatusPill, LockKeyholeIcon, GridIcon } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  KeyRound,
  Plus,
  BadgeCheck,
  Users,
  ShieldCheck,
  Search,
  ChevronRight,
  Power,
  Trash2,
  Save,
  Info,
} from 'lucide-react'

export default function RolesManagementPage({
  users,
  roles,
  onSaveRole,
  onUpdateRole,
  onDeleteRole,
  onNavigate,
  selectedRoleCode,
  onSelectRole,
}) {
  const [creating, setCreating] = useState(false)
  const [roleQuery, setRoleQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const selectedRole = roles.find((role) => role.code === selectedRoleCode) || roles[0]
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const activeRole = creating ? null : selectedRole
  const currentForm =
    form ||
    (activeRole
      ? { name: activeRole.name, description: activeRole.description, scope: activeRole.scope }
      : { name: '', description: '', scope: 'Company-wide' })
  const beginCreate = () => {
    setCreating(true)
    setForm({ name: '', description: '', scope: 'Company-wide' })
    setError('')
  }
  const selectRole = (code) => {
    setCreating(false)
    setForm(null)
    setError('')
    onSelectRole(code)
  }
  const save = (event) => {
    event.preventDefault()
    const name = currentForm.name.trim()
    if (!name) return setError('Role name is required.')
    if (
      roles.some(
        (role) =>
          role.code !== activeRole?.code && role.name.trim().toLowerCase() === name.toLowerCase(),
      )
    )
      return setError('A role with this name already exists.')
    const nextRole = onSaveRole(
      {
        ...activeRole,
        ...currentForm,
        name,
        permissions: activeRole?.permissions || buildRolePermissions(),
        status: activeRole?.status || 'Active',
      },
      activeRole?.code || '',
    )
    if (nextRole) {
      setCreating(false)
      setForm(null)
      setError('')
      onSelectRole(nextRole.code)
    }
  }
  const assignedUsers = activeRole ? users.filter((user) => user.roleCode === activeRole.code) : []
  const filteredRoles = roles.filter(
    (role) =>
      (roleFilter === 'All' || role.status === roleFilter) &&
      `${role.name} ${role.code} ${role.scope} ${role.system ? 'built-in' : 'custom'}`
        .toLowerCase()
        .includes(roleQuery.trim().toLowerCase()),
  )
  const permissionCounts = ['view', 'create', 'edit', 'delete', 'approve', 'export'].map(
    (action) => ({
      action,
      count: activeRole
        ? Object.values(activeRole.permissions || {}).filter((permissions) => permissions[action])
            .length
        : 0,
    }),
  )
  const toggleRoleStatus = () => {
    if (!activeRole || activeRole.system) return
    onUpdateRole(
      activeRole.code,
      { status: activeRole.status === 'Active' ? 'Inactive' : 'Active' },
      'Role status changed',
    )
  }

  return (
    <div className="branch-list-page access-page roles-management-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <KeyRound size={36} />
          <div>
            <h1>Roles Management</h1>
            <p>Define reusable access profiles for your organization</p>
          </div>
        </div>
        <button
          type="button"
          className="branch-create-button access-banner-action"
          onClick={beginCreate}
        >
          <Plus size={16} />
          Create Role
        </button>
      </header>
      <section className="access-summary role-summary">
        <article>
          <span className="access-summary-icon green">
            <KeyRound size={20} />
          </span>
          <div>
            <span>Total roles</span>
            <strong>{roles.length}</strong>
            <small>Reusable permission profiles</small>
          </div>
        </article>
        <article>
          <span className="access-summary-icon blue">
            <BadgeCheck size={20} />
          </span>
          <div>
            <span>Active roles</span>
            <strong>{roles.filter((role) => role.status === 'Active').length}</strong>
            <small>Available for assignment</small>
          </div>
        </article>
        <article>
          <span className="access-summary-icon purple">
            <Users size={20} />
          </span>
          <div>
            <span>Role assignments</span>
            <strong>{users.length}</strong>
            <small>Across all user accounts</small>
          </div>
        </article>
      </section>
      <div className="role-management-layout">
        <section className="role-list-card">
          <div className="role-catalogue-header">
            <div>
              <span className="role-catalogue-icon">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2>Role catalogue</h2>
                <p>Browse and select an access profile</p>
              </div>
            </div>
            <span className="role-catalogue-total">{roles.length} roles</span>
          </div>
          <label className="role-search">
            <Search size={15} />
            <input
              value={roleQuery}
              onChange={(event) => setRoleQuery(event.target.value)}
              placeholder="Search role name, code, scope"
            />
            <span>{filteredRoles.length}</span>
          </label>
          <div className="role-filter-chips" aria-label="Filter roles">
            {['All', 'Active', 'Inactive'].map((filter) => (
              <button
                type="button"
                key={filter}
                className={roleFilter === filter ? 'selected' : ''}
                onClick={() => setRoleFilter(filter)}
              >
                {filter}
                <small>
                  {filter === 'All'
                    ? roles.length
                    : roles.filter((role) => role.status === filter).length}
                </small>
              </button>
            ))}
          </div>
          <div className="role-list">
            {filteredRoles.map((role) => {
              const roleUsers = users.filter((user) => user.roleCode === role.code).length
              return (
                <button
                  type="button"
                  key={role.code}
                  className={`role-list-item ${!creating && activeRole?.code === role.code ? 'selected' : ''}`}
                  onClick={() => selectRole(role.code)}
                >
                  <span className={`role-list-icon ${role.system ? 'built-in' : 'custom'}`}>
                    {role.system ? <ShieldCheck size={17} /> : <KeyRound size={17} />}
                  </span>
                  <span className="role-list-copy">
                    <b>{role.name}</b>
                    <small>
                      {role.code} <i /> {role.scope}
                    </small>
                    <span className="role-list-meta">
                      <span className={`role-status-dot ${role.status.toLowerCase()}`} />
                      {role.status}
                      <i />
                      {roleUsers} {roleUsers === 1 ? 'user' : 'users'}
                    </span>
                  </span>
                  <ChevronRight size={16} />
                </button>
              )
            })}
            {!filteredRoles.length && (
              <div className="role-list-empty">
                <Search size={19} />
                <b>No roles found</b>
                <span>Try a different search or status filter.</span>
              </div>
            )}
          </div>
          <button type="button" className="role-create-inline" onClick={beginCreate}>
            <Plus size={15} />
            Create a custom role
          </button>
        </section>
        <div className="role-editor-column">
          <form className="role-editor-card" onSubmit={save}>
            <div className="role-editor-heading">
              <span
                className={`role-editor-icon ${creating || !activeRole?.system ? 'custom' : 'built-in'}`}
              >
                {creating || !activeRole?.system ? (
                  <KeyRound size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
              </span>
              <div>
                <span className="role-editor-kicker">
                  {creating
                    ? 'NEW ACCESS PROFILE'
                    : activeRole?.system
                      ? 'BUILT-IN SECURITY ROLE'
                      : 'CUSTOM SECURITY ROLE'}
                </span>
                <h2>{creating ? 'Create a role' : activeRole?.name || 'Select a role'}</h2>
                <p>
                  {creating
                    ? 'Start with a clear name and choose the data scope.'
                    : `${activeRole?.code || ''} · ${assignedUsers.length} ${assignedUsers.length === 1 ? 'assigned user' : 'assigned users'}`}
                </p>
              </div>
              {activeRole && <UserStatusPill status={activeRole.status} />}
            </div>
            <div className="role-form-intro">
              <LockKeyholeIcon />
              <span>Role details</span>
              <small>Control where this role can access data.</small>
            </div>
            {error && (
              <p className="access-form-error" role="alert">
                {error}
              </p>
            )}
            <div className="role-editor-fields">
              <label>
                <span>
                  Role name <b>*</b>
                </span>
                <input
                  required
                  maxLength="70"
                  value={currentForm.name}
                  onChange={(event) => {
                    setForm({ ...currentForm, name: event.target.value })
                    setError('')
                  }}
                  placeholder="e.g. Regulatory Officer"
                />
                <small>Use a clear name that reflects the team's responsibilities.</small>
              </label>
              <label>
                <span>Data access scope</span>
                <select
                  value={currentForm.scope}
                  onChange={(event) => setForm({ ...currentForm, scope: event.target.value })}
                >
                  <option>Company-wide</option>
                  <option>Assigned branch</option>
                  <option>Assigned department</option>
                </select>
                <small>Defines which organization's records are in scope.</small>
              </label>
              <label className="role-field-full">
                <span>Role description</span>
                <textarea
                  rows="2"
                  maxLength="220"
                  value={currentForm.description}
                  onChange={(event) => setForm({ ...currentForm, description: event.target.value })}
                  placeholder="Describe this role's responsibilities."
                />
                <small>{(currentForm.description || '').length}/220 characters</small>
              </label>
            </div>
            <div className="role-editor-footer">
              <span>
                <Users size={14} />
                {assignedUsers.length} assigned users
              </span>
              <div>
                {activeRole && !activeRole.system && (
                  <>
                    <button
                      type="button"
                      className={
                        activeRole.status === 'Active' ? 'role-deactivate' : 'role-activate'
                      }
                      onClick={toggleRoleStatus}
                    >
                      <Power size={14} />
                      {activeRole.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="role-delete"
                      disabled={assignedUsers.length > 0}
                      title={
                        assignedUsers.length
                          ? 'Reassign users before deleting this role.'
                          : 'Delete role'
                      }
                      onClick={() => {
                        if (window.confirm(`Permanently delete the ${activeRole.name} role?`))
                          onDeleteRole(activeRole.code)
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </>
                )}
                <button type="submit" className="branch-save-button">
                  <Save size={15} />
                  {creating ? 'Create Role' : 'Save Role'}
                </button>
              </div>
            </div>
          </form>
          <section className="role-permission-preview">
            <div>
              <h3>
                <LockKeyholeIcon />
                Permission overview
              </h3>
              <p>Actions enabled across all ERP modules.</p>
            </div>
            <div className="role-preview-stats">
              {permissionCounts.map(({ action, count }) => (
                <span key={action}>
                  <b>{count}</b>
                  {action}
                </span>
              ))}
            </div>
          </section>
          <button
            type="button"
            className="access-inline-link role-matrix-link"
            onClick={() => onNavigate('Permission Matrix')}
          >
            <GridIcon />
            Open the full permission matrix
          </button>
        </div>
      </div>
      <div className="access-notice">
        <Info size={15} />
        Built-in roles cannot be deactivated. Reassign users before deactivating a custom role.
      </div>
    </div>
  )
}
