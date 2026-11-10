export const financeGroups = [
  {
    title: 'Chart of Accounts',
    items: ['Account Groups', 'Create Ledger Account', 'Account Directory', 'Account Details'],
  },
  {
    title: 'Journal Entries',
    items: [
      'Create Journal Entry',
      'Draft Entries',
      'Posted Entries',
      'Reversals',
      'Journal Report',
    ],
  },
  {
    title: 'Cash & Bank',
    items: [
      'Cash Accounts',
      'Cash Receipts',
      'Cash Payments',
      'Bank Accounts',
      'Bank Transactions',
      'Bank Reconciliation',
    ],
  },
  {
    title: 'Receivables (Customers)',
    items: [
      'Customer Balances',
      'Outstanding Invoices',
      'Receive Payment',
      'Payment Allocation',
      'Aging Report',
    ],
  },
  {
    title: 'Payables (Suppliers)',
    items: [
      'Supplier Balances',
      'Supplier Bills',
      'Make Payment',
      'Outstanding Payables',
      'Payable Aging',
    ],
  },
  {
    title: 'Financial Reports',
    items: [
      'General Ledger',
      'Trial Balance',
      'Profit & Loss',
      'Balance Sheet',
      'Cash Flow',
      'Tax Reports',
    ],
  },
]

export const financePages = new Set([
  'Finance Dashboard',
  ...financeGroups.flatMap((group) => group.items),
])
