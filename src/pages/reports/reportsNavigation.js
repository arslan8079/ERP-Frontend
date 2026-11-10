export const reportGroups = [
  {
    title: 'Dashboard Analytics',
    items: [
      'Executive Overview',
      'Sales Overview',
      'Finance Overview',
      'Inventory Overview',
      'HR Overview',
    ],
  },
  {
    title: 'Operational Reports',
    items: [
      'Administration Reports',
      'HRM Reports',
      'Payroll Reports',
      'Finance Reports',
      'Inventory Reports',
      'Dealer Reports',
    ],
  },
  {
    title: 'Report Management',
    items: ['Saved Reports', 'Report Filters', 'Scheduled Reports', 'Export History'],
  },
  {
    title: 'Audit & Analysis',
    items: [
      'Activity Reports',
      'Approval Reports',
      'Transaction Analysis',
      'Comparative Reports',
      'Data Audit Logs',
    ],
  },
]

export const reportPages = new Set([
  'Reports & Analytics',
  ...reportGroups.flatMap((group) => group.items),
])
