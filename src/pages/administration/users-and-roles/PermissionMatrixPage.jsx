import { useState, Fragment } from 'react'
import { accessPermissionGroups, accessActions, GridIcon, UserStatusPill } from '../../../App.jsx'
import fieldBanner from '../../../field-banner.svg'
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  LayoutDashboard,
  KeyRound,
  Folder,
  Info,
} from 'lucide-react'

export default function PermissionMatrixPage({ roles, users, onUpdateRole }) {
  const [selectedRoleCode, setSelectedRoleCode] = useState(roles[0]?.code || '')
  const role = roles.find((item) => item.code === selectedRoleCode) || roles[0]
  const permissionValue = (module, action) => Boolean(role?.permissions?.[module]?.[action])
  const togglePermission = (module, action, checked) => {
    if (!role) return
    const permissions = Object.fromEntries(
      accessPermissionGroups
        .flatMap((group) => group.modules)
        .map((name) => [
          name,
          Object.fromEntries(
            accessActions.map((permission) => [permission, permissionValue(name, permission)]),
          ),
        ]),
    )
    permissions[module][action] = checked
    onUpdateRole(role.code, { permissions }, 'Role permission matrix updated')
  }
  const setModuleAccess = (module, enabled) => {
    if (!role) return
    const permissions = Object.fromEntries(
      accessPermissionGroups
        .flatMap((group) => group.modules)
        .map((name) => [
          name,
          Object.fromEntries(
            accessActions.map((action) => [
              action,
              name === module ? enabled : permissionValue(name, action),
            ]),
          ),
        ]),
    )
    onUpdateRole(role.code, { permissions }, `Permissions changed · ${module}`)
  }
  const allEnabled = (module) => accessActions.every((action) => permissionValue(module, action))
  const moduleEnabledCount = (module) =>
    accessActions.filter((action) => permissionValue(module, action)).length
  const moduleCount = accessPermissionGroups.reduce(
    (total, group) => total + group.modules.length,
    0,
  )
  const enabledCount = accessPermissionGroups.reduce(
    (total, group) =>
      total + group.modules.reduce((count, module) => count + moduleEnabledCount(module), 0),
    0,
  )
  const assignedUsers = users.filter((user) => user.roleCode === role?.code).length

  return (
    <div className="branch-list-page access-page permission-matrix-page">
      <header className="branch-list-banner access-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <GridIcon />
          <div>
            <h1>Permission Matrix</h1>
            <p>Configure precise access for every module and role</p>
          </div>
        </div>
      </header>
      <section className="permission-matrix-toolbar">
        <div className="permission-role-context">
          <span className="permission-role-icon">
            <ShieldCheck size={21} />
          </span>
          <div>
            <small>PERMISSIONS FOR</small>
            <b>{role?.name || 'No role selected'}</b>
            <span>{role?.description || 'Choose a role to view its access profile.'}</span>
          </div>
        </div>
        <label>
          <span>Security role</span>
          <select
            value={role?.code || ''}
            onChange={(event) => setSelectedRoleCode(event.target.value)}
          >
            {roles.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} · {item.status}
              </option>
            ))}
          </select>
        </label>
        {role && (
          <div className="permission-role-badges">
            <UserStatusPill status={role.status} />
            <span>
              <Users size={14} />
              {assignedUsers} assigned
            </span>
          </div>
        )}
      </section>
      {role?.status === 'Inactive' && (
        <div className="access-notice">
          <AlertTriangle size={15} />
          This role is inactive and cannot be assigned to new users.
        </div>
      )}
      <section className="permission-overview" aria-label="Permission overview">
        <article>
          <span className="permission-overview-icon green">
            <LayoutDashboard size={18} />
          </span>
          <div>
            <small>Modules</small>
            <b>{moduleCount}</b>
          </div>
        </article>
        <article>
          <span className="permission-overview-icon blue">
            <KeyRound size={18} />
          </span>
          <div>
            <small>Granted actions</small>
            <b>
              {enabledCount} <i>/ {moduleCount * accessActions.length}</i>
            </b>
          </div>
        </article>
        <article>
          <span className="permission-overview-icon purple">
            <Users size={18} />
          </span>
          <div>
            <small>Assigned users</small>
            <b>{assignedUsers}</b>
          </div>
        </article>
      </section>
      <section className="permission-matrix-card">
        <div className="permission-matrix-heading">
          <div>
            <span className="permission-matrix-heading-icon">
              <GridIcon />
            </span>
            <div>
              <h2>Module permissions</h2>
              <p>Toggle individual actions, or select all actions for a module.</p>
            </div>
          </div>
          <span className="permission-live-note">
            <i />
            Changes save automatically
          </span>
        </div>
        <div className="permission-matrix-scroll">
          <table className="permission-matrix-table">
            <thead>
              <tr>
                <th>ERP MODULE</th>
                {accessActions.map((action) => (
                  <th key={action}>
                    <span className={`permission-action-label ${action}`}>{action}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accessPermissionGroups.map((group) => (
                <Fragment key={group.name}>
                  <tr className="permission-group-row">
                    <th colSpan={accessActions.length + 1}>
                      <span>
                        <Folder size={15} />
                        {group.name}
                      </span>
                      <small>
                        {group.modules.length} {group.modules.length === 1 ? 'module' : 'modules'}
                      </small>
                    </th>
                  </tr>
                  {group.modules.map((module) => (
                    <tr key={module}>
                      <td>
                        <span className="permission-module-name">
                          <span>
                            <b>{module}</b>
                            <small>
                              {moduleEnabledCount(module)} of {accessActions.length} actions enabled
                            </small>
                          </span>
                          <button
                            type="button"
                            onClick={() => setModuleAccess(module, !allEnabled(module))}
                          >
                            {allEnabled(module) ? 'Clear all' : 'Select all'}
                          </button>
                        </span>
                      </td>
                      {accessActions.map((action) => (
                        <td key={action}>
                          <label className="permission-toggle" aria-label={`${action} ${module}`}>
                            <input
                              type="checkbox"
                              checked={permissionValue(module, action)}
                              onChange={(event) =>
                                togglePermission(module, action, event.target.checked)
                              }
                            />
                            <span />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="permission-matrix-footer">
          <span>
            <Info size={15} />
            Delete access should be granted sparingly; approval is separate from edit access.
          </span>
          <span>
            {enabledCount} permissions enabled for {role?.name || 'this role'}
          </span>
        </div>
      </section>
    </div>
  )
}
