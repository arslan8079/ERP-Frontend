const routes = [
  { page: 'Payroll Dashboard', category: 'dashboard', slug: 'payroll-dashboard' },
  { page: 'Salary Structures', category: 'salary-configuration', slug: 'salary-structures' },
  {
    page: 'Create Salary Structure',
    category: 'salary-configuration',
    slug: 'create-salary-structure',
  },
  {
    page: 'Allowances & Deductions',
    category: 'salary-configuration',
    slug: 'allowances-deductions',
  },
  {
    page: 'Employee Salary Assignment',
    category: 'salary-configuration',
    slug: 'employee-salary-assignment',
  },
  { page: 'Payroll Periods', category: 'payroll-processing', slug: 'payroll-periods' },
  { page: 'Generate Payroll', category: 'payroll-processing', slug: 'generate-payroll' },
  { page: 'Payroll Drafts', category: 'payroll-processing', slug: 'payroll-drafts' },
  { page: 'Review & Approval', category: 'payroll-processing', slug: 'review-approval' },
  { page: 'Finalize Payroll', category: 'payroll-processing', slug: 'finalize-payroll' },
  { page: 'Payroll History', category: 'payroll-processing', slug: 'payroll-history' },
  { page: 'Pending Salaries', category: 'salary-payments', slug: 'pending-salaries' },
  { page: 'Process Payments', category: 'salary-payments', slug: 'process-payments' },
  { page: 'Payment Records', category: 'salary-payments', slug: 'payment-records' },
  { page: 'Salary Slips', category: 'salary-payments', slug: 'salary-slips' },
  { page: 'Advance Requests', category: 'advances-loans', slug: 'advance-requests' },
  { page: 'Approve Advances', category: 'advances-loans', slug: 'approve-advances' },
  { page: 'Loan Records', category: 'advances-loans', slug: 'loan-records' },
  { page: 'Installment Recovery', category: 'advances-loans', slug: 'installment-recovery' },
  { page: 'Monthly Payroll Report', category: 'payroll-reports', slug: 'monthly-payroll-report' },
  { page: 'Salary Register', category: 'payroll-reports', slug: 'salary-register' },
  { page: 'Deductions Report', category: 'payroll-reports', slug: 'deductions-report' },
  { page: 'Payment Summary', category: 'payroll-reports', slug: 'payment-summary' },
  { page: 'Employee Salary History', category: 'payroll-reports', slug: 'employee-salary-history' },
]

export const payrollPageRoutes = new Map(
  routes.map(({ page, category, slug }) => [page, `/pages/payroll/${category}/${slug}`]),
)

const payrollPageByPath = new Map([...payrollPageRoutes].map(([page, path]) => [path, page]))

export const isPayrollPage = (page) => payrollPageRoutes.has(page)

export const payrollPathForPage = (page) => payrollPageRoutes.get(page)

export const payrollPageForPath = (pathname) =>
  payrollPageByPath.get(pathname.replace(/\/+$/, '') || '/')
