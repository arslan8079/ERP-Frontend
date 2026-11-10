const routes = [
  { page: 'Dealer Management', category: 'dashboard', slug: 'dealer-management' },
  { page: 'Dealer Dashboard', category: 'dashboard', slug: 'dealer-dashboard' },
  { page: 'Dealer List', category: 'dealer-management', slug: 'dealer-list' },
  { page: 'Add Dealer', category: 'dealer-management', slug: 'add-dealer' },
  { page: 'Dealer Profile', category: 'dealer-management', slug: 'dealer-profile' },
  { page: 'Dealer Verification', category: 'dealer-management', slug: 'dealer-verification' },
  { page: 'Dealer Categories', category: 'dealer-management', slug: 'dealer-categories' },
  { page: 'Dealer Reports', category: 'dealer-management', slug: 'dealer-reports' },
  { page: 'Sales Territories', category: 'territory-assignments', slug: 'sales-territories' },
  { page: 'Dealer Assignments', category: 'territory-assignments', slug: 'dealer-assignments' },
  {
    page: 'Sales Officer Assignments',
    category: 'territory-assignments',
    slug: 'sales-officer-assignments',
  },
  { page: 'Assignment History', category: 'territory-assignments', slug: 'assignment-history' },
  { page: 'Create Order', category: 'orders-management', slug: 'create-order' },
  { page: 'Order List', category: 'orders-management', slug: 'order-list' },
  { page: 'Pending Orders', category: 'orders-management', slug: 'pending-orders' },
  { page: 'Approval Queue', category: 'orders-management', slug: 'approval-queue' },
  { page: 'Order Details', category: 'orders-management', slug: 'order-details' },
  { page: 'Order History', category: 'orders-management', slug: 'order-history' },
  { page: 'Pending Dispatches', category: 'dispatch-returns', slug: 'pending-dispatches' },
  { page: 'Create Dispatch', category: 'dispatch-returns', slug: 'create-dispatch' },
  { page: 'Delivery Records', category: 'dispatch-returns', slug: 'delivery-records' },
  { page: 'Sales Returns', category: 'dispatch-returns', slug: 'sales-returns' },
  { page: 'Return Approvals', category: 'dispatch-returns', slug: 'return-approvals' },
  { page: 'Credit Limits', category: 'dealer-accounts', slug: 'credit-limits' },
  { page: 'Dealer Statements', category: 'dealer-accounts', slug: 'dealer-statements' },
  { page: 'Outstanding Balances', category: 'dealer-accounts', slug: 'outstanding-balances' },
  { page: 'Dealer Payments', category: 'dealer-accounts', slug: 'dealer-payments' },
  { page: 'Recovery History', category: 'dealer-accounts', slug: 'recovery-history' },
  { page: 'Dealer Sales Report', category: 'dealer-reports', slug: 'dealer-sales-report' },
  { page: 'Order Report', category: 'dealer-reports', slug: 'order-report' },
  { page: 'Outstanding Report', category: 'dealer-reports', slug: 'outstanding-report' },
  { page: 'Territory Sales', category: 'dealer-reports', slug: 'territory-sales' },
  { page: 'Dealer Performance', category: 'dealer-reports', slug: 'dealer-performance' },
]

export const dealerPageRoutes = new Map(
  routes.map(({ page, category, slug }) => [page, `/pages/dealer-management/${category}/${slug}`]),
)

const dealerPageByPath = new Map([...dealerPageRoutes].map(([page, path]) => [path, page]))

export const isDealerPage = (page) => dealerPageRoutes.has(page)

export const dealerPathForPage = (page) => dealerPageRoutes.get(page)

export const dealerPageForPath = (pathname) =>
  dealerPageByPath.get(pathname.replace(/\/+$/, '') || '/')
