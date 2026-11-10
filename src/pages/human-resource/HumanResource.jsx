import { useMemo, useRef, useState } from 'react'
import { today } from './shared'
import HumanResourceDashboard from './dashboard/HumanResourceDashboard'
import EmployeeDirectory from './employee-management/EmployeeDirectory'
import AddEmployee from './employee-management/AddEmployee'
import EmployeeProfile from './employee-management/EmployeeProfile'
import EmployeeDocuments from './employee-management/EmployeeDocuments'
import TransfersPromotions from './employee-management/TransfersPromotions'
import EmployeeReports from './employee-management/EmployeeReports'
import DailyAttendance from './attendance/DailyAttendance'
import MarkAttendance from './attendance/MarkAttendance'
import AttendanceCorrections from './attendance/AttendanceCorrections'
import ShiftAssignments from './attendance/ShiftAssignments'
import AttendanceReports from './attendance/AttendanceReports'
import LeaveTypes from './leave-management/LeaveTypes'
import LeaveRequests from './leave-management/LeaveRequests'
import ApplyForLeave from './leave-management/ApplyForLeave'
import LeaveApprovals from './leave-management/LeaveApprovals'
import LeaveBalances from './leave-management/LeaveBalances'
import LeaveReports from './leave-management/LeaveReports'
import ShiftList from './shifts-scheduling/ShiftList'
import CreateShift from './shifts-scheduling/CreateShift'
import EmployeeRosters from './shifts-scheduling/EmployeeRosters'
import ShiftReports from './shifts-scheduling/ShiftReports'
import PerformanceReviews from './performance-management/PerformanceReviews'
import EmployeeEvaluations from './performance-management/EmployeeEvaluations'
import GoalsKPIs from './performance-management/GoalsKPIs'
import PerformanceReports from './performance-management/PerformanceReports'

const storageKey = 'greenfield-human-resource-v1'

const employeeDefaults = (employee, index) => ({
  ...employee,
  phone: employee.phone || `+92 300 555 ${String(index + 11).padStart(4, '0')}`,
  gender: employee.gender || (index % 2 ? 'Female' : 'Male'),
  employmentType: employee.employmentType || (index % 5 === 0 ? 'Contract' : 'Full-time'),
  hireDate: employee.hireDate || `202${index % 4}-${String((index % 11) + 1).padStart(2, '0')}-15`,
  manager: employee.manager || 'Asim Khan',
  salary: employee.salary || 85000 + index * 6500,
  emergencyContact: employee.emergencyContact || employee.phone || '',
  address: employee.address || 'Sahiwal, Punjab',
})

