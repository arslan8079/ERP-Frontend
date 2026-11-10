const routes = [
  { page: 'Finance Dashboard', category: 'dashboard', slug: 'finance-dashboard' },
  { page: 'Account Groups', category: 'chart-of-accounts', slug: 'account-groups' },
  { page: 'Create Ledger Account', category: 'chart-of-accounts', slug: 'create-ledger-account' },
  { page: 'Account Directory', category: 'chart-of-accounts', slug: 'account-directory' },
  { page: 'Account Details', category: 'chart-of-accounts', slug: 'account-details' },
  { page: 'Create Journal Entry', category: 'journal-entries', slug: 'create-journal-entry' },
  { page: 'Draft Entries', category: 'journal-entries', slug: 'draft-entries' },
  { page: 'Posted Entries', category: 'journal-entries', slug: 'posted-entries' },
  { page: 'Reversals', category: 'journal-entries', slug: 'reversals' },
  { page: 'Journal Report', category: 'journal-entries', slug: 'journal-report' },
  { page: 'Cash Accounts', category: 'cash-bank', slug: 'cash-accounts' },
  { page: 'Cash Receipts', category: 'cash-bank', slug: 'cash-receipts' },
  { page: 'Cash Payments', category: 'cash-bank', slug: 'cash-payments' },
  { page: 'Bank Accounts', category: 'cash-bank', slug: 'bank-accounts' },
  { page: 'Bank Transactions', category: 'cash-bank', slug: 'bank-transactions' },
  { page: 'Bank Reconciliation', category: 'cash-bank', slug: 'bank-reconciliation' },
  { page: 'Customer Balances', category: 'receivables-customers', slug: 'customer-balances' },
  { page: 'Outstanding Invoices', category: 'receivables-customers', slug: 'outstanding-invoices' },
  { page: 'Receive Payment', category: 'receivables-customers', slug: 'receive-payment' },
  { page: 'Payment Allocation', category: 'receivables-customers', slug: 'payment-allocation' },
  { page: 'Aging Report', category: 'receivables-customers', slug: 'aging-report' },
  { page: 'Supplier Balances', category: 'payables-suppliers', slug: 'supplier-balances' },
  { page: 'Supplier Bills', category: 'payables-suppliers', slug: 'supplier-bills' },
  { page: 'Make Payment', category: 'payables-suppliers', slug: 'make-payment' },
  { page: 'Outstanding Payables', category: 'payables-suppliers', slug: 'outstanding-payables' },
  { page: 'Payable Aging', category: 'payables-suppliers', slug: 'payable-aging' },
  { page: 'General Ledger', category: 'financial-reports', slug: 'general-ledger' },
  { page: 'Trial Balance', category: 'financial-reports', slug: 'trial-balance' },
  { page: 'Profit & Loss', category: 'financial-reports', slug: 'profit-loss' },
  { page: 'Balance Sheet', category: 'financial-reports', slug: 'balance-sheet' },
  { page: 'Cash Flow', category: 'financial-reports', slug: 'cash-flow' },
  { page: 'Tax Reports', category: 'financial-reports', slug: 'tax-reports' },
]

export const financePageRoutes = new Map(
  routes.map(({ page, category, slug }) => [page, `/pages/finance/${category}/${slug}`]),
)

const financePageByPath = new Map([...financePageRoutes].map(([page, path]) => [path, page]))

export const isFinancePage = (page) => financePageRoutes.has(page)

export const financePathForPage = (page) => financePageRoutes.get(page)

export const financePageForPath = (pathname) =>
  financePageByPath.get(pathname.replace(/\/+$/, '') || '/')
