const routes = [
  { page: 'Human Resource Dashboard', category: 'dashboard', slug: 'human-resource-dashboard' },
  { page: 'Employee Directory', category: 'employee-management', slug: 'employee-directory' },
  { page: 'Add Employee', category: 'employee-management', slug: 'add-employee' },
  { page: 'Edit Employee', category: 'employee-management', slug: 'edit-employee' },
  { page: 'Employee Profile', category: 'employee-management', slug: 'employee-profile' },
  { page: 'Employee Documents', category: 'employee-management', slug: 'employee-documents' },
  { page: 'Transfers & Promotions', category: 'employee-management', slug: 'transfers-promotions' },
  { page: 'Employee Reports', category: 'employee-management', slug: 'employee-reports' },
  { page: 'Daily Attendance', category: 'attendance', slug: 'daily-attendance' },
  { page: 'Mark Attendance', category: 'attendance', slug: 'mark-attendance' },
  { page: 'Attendance Corrections', category: 'attendance', slug: 'attendance-corrections' },
  { page: 'Shift Assignments', category: 'attendance', slug: 'shift-assignments' },
  { page: 'Attendance Reports', category: 'attendance', slug: 'attendance-reports' },
  { page: 'Leave Types', category: 'leave-management', slug: 'leave-types' },
  { page: 'Leave Requests', category: 'leave-management', slug: 'leave-requests' },
  { page: 'Apply for Leave', category: 'leave-management', slug: 'apply-for-leave' },
  { page: 'Leave Approvals', category: 'leave-management', slug: 'leave-approvals' },
  { page: 'Leave Balances', category: 'leave-management', slug: 'leave-balances' },
  { page: 'Leave Reports', category: 'leave-management', slug: 'leave-reports' },
  { page: 'Shift List', category: 'shifts-scheduling', slug: 'shift-list' },
  { page: 'Create Shift', category: 'shifts-scheduling', slug: 'create-shift' },
  { page: 'Employee Rosters', category: 'shifts-scheduling', slug: 'employee-rosters' },
  { page: 'Shift Reports', category: 'shifts-scheduling', slug: 'shift-reports' },
  { page: 'Performance Reviews', category: 'performance-management', slug: 'performance-reviews' },
  {
    page: 'Employee Evaluations',
    category: 'performance-management',
    slug: 'employee-evaluations',
  },
  { page: 'Goals & KPIs', category: 'performance-management', slug: 'goals-kpis' },
  { page: 'Performance Reports', category: 'performance-management', slug: 'performance-reports' },
]

export const humanResourcePageRoutes = new Map(
  routes.map(({ page, category, slug }) => [page, `/pages/human-resource/${category}/${slug}`]),
)

const humanResourcePageByPath = new Map(
  [...humanResourcePageRoutes].map(([page, path]) => [path, page]),
)

export const isHumanResourcePage = (page) => humanResourcePageRoutes.has(page)

export const humanResourcePathForPage = (page) => humanResourcePageRoutes.get(page)

export const humanResourcePageForPath = (pathname) =>
  humanResourcePageByPath.get(pathname.replace(/\/+$/, '') || '/')