function createInitialData(sourceEmployees) {
  const employees = sourceEmployees.map(employeeDefaults)
  const date = today()
  const attendance = employees.map((employee, index) => ({
    id: `${date}-${employee.id}`,
    employeeId: employee.id,
    date,
    status:
      employee.status !== 'Active'
        ? 'Absent'
        : index % 13 === 4
          ? 'Late'
          : index % 17 === 7
            ? 'On Leave'
            : 'Present',
    checkIn:
      employee.status === 'Active' ? (index % 13 === 4 ? '09:24' : '08:4' + (index % 10)) : '',
    checkOut: '',
    note: '',
  }))
  const leaveTypes = [
    {
      id: 'LT-001',
      name: 'Annual Leave',
      days: 20,
      carryForward: true,
      paid: true,
      status: 'Active',
    },
    {
      id: 'LT-002',
      name: 'Casual Leave',
      days: 10,
      carryForward: false,
      paid: true,
      status: 'Active',
    },
    {
      id: 'LT-003',
      name: 'Sick Leave',
      days: 8,
      carryForward: false,
      paid: true,
      status: 'Active',
    },
    {
      id: 'LT-004',
      name: 'Unpaid Leave',
      days: 30,
      carryForward: false,
      paid: false,
      status: 'Active',
    },
  ]
  const leaveRequests = [
    {
      id: 'LR-2026-014',
      employeeId: 'EMP-002',
      typeId: 'LT-001',
      startDate: '2026-11-12',
      endDate: '2026-11-14',
      days: 3,
      reason: 'Family commitment',
      status: 'Pending',
      submittedAt: date,
    },
    {
      id: 'LR-2026-013',
      employeeId: 'EMP-007',
      typeId: 'LT-003',
      startDate: '2026-11-09',
      endDate: '2026-11-10',
      days: 2,
      reason: 'Medical appointment',
      status: 'Pending',
      submittedAt: date,
    },
    {
      id: 'LR-2026-012',
      employeeId: 'EMP-010',
      typeId: 'LT-002',
      startDate: '2026-11-02',
      endDate: '2026-11-03',
      days: 2,
      reason: 'Personal leave',
      status: 'Approved',
      submittedAt: date,
    },
  ]
  const shifts = [
    {
      id: 'SH-001',
      name: 'General Day',
      start: '09:00',
      end: '17:00',
      breakMinutes: 60,
      graceMinutes: 10,
      days: 'Mon–Fri',
      status: 'Active',
    },
    {
      id: 'SH-002',
      name: 'Early Production',
      start: '07:00',
      end: '15:00',
      breakMinutes: 45,
      graceMinutes: 5,
      days: 'Mon–Sat',
      status: 'Active',
    },
    {
      id: 'SH-003',
      name: 'Evening Warehouse',
      start: '14:00',
      end: '22:00',
      breakMinutes: 45,
      graceMinutes: 10,
      days: 'Mon–Sat',
      status: 'Active',
    },
  ]
  const rosters = employees.map((employee, index) => ({
    employeeId: employee.id,
    shiftId: shifts[index % shifts.length].id,
  }))
  const reviews = [
    {
      id: 'PR-2026-012',
      employeeId: 'EMP-002',
      period: 'Q3 2026',
      rating: 4.6,
      status: 'Completed',
      notes: 'Strong regional delivery and dealer engagement.',
    },
    {
      id: 'PR-2026-011',
      employeeId: 'EMP-003',
      period: 'Q3 2026',
      rating: 4.3,
      status: 'Completed',
      notes: 'Consistently met production and quality targets.',
    },
    {
      id: 'PR-2026-010',
      employeeId: 'EMP-010',
      period: 'Q3 2026',
      rating: 3.8,
      status: 'Completed',
      notes: 'Good customer coverage; improve forecast accuracy.',
    },
  ]
  const goals = [
    {
      id: 'GO-001',
      employeeId: 'EMP-002',
      title: 'Improve dealer retention',
      target: '2026-12-31',
      progress: 78,
      status: 'On track',
    },
    {
      id: 'GO-002',
      employeeId: 'EMP-003',
      title: 'Reduce production waste',
      target: '2026-12-31',
      progress: 62,
      status: 'On track',
    },
    {
      id: 'GO-003',
      employeeId: 'EMP-010',
      title: 'Achieve quarterly sales plan',
      target: '2026-12-31',
      progress: 44,
      status: 'Needs focus',
    },
  ]
  return {
    employees,
    documents: [
      {
        id: 'DOC-001',
        employeeId: 'EMP-001',
        name: 'Employment Agreement',
        category: 'Contract',
        issueDate: '2023-02-15',
        expiryDate: '',
        status: 'Verified',
      },
      {
        id: 'DOC-002',
        employeeId: 'EMP-002',
        name: 'National Identity Card',
        category: 'Identity',
        issueDate: '2024-06-11',
        expiryDate: '2029-06-10',
        status: 'Verified',
      },
      {
        id: 'DOC-003',
        employeeId: 'EMP-004',
        name: 'First Aid Certificate',
        category: 'Training',
        issueDate: '2025-03-20',
        expiryDate: '2027-03-19',
        status: 'Verified',
      },
    ],
    transfers: [
      {
        id: 'TR-2026-004',
        employeeId: 'EMP-009',
        effectiveDate: '2026-10-01',
        from: 'Accounts Officer · Sahiwal',
        to: 'Senior Accounts Officer · Sahiwal',
        status: 'Completed',
      },
    ],
    attendance,
    corrections: [],
    leaveTypes,
    leaveRequests,
    shifts,
    rosters,
    reviews,
    goals,
  }
}

