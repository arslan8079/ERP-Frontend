import CompanyDocumentsPage from './pages/administration/company-management/CompanyDocumentsPage.jsx'
import UsersListPage from './pages/administration/users-and-roles/UsersListPage.jsx'
import CreateUserPage from './pages/administration/users-and-roles/CreateUserPage.jsx'
import UserProfilePage from './pages/administration/users-and-roles/UserProfilePage.jsx'
import RolesManagementPage from './pages/administration/users-and-roles/RolesManagementPage.jsx'
import PermissionMatrixPage from './pages/administration/users-and-roles/PermissionMatrixPage.jsx'
import LoginHistoryPage from './pages/administration/users-and-roles/LoginHistoryPage.jsx'
import ApprovalPendingPage from './pages/administration/approval-management/ApprovalPendingPage.jsx'
import ApprovalRulesPage from './pages/administration/approval-management/ApprovalRulesPage.jsx'
import ApprovalHistoryPage from './pages/administration/approval-management/ApprovalHistoryPage.jsx'
import DelegationLimitsPage from './pages/administration/approval-management/DelegationLimitsPage.jsx'
import DepartmentListPage from './pages/administration/departments/DepartmentListPage.jsx'
import CreateDepartmentPage from './pages/administration/departments/CreateDepartmentPage.jsx'
import DepartmentDetailsPage from './pages/administration/departments/DepartmentDetailsPage.jsx'
import AssignEmployeesPage from './pages/administration/departments/AssignEmployeesPage.jsx'
import DepartmentSettingsPage from './pages/administration/departments/DepartmentSettingsPage.jsx'
import DepartmentReportsPage from './pages/administration/departments/DepartmentReportsPage.jsx'
import BranchReportsPage from './pages/administration/branches/BranchReportsPage.jsx'
import BranchListPage from './pages/administration/branches/BranchListPage.jsx'
import BranchDetailsPage from './pages/administration/branches/BranchDetailsPage.jsx'
import BranchSettingsPage from './pages/administration/branches/BranchSettingsPage.jsx'
import CreateBranchPage from './pages/administration/branches/CreateBranchPage.jsx'
import CompanySetupPage from './pages/administration/company-management/CompanySetupPage.jsx'
import CompanySettingsPage from './pages/administration/system-settings/CompanySettingsPage.jsx'
import SystemGeneralSettingsPage from './pages/administration/system-settings/SystemGeneralSettingsPage.jsx'
import FinancialYearPage from './pages/administration/system-settings/FinancialYearPage.jsx'
import DocumentNumberingPage from './pages/administration/system-settings/DocumentNumberingPage.jsx'
import SystemAuditLogsPage from './pages/administration/system-settings/SystemAuditLogsPage.jsx'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  Banknote,
  Boxes,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Database,
  Factory,
  FileBarChart,
  FileCheck2,
  FilePlus2,
  FileText,
  FlaskConical,
  Folder,
  GitBranch,
  Handshake,
  KeyRound,
  Leaf,
  LayoutDashboard,
  Landmark,
  MapPin,
  Menu,
  Network,
  PackagePlus,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  ShieldCheck,
  Truck,
  UserCog,
  UserPlus,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import fieldBanner from './field-banner.svg'
import { administrationGroups } from './pages/administration/administrationNavigation.js'
import { pageIconFor } from './navigation/pageIcons.js'
import {
  humanResourceGroups,
  humanResourcePages,
} from './pages/human-resource/humanResourceNavigation.js'
import { payrollGroups, payrollPages } from './pages/payroll/payrollNavigation'
import { financeGroups, financePages } from './pages/finance/financeNavigation'
import { inventoryGroups, inventoryPages } from './pages/inventory/inventoryNavigation'
import { dealerGroups, dealerPages } from './pages/dealer-management/dealerNavigation'
import { reportGroups, reportPages } from './pages/reports/reportsNavigation'
import {
  administrationPageForPath,
  administrationPathForPage,
  isAdministrationPage,
} from './pages/administration/administrationRoutes'
import {
  humanResourcePageForPath,
  humanResourcePathForPage,
  isHumanResourcePage,
} from './pages/human-resource/humanResourceRoutes'
import {
  isPayrollPage,
  payrollPageForPath,
  payrollPathForPage,
} from './pages/payroll/payrollRoutes'
import {
  financePageForPath,
  financePathForPage,
  isFinancePage,
} from './pages/finance/financeRoutes'
import {
  inventoryPageForPath,
  inventoryPathForPage,
  isInventoryPage,
} from './pages/inventory/inventoryRoutes'
import {
  dealerPageForPath,
  dealerPathForPage,
  isDealerPage,
} from './pages/dealer-management/dealerRoutes'
import { isReportPage, reportPageForPath, reportPathForPage } from './pages/reports/reportRoutes'
const HumanResourceModule = lazy(() => import('./pages/human-resource/HumanResource'))
const PayrollModule = lazy(() => import('./pages/payroll/Payroll'))
const FinanceModule = lazy(() => import('./pages/finance/Finance'))
const InventoryModule = lazy(() => import('./pages/inventory/Inventory'))
const DealerModule = lazy(() => import('./pages/dealer-management/Dealer'))
const ReportsModule = lazy(() => import('./pages/reports/Reports'))
const navItems = [
  'Administration',
  'Human Resource',
  'Payroll',
  'Finance & Accounting',
  'Inventory & Warehouse',
  'Dealer Management',
  'Reports & Analytics',
]
const dashboardTab = 'Dashboard'
const isAppPage = (name) =>
  name === 'Company Setup' ||
  administrationGroups.some((group) => group.items.includes(name)) ||
  isAdministrationPage(name) ||
  isHumanResourcePage(name) ||
  isPayrollPage(name) ||
  isFinancePage(name) ||
  isInventoryPage(name) ||
  isDealerPage(name) ||
  isReportPage(name) ||
  humanResourcePages.has(name) ||
  payrollPages.has(name) ||
  financePages.has(name) ||
  inventoryPages.has(name) ||
  dealerPages.has(name) ||
  reportPages.has(name)
