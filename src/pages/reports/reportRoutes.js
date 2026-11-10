const routes = [
  { page: 'Reports & Analytics', category: 'dashboard', slug: 'reports-analytics' },
  { page: 'Executive Overview', category: 'dashboard', slug: 'executive-overview' },
  { page: 'Sales Overview', category: 'dashboard', slug: 'sales-overview' },
  { page: 'Finance Overview', category: 'dashboard', slug: 'finance-overview' },
  { page: 'Inventory Overview', category: 'dashboard', slug: 'inventory-overview' },
  { page: 'HR Overview', category: 'dashboard', slug: 'hr-overview' },
  {
    page: 'Administration Reports',
    category: 'operational-reports',
    slug: 'administration-reports',
  },
  { page: 'HRM Reports', category: 'operational-reports', slug: 'hrm-reports' },
  { page: 'Payroll Reports', category: 'operational-reports', slug: 'payroll-reports' },
  { page: 'Finance Reports', category: 'operational-reports', slug: 'finance-reports' },
  { page: 'Inventory Reports', category: 'operational-reports', slug: 'inventory-reports' },
  { page: 'Dealer Reports', category: 'operational-reports', slug: 'dealer-reports' },
  { page: 'Saved Reports', category: 'report-management', slug: 'saved-reports' },
  { page: 'Report Filters', category: 'report-management', slug: 'report-filters' },
  { page: 'Scheduled Reports', category: 'report-management', slug: 'scheduled-reports' },
  { page: 'Export History', category: 'report-management', slug: 'export-history' },
  { page: 'Activity Reports', category: 'audit-analysis', slug: 'activity-reports' },
  { page: 'Approval Reports', category: 'audit-analysis', slug: 'approval-reports' },
  { page: 'Transaction Analysis', category: 'audit-analysis', slug: 'transaction-analysis' },
  { page: 'Comparative Reports', category: 'audit-analysis', slug: 'comparative-reports' },
  { page: 'Data Audit Logs', category: 'audit-analysis', slug: 'data-audit-logs' },
]

export const reportPageRoutes = new Map(
  routes.map(({ page, category, slug }) => [page, `/pages/reports/${category}/${slug}`]),
)

const reportPageByPath = new Map([...reportPageRoutes].map(([page, path]) => [path, page]))

export const isReportPage = (page) => reportPageRoutes.has(page)

export const reportPathForPage = (page) => reportPageRoutes.get(page)

export const reportPageForPath = (pathname) =>
  reportPageByPath.get(pathname.replace(/\/+$/, '') || '/')
