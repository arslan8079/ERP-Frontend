export const payrollGroups = [
  {
    title: 'Salary Configuration',
    items: [
      'Salary Structures',
      'Create Salary Structure',
      'Allowances & Deductions',
      'Employee Salary Assignment',
    ],
  },
  {
    title: 'Payroll Processing',
    items: [
      'Payroll Periods',
      'Generate Payroll',
      'Payroll Drafts',
      'Review & Approval',
      'Finalize Payroll',
      'Payroll History',
    ],
  },
  {
    title: 'Salary Payments',
    items: ['Pending Salaries', 'Process Payments', 'Payment Records', 'Salary Slips'],
  },
  {
    title: 'Advances & Loans',
    items: ['Advance Requests', 'Approve Advances', 'Loan Records', 'Installment Recovery'],
  },
  {
    title: 'Payroll Reports',
    items: [
      'Monthly Payroll Report',
      'Salary Register',
      'Deductions Report',
      'Payment Summary',
      'Employee Salary History',
    ],
  },
]

export const payrollPages = new Set([
  'Payroll Dashboard',
  ...payrollGroups.flatMap((group) => group.items),
])
