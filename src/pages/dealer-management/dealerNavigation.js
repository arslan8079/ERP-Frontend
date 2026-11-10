export const dealerGroups = [
  {
    title: 'Dealer Management',
    items: [
      'Dealer List',
      'Add Dealer',
      'Dealer Profile',
      'Dealer Verification',
      'Dealer Categories',
      'Dealer Reports',
    ],
  },
  {
    title: 'Territory & Assignments',
    items: [
      'Sales Territories',
      'Dealer Assignments',
      'Sales Officer Assignments',
      'Assignment History',
    ],
  },
  {
    title: 'Orders Management',
    items: [
      'Create Order',
      'Order List',
      'Pending Orders',
      'Approval Queue',
      'Order Details',
      'Order History',
    ],
  },
  {
    title: 'Dispatch & Returns',
    items: [
      'Pending Dispatches',
      'Create Dispatch',
      'Delivery Records',
      'Sales Returns',
      'Return Approvals',
    ],
  },
  {
    title: 'Dealer Accounts',
    items: [
      'Credit Limits',
      'Dealer Statements',
      'Outstanding Balances',
      'Dealer Payments',
      'Recovery History',
    ],
  },
  {
    title: 'Dealer Reports',
    items: [
      'Dealer Sales Report',
      'Order Report',
      'Outstanding Report',
      'Territory Sales',
      'Dealer Performance',
    ],
  },
]

export const dealerPages = new Set([
  'Dealer Management',
  'Dealer Dashboard',
  ...dealerGroups.flatMap((group) => group.items),
])