function loadData(sourceEmployees) {
  const defaults = createInitialData(sourceEmployees)
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return defaults
    const parsed = JSON.parse(saved)
    return Object.fromEntries(
      Object.keys(defaults).map((key) => [
        key,
        Array.isArray(parsed[key]) ? parsed[key] : defaults[key],
      ]),
    )
  } catch (error) {
    console.error('Unable to load Human Resource data:', error)
    return defaults
  }
}

export default function HumanResourceModule({
  page,
  employees: sourceEmployees,
  branches,
  departments,
  onEmployeesChange,
  onNotify,
  onNavigate,
}) {
  const [data, setData] = useState(() => loadData(sourceEmployees))
  const dataRef = useRef(data)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(() => {
    try {
      return window.localStorage.getItem(`${storageKey}-selected`) || sourceEmployees[0]?.id || ''
    } catch (error) {
      console.error('Unable to load selected employee:', error)
      return sourceEmployees[0]?.id || ''
    }
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All status')
  const employees = data.employees
  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) || employees[0]
  const updateData = (updater, message) => {
    const current = dataRef.current
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      dataRef.current = next
      setData(next)
      if (message) onNotify(message)
      return true
    } catch (error) {
      console.error('Unable to save Human Resource data:', error)
      onNotify('HR changes could not be saved. Check available browser storage and try again.')
      return false
    }
  }
  const selectEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId)
    try {
      window.localStorage.setItem(`${storageKey}-selected`, employeeId)
    } catch (error) {
      console.error('Unable to save selected employee:', error)
    }
  }
  const employeeName = (id) =>
    employees.find((employee) => employee.id === id)?.name || 'Unknown employee'
  const branchName = (code) => branches.find((branch) => branch.code === code)?.name || code || '—'
  const departmentName = (code) =>
    departments.find((department) => department.code === code)?.name || code || '—'
  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const query = search.trim().toLowerCase()
        return (
          (!query ||
            `${employee.id} ${employee.name} ${employee.email} ${employee.role}`
              .toLowerCase()
              .includes(query)) &&
          (statusFilter === 'All status' || employee.status === statusFilter)
        )
      }),
    [employees, search, statusFilter],
  )

  const saveEmployee = (employee, existingId = '') => {
    const name = employee.name.trim()
    const email = employee.email.trim().toLowerCase()
    if (!name || !email || !employee.role.trim())
      return onNotify('Name, email, and job title are required.')
    if (employees.some((item) => item.id !== existingId && item.email.toLowerCase() === email))
      return onNotify('Another employee already uses this email address.')
    const saved = {
      ...employee,
      id:
        existingId ||
        `EMP-${String(Math.max(0, ...employees.map((item) => Number(item.id.replace('EMP-', '')) || 0)) + 1).padStart(3, '0')}`,
      name,
      email,
      status: employee.status || 'Active',
    }
    if (
      !updateData(
        (current) => ({
          ...current,
          employees: existingId
            ? current.employees.map((item) => (item.id === existingId ? saved : item))
            : [...current.employees, saved],
        }),
        existingId ? 'Employee profile updated' : 'Employee added successfully',
      )
    )
      return
    onEmployeesChange(saved, existingId)
    selectEmployee(saved.id)
    onNavigate(existingId ? 'Employee Profile' : 'Employee Directory')
  }

  const saveAttendanceBatch = (statuses) =>
    updateData((current) => {
      const date = today()
      const attendanceByEmployee = new Map(
        current.attendance
          .filter((item) => item.date === date)
          .map((item) => [item.employeeId, item]),
      )
      const records = Object.entries(statuses).map(([employeeId, status]) => {
        const existing = attendanceByEmployee.get(employeeId)
        return {
          id: existing?.id || `${date}-${employeeId}`,
          employeeId,
          date,
          status,
          checkIn: ['Present', 'Late'].includes(status) ? existing?.checkIn || '09:00' : '',
          checkOut: existing?.checkOut || '',
          note: existing?.note || '',
        }
      })
      return {
        ...current,
        attendance: [...current.attendance.filter((item) => item.date !== date), ...records],
      }
    }, 'Attendance register saved')
  const approveLeave = (requestId, status) => {
    const request = data.leaveRequests.find((item) => item.id === requestId)
    if (!request || request.status !== 'Pending')
      return onNotify('This leave request has already been reviewed.')
    if (status === 'Approved') {
      const type = data.leaveTypes.find((item) => item.id === request.typeId)
      const used = data.leaveRequests
        .filter(
          (item) =>
            item.employeeId === request.employeeId &&
            item.typeId === request.typeId &&
            item.status === 'Approved',
        )
        .reduce((sum, item) => sum + item.days, 0)
      if (!type || used + request.days > type.days) {
        return onNotify('This request exceeds the employee’s available leave balance.')
      }
    }
    updateData((current) => {
      const nextRequests = current.leaveRequests.map((item) =>
        item.id === requestId && item.status === 'Pending'
          ? { ...item, status, reviewedAt: new Date().toISOString() }
          : item,
      )
      return { ...current, leaveRequests: nextRequests }
    }, `Leave request ${status.toLowerCase()}`)
  }

  const baseProps = {
    data,
    updateData,
    employees,
    branches,
    departments,
    employeeName,
    branchName,
    departmentName,
    selectedEmployee,
    selectedEmployeeId,
    selectEmployee,
    onNavigate,
    onNotify,
    saveEmployee,
  }
  let content
  switch (page) {
    case 'Human Resource Dashboard':
      content = <HumanResourceDashboard {...baseProps} />
      break
    case 'Employee Directory':
      content = (
        <EmployeeDirectory
          {...baseProps}
          filteredEmployees={filteredEmployees}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )
      break
    case 'Add Employee':
      content = <AddEmployee {...baseProps} editing={page === 'Edit Employee'} />
      break
    case 'Edit Employee':
      content = <AddEmployee {...baseProps} editing />
      break
    case 'Employee Profile':
      content = <EmployeeProfile {...baseProps} />
      break
    case 'Employee Documents':
      content = <EmployeeDocuments {...baseProps} />
      break
    case 'Transfers & Promotions':
      content = <TransfersPromotions {...baseProps} onEmployeesChange={onEmployeesChange} />
      break
    case 'Employee Reports':
      content = <EmployeeReports {...baseProps} />
      break
    case 'Daily Attendance':
      content = <DailyAttendance {...baseProps} />
      break
    case 'Mark Attendance':
      content = <MarkAttendance {...baseProps} onMarkMany={saveAttendanceBatch} />
      break
    case 'Attendance Corrections':
      content = <AttendanceCorrections {...baseProps} />
      break
    case 'Shift Assignments':
      content = <ShiftAssignments {...baseProps} />
      break
    case 'Attendance Reports':
      content = <AttendanceReports {...baseProps} />
      break
    case 'Leave Types':
      content = <LeaveTypes {...baseProps} />
      break
    case 'Leave Requests':
      content = <LeaveRequests {...baseProps} />
      break
    case 'Apply for Leave':
      content = <ApplyForLeave {...baseProps} />
      break
    case 'Leave Approvals':
      content = <LeaveApprovals {...baseProps} onApprove={approveLeave} />
      break
    case 'Leave Balances':
      content = <LeaveBalances {...baseProps} />
      break
    case 'Leave Reports':
      content = <LeaveReports {...baseProps} />
      break
    case 'Shift List':
      content = <ShiftList {...baseProps} />
      break
    case 'Create Shift':
      content = <CreateShift {...baseProps} />
      break
    case 'Employee Rosters':
      content = <EmployeeRosters {...baseProps} />
      break
    case 'Shift Reports':
      content = <ShiftReports {...baseProps} />
      break
    case 'Performance Reviews':
      content = <PerformanceReviews {...baseProps} />
      break
    case 'Employee Evaluations':
      content = <EmployeeEvaluations {...baseProps} />
      break
    case 'Goals & KPIs':
      content = <GoalsKPIs {...baseProps} />
      break
    case 'Performance Reports':
      content = <PerformanceReports {...baseProps} />
      break
    default:
      content = <HumanResourceDashboard {...baseProps} />
  }
  return <div className="hr-module">{content}</div>
}
