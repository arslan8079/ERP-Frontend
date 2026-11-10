import { Building2, ClipboardCheck, GitBranch, Settings, UserCog, Users } from 'lucide-react'

export const administrationGroups = [
  { name: 'Company Management', icon: Building2, items: ['Company Profile', 'Company Documents'] },
  {
    name: 'Branches',
    icon: GitBranch,
    items: ['Branch List', 'Create Branch', 'Branch Details', 'Branch Settings', 'Branch Reports'],
  },
  {
    name: 'Departments',
    icon: Users,
    items: [
      'Department List',
      'Create Department',
      'Department Details',
      'Department Settings',
      'Assign Employees',
      'Department Reports',
    ],
  },
  {
    name: 'Users & Roles',
    icon: UserCog,
    items: [
      'Users List',
      'Create User',
      'User Profile',
      'Roles Management',
      'Permission Matrix',
      'Login History',
    ],
  },
  {
    name: 'Approval Management',
    icon: ClipboardCheck,
    items: ['Pending Approvals', 'Approval Rules', 'Approval History', 'Delegation & Limits'],
  },
  {
    name: 'System Settings',
    icon: Settings,
    items: [
      'Company Settings',
      'General Settings',
      'Financial Year',
      'Document Numbering',
      'Audit Logs',
    ],
  },
]