const isRoutablePage = (name) => name === dashboardTab || isAppPage(name) || navItems.includes(name)
const pagePath = (name, moduleName) => {
  if (name === 'Dealer Reports' && moduleName === 'Reports & Analytics') {
    return reportPathForPage(name)
  }
  if (name === 'Dealer Reports' && moduleName === 'Dealer Management') {
    return dealerPathForPage(name)
  }
  return (
    administrationPathForPage(name) ||
    humanResourcePathForPage(name) ||
    payrollPathForPage(name) ||
    financePathForPage(name) ||
    inventoryPathForPage(name) ||
    dealerPathForPage(name) ||
    reportPathForPage(name) ||
    `/pages/${encodeURIComponent(name)}`
  )
}
const pageFromPath = (pathname, fallbackPage) => {
  if (pathname === '/') return fallbackPage
  const administrationPage = administrationPageForPath(pathname)
  if (administrationPage) return administrationPage
  const humanResourcePage = humanResourcePageForPath(pathname)
  if (humanResourcePage) return humanResourcePage
  const payrollPage = payrollPageForPath(pathname)
  if (payrollPage) return payrollPage
  const financePage = financePageForPath(pathname)
  if (financePage) return financePage
  const inventoryPage = inventoryPageForPath(pathname)
  if (inventoryPage) return inventoryPage
  const dealerPage = dealerPageForPath(pathname)
  if (dealerPage) return dealerPage
  const reportPage = reportPageForPath(pathname)
  if (reportPage) return reportPage
  const match = pathname.match(/^\/pages\/(.+)$/)
  if (!match) return null
  try {
    const name = decodeURIComponent(match[1])
    return isRoutablePage(name) ? name : null
  } catch {
    return null
  }
}
const dashboardActionPages = {
  'New Order': 'Create Order',
  Purchase: 'Supplier Bills',
  'Goods Receipt': 'Stock In (GRN)',
  Dispatch: 'Pending Dispatches',
  Payment: 'Dealer Payments',
  Receipt: 'Cash Receipts',
  'Stock View': 'Warehouse Stock',
  'Dealer List': 'Dealer List',
  Reports: 'Executive Overview',
  'User Management': 'Users List',
  'System Settings': 'General Settings',
  'Add Company': 'Company Setup',
  'Add Branch': 'Create Branch',
  'Create User': 'Create User',
  'Manage Roles': 'Roles Management',
  'Approval Setup': 'Approval Rules',
  'Approval Queue': 'Pending Approvals',
}
const ribbonActions = [
  { label: 'Dashboard', icon: LayoutDashboard, tint: 'green', section: 'Quick Access' },
  { label: 'New Order', icon: FilePlus2, tint: 'blue', section: 'Quick Access', action: true },
  { label: 'Purchase', icon: ShoppingCart, tint: 'green', section: 'Quick Access', action: true },
  { label: 'Production', icon: Factory, tint: 'red', section: 'Transactions', action: true },
  {
    label: 'Goods Receipt',
    icon: PackagePlus,
    tint: 'orange',
    section: 'Transactions',
    action: true,
  },
  { label: 'Dispatch', icon: Truck, tint: 'blue', section: 'Transactions', action: true },
  { label: 'Payment', icon: Database, tint: 'orange', section: 'Inventory', action: true },
  { label: 'Receipt', icon: FileCheck2, tint: 'blue', section: 'Inventory', action: true },
  { label: 'Stock View', icon: Boxes, tint: 'orange', section: 'Inventory', action: true },
  { label: 'Dealer List', icon: Users, tint: 'red', section: 'Finance', action: true },
  { label: 'Reports', icon: FileBarChart, tint: 'blue', section: 'Reports', action: true },
  {
    label: 'User Management',
    icon: UserCog,
    tint: 'blue',
    section: 'Administration',
    action: true,
  },
  {
    label: 'System Settings',
    icon: Settings,
    tint: 'blue',
    section: 'Administration',
    action: true,
  },
]
const kpis = [
  { label: 'Total Companies', value: '3', icon: Building2, color: 'green', page: 'Company Setup' },
  { label: 'Total Branches', value: '12', icon: Network, color: 'purple', page: 'Branch List' },
  { label: 'Active Users', value: '47', icon: Users, color: 'green', page: 'Users List' },
  {
    label: 'Pending Approvals',
    value: '18',
    icon: ClipboardCheck,
    color: 'orange',
    page: 'Pending Approvals',
  },
  {
    label: 'Inventory Alerts',
    value: '7',
    icon: AlertTriangle,
    color: 'red',
    page: 'Near Expiry Stock',
  },
  {
    label: 'Dealer Credit Alerts',
    value: '5',
    icon: Building2,
    color: 'sky',
    page: 'Outstanding Balances',
  },
  {
    label: "Today's Transactions",
    value: '126',
    change: '↑ +22%',
    icon: ArrowRight,
    color: 'green',
    page: 'Transaction Analysis',
  },
]
const activities = [
  {
    date: '26-Nov-2026 10:42',
    user: 'admin',
    icon: UserPlus,
    color: 'blue',
    activity: 'User Created',
    details: 'New user "QC_Manager" (QC Role)',
  },
  {
    date: '26-Nov-2026 10:18',
    user: 'admin',
    icon: Check,
    color: 'green',
    activity: 'Approval',
    details: 'Purchase Order PO-2026-009 Approved',
  },
  {
    date: '26-Nov-2026 09:56',
    user: 'system',
    icon: AlertTriangle,
    color: 'orange',
    activity: 'Stock Alert',
    details: 'Batch EXP-24-107 near expiry (4 days)',
  },
  {
    date: '26-Nov-2026 09:40',
    user: 'admin',
    icon: Settings,
    color: 'blue',
    activity: 'Settings Update',
    details: 'Approval workflow updated (Purchase)',
  },
  {
    date: '26-Nov-2026 09:15',
    user: 'admin',
    icon: Building2,
    color: 'blue',
    activity: 'Company Setup',
    details: 'New branch "Ludhiana" added',
  },
]
const adminAlerts = [
  {
    icon: AlertTriangle,
    color: 'red',
    text: '3 batches near expiry (≤ 30 days)',
    page: 'Near Expiry Stock',
  },
  {
    icon: AlertTriangle,
    color: 'orange',
    text: 'Low stock: Cypermethrin 25EC (50 L remaining)',
    page: 'Low Stock Report',
  },
  {
    icon: Users,
    color: 'blue',
    text: '5 dealer accounts exceed credit limit',
    page: 'Outstanding Balances',
  },
  {
    icon: CalendarDays,
    color: 'blue',
    text: '2 purchase approvals pending > 2 days',
    page: 'Pending Approvals',
  },
  {
    icon: FlaskConical,
    color: 'red',
    text: 'QC: 1 batch failed quality (Batch: QC-24-118)',
    page: 'Batch Register',
  },
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [systemData, setSystemData] = useState(loadSystemData)
  const initialLandingPage = systemData.general.defaultLandingPage
  const [activeNav, setActiveNav] = useState('Administration')
  const [openTabs, setOpenTabs] = useState(() => [...new Set([dashboardTab, initialLandingPage])])
  const [activeTab, setActiveTab] = useState(
    () => pageFromPath(window.location.pathname, initialLandingPage) || initialLandingPage,
  )
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(administrationGroups.map((group) => [group.name, true])),
  )
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [modal, setModal] = useState('')
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [companyPageDirty, setCompanyPageDirty] = useState(false)
  const [branches, setBranches] = useState(initialBranches)
  const [selectedBranchCode, setSelectedBranchCode] = useState(initialBranches[0].code)
  const [departments, setDepartments] = useState(initialDepartments)
  const [employees, setEmployees] = useState(loadEmployees)
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState(initialDepartments[0].code)
  const [accessData, setAccessData] = useState(loadAccessData)
  const [approvalData, setApprovalData] = useState(loadApprovalData)
  const [selectedUserId, setSelectedUserId] = useState(() => initialAccessData.users[0].id)
  const [selectedRoleCode, setSelectedRoleCode] = useState(() => initialAccessData.roles[0].code)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  useEffect(() => {
    if (!companyPageDirty) return undefined
    const warnBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [companyPageDirty])
  const canLeaveCompanyPage = (nextTab) => {
    if (activeTab !== 'Company Setup' || nextTab === activeTab || !companyPageDirty) return true
    return window.confirm('You have unsaved company changes. Leave without saving?')
  }
  useEffect(() => {
    const nextTab = pageFromPath(location.pathname, initialLandingPage)
    if (!nextTab) {
      navigate(pagePath(activeTab || initialLandingPage), { replace: true })
      return
    }
    if (nextTab === activeTab) {
      setOpenTabs((tabs) => (tabs.includes(nextTab) ? tabs : [...tabs, nextTab]))
      setActiveNav(moduleForPage(nextTab, location.pathname))
      return
    }
    if (!canLeaveCompanyPage(nextTab)) {
      navigate(pagePath(activeTab), { replace: true })
      return
    }
    if (activeTab === 'Company Setup') setCompanyPageDirty(false)
    setOpenTabs((tabs) => (tabs.includes(nextTab) ? tabs : [...tabs, nextTab]))
    setActiveTab(nextTab)
    setActiveNav(moduleForPage(nextTab, location.pathname))
  }, [location.pathname])
  const moduleForPage = (name, context) => {
    if (name === 'Dealer Reports') {
      if (context === 'Dealer Management' || context?.startsWith('/pages/dealer-management/'))
        return 'Dealer Management'
      if (context === 'Reports & Analytics' || context?.startsWith('/pages/reports/'))
        return 'Reports & Analytics'
    }
    if (humanResourcePages.has(name)) return 'Human Resource'
    if (payrollPages.has(name)) return 'Payroll'
    if (financePages.has(name)) return 'Finance & Accounting'
    if (inventoryPages.has(name)) return 'Inventory & Warehouse'
    if (reportPages.has(name)) return 'Reports & Analytics'
    if (dealerPages.has(name)) return 'Dealer Management'
    if (
      isAdministrationPage(name) ||
      name === dashboardTab ||
      name === 'Company Setup' ||
      administrationGroups.some((group) => group.items.includes(name))
    )
      return 'Administration'
    return navItems.includes(name) ? name : 'Administration'
  }
  const openTab = (name) => {
    if (!canLeaveCompanyPage(name)) return
    if (activeTab === 'Company Setup' && name !== activeTab) setCompanyPageDirty(false)
    setOpenTabs((tabs) => (tabs.includes(name) ? tabs : [...tabs, name]))
    setActiveTab(name)
    const targetModule = moduleForPage(name, activeNav)
    setActiveNav(targetModule)
    navigate(pagePath(name, targetModule))
  }
  const closeTab = (name) => {
    if (activeTab === name && !canLeaveCompanyPage('')) return
    if (activeTab === name && name === 'Company Setup') setCompanyPageDirty(false)
    const closedIndex = openTabs.indexOf(name)
    const remainingTabs = openTabs.filter((tab) => tab !== name)
    const nextTabs = remainingTabs.length ? remainingTabs : [dashboardTab]
    setOpenTabs(nextTabs)
    if (activeTab === name) {
      const nextActiveTab = nextTabs[Math.max(0, Math.min(closedIndex - 1, nextTabs.length - 1))]
      setActiveTab(nextActiveTab)
      setActiveNav(moduleForPage(nextActiveTab))
      navigate(pagePath(nextActiveTab), { replace: true })
    }
  }
  const openAction = (name) => {
    if (name === 'Dashboard') {
      openTab(dashboardTab)
      return
    }
    const page =
      dashboardActionPages[name] || (name === 'Export Reports' ? 'Executive Overview' : name)
    if (isAppPage(page)) {
      openTab(page)
      return
    }
    setModal(name)
  }
  const createBranch = (branch) => {
    setBranches((current) => {
      const nextNumber =
        current.reduce((max, item) => Math.max(max, Number(item.code.replace('BR-', '')) || 0), 0) +
        1
      return [...current, { ...branch, code: `BR-${String(nextNumber).padStart(3, '0')}` }]
    })
    openTab('Branch List')
    notify('Branch created successfully')
  }
  const updateBranch = (code, updates) => {
    setBranches((current) =>
      current.map((branch) => (branch.code === code ? { ...branch, ...updates } : branch)),
    )
    setSelectedBranchCode(code)
    openTab('Branch Details')
    notify('Branch updated successfully')
  }
  const createDepartment = (department) => {
    const nextNumber =
      departments.reduce(
        (max, item) => Math.max(max, Number(item.code.replace('DPT-', '')) || 0),
        0,
      ) + 1
    const code = `DPT-${String(nextNumber).padStart(3, '0')}`
    setDepartments((current) => [...current, { ...department, code }])
    if (department.managerId) {
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === department.managerId ? { ...employee, departmentCode: code } : employee,
        ),
      )
    }
    setSelectedDepartmentCode(code)
    openTab('Department List')
    notify('Department created successfully')
  }
  const updateDepartment = (code, updates) => {
    setDepartments((current) =>
      current.map((department) =>
        department.code === code ? { ...department, ...updates } : department,
      ),
    )
    if (Object.hasOwn(updates, 'managerId')) {
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === updates.managerId ? { ...employee, departmentCode: code } : employee,
        ),
      )
    }
  }
  const assignDepartmentEmployees = (code, employeeIds) => {
    const assignedIds = new Set(employeeIds)
    setEmployees((current) =>
      current.map((employee) =>
        employee.departmentCode === code || assignedIds.has(employee.id)
          ? { ...employee, departmentCode: assignedIds.has(employee.id) ? code : '' }
          : employee,
      ),
    )
    notify('Department employee assignments saved')
  }
  const saveAccessData = (nextData, successMessage) => {
    try {
      const savedData = {
        users: nextData.users,
        roles: nextData.roles,
        loginHistory: nextData.loginHistory,
      }
      window.localStorage.setItem(accessDataStorageKey, JSON.stringify(savedData))
      setAccessData(savedData)
      if (successMessage) notify(successMessage)
      return true
    } catch (error) {
      console.error('Unable to save users and roles:', error)
      notify('Changes could not be saved. Check available browser storage and try again.')
      return false
    }
  }
  const addAccessHistory = (history, user, action, result = 'Success', details = '') => [
    {
      id: Math.max(0, ...history.map((item) => Number(item.id) || 0)) + 1,
      date: new Date().toISOString(),
      userId: user?.id || '',
      username: user?.username || 'admin',
      action,
      result,
      details,
      ip: '—',
      device: 'Local application',
    },
    ...history,
  ]
  const saveUser = (values, existingId = '') => {
    const existing = accessData.users.find((user) => user.id === existingId)
    const nextIdNumber =
      accessData.users.reduce(
        (max, user) => Math.max(max, Number(user.id.replace('USR-', '')) || 0),
        0,
      ) + 1
    const nextUser = {
      ...values,
      id: existing?.id || `USR-${String(nextIdNumber).padStart(4, '0')}`,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mustChangePassword: existing?.mustChangePassword || false,
    }
    const users = existing
      ? accessData.users.map((user) => (user.id === existingId ? nextUser : user))
      : [...accessData.users, nextUser]
    const loginHistory = addAccessHistory(
      accessData.loginHistory,
      nextUser,
      existing ? 'User profile updated' : 'User account created',
      'Success',
      `${nextUser.name} · ${nextUser.roleName}`,
    )
    if (
      !saveAccessData(
        { ...accessData, users, loginHistory },
        `${existing ? 'User updated' : 'User created'} successfully`,
      )
    )
      return null
    return nextUser
  }
  const updateUser = (userId, updates, action, details = '') => {
    const user = accessData.users.find((item) => item.id === userId)
    if (!user) return false
    const nextRoleCode = updates.roleCode || user.roleCode
    const isActiveAdmin = (item) => item.status === 'Active' && item.roleCode === 'ROLE-001'
    if (isActiveAdmin(user) && !isActiveAdmin({ ...user, ...updates, roleCode: nextRoleCode })) {
      const activeAdmins = accessData.users.filter(isActiveAdmin)
      if (activeAdmins.length <= 1) {
        notify('The last active system administrator cannot be suspended or reassigned.')
        return false
      }
    }
    const nextUser = { ...user, ...updates, updatedAt: new Date().toISOString() }
    const users = accessData.users.map((item) => (item.id === userId ? nextUser : item))
    const loginHistory = addAccessHistory(
      accessData.loginHistory,
      nextUser,
      action,
      'Success',
      details || nextUser.name,
    )
    return saveAccessData({ ...accessData, users, loginHistory }, 'User account updated')
  }
  const saveRole = (values, existingCode = '') => {
    const existing = accessData.roles.find((role) => role.code === existingCode)
    const nextCodeNumber =
      accessData.roles.reduce(
        (max, role) => Math.max(max, Number(role.code.replace('ROLE-', '')) || 0),
        0,
      ) + 1
    const nextRole = {
      ...values,
      code: existing?.code || `ROLE-${String(nextCodeNumber).padStart(3, '0')}`,
      system: existing?.system || false,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const roles = existing
      ? accessData.roles.map((role) => (role.code === existingCode ? nextRole : role))
      : [...accessData.roles, nextRole]
    const loginHistory = addAccessHistory(
      accessData.loginHistory,
      { id: '', username: 'admin' },
      existing ? 'Role updated' : 'Role created',
      'Success',
      nextRole.name,
    )
    if (
      !saveAccessData(
        { ...accessData, roles, loginHistory },
        `${existing ? 'Role updated' : 'Role created'} successfully`,
      )
    )
      return null
    return nextRole
  }
  const updateRole = (code, updates, action = 'Role settings updated') => {
    const role = accessData.roles.find((item) => item.code === code)
    if (!role) return false
    if (role.system && updates.status && updates.status !== role.status) {
      notify('Built-in system roles cannot be deactivated.')
      return false
    }
    if (updates.status === 'Inactive' && accessData.users.some((user) => user.roleCode === code)) {
      notify('Reassign users from this role before deactivating it.')
      return false
    }
    const roles = accessData.roles.map((item) =>
      item.code === code ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
    )
    const loginHistory = addAccessHistory(
      accessData.loginHistory,
      { id: '', username: 'admin' },
      action,
      'Success',
      role.name,
    )
    return saveAccessData({ ...accessData, roles, loginHistory }, 'Role changes saved')
  }
  const deleteRole = (code) => {
    const role = accessData.roles.find((item) => item.code === code)
    if (!role || role.system) {
      notify('Built-in system roles cannot be deleted.')
      return false
    }
    if (accessData.users.some((user) => user.roleCode === code)) {
      notify('Reassign users from this role before deleting it.')
      return false
    }
    const roles = accessData.roles.filter((item) => item.code !== code)
    const loginHistory = addAccessHistory(
      accessData.loginHistory,
      { id: '', username: 'admin' },
      'Role deleted',
      'Success',
      role.name,
    )
    return saveAccessData({ ...accessData, roles, loginHistory }, 'Role deleted')
  }
  const saveApprovalData = (nextData, successMessage) => {
    try {
      window.localStorage.setItem(approvalDataStorageKey, JSON.stringify(nextData))
      setApprovalData(nextData)
      if (successMessage) notify(successMessage)
      return true
    } catch (error) {
      console.error('Unable to save approval management data:', error)
      notify('Approval changes could not be saved. Check available browser storage and try again.')
      return false
    }
  }
  const decideApproval = (requestId, decision, comments = '') => {
    const request = approvalData.requests.find((item) => item.id === requestId)
    if (!request || request.status !== 'Pending') {
      notify('This approval is no longer waiting for a decision.')
      return false
    }
    const rule = approvalData.rules.find((item) => item.id === request.ruleId)
    if (decision === 'Approved') {
      if (!rule) {
        notify('This request no longer has an assigned approval rule.')
        return false
      }
      const currentRoleCode =
        request.currentStage === 2 ? rule.escalationRoleCode : rule.approverRoleCode
      const currentRole = accessData.roles.find((item) => item.code === currentRoleCode)
      const roleLimit = Number(approvalData.roleLimits[currentRoleCode] || 0)
      if (!currentRole || currentRole.status !== 'Active') {
        notify('The assigned approver role is unavailable or inactive.')
        return false
      }
      if (Number(request.amount) > roleLimit && request.currentStage === 2) {
        notify(
          `${currentRole.name} has an approval limit of ${approvalMoney(roleLimit)}. Adjust the role limit or rule before approving.`,
        )
        return false
      }
      if (
        Number(request.amount) > roleLimit &&
        request.currentStage === 1 &&
        !rule.escalationRoleCode
      ) {
        notify(
          `${currentRole.name} has insufficient approval limit and no escalation role is configured.`,
        )
        return false
      }
    }
    const now = new Date().toISOString()
    const actorRole =
      accessData.roles.find((item) => item.code === 'ROLE-001')?.name || 'System Administrator'
    const needsEscalation =
      decision === 'Approved' &&
      request.currentStage === 1 &&
      rule?.escalationRoleCode &&
      (Number(request.amount) > Number(rule.escalationAmount || 0) ||
        Number(request.amount) > Number(approvalData.roleLimits[rule.approverRoleCode] || 0))
    const event = {
      id: `AH-${Date.now()}`,
      requestId,
      reference: request.reference,
      documentType: request.documentType,
      action: needsEscalation ? 'Stage Approved' : decision,
      actor: 'admin',
      actorRole,
      date: now,
      amount: request.amount,
      comments: comments.trim(),
    }
    const requests = approvalData.requests.map((item) =>
      item.id === requestId
        ? needsEscalation
          ? {
              ...item,
              currentStage: 2,
              nextApproverRoleCode: rule.escalationRoleCode,
              updatedAt: now,
            }
          : { ...item, status: decision, completedAt: now, updatedAt: now }
        : item,
    )
    const history = [event, ...approvalData.history]
    return saveApprovalData(
      { ...approvalData, requests, history },
      needsEscalation
        ? `${request.reference} advanced to second-stage approval`
        : `${request.reference} ${decision.toLowerCase()}`,
    )
  }
  const saveApprovalRule = (values, existingId = '') => {
    const existing = approvalData.rules.find((rule) => rule.id === existingId)
    const duplicate = approvalData.rules.find(
      (rule) => rule.id !== existingId && rule.documentType === values.documentType,
    )
    if (duplicate) {
      notify(`An approval rule already exists for ${values.documentType}.`)
      return null
    }
    const id =
      existing?.id ||
      `APR-${String(approvalData.rules.reduce((max, rule) => Math.max(max, Number(rule.id.replace('APR-', '')) || 0), 0) + 1).padStart(3, '0')}`
    const nextRule = { ...existing, ...values, id, updatedAt: new Date().toISOString() }
    const rules = existing
      ? approvalData.rules.map((rule) => (rule.id === existingId ? nextRule : rule))
      : [...approvalData.rules, nextRule]
    const history = [
      {
        id: `AH-${Date.now()}`,
        requestId: '',
        reference: id,
        documentType: values.documentType,
        action: existing ? 'Approval rule updated' : 'Approval rule created',
        actor: 'admin',
        actorRole: 'System Administrator',
        date: new Date().toISOString(),
        amount: 0,
        comments: nextRule.name,
      },
      ...approvalData.history,
    ]
    return saveApprovalData(
      { ...approvalData, rules, history },
      `Approval rule ${existing ? 'updated' : 'created'}`,
    )
      ? nextRule
      : null
  }
  const updateApprovalRule = (ruleId, updates) => {
    const rule = approvalData.rules.find((item) => item.id === ruleId)
    if (!rule) return false
    const rules = approvalData.rules.map((item) =>
      item.id === ruleId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
    )
    const history = [
      {
        id: `AH-${Date.now()}`,
        requestId: '',
        reference: rule.id,
        documentType: rule.documentType,
        action:
          updates.status === 'Inactive' ? 'Approval rule deactivated' : 'Approval rule updated',
        actor: 'admin',
        actorRole: 'System Administrator',
        date: new Date().toISOString(),
        amount: 0,
        comments: rule.name,
      },
      ...approvalData.history,
    ]
    return saveApprovalData(
      { ...approvalData, rules, history },
      `Rule ${updates.status === 'Inactive' ? 'deactivated' : 'updated'}`,
    )
  }
  const createDelegation = (values) => {
    const idNumber =
      approvalData.delegations.reduce(
        (max, item) => Math.max(max, Number(item.id.replace('DLG-', '')) || 0),
        0,
      ) + 1
    const delegation = {
      ...values,
      id: `DLG-${String(idNumber).padStart(3, '0')}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    }
    const delegations = [delegation, ...approvalData.delegations]
    const history = [
      {
        id: `AH-${Date.now()}`,
        requestId: '',
        reference: delegation.id,
        documentType: 'Delegation',
        action: 'Delegation created',
        actor: 'admin',
        actorRole: 'System Administrator',
        date: new Date().toISOString(),
        amount: 0,
        comments: `${delegation.delegatorName} → ${delegation.delegateName}`,
      },
      ...approvalData.history,
    ]
    return saveApprovalData(
      { ...approvalData, delegations, history },
      'Approval delegation created',
    )
  }
  const revokeDelegation = (delegationId) => {
    const delegation = approvalData.delegations.find((item) => item.id === delegationId)
    if (!delegation || delegation.status !== 'Active') return false
    const delegations = approvalData.delegations.map((item) =>
      item.id === delegationId
        ? { ...item, status: 'Revoked', revokedAt: new Date().toISOString() }
        : item,
    )
    const history = [
      {
        id: `AH-${Date.now()}`,
        requestId: '',
        reference: delegation.id,
        documentType: 'Delegation',
        action: 'Delegation revoked',
        actor: 'admin',
        actorRole: 'System Administrator',
        date: new Date().toISOString(),
        amount: 0,
        comments: `${delegation.delegatorName} → ${delegation.delegateName}`,
      },
      ...approvalData.history,
    ]
    return saveApprovalData({ ...approvalData, delegations, history }, 'Delegation revoked')
  }
  const saveApprovalLimit = (roleCode, maxAmount) => {
    const limits = { ...approvalData.roleLimits, [roleCode]: Number(maxAmount) }
    const role = accessData.roles.find((item) => item.code === roleCode)
    const history = [
      {
        id: `AH-${Date.now()}`,
        requestId: '',
        reference: roleCode,
        documentType: 'Approval limit',
        action: 'Approval limit updated',
        actor: 'admin',
        actorRole: 'System Administrator',
        date: new Date().toISOString(),
        amount: Number(maxAmount),
        comments: role?.name || roleCode,
      },
      ...approvalData.history,
    ]
    return saveApprovalData(
      { ...approvalData, roleLimits: limits, history },
      'Role approval limit saved',
    )
  }
  const saveSystemData = (nextData, successMessage) => {
    try {
      window.localStorage.setItem(systemDataStorageKey, JSON.stringify(nextData))
      setSystemData(nextData)
      if (successMessage) notify(successMessage)
      return true
    } catch (error) {
      console.error('Unable to save system settings:', error)
      notify('System settings could not be saved. Check available browser storage and try again.')
      return false
    }
  }
  const addSystemAuditEvent = (auditLogs, area, action, details) =>
    [
      {
        id: `SYS-${Date.now()}`,
        date: new Date().toISOString(),
        actor: 'admin',
        area,
        action,
        details,
      },
      ...auditLogs,
    ].slice(0, 500)
  const saveGeneralSystemSettings = (general) =>
    saveSystemData(
      {
        ...systemData,
        general,
        auditLogs: addSystemAuditEvent(
          systemData.auditLogs,
          'General Settings',
          'System preferences updated',
          'Locale, defaults, and operational preferences saved',
        ),
      },
      'System preferences saved',
    )
  const createFinancialYear = (values) => {
    const hasOverlap = systemData.financialYears.some(
      (year) => values.startDate <= year.endDate && values.endDate >= year.startDate,
    )
    if (hasOverlap) {
      notify('This financial year overlaps an existing period.')
      return false
    }
    const years = [
      ...systemData.financialYears,
      { ...values, id: `FY-${Date.now()}`, status: 'Planned' },
    ].sort((a, b) => a.startDate.localeCompare(b.startDate))
    const auditLogs = addSystemAuditEvent(
      systemData.auditLogs,
      'Financial Year',
      'Financial year scheduled',
      `${values.name} · ${values.startDate} to ${values.endDate}`,
    )
    return saveSystemData(
      { ...systemData, financialYears: years, auditLogs },
      `${values.name} scheduled`,
    )
  }
  const updateFinancialYearStatus = (yearId, status) => {
    const year = systemData.financialYears.find((item) => item.id === yearId)
    if (!year || !['Active', 'Closed'].includes(status)) return false
    if (
      status === 'Active' &&
      (year.status !== 'Planned' ||
        systemData.financialYears.some((item) => item.status === 'Active'))
    ) {
      notify('Close the current financial year before activating a planned year.')
      return false
    }
    if (
      status === 'Closed' &&
      (year.status !== 'Active' || new Date(`${year.endDate}T23:59:59`) > new Date())
    ) {
      notify('A financial year can only be closed after its end date.')
      return false
    }
    const financialYears = systemData.financialYears.map((item) =>
      item.id === yearId
        ? { ...item, status, closedAt: status === 'Closed' ? new Date().toISOString() : '' }
        : item,
    )
    const auditLogs = addSystemAuditEvent(
      systemData.auditLogs,
      'Financial Year',
      `Financial year ${status.toLowerCase()}`,
      year.name,
    )
    return saveSystemData(
      { ...systemData, financialYears, auditLogs },
      `${year.name} ${status.toLowerCase()}`,
    )
  }
  const saveDocumentNumbering = (numbering) => {
    const prefixes = numbering.map((item) => item.prefix.trim().toUpperCase())
    if (new Set(prefixes).size !== prefixes.length) {
      notify('Each document type must use a unique prefix.')
      return false
    }
    const auditLogs = addSystemAuditEvent(
      systemData.auditLogs,
      'Document Numbering',
      'Numbering rules updated',
      `${numbering.length} document sequences saved`,
    )
    return saveSystemData({ ...systemData, numbering, auditLogs }, 'Document numbering rules saved')
  }
  const activeSystemYear = systemData.financialYears.find((year) => year.status === 'Active')

  const visibleGroups =
    activeNav === 'Reports & Analytics'
      ? reportGroups.map((group) => ({ name: group.title, icon: FileBarChart, items: group.items }))
      : activeNav === 'Dealer Management'
        ? dealerGroups.map((group, index) => ({
            name: group.title,
            icon: [Users, MapPin, ShoppingCart, Truck, Wallet, FileBarChart][index],
            items: group.items,
          }))
        : activeNav === 'Human Resource'
          ? humanResourceGroups.map((group) => ({
              name: group.title,
              icon: FileText,
              items: group.items,
            }))
          : activeNav === 'Payroll'
            ? payrollGroups.map((group) => ({
                name: group.title,
                icon: FileText,
                items: group.items,
              }))
            : activeNav === 'Finance & Accounting'
              ? financeGroups.map((group) => ({
                  name: group.title,
                  icon: FileText,
                  items: group.items,
                }))
              : activeNav === 'Inventory & Warehouse'
                ? inventoryGroups.map((group) => ({
                    name: group.title,
                    icon: FileText,
                    items: group.items,
                  }))
                : administrationGroups
  const filteredGroups = visibleGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        `${item} ${group.name}`.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter(
      (group) => group.items.length || group.name.toLowerCase().includes(search.toLowerCase()),
    )

  return (
    <div
      className={`app-shell${activeNav === 'Human Resource' ? ' app-shell-hr' : activeNav === 'Payroll' ? ' app-shell-payroll' : activeNav === 'Finance & Accounting' ? ' app-shell-finance' : activeNav === 'Inventory & Warehouse' ? ' app-shell-inventory' : activeNav === 'Dealer Management' ? ' app-shell-dealer' : activeNav === 'Reports & Analytics' ? ' app-shell-reports' : ''}`}
    >
      <nav className="top-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item}
            className={`nav-tab ${activeNav === item ? 'selected' : ''}`}
            onClick={() =>
              openTab(
                item === 'Administration'
                  ? dashboardTab
                  : item === 'Human Resource'
                    ? 'Human Resource Dashboard'
                    : item === 'Payroll'
                      ? 'Payroll Dashboard'
                      : item === 'Finance & Accounting'
                        ? 'Finance Dashboard'
                        : item === 'Inventory & Warehouse'
                          ? 'Inventory Dashboard'
                          : item,
              )
            }
          >
            {item}
          </button>
        ))}
        <button
          className="mobile-menu"
          aria-label="Toggle modules"
          aria-expanded={sidebarOpen}
          aria-controls="module-panel"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={18} />
        </button>
      </nav>

      <section className="ribbon" aria-label="Quick actions">
        {[
          'Quick Access',
          'Transactions',
          'Inventory',
          'Finance',
          'Reports',
          'Administration',
          'System',
        ].map((section) => (
          <div className="ribbon-group" key={section}>
            <div className="ribbon-buttons">
              {ribbonActions
                .filter((action) => action.section === section)
                .map(({ label, icon: Icon, tint }) => (
                  <button
                    key={label}
                    className={`ribbon-action ${label === 'Dashboard' ? 'ribbon-current' : ''}`}
                    onClick={() => openAction(label)}
                  >
                    <Icon className={`icon-${tint}`} size={29} strokeWidth={1.8} />
                    <span>{label}</span>
                  </button>
                ))}
              {section === 'System' && (
                <button className="ribbon-action" onClick={() => notify('Session closed securely')}>
                  <X size={29} className="icon-red" />
                  <span>Close</span>
                </button>
              )}
            </div>
            <span className="ribbon-caption">{section}</span>
          </div>
        ))}
      </section>

      <main className={`workspace ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        {sidebarOpen && (
          <button
            className="sidebar-backdrop"
            aria-label="Close modules"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {sidebarOpen && (
          <aside className="module-panel" id="module-panel">
            <div
              className={`module-heading ${activeNav === 'Human Resource' ? 'module-heading-hr' : activeNav === 'Payroll' ? 'module-heading-payroll' : activeNav === 'Finance & Accounting' ? 'module-heading-finance' : activeNav === 'Inventory & Warehouse' ? 'module-heading-inventory' : activeNav === 'Dealer Management' ? 'module-heading-dealer' : activeNav === 'Reports & Analytics' ? 'module-heading-reports' : ''}`}
            >
              <span>
                {activeNav === 'Human Resource' && <Users size={18} />}
                {activeNav === 'Payroll' && <Banknote size={18} />}
                {activeNav === 'Finance & Accounting' && <Landmark size={18} />}
                {activeNav === 'Inventory & Warehouse' && <Boxes size={18} />}
                {activeNav === 'Dealer Management' && <Handshake size={18} />}
                {activeNav === 'Reports & Analytics' && <FileBarChart size={18} />}{' '}
                {activeNav === 'Human Resource'
                  ? 'Human Resource Management'
                  : activeNav === 'Payroll'
                    ? 'Payroll Management'
                    : activeNav === 'Finance & Accounting'
                      ? 'Finance & Accounting'
                      : activeNav === 'Inventory & Warehouse'
                        ? 'Inventory & Warehouse'
                        : activeNav === 'Dealer Management'
                          ? 'Dealer Management'
                          : activeNav === 'Reports & Analytics'
                            ? 'Reports & Analytics'
                            : 'Module Explorer'}
              </span>
              <button aria-label="Collapse module panel" onClick={() => setSidebarOpen(false)}>
                <ChevronUp size={16} />
              </button>
            </div>
            <label className="module-search">
              <Search size={14} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a module..."
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="module-tree">
              {filteredGroups.map((group) => {
                const isOpen = search ? true : (expanded[group.name] ?? true)
                return (
                  <div className="tree-group" key={group.name}>
                    <button
                      className="tree-group-title"
                      onClick={() =>
                        setExpanded({ ...expanded, [group.name]: !expanded[group.name] })
                      }
                    >
                      {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      <Folder className="folder-icon" size={16} fill="#ffb632" />
                      <span>{group.name}</span>
                    </button>
                    {isOpen &&
                      group.items.map((item) => {
                        const { Icon, tone } = pageIconFor(item, activeNav)
                        return (
                          <button
                            key={item}
                            className={`tree-item ${activeTab === item || (item === 'Company Profile' && activeTab === 'Company Setup') ? 'active' : ''}`}
                            onClick={() =>
                              openTab(item === 'Company Profile' ? 'Company Setup' : item)
                            }
                          >
                            <Icon className={`page-icon page-icon-${tone}`} size={14} />
                            <span>{item}</span>
                          </button>
                        )
                      })}
                  </div>
                )
              })}
              {!filteredGroups.length && <div className="no-results">No modules found</div>}
            </div>
          </aside>
        )}
        {!sidebarOpen && (
          <button
            className="restore-sidebar"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open modules"
          >
            <PanelLeftClose size={16} />
          </button>
        )}

        <section className="content-area">
          <div className="tab-strip" role="tablist" aria-label="Open pages">
            {openTabs.map((tab) => {
              const { Icon, tone } = pageIconFor(tab, moduleForPage(tab, activeNav))
              return (
                <div
                  className={`page-tab ${activeTab === tab ? 'active' : ''}`}
                  key={tab}
                  role="presentation"
                >
                  <button
                    className="page-tab-select"
                    role="tab"
                    aria-selected={activeTab === tab}
                    title={tab}
                    onClick={() => openTab(tab)}
                  >
                    <Icon className={`page-icon page-icon-${tone}`} size={15} />
                    <span className="page-tab-title">{tab}</span>
                  </button>
                  <button
                    className="page-tab-close"
                    aria-label={`Close ${tab} tab`}
                    title={`Close ${tab}`}
                    onClick={() => closeTab(tab)}
                  >
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>
          {activeTab === dashboardTab ? (
            <Dashboard onAction={openAction} approvalData={approvalData} users={accessData.users} />
          ) : humanResourcePages.has(activeTab) ? (
            <Suspense
              fallback={<div className="hr-module-loading">Loading Human Resource workspace…</div>}
            >
              <HumanResourceModule
                page={activeTab}
                employees={employees}
                branches={branches}
                departments={departments}
                onEmployeesChange={(employee, existingId) =>
                  setEmployees((current) =>
                    existingId
                      ? current.map((item) => (item.id === existingId ? employee : item))
                      : [...current, employee],
                  )
                }
                onNotify={notify}
                onNavigate={openTab}
              />
            </Suspense>
          ) : payrollPages.has(activeTab) ? (
            <Suspense fallback={<div className="payroll-loading">Loading payroll workspace…</div>}>
              <PayrollModule
                page={activeTab}
                employees={employees}
                onNotify={notify}
                onNavigate={openTab}
              />
            </Suspense>
          ) : financePages.has(activeTab) ? (
            <Suspense
              fallback={<div className="finance-loading">Loading Finance & Accounting…</div>}
            >
              <FinanceModule page={activeTab} onNotify={notify} onNavigate={openTab} />
            </Suspense>
          ) : inventoryPages.has(activeTab) ? (
            <Suspense fallback={<div className="inv-loading">Loading Inventory & Warehouse…</div>}>
              <InventoryModule page={activeTab} onNotify={notify} onNavigate={openTab} />
            </Suspense>
          ) : dealerPages.has(activeTab) ? (
            <Suspense
              fallback={<div className="dealer-loading">Loading dealer management workspace…</div>}
            >
              <DealerModule page={activeTab} onNotify={notify} onNavigate={openTab} />
            </Suspense>
          ) : reportPages.has(activeTab) ? (
            <Suspense
              fallback={<div className="reports-loading">Loading reports and analytics…</div>}
            >
              <ReportsModule page={activeTab} onNotify={notify} onNavigate={openTab} />
            </Suspense>
          ) : (
            <ModulePage
              name={activeTab}
              onAction={openAction}
              onNotify={notify}
              onDirtyChange={setCompanyPageDirty}
              onNavigate={openTab}
              branches={branches}
              setBranches={setBranches}
              onCreateBranch={createBranch}
              onUpdateBranch={updateBranch}
              selectedBranchCode={selectedBranchCode}
              onSelectBranch={setSelectedBranchCode}
              departments={departments}
              employees={employees}
              onCreateDepartment={createDepartment}
              onUpdateDepartment={updateDepartment}
              onAssignDepartmentEmployees={assignDepartmentEmployees}
              selectedDepartmentCode={selectedDepartmentCode}
              onSelectDepartment={setSelectedDepartmentCode}
              accessData={accessData}
              approvalData={approvalData}
              systemData={systemData}
              onSaveGeneralSystemSettings={saveGeneralSystemSettings}
              onCreateFinancialYear={createFinancialYear}
              onUpdateFinancialYearStatus={updateFinancialYearStatus}
              onSaveDocumentNumbering={saveDocumentNumbering}
              onDecideApproval={decideApproval}
              onSaveApprovalRule={saveApprovalRule}
              onUpdateApprovalRule={updateApprovalRule}
              onCreateDelegation={createDelegation}
              onRevokeDelegation={revokeDelegation}
              onSaveApprovalLimit={saveApprovalLimit}
              onSaveUser={saveUser}
              onUpdateUser={updateUser}
              onSaveRole={saveRole}
              onUpdateRole={updateRole}
              onDeleteRole={deleteRole}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
              selectedRoleCode={selectedRoleCode}
              onSelectRole={setSelectedRoleCode}
            />
          )}
        </section>
      </main>

      <footer className="status-bar">
        <span>
          <Database size={16} /> <b>Company:</b> GreenField Agrochemicals (Pvt.) Ltd.
        </span>
        <span>
          <Building2 size={17} /> <b>Branch:</b> Sahiwal (Main)
        </span>
        <span>
          <UserRound size={17} /> <b>User:</b> Admin
        </span>
        <span>
          <CalendarDays size={17} /> <b>Financial Year:</b>{' '}
          {activeSystemYear?.name || 'Not configured'}
        </span>
        <span className="connection">
          <i />
          Connected
        </span>
        <span className="version">v1.0.0</span>
      </footer>

      {modal && <ActionModal name={modal} onClose={() => setModal('')} />}
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  )
}

function Dashboard({ onAction, approvalData, users }) {
  const pendingRequests = approvalData.requests.filter((request) => request.status === 'Pending')
  const administrator = users.find((user) => user.username === 'admin')
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 5
      ? 'Good evening'
      : currentHour < 12
        ? 'Good morning'
        : currentHour < 17
          ? 'Good afternoon'
          : 'Good evening'
  const todayLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  const shortcuts = [
    { label: 'Add Company', icon: Building2 },
    { label: 'Add Branch', icon: GitBranch },
    { label: 'Create User', icon: UserPlus },
    { label: 'Review Approvals', icon: ClipboardCheck, page: 'Approval Queue' },
  ]

  return (
    <div className="dashboard-scroll admin-dashboard">
      <header className="admin-welcome">
        <div className="admin-welcome-copy">
          <span className="admin-welcome-kicker">Administration overview</span>
          <h1>
            {greeting}, {administrator?.name || 'Admin'}
          </h1>
          <p>Your organization’s key updates and actions.</p>
        </div>
        <div className="admin-welcome-actions">
          <span className="admin-date-pill">
            <CalendarDays size={14} />
            {todayLabel}
          </span>
          <button type="button" onClick={() => onAction('Approval Queue')}>
            <ClipboardCheck size={15} />
            Review approvals
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <section className="admin-kpis" aria-label="System overview">
        {kpis.map(({ label, value, change, icon: Icon, color, page }) => (
          <button
            type="button"
            className="admin-kpi admin-kpi-link"
            key={label}
            onClick={() => onAction(page)}
            title={`Open ${page}`}
            aria-label={`${label}: ${label === 'Pending Approvals' ? pendingRequests.length : value}. Open ${page}`}
          >
            <span className={`admin-kpi-icon ${color}`}>
              <Icon size={24} strokeWidth={1.9} />
            </span>
            <span className="admin-kpi-copy">
              <span>{label}</span>
              <strong>{label === 'Pending Approvals' ? pendingRequests.length : value}</strong>
            </span>
            {change && <span className="kpi-change">{change}</span>}
          </button>
        ))}
      </section>

      <section className="admin-shortcuts" aria-label="Common admin tasks">
        {shortcuts.map(({ label, icon: Icon, page }) => (
          <button
            type="button"
            className="admin-shortcut"
            key={label}
            onClick={() => onAction(page || label)}
          >
            <Icon size={17} />
            <span>{label}</span>
            <ArrowRight size={14} />
          </button>
        ))}
      </section>

      <div className="admin-clean-grid">
        <section className="panel admin-data-panel admin-activity-panel">
          <h2>
            <span className="dashboard-heading-icon activity-heading-icon">
              <Clock3 size={16} />
            </span>
            <span className="dashboard-heading-copy">
              <b>Recent System Activities</b>
              <small>Latest events across administration</small>
            </span>
          </h2>
          <div className="admin-table-wrap">
            <table className="admin-table activity-table">
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  <th>User</th>
                  <th>Activity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(({ date, user, icon: Icon, color, activity, details }) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{user}</td>
                    <td>
                      <span className={`table-activity-icon ${color}`}>
                        <Icon size={12} />
                      </span>
                      {activity}
                    </td>
                    <td>{details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="admin-clean-side">
          <section className="panel admin-data-panel admin-pending-panel">
            <h2>
              <span className="dashboard-heading-icon approval-heading-icon">
                <ClipboardCheck size={16} />
              </span>
              <span className="dashboard-heading-copy">
                <b>Pending Approvals</b>
                <small>{pendingRequests.length} requests are waiting</small>
              </span>
              <button className="view-all" onClick={() => onAction('Approval Queue')}>
                View All <ArrowRight size={13} />
              </button>
            </h2>
            <div className="admin-approval-list">
              {pendingRequests.slice(0, 4).map((request) => {
                const user = users.find((item) => item.id === request.requestedById)
                return (
                  <div className="admin-approval-row" key={request.id}>
                    <span>
                      <b>{request.reference}</b>
                      <small>
                        {request.documentType} · {user?.name || 'Unknown'}
                      </small>
                    </span>
                    <span>
                      <b>{approvalMoney(request.amount)}</b>
                      <small>{approvalAge(request.submittedAt)}</small>
                    </span>
                  </div>
                )
              })}
              {!pendingRequests.length && (
                <p className="admin-clean-empty">No pending approvals.</p>
              )}
            </div>
          </section>

          <section className="panel admin-data-panel admin-alert-panel">
            <h2>
              <span className="dashboard-heading-icon critical-heading-icon">
                <AlertTriangle size={16} />
              </span>
              <span className="dashboard-heading-copy">
                <b>Needs Attention</b>
                <small>{adminAlerts.length} items need attention</small>
              </span>
              <button className="view-all" onClick={() => onAction('Inventory Dashboard')}>
                View All <ArrowRight size={13} />
              </button>
            </h2>
            <div className="alert-list admin-alert-list">
              {adminAlerts.map(({ icon: Icon, color, text, page }) => (
                <button
                  type="button"
                  className="alert-row"
                  key={text}
                  onClick={() => onAction(page)}
                  title={`Open ${page}`}
                >
                  <span className={`alert-icon ${color}`}>
                    <Icon size={16} />
                  </span>
                  <span>{text}</span>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

const initialCompanyDocuments = [
  {
    id: 1,
    name: 'Pesticide Manufacturing License',
    category: 'License',
    reference: 'PML-2024-0178',
    uploaded: '10-Jul-2024',
    expiry: '09-Jul-2027',
    department: 'Regulatory',
    status: 'Verified',
    version: 'v1.2',
    note: 'Manufacturing license for pesticide formulations and technical production. Valid for 3 years from the date of issue.',
  },
  {
    id: 2,
    name: 'Company Incorporation Certificate',
    category: 'Registration',
    reference: 'CIN-2012-0045',
    uploaded: '15-Jun-2024',
    expiry: '—',
    department: 'Legal',
    status: 'Verified',
    version: 'v1.0',
    note: 'Company registration and incorporation certificate.',
  },
  {
    id: 3,
    name: 'Pesticide Formulation Registration',
    category: 'Product Registration',
    reference: 'PFR-2024-2261',
    uploaded: '20-Aug-2024',
    expiry: '19-Dec-2026',
    department: 'Regulatory',
    status: 'Expiring Soon',
    version: 'v2.1',
    note: 'Product formulation registration. Renewal should be initiated before the expiry date.',
  },
  {
    id: 4,
    name: 'ISO 9001:2015 Certificate',
    category: 'Certification',
    reference: 'ISO-9001-1187',
    uploaded: '05-Sep-2024',
    expiry: '04-Sep-2027',
    department: 'Quality Assurance',
    status: 'Verified',
    version: 'v1.0',
    note: 'Quality management system certification.',
  },
  {
    id: 5,
    name: 'Environmental Compliance (EPA)',
    category: 'Compliance',
    reference: 'ECP-2023-0760',
    uploaded: '12-Dec-2023',
    expiry: '11-Dec-2026',
    department: 'Environment',
    status: 'Expiring Soon',
    version: 'v1.1',
    note: 'Environmental compliance approval. Review renewal requirements with the Environment department.',
  },
  {
    id: 6,
    name: 'Warehouse Storage License',
    category: 'License',
    reference: 'WSL-2024-0099',
    uploaded: '08-Aug-2024',
    expiry: '07-Aug-2027',
    department: 'Inventory & Warehouse',
    status: 'Verified',
    version: 'v1.0',
    note: 'Approved warehouse storage license.',
  },
  {
    id: 7,
    name: 'Factory Premises NOC',
    category: 'NOC',
    reference: 'NOC-2024-0034',
    uploaded: '18-Sep-2024',
    expiry: '—',
    department: 'Operations',
    status: 'Rejected',
    version: 'v1.0',
    note: 'Rejected: please upload the updated premises inspection certificate.',
  },
  {
    id: 8,
    name: 'Risk Assessment Report',
    category: 'Report',
    reference: 'RAR-2024-0021',
    uploaded: '01-Oct-2024',
    expiry: '—',
    department: 'EHS',
    status: 'Pending',
    version: 'v1.0',
    note: 'Awaiting review from the EHS department.',
  },
]

function ModulePage({
  name,
  onAction,
  onNotify,
  onDirtyChange,
  onNavigate,
  branches,
  setBranches,
  onCreateBranch,
  onUpdateBranch,
  selectedBranchCode,
  onSelectBranch,
  departments,
  employees,
  onCreateDepartment,
  onUpdateDepartment,
  onAssignDepartmentEmployees,
  selectedDepartmentCode,
  onSelectDepartment,
  accessData,
  approvalData,
  systemData,
  onSaveGeneralSystemSettings,
  onCreateFinancialYear,
  onUpdateFinancialYearStatus,
  onSaveDocumentNumbering,
  onDecideApproval,
  onSaveApprovalRule,
  onUpdateApprovalRule,
  onCreateDelegation,
  onRevokeDelegation,
  onSaveApprovalLimit,
  onSaveUser,
  onUpdateUser,
  onSaveRole,
  onUpdateRole,
  onDeleteRole,
  selectedUserId,
  onSelectUser,
  selectedRoleCode,
  onSelectRole,
}) {
  if (name === 'Company Setup')
    return (
      <CompanySetupPage
        onSaved={onNotify}
        onDirtyChange={onDirtyChange}
        onOpenDocuments={() => onNavigate('Company Documents')}
      />
    )
  if (name === 'Company Settings')
    return (
      <CompanySettingsPage onNotify={onNotify} onNavigate={onNavigate} systemData={systemData} />
    )
  if (name === 'Company Documents') return <CompanyDocumentsPage onNotify={onNotify} />
  if (name === 'Branch List')
    return (
      <BranchListPage
        branches={branches}
        setBranches={setBranches}
        onNavigate={onNavigate}
        onNotify={onNotify}
        onSelectBranch={onSelectBranch}
      />
    )
  if (name === 'Create Branch' || name === 'Edit Branch')
    return (
      <CreateBranchPage
        branches={branches}
        onNavigate={onNavigate}
        onCreateBranch={onCreateBranch}
        onUpdateBranch={onUpdateBranch}
        branch={
          name === 'Edit Branch'
            ? branches.find((item) => item.code === selectedBranchCode) || branches[0]
            : null
        }
      />
    )
  if (name === 'Branch Details')
    return (
      <BranchDetailsPage
        branch={branches.find((item) => item.code === selectedBranchCode) || branches[0]}
        onNavigate={onNavigate}
        onNotify={onNotify}
        setBranches={setBranches}
        onSelectBranch={onSelectBranch}
      />
    )
  if (name === 'Branch Settings')
    return <BranchSettingsPage branches={branches} onNotify={onNotify} />
  if (name === 'Branch Reports')
    return (
      <BranchReportsPage
        branches={branches}
        onSelectBranch={onSelectBranch}
        onNavigate={onNavigate}
      />
    )
  if (name === 'Department List')
    return (
      <DepartmentListPage
        departments={departments}
        employees={employees}
        branches={branches}
        onNavigate={onNavigate}
        onNotify={onNotify}
        onSelectDepartment={onSelectDepartment}
        onUpdateDepartment={onUpdateDepartment}
      />
    )
  if (name === 'Create Department' || name === 'Edit Department')
    return (
      <CreateDepartmentPage
        departments={departments}
        employees={employees}
        branches={branches}
        department={
          name === 'Edit Department'
            ? departments.find((item) => item.code === selectedDepartmentCode)
            : null
        }
        onNavigate={onNavigate}
        onCreateDepartment={onCreateDepartment}
        onUpdateDepartment={onUpdateDepartment}
        onNotify={onNotify}
      />
    )
  if (name === 'Department Details')
    return (
      <DepartmentDetailsPage
        department={departments.find((item) => item.code === selectedDepartmentCode)}
        employees={employees}
        branches={branches}
        onNavigate={onNavigate}
        onNotify={onNotify}
        onUpdateDepartment={onUpdateDepartment}
      />
    )
  if (name === 'Department Settings')
    return (
      <DepartmentSettingsPage
        departments={departments}
        onUpdateDepartment={onUpdateDepartment}
        onNotify={onNotify}
        selectedDepartmentCode={selectedDepartmentCode}
      />
    )
  if (name === 'Assign Employees')
    return (
      <AssignEmployeesPage
        departments={departments}
        employees={employees}
        branches={branches}
        onAssign={onAssignDepartmentEmployees}
        onSelectDepartment={onSelectDepartment}
        selectedDepartmentCode={selectedDepartmentCode}
      />
    )
  if (name === 'Department Reports')
    return (
      <DepartmentReportsPage
        departments={departments}
        employees={employees}
        branches={branches}
        onSelectDepartment={onSelectDepartment}
        onNavigate={onNavigate}
      />
    )
  if (name === 'Users List')
    return (
      <UsersListPage
        users={accessData.users}
        roles={accessData.roles}
        branches={branches}
        departments={departments}
        onNavigate={onNavigate}
        onNotify={onNotify}
        onSelectUser={onSelectUser}
        onUpdateUser={onUpdateUser}
      />
    )
  if (name === 'Create User' || name === 'Edit User')
    return (
      <CreateUserPage
        key={name === 'Edit User' ? `edit-${selectedUserId}` : 'create-user'}
        users={accessData.users}
        roles={accessData.roles}
        branches={branches}
        departments={departments}
        employees={employees}
        user={
          name === 'Edit User' ? accessData.users.find((item) => item.id === selectedUserId) : null
        }
        onNavigate={onNavigate}
        onSaveUser={onSaveUser}
      />
    )
  if (name === 'User Profile')
    return (
      <UserProfilePage
        user={accessData.users.find((item) => item.id === selectedUserId)}
        roles={accessData.roles}
        branches={branches}
        departments={departments}
        history={accessData.loginHistory}
        onNavigate={onNavigate}
        onUpdateUser={onUpdateUser}
        onNotify={onNotify}
      />
    )
  if (name === 'Roles Management')
    return (
      <RolesManagementPage
        users={accessData.users}
        roles={accessData.roles}
        onSaveRole={onSaveRole}
        onUpdateRole={onUpdateRole}
        onDeleteRole={onDeleteRole}
        onNavigate={onNavigate}
        selectedRoleCode={selectedRoleCode}
        onSelectRole={onSelectRole}
      />
    )
  if (name === 'Permission Matrix')
    return (
      <PermissionMatrixPage
        roles={accessData.roles}
        users={accessData.users}
        onUpdateRole={onUpdateRole}
      />
    )
  if (name === 'Login History')
    return <LoginHistoryPage history={accessData.loginHistory} users={accessData.users} />
  if (name === 'Pending Approvals')
    return (
      <ApprovalPendingPage
        requests={approvalData.requests}
        rules={approvalData.rules}
        users={accessData.users}
        roles={accessData.roles}
        branches={branches}
        departments={departments}
        delegations={approvalData.delegations}
        onDecide={onDecideApproval}
        onNavigate={onNavigate}
      />
    )
  if (name === 'Approval Rules')
    return (
      <ApprovalRulesPage
        rules={approvalData.rules}
        roles={accessData.roles}
        requests={approvalData.requests}
        onSaveRule={onSaveApprovalRule}
        onUpdateRule={onUpdateApprovalRule}
        onNavigate={onNavigate}
      />
    )
  if (name === 'Approval History')
    return (
      <ApprovalHistoryPage
        history={approvalData.history}
        users={accessData.users}
        onNavigate={onNavigate}
      />
    )
  if (name === 'Delegation & Limits')
    return (
      <DelegationLimitsPage
        delegations={approvalData.delegations}
        roleLimits={approvalData.roleLimits}
        users={accessData.users}
        roles={accessData.roles}
        onCreateDelegation={onCreateDelegation}
        onRevokeDelegation={onRevokeDelegation}
        onSaveApprovalLimit={onSaveApprovalLimit}
      />
    )
  if (name === 'General Settings')
    return (
      <SystemGeneralSettingsPage
        settings={systemData.general}
        onSave={onSaveGeneralSystemSettings}
      />
    )
  if (name === 'Financial Year')
    return (
      <FinancialYearPage
        years={systemData.financialYears}
        onCreate={onCreateFinancialYear}
        onUpdateStatus={onUpdateFinancialYearStatus}
      />
    )
  if (name === 'Document Numbering')
    return (
      <DocumentNumberingPage
        numbering={systemData.numbering}
        activeYear={systemData.financialYears.find((year) => year.status === 'Active')}
        onSave={onSaveDocumentNumbering}
      />
    )
  if (name === 'Audit Logs')
    return (
      <SystemAuditLogsPage
        systemLogs={systemData.auditLogs}
        loginHistory={accessData.loginHistory}
        approvalHistory={approvalData.history}
        users={accessData.users}
        onNavigate={onNavigate}
      />
    )

  return (
    <div className="module-page">
      <div className="module-page-heading">
        <div>
          <span className="eyebrow">GREENFIELD ERP / MODULE</span>
          <h1>{name}</h1>
          <p>Manage and review {name.toLowerCase()} across your organization.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => onAction(`New ${name.replace(/s$/, '')}`)}
        >
          <Plus size={16} /> Create new
        </button>
      </div>
      <div className="module-summary">
        <div className="module-stat">
          <span>Active records</span>
          <b>1,284</b>
          <small>
            <Activity size={13} /> +8.2% this month
          </small>
        </div>
        <div className="module-stat">
          <span>Pending review</span>
          <b>18</b>
          <small>
            <ClipboardCheck size={13} /> Requires attention
          </small>
        </div>
        <div className="module-stat">
          <span>Last updated</span>
          <b>Today, 10:42 AM</b>
          <small>
            <Check size={13} /> All changes saved
          </small>
        </div>
      </div>
      <section className="panel module-placeholder">
        <div className="placeholder-icon">
          <ClipboardList size={25} />
        </div>
        <h2>{name} workspace</h2>
        <p>Your {name.toLowerCase()} records and activity will appear here.</p>
        <button className="secondary-button" onClick={() => onAction(`Export ${name}`)}>
          <ArrowDownToLine size={15} /> Export records
        </button>
      </section>
    </div>
  )
}

const initialEmployees = [
  {
    id: 'EMP-001',
    name: 'Asim Khan',
    role: 'General Manager',
    branchCode: 'BR-001',
    departmentCode: 'DPT-001',
    email: 'asim.khan@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-002',
    name: 'Sana Iqbal',
    role: 'Regional Sales Manager',
    branchCode: 'BR-002',
    departmentCode: 'DPT-004',
    email: 'sana.iqbal@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-003',
    name: 'Bilal Ahmad',
    role: 'Production Manager',
    branchCode: 'BR-003',
    departmentCode: 'DPT-005',
    email: 'bilal.ahmad@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-004',
    name: 'Imran Raza',
    role: 'HR Officer',
    branchCode: 'BR-004',
    departmentCode: 'DPT-003',
    email: 'imran.raza@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-005',
    name: 'Nida Hassan',
    role: 'Finance Manager',
    branchCode: 'BR-005',
    departmentCode: 'DPT-002',
    email: 'nida.hassan@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-006',
    name: 'Usman Gul',
    role: 'Warehouse Officer',
    branchCode: 'BR-006',
    departmentCode: 'DPT-006',
    email: 'usman.gul@greenfieldagro.com',
    status: 'Inactive',
  },
  {
    id: 'EMP-007',
    name: 'Farhan Khalid',
    role: 'Quality Analyst',
    branchCode: 'BR-007',
    departmentCode: 'DPT-007',
    email: 'farhan.khalid@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-008',
    name: 'Raza Memon',
    role: 'Procurement Officer',
    branchCode: 'BR-008',
    departmentCode: 'DPT-008',
    email: 'raza.memon@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-009',
    name: 'Ayesha Malik',
    role: 'Accounts Officer',
    branchCode: 'BR-001',
    departmentCode: 'DPT-002',
    email: 'ayesha.malik@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-010',
    name: 'Hassan Javed',
    role: 'Sales Executive',
    branchCode: 'BR-001',
    departmentCode: 'DPT-004',
    email: 'hassan.javed@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-011',
    name: 'Maria Shah',
    role: 'HR Coordinator',
    branchCode: 'BR-002',
    departmentCode: 'DPT-003',
    email: 'maria.shah@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-012',
    name: 'Omar Farooq',
    role: 'Manufacturing Supervisor',
    branchCode: 'BR-003',
    departmentCode: 'DPT-005',
    email: 'omar.farooq@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-013',
    name: 'Hina Tariq',
    role: 'Quality Inspector',
    branchCode: 'BR-004',
    departmentCode: 'DPT-007',
    email: 'hina.tariq@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-014',
    name: 'Salman Qureshi',
    role: 'Inventory Controller',
    branchCode: 'BR-005',
    departmentCode: 'DPT-006',
    email: 'salman.qureshi@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-015',
    name: 'Zara Ahmed',
    role: 'Buyer',
    branchCode: 'BR-007',
    departmentCode: 'DPT-008',
    email: 'zara.ahmed@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-016',
    name: 'Kamran Ali',
    role: 'Accounts Assistant',
    branchCode: 'BR-008',
    departmentCode: 'DPT-002',
    email: 'kamran.ali@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-017',
    name: 'Noor Fatima',
    role: 'Sales Executive',
    branchCode: 'BR-005',
    departmentCode: 'DPT-004',
    email: 'noor.fatima@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-018',
    name: 'Danish Akram',
    role: 'People Operations Officer',
    branchCode: 'BR-001',
    departmentCode: 'DPT-003',
    email: 'danish.akram@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-019',
    name: 'Sadia Noor',
    role: 'Production Planner',
    branchCode: 'BR-002',
    departmentCode: 'DPT-005',
    email: 'sadia.noor@greenfieldagro.com',
    status: 'Active',
  },
  {
    id: 'EMP-020',
    name: 'Waqar Hussain',
    role: 'Storekeeper',
    branchCode: 'BR-003',
    departmentCode: 'DPT-006',
    email: 'waqar.hussain@greenfieldagro.com',
    status: 'Active',
  },
]

function loadEmployees() {
  try {
    const saved = window.localStorage.getItem('greenfield-human-resource-v1')
    if (!saved) return initialEmployees
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed.employees) ? parsed.employees : initialEmployees
  } catch (error) {
    console.error('Unable to load employee records:', error)
    return initialEmployees
  }
}

const initialDepartments = [
  {
    code: 'DPT-001',
    name: 'Administration',
    branchCode: 'BR-001',
    managerId: 'EMP-001',
    email: 'admin@greenfieldagro.com',
    phone: '+92-42-3587 4501',
    costCenter: 'CC-1001',
    budget: 2400000,
    description: 'Company administration, governance, and office operations.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '250000',
      restrictBranchData: false,
      emailNotifications: true,
    },
  },
  {
    code: 'DPT-002',
    name: 'Finance & Accounting',
    branchCode: 'BR-001',
    managerId: 'EMP-005',
    email: 'finance@greenfieldagro.com',
    phone: '+92-42-3587 4510',
    costCenter: 'CC-2001',
    budget: 3800000,
    description: 'Financial planning, accounting, payments, and reporting.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '500000',
      restrictBranchData: true,
      emailNotifications: true,
    },
  },
  {
    code: 'DPT-003',
    name: 'Human Resources',
    branchCode: 'BR-004',
    managerId: 'EMP-004',
    email: 'hr@greenfieldagro.com',
    phone: '+92-40-446 2100',
    costCenter: 'CC-3001',
    budget: 3100000,
    description: 'People operations, employee relations, and workforce planning.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '100000',
      restrictBranchData: false,
      emailNotifications: true,
    },
  },
  {
    code: 'DPT-004',
    name: 'Sales & Dealer Operations',
    branchCode: 'BR-002',
    managerId: 'EMP-002',
    email: 'sales@greenfieldagro.com',
    phone: '+92-41-872 5100',
    costCenter: 'CC-4001',
    budget: 6200000,
    description: 'Regional sales, dealer relationships, and commercial operations.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '350000',
      restrictBranchData: true,
      emailNotifications: true,
    },
  },
  {
    code: 'DPT-005',
    name: 'Production',
    branchCode: 'BR-003',
    managerId: 'EMP-003',
    email: 'production@greenfieldagro.com',
    phone: '+92-61-458 3200',
    costCenter: 'CC-5001',
    budget: 9500000,
    description: 'Manufacturing planning, formulation, and production control.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '750000',
      restrictBranchData: true,
      emailNotifications: true,
    },
  },
  {
    code: 'DPT-006',
    name: 'Inventory & Warehouse',
    branchCode: 'BR-005',
    managerId: 'EMP-014',
    email: 'warehouse@greenfieldagro.com',
    phone: '+92-22-341 7800',
    costCenter: 'CC-6001',
    budget: 4700000,
    description: 'Stock control, warehouse operations, and logistics coordination.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '300000',
      restrictBranchData: true,
      emailNotifications: true,
    },
  },
  {
    code: 'DPT-007',
    name: 'Quality Assurance',
    branchCode: 'BR-007',
    managerId: 'EMP-007',
    email: 'quality@greenfieldagro.com',
    phone: '+92-81-282 4600',
    costCenter: 'CC-7001',
    budget: 2800000,
    description: 'Product testing, quality systems, and regulatory compliance.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '200000',
      restrictBranchData: false,
      emailNotifications: true,
    },
  },
  {
    code: 'DPT-008',
    name: 'Procurement',
    branchCode: 'BR-008',
    managerId: 'EMP-008',
    email: 'procurement@greenfieldagro.com',
    phone: '+92-71-562 3900',
    costCenter: 'CC-8001',
    budget: 5300000,
    description: 'Supplier management, sourcing, and purchase operations.',
    status: 'Active',
    settings: {
      approvalRequired: true,
      approvalLimit: '400000',
      restrictBranchData: true,
      emailNotifications: true,
    },
  },
]

const accessPermissionGroups = [
  {
    name: 'Administration',
    modules: ['Company Profile', 'Branches', 'Departments', 'Users & Roles', 'System Settings'],
  },
  { name: 'Finance & Accounting', modules: ['Finance', 'Approvals'] },
  { name: 'Human Resources', modules: ['Employees & HR', 'Payroll'] },
  { name: 'Inventory & Warehouse', modules: ['Inventory', 'Products', 'Purchasing'] },
  { name: 'Sales & Dealer Management', modules: ['Sales', 'Dealers'] },
  { name: 'Production & Quality', modules: ['Production', 'Quality Control'] },
]
const accessActions = ['view', 'create', 'edit', 'delete', 'approve', 'export']
const buildRolePermissions = (allowedModules = [], actions = ['view']) =>
  Object.fromEntries(
    accessPermissionGroups
      .flatMap((group) => group.modules)
      .map((module) => [
        module,
        Object.fromEntries(
          accessActions.map((action) => [
            action,
            allowedModules.includes('*') ||
              (allowedModules.includes(module) && actions.includes(action)),
          ]),
        ),
      ]),
  )
const initialRoles = [
  {
    code: 'ROLE-001',
    name: 'System Administrator',
    description: 'Full access to company setup, security, and all ERP modules.',
    scope: 'Company-wide',
    status: 'Active',
    system: true,
    permissions: buildRolePermissions(['*'], accessActions),
  },
  {
    code: 'ROLE-002',
    name: 'Company Administrator',
    description: 'Manage company operations, branches, departments, and users.',
    scope: 'Company-wide',
    status: 'Active',
    system: true,
    permissions: buildRolePermissions(
      [
        'Company Profile',
        'Branches',
        'Departments',
        'Users & Roles',
        'System Settings',
        'Employees & HR',
        'Inventory',
        'Products',
      ],
      ['view', 'create', 'edit', 'export'],
    ),
  },
  {
    code: 'ROLE-003',
    name: 'Branch Manager',
    description: 'Manage the assigned branch and review its operational workflows.',
    scope: 'Assigned branch',
    status: 'Active',
    system: true,
    permissions: buildRolePermissions(
      [
        'Branches',
        'Departments',
        'Finance',
        'Approvals',
        'Employees & HR',
        'Inventory',
        'Products',
        'Purchasing',
        'Sales',
        'Dealers',
        'Production',
        'Quality Control',
      ],
      ['view', 'create', 'edit', 'approve', 'export'],
    ),
  },
  {
    code: 'ROLE-004',
    name: 'HR Manager',
    description: 'Maintain employee records, organizational assignments, and HR operations.',
    scope: 'Company-wide',
    status: 'Active',
    system: true,
    permissions: buildRolePermissions(
      ['Departments', 'Employees & HR', 'Payroll', 'Approvals'],
      ['view', 'create', 'edit', 'approve', 'export'],
    ),
  },
  {
    code: 'ROLE-005',
    name: 'Finance Manager',
    description: 'Manage financial records, approvals, and finance reporting.',
    scope: 'Company-wide',
    status: 'Active',
    system: true,
    permissions: buildRolePermissions(
      ['Finance', 'Approvals', 'Purchasing', 'Sales'],
      ['view', 'create', 'edit', 'approve', 'export'],
    ),
  },
  {
    code: 'ROLE-006',
    name: 'Inventory Officer',
    description: 'Process inventory, purchasing, and warehouse operations.',
    scope: 'Assigned branch',
    status: 'Active',
    system: true,
    permissions: buildRolePermissions(
      ['Inventory', 'Products', 'Purchasing', 'Quality Control'],
      ['view', 'create', 'edit', 'export'],
    ),
  },
  {
    code: 'ROLE-007',
    name: 'Read Only Auditor',
    description: 'Read and export records for internal audit and compliance review.',
    scope: 'Company-wide',
    status: 'Active',
    system: true,
    permissions: buildRolePermissions(['*'], ['view', 'export']),
  },
]
const initialUsers = [
  {
    id: 'USR-0001',
    name: 'System Administrator',
    username: 'admin',
    email: 'admin@greenfieldagro.com',
    phone: '+92-42-3587 4501',
    roleCode: 'ROLE-001',
    branchCode: 'BR-001',
    departmentCode: 'DPT-001',
    employeeId: '',
    status: 'Active',
    lastLogin: '2026-11-05T16:42:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: 'USR-0002',
    name: 'Asim Khan',
    username: 'asim.khan',
    email: 'asim.khan@greenfieldagro.com',
    phone: '+92-300-421 1001',
    roleCode: 'ROLE-002',
    branchCode: 'BR-001',
    departmentCode: 'DPT-001',
    employeeId: 'EMP-001',
    status: 'Active',
    lastLogin: '2026-11-05T16:18:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-02-14T09:00:00.000Z',
  },
  {
    id: 'USR-0003',
    name: 'Sana Iqbal',
    username: 'sana.iqbal',
    email: 'sana.iqbal@greenfieldagro.com',
    phone: '+92-300-421 1002',
    roleCode: 'ROLE-003',
    branchCode: 'BR-002',
    departmentCode: 'DPT-004',
    employeeId: 'EMP-002',
    status: 'Active',
    lastLogin: '2026-11-05T15:54:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-03-02T09:00:00.000Z',
  },
  {
    id: 'USR-0004',
    name: 'Bilal Ahmad',
    username: 'bilal.ahmad',
    email: 'bilal.ahmad@greenfieldagro.com',
    phone: '+92-300-421 1003',
    roleCode: 'ROLE-003',
    branchCode: 'BR-003',
    departmentCode: 'DPT-005',
    employeeId: 'EMP-003',
    status: 'Active',
    lastLogin: '2026-11-05T14:30:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-03-19T09:00:00.000Z',
  },
  {
    id: 'USR-0005',
    name: 'Imran Raza',
    username: 'imran.raza',
    email: 'imran.raza@greenfieldagro.com',
    phone: '+92-300-421 1004',
    roleCode: 'ROLE-004',
    branchCode: 'BR-004',
    departmentCode: 'DPT-003',
    employeeId: 'EMP-004',
    status: 'Active',
    lastLogin: '2026-11-05T13:12:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-04-04T09:00:00.000Z',
  },
  {
    id: 'USR-0006',
    name: 'Nida Hassan',
    username: 'nida.hassan',
    email: 'nida.hassan@greenfieldagro.com',
    phone: '+92-300-421 1005',
    roleCode: 'ROLE-005',
    branchCode: 'BR-005',
    departmentCode: 'DPT-002',
    employeeId: 'EMP-005',
    status: 'Active',
    lastLogin: '2026-11-05T12:05:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-05-09T09:00:00.000Z',
  },
  {
    id: 'USR-0007',
    name: 'Usman Gul',
    username: 'usman.gul',
    email: 'usman.gul@greenfieldagro.com',
    phone: '+92-300-421 1006',
    roleCode: 'ROLE-006',
    branchCode: 'BR-006',
    departmentCode: 'DPT-006',
    employeeId: 'EMP-006',
    status: 'Suspended',
    lastLogin: '2026-10-28T10:00:00.000Z',
    mustChangePassword: true,
    createdAt: '2025-06-11T09:00:00.000Z',
  },
  {
    id: 'USR-0008',
    name: 'Farhan Khalid',
    username: 'farhan.khalid',
    email: 'farhan.khalid@greenfieldagro.com',
    phone: '+92-300-421 1007',
    roleCode: 'ROLE-006',
    branchCode: 'BR-007',
    departmentCode: 'DPT-007',
    employeeId: 'EMP-007',
    status: 'Active',
    lastLogin: '2026-11-04T11:40:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-07-15T09:00:00.000Z',
  },
  {
    id: 'USR-0009',
    name: 'Raza Memon',
    username: 'raza.memon',
    email: 'raza.memon@greenfieldagro.com',
    phone: '+92-300-421 1008',
    roleCode: 'ROLE-006',
    branchCode: 'BR-008',
    departmentCode: 'DPT-008',
    employeeId: 'EMP-008',
    status: 'Active',
    lastLogin: '2026-11-04T09:20:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-08-20T09:00:00.000Z',
  },
  {
    id: 'USR-0010',
    name: 'Ayesha Malik',
    username: 'ayesha.malik',
    email: 'ayesha.malik@greenfieldagro.com',
    phone: '+92-300-421 1009',
    roleCode: 'ROLE-005',
    branchCode: 'BR-001',
    departmentCode: 'DPT-002',
    employeeId: 'EMP-009',
    status: 'Active',
    lastLogin: '2026-11-03T15:25:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-09-10T09:00:00.000Z',
  },
  {
    id: 'USR-0011',
    name: 'Hassan Javed',
    username: 'hassan.javed',
    email: 'hassan.javed@greenfieldagro.com',
    phone: '+92-300-421 1010',
    roleCode: 'ROLE-003',
    branchCode: 'BR-001',
    departmentCode: 'DPT-004',
    employeeId: 'EMP-010',
    status: 'Active',
    lastLogin: '2026-11-03T14:05:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-10-08T09:00:00.000Z',
  },
  {
    id: 'USR-0012',
    name: 'Maria Shah',
    username: 'maria.shah',
    email: 'maria.shah@greenfieldagro.com',
    phone: '+92-300-421 1011',
    roleCode: 'ROLE-004',
    branchCode: 'BR-002',
    departmentCode: 'DPT-003',
    employeeId: 'EMP-011',
    status: 'Active',
    lastLogin: '2026-11-02T10:10:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-10-21T09:00:00.000Z',
  },
  {
    id: 'USR-0013',
    name: 'Omar Farooq',
    username: 'omar.farooq',
    email: 'omar.farooq@greenfieldagro.com',
    phone: '+92-300-421 1012',
    roleCode: 'ROLE-003',
    branchCode: 'BR-003',
    departmentCode: 'DPT-005',
    employeeId: 'EMP-012',
    status: 'Active',
    lastLogin: '2026-11-01T12:44:00.000Z',
    mustChangePassword: true,
    createdAt: '2025-11-02T09:00:00.000Z',
  },
  {
    id: 'USR-0014',
    name: 'Hina Tariq',
    username: 'hina.tariq',
    email: 'hina.tariq@greenfieldagro.com',
    phone: '+92-300-421 1013',
    roleCode: 'ROLE-007',
    branchCode: 'BR-004',
    departmentCode: 'DPT-007',
    employeeId: 'EMP-013',
    status: 'Active',
    lastLogin: '2026-10-31T09:17:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-11-19T09:00:00.000Z',
  },
  {
    id: 'USR-0015',
    name: 'Salman Qureshi',
    username: 'salman.qureshi',
    email: 'salman.qureshi@greenfieldagro.com',
    phone: '+92-300-421 1014',
    roleCode: 'ROLE-006',
    branchCode: 'BR-005',
    departmentCode: 'DPT-006',
    employeeId: 'EMP-014',
    status: 'Active',
    lastLogin: '2026-10-30T16:32:00.000Z',
    mustChangePassword: false,
    createdAt: '2025-12-03T09:00:00.000Z',
  },
]
const initialLoginHistory = Array.from({ length: 16 }, (_, index) => {
  const user = initialUsers[(index + 2) % initialUsers.length]
  const failed = index === 5 || index === 12
  return {
    id: index + 1,
    date: new Date(Date.now() - index * 52 * 60 * 1000).toISOString(),
    userId: user.id,
    username: user.username,
    action: failed ? 'Sign-in attempt' : index % 4 === 1 ? 'Password changed' : 'Sign-in',
    result: failed ? 'Failed' : 'Success',
    details: failed ? 'Incorrect password' : 'Password authentication · MFA not enabled',
    ip: `192.168.1.${24 + (index % 8)}`,
    device: index % 3 === 0 ? 'Web · Windows' : 'Web · Chrome',
  }
})
const initialAccessData = {
  users: initialUsers,
  roles: initialRoles,
  loginHistory: initialLoginHistory,
}
const accessDataStorageKey = 'greenfield-users-roles-v1'
const approvalDocumentTypes = [
  'Purchase Order',
  'Sales Order',
  'Payment Voucher',
  'Stock Adjustment',
  'Production Plan',
  'Payroll Batch',
  'Expense Claim',
]
const approvalDateOffset = (days) => new Date(Date.now() + days * 86400000).toISOString()
const initialApprovalRules = [
  {
    id: 'APR-001',
    name: 'Purchase Order Review',
    documentType: 'Purchase Order',
    approverRoleCode: 'ROLE-005',
    escalationAmount: 500000,
    escalationRoleCode: 'ROLE-001',
    status: 'Active',
    updatedAt: approvalDateOffset(-30),
  },
  {
    id: 'APR-002',
    name: 'Sales Order Review',
    documentType: 'Sales Order',
    approverRoleCode: 'ROLE-003',
    escalationAmount: 1000000,
    escalationRoleCode: 'ROLE-005',
    status: 'Active',
    updatedAt: approvalDateOffset(-24),
  },
  {
    id: 'APR-003',
    name: 'Payment Voucher Review',
    documentType: 'Payment Voucher',
    approverRoleCode: 'ROLE-005',
    escalationAmount: 250000,
    escalationRoleCode: 'ROLE-001',
    status: 'Active',
    updatedAt: approvalDateOffset(-18),
  },
  {
    id: 'APR-004',
    name: 'Stock Adjustment Review',
    documentType: 'Stock Adjustment',
    approverRoleCode: 'ROLE-006',
    escalationAmount: 100000,
    escalationRoleCode: 'ROLE-005',
    status: 'Active',
    updatedAt: approvalDateOffset(-15),
  },
  {
    id: 'APR-005',
    name: 'Production Plan Review',
    documentType: 'Production Plan',
    approverRoleCode: 'ROLE-003',
    escalationAmount: 750000,
    escalationRoleCode: 'ROLE-001',
    status: 'Active',
    updatedAt: approvalDateOffset(-11),
  },
  {
    id: 'APR-006',
    name: 'Payroll Batch Review',
    documentType: 'Payroll Batch',
    approverRoleCode: 'ROLE-004',
    escalationAmount: 500000,
    escalationRoleCode: 'ROLE-001',
    status: 'Active',
    updatedAt: approvalDateOffset(-8),
  },
]
const initialApprovalRequests = [
  {
    id: 'REQ-2026-0142',
    reference: 'PO-2026-0142',
    documentType: 'Purchase Order',
    description: 'Agrochemical packaging materials · Q4 replenishment',
    requestedById: 'USR-0008',
    branchCode: 'BR-008',
    departmentCode: 'DPT-008',
    amount: 825000,
    currency: 'PKR',
    submittedAt: approvalDateOffset(-0.2),
    priority: 'High',
    status: 'Pending',
    ruleId: 'APR-001',
    currentStage: 1,
  },
  {
    id: 'REQ-2026-0138',
    reference: 'PAY-2026-0087',
    documentType: 'Payment Voucher',
    description: 'Supplier settlement · GreenFarm Packaging',
    requestedById: 'USR-0010',
    branchCode: 'BR-001',
    departmentCode: 'DPT-002',
    amount: 186500,
    currency: 'PKR',
    submittedAt: approvalDateOffset(-0.6),
    priority: 'Normal',
    status: 'Pending',
    ruleId: 'APR-003',
    currentStage: 1,
  },
  {
    id: 'REQ-2026-0135',
    reference: 'SO-2026-0441',
    documentType: 'Sales Order',
    description: 'Seasonal dealer order · Punjab region',
    requestedById: 'USR-0003',
    branchCode: 'BR-002',
    departmentCode: 'DPT-004',
    amount: 1260000,
    currency: 'PKR',
    submittedAt: approvalDateOffset(-1.1),
    priority: 'High',
    status: 'Pending',
    ruleId: 'APR-002',
    currentStage: 2,
    nextApproverRoleCode: 'ROLE-005',
  },
  {
    id: 'REQ-2026-0132',
    reference: 'STK-2026-0039',
    documentType: 'Stock Adjustment',
    description: 'Damaged batch write-off · warehouse reconciliation',
    requestedById: 'USR-0015',
    branchCode: 'BR-005',
    departmentCode: 'DPT-006',
    amount: 67500,
    currency: 'PKR',
    submittedAt: approvalDateOffset(-1.8),
    priority: 'Normal',
    status: 'Pending',
    ruleId: 'APR-004',
    currentStage: 1,
  },
  {
    id: 'REQ-2026-0129',
    reference: 'PP-2026-0061',
    documentType: 'Production Plan',
    description: 'Cypermethrin 25EC · November production run',
    requestedById: 'USR-0004',
    branchCode: 'BR-003',
    departmentCode: 'DPT-005',
    amount: 640000,
    currency: 'PKR',
    submittedAt: approvalDateOffset(-2.2),
    priority: 'Normal',
    status: 'Pending',
    ruleId: 'APR-005',
    currentStage: 1,
  },
  {
    id: 'REQ-2026-0124',
    reference: 'PR-2026-0018',
    documentType: 'Payroll Batch',
    description: 'Monthly payroll batch · October 2026',
    requestedById: 'USR-0012',
    branchCode: 'BR-002',
    departmentCode: 'DPT-003',
    amount: 420000,
    currency: 'PKR',
    submittedAt: approvalDateOffset(-3.4),
    priority: 'Urgent',
    status: 'Pending',
    ruleId: 'APR-006',
    currentStage: 1,
  },
  {
    id: 'REQ-2026-0117',
    reference: 'PO-2026-0137',
    documentType: 'Purchase Order',
    description: 'Warehouse safety equipment · annual purchase',
    requestedById: 'USR-0009',
    branchCode: 'BR-008',
    departmentCode: 'DPT-008',
    amount: 315000,
    currency: 'PKR',
    submittedAt: approvalDateOffset(-4.1),
    priority: 'Urgent',
    status: 'Pending',
    ruleId: 'APR-001',
    currentStage: 1,
  },
]
const initialApprovalHistory = [
  {
    id: 'AH-SEED-01',
    requestId: 'REQ-2026-0108',
    reference: 'SO-2026-0412',
    documentType: 'Sales Order',
    action: 'Approved',
    actor: 'sana.iqbal',
    actorRole: 'Branch Manager',
    date: approvalDateOffset(-0.8),
    amount: 285000,
    comments: 'Order pricing and credit checked.',
  },
  {
    id: 'AH-SEED-02',
    requestId: 'REQ-2026-0102',
    reference: 'PAY-2026-0079',
    documentType: 'Payment Voucher',
    action: 'Rejected',
    actor: 'nida.hassan',
    actorRole: 'Finance Manager',
    date: approvalDateOffset(-1.4),
    amount: 93500,
    comments: 'Supporting supplier invoice was not attached.',
  },
  {
    id: 'AH-SEED-03',
    requestId: 'REQ-2026-0094',
    reference: 'PO-2026-0128',
    documentType: 'Purchase Order',
    action: 'Approved',
    actor: 'admin',
    actorRole: 'System Administrator',
    date: approvalDateOffset(-2.1),
    amount: 1180000,
    comments: 'Second-stage approval completed.',
  },
  {
    id: 'AH-SEED-04',
    requestId: 'REQ-2026-0089',
    reference: 'STK-2026-0034',
    documentType: 'Stock Adjustment',
    action: 'Changes Requested',
    actor: 'farhan.khalid',
    actorRole: 'Inventory Officer',
    date: approvalDateOffset(-3.2),
    amount: 47500,
    comments: 'Attach the quality inspection report.',
  },
  {
    id: 'AH-SEED-05',
    requestId: 'REQ-2026-0082',
    reference: 'PR-2026-0014',
    documentType: 'Payroll Batch',
    action: 'Approved',
    actor: 'imran.raza',
    actorRole: 'HR Manager',
    date: approvalDateOffset(-5),
    amount: 395000,
    comments: 'Headcount and payroll summary verified.',
  },
]
const initialApprovalData = {
  requests: initialApprovalRequests,
  rules: initialApprovalRules,
  history: initialApprovalHistory,
  delegations: [
    {
      id: 'DLG-001',
      delegatorId: 'USR-0006',
      delegatorName: 'Nida Hassan',
      delegateId: 'USR-0003',
      delegateName: 'Sana Iqbal',
      startDate: approvalDateOffset(-2).slice(0, 10),
      endDate: approvalDateOffset(5).slice(0, 10),
      documentTypes: ['Purchase Order', 'Sales Order'],
      status: 'Active',
      createdAt: approvalDateOffset(-2),
    },
  ],
  roleLimits: {
    'ROLE-001': 5000000,
    'ROLE-002': 2000000,
    'ROLE-003': 1000000,
    'ROLE-004': 750000,
    'ROLE-005': 2000000,
    'ROLE-006': 250000,
    'ROLE-007': 0,
  },
}
const approvalDataStorageKey = 'greenfield-approval-management-v1'
const systemDataStorageKey = 'greenfield-system-settings-v1'
const systemLandingPages = ['Dashboard', 'Pending Approvals', 'Branch List', 'Users List']
const initialSystemData = {
  general: {
    systemName: 'GreenField ERP',
    baseCurrency: 'PKR',
    timezone: 'Asia/Karachi',
    dateFormat: 'DD MMM YYYY',
    timeFormat: '24-hour',
    defaultLandingPage: 'Dashboard',
    recordsPerPage: 25,
    emailNotifications: true,
    inAppNotifications: true,
    approvalNotifications: true,
    inventoryNotifications: true,
  },
  financialYears: [
    {
      id: 'FY-2025-26',
      name: 'FY 2025–26',
      startDate: '2025-07-01',
      endDate: '2026-06-30',
      status: 'Closed',
    },
    {
      id: 'FY-2026-27',
      name: 'FY 2026–27',
      startDate: '2026-07-01',
      endDate: '2027-06-30',
      status: 'Active',
    },
    {
      id: 'FY-2027-28',
      name: 'FY 2027–28',
      startDate: '2027-07-01',
      endDate: '2028-06-30',
      status: 'Planned',
    },
  ],
  numbering: [
    {
      id: 'DOC-PO',
      documentType: 'Purchase Order',
      prefix: 'PO',
      nextNumber: 143,
      padding: 6,
      resetPeriod: 'Financial year',
    },
    {
      id: 'DOC-SO',
      documentType: 'Sales Order',
      prefix: 'SO',
      nextNumber: 442,
      padding: 6,
      resetPeriod: 'Financial year',
    },
    {
      id: 'DOC-PV',
      documentType: 'Payment Voucher',
      prefix: 'PV',
      nextNumber: 88,
      padding: 6,
      resetPeriod: 'Financial year',
    },
    {
      id: 'DOC-STK',
      documentType: 'Stock Adjustment',
      prefix: 'STK',
      nextNumber: 40,
      padding: 5,
      resetPeriod: 'Never',
    },
    {
      id: 'DOC-INV',
      documentType: 'Sales Invoice',
      prefix: 'INV',
      nextNumber: 251,
      padding: 6,
      resetPeriod: 'Financial year',
    },
    {
      id: 'DOC-JV',
      documentType: 'Journal Voucher',
      prefix: 'JV',
      nextNumber: 64,
      padding: 6,
      resetPeriod: 'Never',
    },
  ],
  auditLogs: [
    {
      id: 'SYS-SEED-01',
      date: approvalDateOffset(-1),
      actor: 'admin',
      area: 'System Settings',
      action: 'System settings initialized',
      details: 'Default system configuration loaded',
    },
  ],
}

function loadSystemData() {
  try {
    const raw = window.localStorage.getItem(systemDataStorageKey)
    if (!raw) return initialSystemData
    const parsed = JSON.parse(raw)
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.general ||
      !Array.isArray(parsed.financialYears) ||
      !Array.isArray(parsed.numbering) ||
      !Array.isArray(parsed.auditLogs)
    ) {
      throw new Error('Saved system settings have an invalid format')
    }
    const general = { ...initialSystemData.general, ...parsed.general }
    if (!systemLandingPages.includes(general.defaultLandingPage))
      general.defaultLandingPage = initialSystemData.general.defaultLandingPage
    return {
      ...initialSystemData,
      ...parsed,
      general,
    }
  } catch (error) {
    console.error('Unable to load system settings:', error)
    return initialSystemData
  }
}

function loadApprovalData() {
  try {
    const raw = window.localStorage.getItem(approvalDataStorageKey)
    if (!raw) return initialApprovalData
    const parsed = JSON.parse(raw)
    if (
      !parsed ||
      !Array.isArray(parsed.requests) ||
      !Array.isArray(parsed.rules) ||
      !Array.isArray(parsed.history) ||
      !Array.isArray(parsed.delegations) ||
      !parsed.roleLimits
    ) {
      throw new Error('Saved approval management data has an invalid format')
    }
    return parsed
  } catch (error) {
    console.error('Unable to load approval management data:', error)
    return initialApprovalData
  }
}

function approvalMoney(value) {
  return `Rs. ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(Number(value) || 0)}`
}

function approvalDisplayDate(value, includeTime = false) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(
    'en-GB',
    includeTime
      ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { day: '2-digit', month: 'short', year: 'numeric' },
  ).format(date)
}

function loadAccessData() {
  try {
    const raw = window.localStorage.getItem(accessDataStorageKey)
    if (!raw) return initialAccessData
    const parsed = JSON.parse(raw)
    if (
      !parsed ||
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.roles) ||
      !Array.isArray(parsed.loginHistory)
    ) {
      throw new Error('Saved users and roles data has an invalid format')
    }
    const defaultPermissions = buildRolePermissions()
    return {
      ...parsed,
      roles: parsed.roles.map((role) => ({
        ...role,
        permissions: Object.fromEntries(
          accessPermissionGroups
            .flatMap((group) => group.modules)
            .map((module) => [
              module,
              { ...defaultPermissions[module], ...(role.permissions?.[module] || {}) },
            ]),
        ),
      })),
    }
  } catch (error) {
    console.error('Unable to load users and roles:', error)
    return initialAccessData
  }
}

function userRoleName(user, roles) {
  return roles.find((role) => role.code === user.roleCode)?.name || 'Role unavailable'
}

function userDisplayDate(value, includeTime = false) {
  if (!value) return 'Never'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return new Intl.DateTimeFormat(
    'en-GB',
    includeTime
      ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { day: '2-digit', month: 'short', year: 'numeric' },
  ).format(date)
}

function UserStatusPill({ status }) {
  return (
    <span className={`user-status-pill ${status.toLowerCase().replaceAll(' ', '-')}`}>
      {status}
    </span>
  )
}

function LockKeyholeIcon() {
  return <ShieldCheck size={17} />
}

function GridIcon() {
  return <LayoutDashboard size={15} />
}

function approvalRoleName(code, roles) {
  return roles.find((role) => role.code === code)?.name || 'Role unavailable'
}

function approvalAge(value) {
  const hours = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3600000))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d ${hours % 24}h`
}

function ApprovalStatusPill({ status }) {
  const kind = status.toLowerCase().replaceAll(' ', '-')
  return (
    <span className={`approval-status-pill ${kind}`}>
      <i />
      {status}
    </span>
  )
}

const initialBranches = [
  {
    code: 'BR-001',
    name: 'Head Office',
    location: 'Lahore, Punjab',
    manager: 'Mr. Asim Khan',
    status: 'Active',
    employees: 145,
  },
  {
    code: 'BR-002',
    name: 'Faisalabad Branch',
    location: 'Faisalabad, Punjab',
    manager: 'Ms. Sana Iqbal',
    status: 'Active',
    employees: 68,
  },
  {
    code: 'BR-003',
    name: 'Multan Branch',
    location: 'Multan, Punjab',
    manager: 'Mr. Bilal Ahmad',
    status: 'Active',
    employees: 52,
  },
  {
    code: 'BR-004',
    name: 'Sahiwal Branch',
    location: 'Sahiwal, Punjab',
    manager: 'Mr. Imran Raza',
    status: 'Active',
    employees: 39,
  },
  {
    code: 'BR-005',
    name: 'Hyderabad Branch',
    location: 'Hyderabad, Sindh',
    manager: 'Ms. Nida Hassan',
    status: 'Active',
    employees: 47,
  },
  {
    code: 'BR-006',
    name: 'Peshawar Branch',
    location: 'Peshawar, Khyber Pakhtunkhwa',
    manager: 'Mr. Usman Gul',
    status: 'Inactive',
    employees: 0,
  },
  {
    code: 'BR-007',
    name: 'Quetta Branch',
    location: 'Quetta, Balochistan',
    manager: 'Mr. Farhan Khalid',
    status: 'Active',
    employees: 31,
  },
  {
    code: 'BR-008',
    name: 'Sukkur Branch',
    location: 'Sukkur, Sindh',
    manager: 'Mr. Raza Memon',
    status: 'Active',
    employees: 29,
  },
]

const departmentCurrency = (amount) =>
  `Rs. ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(amount || 0)}`
const departmentEmployees = (employees, departmentCode) =>
  employees.filter((employee) => employee.departmentCode === departmentCode)

const branchReportMetrics = {
  'BR-001': { sales: 8450000, target: 9000000, orders: 284, stock: 12600000 },
  'BR-002': { sales: 4920000, target: 5200000, orders: 176, stock: 6840000 },
  'BR-003': { sales: 3680000, target: 4000000, orders: 143, stock: 5120000 },
  'BR-004': { sales: 2940000, target: 3100000, orders: 118, stock: 3980000 },
  'BR-005': { sales: 4120000, target: 4500000, orders: 157, stock: 5760000 },
  'BR-006': { sales: 0, target: 2800000, orders: 0, stock: 0 },
  'BR-007': { sales: 2180000, target: 2400000, orders: 89, stock: 2940000 },
  'BR-008': { sales: 1760000, target: 1950000, orders: 72, stock: 2310000 },
}

const reportPeriodFactors = {
  'This Month': 1,
  'Last Month': 0.92,
  'Last Quarter': 2.85,
  'Financial Year': 8.6,
}

const branchSettingsStorageKey = 'greenfield-branch-settings'
const defaultBranchSettings = {
  currency: 'PKR – Pakistan Rupee (₨)',
  dateFormat: 'DD-MMM-YYYY (26-Nov-2026)',
  timezone: '(UTC+05:00) Pakistan Standard Time',
  workingHours: '09:00 – 17:00',
  workingDays: 'Monday – Saturday',
  operations: {
    sales: true,
    purchasing: true,
    inventory: true,
    production: false,
    negativeStock: false,
    requireApproval: true,
  },
  approvalLimit: '500000',
  approvalRole: 'Branch Manager',
  prefixes: { sales: 'SO', purchase: 'PO', inventory: 'GRN' },
  resetNumberingYearly: true,
  notifications: {
    email: true,
    inApp: true,
    lowStock: true,
    approvalRequests: true,
  },
  access: {
    restrictToBranch: true,
    crossBranchView: false,
    managerCanApprove: true,
    activityLog: true,
  },
}

function loadBranchSettings() {
  try {
    const savedSettings = window.localStorage.getItem(branchSettingsStorageKey)
    if (!savedSettings) return { settings: {}, error: '' }
    const parsed = JSON.parse(savedSettings)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Saved branch settings have an invalid format')
    }
    const settings = Object.fromEntries(
      Object.entries(parsed).map(([code, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          throw new Error(`Saved settings for ${code} have an invalid format`)
        }
        return [
          code,
          {
            ...defaultBranchSettings,
            ...value,
            operations: { ...defaultBranchSettings.operations, ...value.operations },
            notifications: { ...defaultBranchSettings.notifications, ...value.notifications },
            access: { ...defaultBranchSettings.access, ...value.access },
            prefixes: { ...defaultBranchSettings.prefixes, ...value.prefixes },
          },
        ]
      }),
    )
    return { settings, error: '' }
  } catch (error) {
    console.error('Unable to load branch settings:', error)
    return {
      settings: {},
      error:
        'Saved branch settings could not be loaded. Check browser storage before saving changes.',
    }
  }
}

const initialCompanyProfile = {
  companyName: 'GreenField Agrochemicals (Pvt.) Ltd.',
  shortName: 'GreenField',
  taxNumber: '1234567-8',
  registrationNumber: '0123456',
  phone: '+92-42-3587 4501-03',
  email: 'info@greenfieldagro.com',
  address: 'Plot No. 24, Industrial Estate, Sundar Industrial Area,\nLahore, Punjab, Pakistan.',
}

const companySetupStorageKey = 'greenfield-company-setup'

function loadCompanySetup() {
  try {
    const savedSetup = window.localStorage.getItem(companySetupStorageKey)
    if (savedSetup) {
      const { profile, logo } = JSON.parse(savedSetup)
      if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
        throw new Error('Saved company details have an invalid format')
      }
      return {
        profile: Object.fromEntries(
          Object.entries(initialCompanyProfile).map(([field, fallback]) => [
            field,
            typeof profile[field] === 'string' ? profile[field] : fallback,
          ]),
        ),
        logo: typeof logo === 'string' ? logo : '',
        hasSavedProfile: true,
        error: '',
      }
    }

    const savedProfile = window.localStorage.getItem('greenfield-company-profile')
    const savedLogo = window.localStorage.getItem('greenfield-company-logo') || ''
    if (!savedProfile) {
      return { profile: initialCompanyProfile, logo: savedLogo, hasSavedProfile: false, error: '' }
    }

    const profile = JSON.parse(savedProfile)
    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
      throw new Error('Saved company details have an invalid format')
    }
    return {
      profile: Object.fromEntries(
        Object.entries(initialCompanyProfile).map(([field, fallback]) => [
          field,
          typeof profile[field] === 'string' ? profile[field] : fallback,
        ]),
      ),
      logo: savedLogo,
      hasSavedProfile: true,
      error: '',
    }
  } catch (error) {
    console.error('Unable to load saved company settings:', error)
    return {
      profile: initialCompanyProfile,
      logo: '',
      hasSavedProfile: false,
      error:
        'Saved company details could not be loaded. You can continue editing, but check your browser storage.',
    }
  }
}

const companySettingsStorageKey = 'greenfield-company-preferences'
const defaultCompanySettings = {
  flags: {
    multiBranch: true,
    multiDepartment: true,
    approvalWorkflow: true,
    backdatedTransactions: false,
  },
  currency: 'PKR – Pakistan Rupee (₨)',
  dateFormat: 'DD-MMM-YYYY (26-Nov-2026)',
  timezone: '(UTC+05:00) Pakistan Standard Time',
  language: 'English',
  financialYearType: 'Custom (Apr – Mar)',
  currentFinancialYear: 'Jul 2026 – Jun 2027',
  fiscalYearStart: '2026-04-01',
  fiscalYearEnd: '2027-03-31',
  prefixes: [
    { type: 'Purchase Order', prefix: 'PO', nextNumber: 'PO-2026-0001', resetYearly: true },
    { type: 'Sales Order', prefix: 'SO', nextNumber: 'SO-2026-0001', resetYearly: true },
    { type: 'Production Plan', prefix: 'PP', nextNumber: 'PP-2026-0001', resetYearly: true },
    { type: 'Goods Receipt', prefix: 'GRN', nextNumber: 'GRN-2026-0001', resetYearly: true },
    { type: 'Dispatch', prefix: 'DSP', nextNumber: 'DSP-2026-0001', resetYearly: true },
  ],
  notifications: {
    email: true,
    inApp: true,
    approvalRequests: true,
    inventoryAlerts: true,
  },
  passwordPolicy: 'Strong (Min 8 chars, A-Z, a-z, 0-9, Special)',
  passwordExpiry: '90 Days',
  sessionTimeout: '30 Minutes',
  maxLoginAttempts: '5',
  security: {
    twoFactor: false,
    restrictLoginByIp: false,
    forcePasswordChange: true,
    userActivityLog: true,
  },
}

function loadCompanySettings() {
  try {
    const savedSettings = window.localStorage.getItem(companySettingsStorageKey)
    if (!savedSettings) return { settings: defaultCompanySettings, error: '' }
    const parsed = JSON.parse(savedSettings)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Saved company preferences have an invalid format')
    }
    const obsoleteSettingKeys = new Set([
      'companyName',
      'shortName',
      'registrationNo',
      'gstVatNo',
      'companyType',
      'industry',
    ])
    const savedPreferences = Object.fromEntries(
      Object.entries(parsed).filter(([key]) => !obsoleteSettingKeys.has(key)),
    )
    const obsoleteFlagKeys = new Set(['showLogoInReports', 'auditLogging'])
    const savedFlags = Object.fromEntries(
      Object.entries(parsed.flags || {}).filter(([key]) => !obsoleteFlagKeys.has(key)),
    )
    const obsoleteNotificationKeys = new Set(['sms', 'dailySummary'])
    const savedNotifications = Object.fromEntries(
      Object.entries(parsed.notifications || {}).filter(
        ([key]) => !obsoleteNotificationKeys.has(key),
      ),
    )
    const savedSecurity = Object.fromEntries(
      Object.entries(parsed.security || {}).filter(([key]) => key !== 'concurrentLogins'),
    )
    return {
      settings: {
        ...defaultCompanySettings,
        ...savedPreferences,
        flags: { ...defaultCompanySettings.flags, ...savedFlags },
        notifications: { ...defaultCompanySettings.notifications, ...savedNotifications },
        security: { ...defaultCompanySettings.security, ...savedSecurity },
        prefixes: Array.isArray(savedPreferences.prefixes)
          ? savedPreferences.prefixes
          : defaultCompanySettings.prefixes,
      },
      error: '',
    }
  } catch (error) {
    console.error('Unable to load company preferences:', error)
    return {
      settings: defaultCompanySettings,
      error: 'Saved preferences could not be loaded. Check browser storage before saving changes.',
    }
  }
}

function SettingsField({ label, required = false, children }) {
  return (
    <label className="settings-field">
      <span>
        {label}
        {required && <b aria-label="required"> *</b>}
      </span>
      {children}
    </label>
  )
}

function SystemSettingsHeader({ title, description, icon: Icon, action }) {
  return (
    <header className="branch-list-banner system-settings-banner">
      <img src={fieldBanner} alt="" />
      <div className="branch-list-banner-content">
        <Icon size={36} />
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      {action}
    </header>
  )
}

function SystemSettingsCardHeading({ icon: Icon, title, description, badge }) {
  return (
    <div className="system-card-heading">
      <span className="system-card-icon">
        <Icon size={18} />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {badge && <span className="system-heading-badge">{badge}</span>}
    </div>
  )
}

function SystemSettingsField({ label, hint, children }) {
  return (
    <label className="system-settings-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}

function SystemSettingsToggle({ label, description, checked, onChange }) {
  return (
    <label className="system-settings-toggle">
      <span>
        <b>{label}</b>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i aria-hidden="true" />
    </label>
  )
}

function SystemStatusPill({ status }) {
  return (
    <span className={`system-status-pill ${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  )
}

