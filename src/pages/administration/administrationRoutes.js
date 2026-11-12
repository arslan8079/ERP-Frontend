const routes = [
  { page: 'Dashboard', path: '/pages/administration/dashboard' },
  { page: 'Company Setup', category: 'company-management', slug: 'company-setup' },
  { page: 'Company Documents', category: 'company-management', slug: 'company-documents' },
  { page: 'Branch List', category: 'branches', slug: 'branch-list' },
  { page: 'Create Branch', category: 'branches', slug: 'create-branch' },
  { page: 'Edit Branch', category: 'branches', slug: 'edit-branch' },
  { page: 'Branch Details', category: 'branches', slug: 'branch-details' },
  { page: 'Branch Settings', category: 'branches', slug: 'branch-settings' },
  { page: 'Branch Reports', category: 'branches', slug: 'branch-reports' },
  { page: 'Department List', category: 'departments', slug: 'department-list' },
  { page: 'Create Department', category: 'departments', slug: 'create-department' },
  { page: 'Edit Department', category: 'departments', slug: 'edit-department' },
  { page: 'Department Details', category: 'departments', slug: 'department-details' },
  { page: 'Department Settings', category: 'departments', slug: 'department-settings' },
  { page: 'Assign Employees', category: 'departments', slug: 'assign-employees' },
  { page: 'Department Reports', category: 'departments', slug: 'department-reports' },
  { page: 'Users List', category: 'users-and-roles', slug: 'user-list' },
  { page: 'Create User', category: 'users-and-roles', slug: 'create-user' },
  { page: 'Edit User', category: 'users-and-roles', slug: 'edit-user' },
  { page: 'User Profile', category: 'users-and-roles', slug: 'user-profile' },
  { page: 'Roles Management', category: 'users-and-roles', slug: 'roles-management' },
  { page: 'Permission Matrix', category: 'users-and-roles', slug: 'permission-matrix' },
  { page: 'Login History', category: 'users-and-roles', slug: 'login-history' },
  { page: 'Pending Approvals', category: 'approval-management', slug: 'pending-approvals' },
  { page: 'Approval Rules', category: 'approval-management', slug: 'approval-rules' },
  { page: 'Approval History', category: 'approval-management', slug: 'approval-history' },
  { page: 'Delegation & Limits', category: 'approval-management', slug: 'delegation-limits' },
  { page: 'Company Settings', category: 'system-settings', slug: 'company-settings' },
  { page: 'General Settings', category: 'system-settings', slug: 'general-settings' },
  { page: 'Financial Year', category: 'system-settings', slug: 'financial-year' },
  { page: 'Document Numbering', category: 'system-settings', slug: 'document-numbering' },
  { page: 'Audit Logs', category: 'system-settings', slug: 'audit-logs' },
]

export const administrationPageRoutes = new Map(
  routes.map((route) => {
    const path = route.path || `/pages/administration/${route.category}/${route.slug}`
    return [route.page, path]
  }),
)

const administrationPageByPath = new Map(
  [...administrationPageRoutes].map(([page, path]) => [path, page]),
)

const administrationPageAliases = new Map([['Company Profile', 'Company Setup']])

export const isAdministrationPage = (page) =>
  administrationPageRoutes.has(page) || administrationPageAliases.has(page)

export const administrationPathForPage = (page) => {
  const canonicalPage = administrationPageAliases.get(page) || page
  return administrationPageRoutes.get(canonicalPage)
}

export const administrationPageForPath = (pathname) =>
  administrationPageByPath.get(pathname.replace(/\/+$/, '') || '/')