function ActionModal({ name, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="action-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">GREENFIELD ERP</span>
            <h2 id="modal-title">{name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close dialog">
            <X size={19} />
          </button>
        </div>
        <div className="modal-info">
          <div className="placeholder-icon">
            <ClipboardList size={23} />
          </div>
          <p>
            <b>{name}</b>
          </p>
          <span>
            This action is not connected to a task-specific workflow yet. No record has been
            created.
          </span>
          <button className="primary-button" onClick={onClose}>
            Got it
          </button>
        </div>
      </section>
    </div>
  )
}

export default App

export {
  ApprovalStatusPill,
  GridIcon,
  LockKeyholeIcon,
  SettingsField,
  SystemSettingsCardHeading,
  SystemSettingsField,
  SystemSettingsHeader,
  SystemSettingsToggle,
  SystemStatusPill,
  UserStatusPill,
  accessActions,
  accessPermissionGroups,
  approvalAge,
  approvalDisplayDate,
  approvalDocumentTypes,
  approvalMoney,
  approvalRoleName,
  branchReportMetrics,
  branchSettingsStorageKey,
  buildRolePermissions,
  companySettingsStorageKey,
  companySetupStorageKey,
  defaultBranchSettings,
  defaultCompanySettings,
  departmentCurrency,
  departmentEmployees,
  initialCompanyDocuments,
  loadBranchSettings,
  loadCompanySettings,
  loadCompanySetup,
  reportPeriodFactors,
  systemLandingPages,
  userDisplayDate,
  userRoleName,
}
