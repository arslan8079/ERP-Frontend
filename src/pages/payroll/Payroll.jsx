import { useMemo, useRef, useState } from 'react'
import { today, monthKey, monthLabel, idFor, activeEmployees, calculateSalary } from './shared'
import PayrollDashboard from './dashboard/PayrollDashboard'
import SalaryStructures from './salary-configuration/SalaryStructures'
import CreateSalaryStructure from './salary-configuration/CreateSalaryStructure'
import AllowancesDeductions from './salary-configuration/AllowancesDeductions'
import EmployeeSalaryAssignment from './salary-configuration/EmployeeSalaryAssignment'
import PayrollPeriods from './payroll-processing/PayrollPeriods'
import GeneratePayroll from './payroll-processing/GeneratePayroll'
import PayrollDrafts from './payroll-processing/PayrollDrafts'
import ReviewApproval from './payroll-processing/ReviewApproval'
import FinalizePayroll from './payroll-processing/FinalizePayroll'
import PayrollHistory from './payroll-processing/PayrollHistory'
import PendingSalaries from './salary-payments/PendingSalaries'
import ProcessPayments from './salary-payments/ProcessPayments'
import PaymentRecords from './salary-payments/PaymentRecords'
import SalarySlips from './salary-payments/SalarySlips'
import AdvanceRequests from './advances-loans/AdvanceRequests'
import ApproveAdvances from './advances-loans/ApproveAdvances'
import LoanRecords from './advances-loans/LoanRecords'
import InstallmentRecovery from './advances-loans/InstallmentRecovery'
import PayrollReportPage from './payroll-reports/PayrollReportPage'

const storageKey = 'greenfield-payroll-v1'
function initialData(sourceEmployees) {
  const employees = activeEmployees(sourceEmployees)
  const structures = [
    {
      id: 'SS-001',
      name: 'Standard Monthly',
      basicPercent: 70,
      allowances: [
        { name: 'House allowance', type: 'Fixed', amount: 12000 },
        { name: 'Transport allowance', type: 'Fixed', amount: 5000 },
      ],
      deductions: [
        { name: 'Income tax', type: 'Fixed', amount: 3500 },
        { name: 'Provident fund', type: 'Percentage', amount: 5 },
      ],
      status: 'Active',
    },
    {
      id: 'SS-002',
      name: 'Sales & Field Staff',
      basicPercent: 65,
      allowances: [
        { name: 'House allowance', type: 'Fixed', amount: 10000 },
        { name: 'Field allowance', type: 'Fixed', amount: 8500 },
      ],
      deductions: [{ name: 'Income tax', type: 'Fixed', amount: 3000 }],
      status: 'Active',
    },
  ]
  const components = [
    {
      id: 'PC-001',
      name: 'House allowance',
      type: 'Allowance',
      calculation: 'Fixed',
      amount: 12000,
      taxable: true,
      status: 'Active',
    },
    {
      id: 'PC-002',
      name: 'Transport allowance',
      type: 'Allowance',
      calculation: 'Fixed',
      amount: 5000,
      taxable: true,
      status: 'Active',
    },
    {
      id: 'PC-003',
      name: 'Income tax',
      type: 'Deduction',
      calculation: 'Fixed',
      amount: 3500,
      taxable: false,
      status: 'Active',
    },
    {
      id: 'PC-004',
      name: 'Provident fund',
      type: 'Deduction',
      calculation: 'Percentage',
      amount: 5,
      taxable: false,
      status: 'Active',
    },
  ]
  const assignments = employees.map((employee, index) => ({
    id: `SA-${String(index + 1).padStart(3, '0')}`,
    employeeId: employee.id,
    structureId: index % 4 === 1 ? 'SS-002' : 'SS-001',
    monthlySalary: Number(employee.salary) || 78000 + index * 6500,
    effectiveDate: `${new Date().getFullYear()}-01-01`,
    status: 'Active',
  }))
  const currentPeriod = monthKey()
  const previousDate = new Date()
  previousDate.setDate(1)
  previousDate.setMonth(previousDate.getMonth() - 1)
  const previousPeriod = monthKey(previousDate)
  const historicalSlips = employees.map((employee) =>
    calculateSalary(
      employee,
      assignments.find((item) => item.employeeId === employee.id),
      structures,
    ),
  )
  const historicalBatch = {
    id: `PAY-${previousPeriod.replace('-', '')}`,
    periodId: previousPeriod,
    status: 'Paid',
    payslips: historicalSlips,
    gross: historicalSlips.reduce((sum, item) => sum + item.gross, 0),
    deductions: historicalSlips.reduce((sum, item) => sum + item.totalDeductions, 0),
    net: historicalSlips.reduce((sum, item) => sum + item.net, 0),
    employeeCount: historicalSlips.length,
    createdAt: previousPeriod,
    approvedAt: previousPeriod,
    finalizedAt: previousPeriod,
    paidAt: previousPeriod,
  }
  const payments = historicalSlips.map((slip, index) => ({
    id: `PM-${previousPeriod.replace('-', '')}-${String(index + 1).padStart(3, '0')}`,
    batchId: historicalBatch.id,
    periodId: previousPeriod,
    employeeId: slip.employeeId,
    employeeName: slip.employeeName,
    amount: slip.net,
    method: 'Bank transfer',
    reference: `BANK-${previousPeriod.replace('-', '')}-${String(index + 1).padStart(3, '0')}`,
    date: previousPeriod,
    status: 'Paid',
  }))
  return {
    structures,
    components,
    assignments,
    periods: [
      { id: currentPeriod, status: 'Open' },
      { id: previousPeriod, status: 'Paid' },
    ],
    batches: [historicalBatch],
    payments,
    advances: [],
    loans: [],
    recoveries: [],
  }
}

function loadData(sourceEmployees) {
  const defaults = initialData(sourceEmployees)
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return defaults
    const parsed = JSON.parse(saved)
    const stored = Object.fromEntries(
      Object.keys(defaults).map((key) => [
        key,
        Array.isArray(parsed[key]) ? parsed[key] : defaults[key],
      ]),
    )
    const assigned = new Set(stored.assignments.map((item) => item.employeeId))
    const missing = defaults.assignments.filter((item) => !assigned.has(item.employeeId))
    return { ...stored, assignments: [...stored.assignments, ...missing] }
  } catch (error) {
    console.error('Unable to load payroll data:', error)
    return defaults
  }
}

function PayrollModule({ page, employees: sourceEmployees, onNotify, onNavigate }) {
  const [data, setData] = useState(() => loadData(sourceEmployees))
  const dataRef = useRef(data)
  const [employeeSearch, setEmployeeSearch] = useState('')
  const employees = activeEmployees(sourceEmployees)
  const employeeName = (id) =>
    sourceEmployees.find((item) => item.id === id)?.name || 'Unknown employee'
  const periodName = (id) => monthLabel(id)
  const notify = onNotify
  const updateData = (updater, message) => {
    const next =
      typeof updater === 'function' ? updater(dataRef.current) : { ...dataRef.current, ...updater }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      dataRef.current = next
      setData(next)
      if (message) notify(message)
      return true
    } catch (error) {
      console.error('Unable to save payroll data:', error)
      notify('Payroll changes could not be saved. Check available browser storage and try again.')
      return false
    }
  }
  const createStructure = (values) =>
    updateData(
      (current) => ({
        ...current,
        structures: [
          ...current.structures,
          {
            ...values,
            id: idFor('SS'),
            basicPercent: Number(values.basicPercent),
            allowances: [
              {
                name: values.allowanceName.trim(),
                type: 'Fixed',
                amount: Number(values.allowanceAmount) || 0,
              },
            ].filter((item) => item.name),
            deductions: [
              {
                name: values.deductionName.trim(),
                type: 'Fixed',
                amount: Number(values.deductionAmount) || 0,
              },
            ].filter((item) => item.name),
            status: 'Active',
          },
        ],
      }),
      'Salary structure created',
    )
  const createComponent = (values) =>
    updateData(
      (current) => ({
        ...current,
        components: [
          ...current.components,
          { ...values, id: idFor('PC'), amount: Number(values.amount), status: 'Active' },
        ],
      }),
      'Payroll component created',
    )
  const saveAssignment = (values) => {
    const duplicate = data.assignments.find((item) => item.employeeId === values.employeeId)
    return updateData((current) => {
      const assignment = {
        ...values,
        id: duplicate?.id || idFor('SA'),
        monthlySalary: Number(values.monthlySalary),
        status: 'Active',
      }
      return {
        ...current,
        assignments: duplicate
          ? current.assignments.map((item) =>
              item.employeeId === values.employeeId ? assignment : item,
            )
          : [...current.assignments, assignment],
      }
    }, 'Employee salary assignment saved')
  }
  const createPeriod = (periodId) => {
    if (data.periods.some((item) => item.id === periodId))
      return notify('A payroll period already exists for this month.')
    updateData(
      (current) => ({
        ...current,
        periods: [...current.periods, { id: periodId, status: 'Open' }].sort((a, b) =>
          b.id.localeCompare(a.id),
        ),
      }),
      `${periodName(periodId)} payroll period created`,
    )
  }
  const generatePayroll = (periodId) => {
    const period = data.periods.find((item) => item.id === periodId)
    if (!period || period.status !== 'Open')
      return notify('Only an open payroll period can be processed.')
    if (data.batches.some((item) => item.periodId === periodId))
      return notify('A payroll batch already exists for this period.')
    const slips = employees.map((employee) =>
      calculateSalary(
        employee,
        data.assignments.find((item) => item.employeeId === employee.id),
        data.structures,
        data.loans,
      ),
    )
    if (!slips.length || slips.some((item) => item.structureName === 'Unassigned'))
      return notify(
        'Assign an active salary structure to every employee before generating payroll.',
      )
    const batch = {
      id: `PAY-${periodId.replace('-', '')}-${String(Date.now()).slice(-3)}`,
      periodId,
      status: 'Draft',
      payslips: slips,
      gross: slips.reduce((sum, item) => sum + item.gross, 0),
      deductions: slips.reduce((sum, item) => sum + item.totalDeductions, 0),
      net: slips.reduce((sum, item) => sum + item.net, 0),
      employeeCount: slips.length,
      createdAt: today(),
    }
    if (
      updateData(
        (current) => ({
          ...current,
          batches: [batch, ...current.batches],
          periods: current.periods.map((item) =>
            item.id === periodId ? { ...item, status: 'Processing' } : item,
          ),
        }),
        'Payroll draft generated. Review the batch before finalizing.',
      )
    )
      onNavigate('Payroll Drafts')
  }
  const setBatchStatus = (batchId, status) =>
    updateData(
      (current) => ({
        ...current,
        batches: current.batches.map((batch) =>
          batch.id === batchId
            ? {
                ...batch,
                status,
                ...(status === 'In Review' ? { submittedAt: today() } : {}),
                ...(status === 'Reviewed' ? { approvedAt: today() } : {}),
              }
            : batch,
        ),
      }),
      status === 'In Review'
        ? 'Payroll batch submitted for review'
        : status === 'Reviewed'
          ? 'Payroll batch approved for finalization'
          : 'Payroll batch returned to drafts',
    )
  const finalizePayroll = (batchId) => {
    const batch = data.batches.find((item) => item.id === batchId)
    if (!batch || batch.status !== 'Reviewed')
      return notify('Only an approved payroll batch can be finalized.')
    const recoveries = batch.payslips.flatMap((slip) =>
      slip.loanDeductions.map((item) => ({
        id: idFor('REC'),
        loanId: item.loanId,
        employeeId: slip.employeeId,
        batchId,
        periodId: batch.periodId,
        amount: item.amount,
        date: today(),
      })),
    )
    updateData(
      (current) => ({
        ...current,
        batches: current.batches.map((item) =>
          item.id === batchId ? { ...item, status: 'Finalized', finalizedAt: today() } : item,
        ),
        periods: current.periods.map((item) =>
          item.id === batch.periodId ? { ...item, status: 'Finalized' } : item,
        ),
        loans: current.loans.map((loan) => {
          const amount = recoveries
            .filter((item) => item.loanId === loan.id)
            .reduce((sum, item) => sum + item.amount, 0)
          const recovered = Number(loan.recovered) + amount
          return amount
            ? { ...loan, recovered, status: recovered >= Number(loan.amount) ? 'Repaid' : 'Active' }
            : loan
        }),
        recoveries: [...recoveries, ...current.recoveries],
      }),
      'Payroll finalized. Salary payments are now ready to process.',
    )
  }
  const processPayments = (batchId) => {
    const batch = data.batches.find((item) => item.id === batchId)
    if (!batch || batch.status !== 'Finalized')
      return notify('Finalize the approved payroll batch before processing payments.')
    const pending = batch.payslips.filter(
      (slip) =>
        !data.payments.some(
          (payment) => payment.batchId === batchId && payment.employeeId === slip.employeeId,
        ),
    )
    if (!pending.length) return notify('All salaries in this batch have already been paid.')
    const payments = pending.map((slip) => ({
      id: idFor('PM'),
      batchId,
      periodId: batch.periodId,
      employeeId: slip.employeeId,
      employeeName: slip.employeeName,
      amount: slip.net,
      method: 'Bank transfer',
      reference: `BANK-${batch.periodId.replace('-', '')}-${slip.employeeId}`,
      date: today(),
      status: 'Paid',
    }))
    updateData(
      (current) => ({
        ...current,
        payments: [...payments, ...current.payments],
        batches: current.batches.map((item) =>
          item.id === batchId ? { ...item, status: 'Paid', paidAt: today() } : item,
        ),
        periods: current.periods.map((item) =>
          item.id === batch.periodId ? { ...item, status: 'Paid' } : item,
        ),
      }),
      `${payments.length} salary payment(s) recorded`,
    )
  }
  const requestAdvance = (values) =>
    updateData(
      (current) => ({
        ...current,
        advances: [
          {
            ...values,
            id: idFor('ADV'),
            amount: Number(values.amount),
            months: Number(values.months),
            status: 'Pending',
            requestedAt: today(),
          },
          ...current.advances,
        ],
      }),
      'Advance request submitted for approval',
    )
  const decideAdvance = (advanceId, status) => {
    const advance = data.advances.find((item) => item.id === advanceId)
    if (!advance || advance.status !== 'Pending') return
    updateData(
      (current) => ({
        ...current,
        advances: current.advances.map((item) =>
          item.id === advanceId ? { ...item, status, decidedAt: today() } : item,
        ),
        loans:
          status === 'Approved'
            ? [
                {
                  id: idFor('LN'),
                  advanceId,
                  employeeId: advance.employeeId,
                  amount: advance.amount,
                  installment: Math.ceil(advance.amount / advance.months),
                  recovered: 0,
                  status: 'Active',
                  issuedAt: today(),
                },
                ...current.loans,
              ]
            : current.loans,
      }),
      status === 'Approved'
        ? 'Advance approved and loan schedule created'
        : 'Advance request rejected',
    )
  }
  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) =>
        `${employee.name} ${employee.id} ${employee.role}`
          .toLowerCase()
          .includes(employeeSearch.trim().toLowerCase()),
      ),
    [employees, employeeSearch],
  )
  const pageProps = {
    data,
    employees,
    filteredEmployees,
    employeeName,
    periodName,
    updateData,
    createStructure,
    createComponent,
    saveAssignment,
    createPeriod,
    generatePayroll,
    setBatchStatus,
    finalizePayroll,
    processPayments,
    requestAdvance,
    decideAdvance,
    onNavigate,
    onNotify: notify,
  }

  let content
  switch (page) {
    case 'Payroll Dashboard':
      content = <PayrollDashboard {...pageProps} />
      break
    case 'Salary Structures':
      content = <SalaryStructures {...pageProps} />
      break
    case 'Create Salary Structure':
      content = <CreateSalaryStructure {...pageProps} />
      break
    case 'Allowances & Deductions':
      content = <AllowancesDeductions {...pageProps} />
      break
    case 'Employee Salary Assignment':
      content = <EmployeeSalaryAssignment {...pageProps} />
      break
    case 'Payroll Periods':
      content = <PayrollPeriods {...pageProps} />
      break
    case 'Generate Payroll':
      content = <GeneratePayroll {...pageProps} />
      break
    case 'Payroll Drafts':
      content = (
        <PayrollDrafts
          {...pageProps}
          statuses={['Draft']}
          title="Payroll Drafts"
          subtitle="Inspect generated payroll batches and submit them for approval."
          action="Submit for review"
          nextStatus="In Review"
        />
      )
      break
    case 'Review & Approval':
      content = <ReviewApproval {...pageProps} />
      break
    case 'Finalize Payroll':
      content = <FinalizePayroll {...pageProps} />
      break
    case 'Payroll History':
      content = (
        <PayrollHistory
          {...pageProps}
          statuses={['Finalized', 'Paid']}
          title="Payroll History"
          subtitle="Auditable record of finalized payroll runs and payment progress."
        />
      )
      break
    case 'Pending Salaries':
      content = <PendingSalaries {...pageProps} />
      break
    case 'Process Payments':
      content = <ProcessPayments {...pageProps} />
      break
    case 'Payment Records':
      content = <PaymentRecords {...pageProps} />
      break
    case 'Salary Slips':
      content = <SalarySlips {...pageProps} />
      break
    case 'Advance Requests':
      content = <AdvanceRequests {...pageProps} />
      break
    case 'Approve Advances':
      content = <ApproveAdvances {...pageProps} />
      break
    case 'Loan Records':
      content = <LoanRecords {...pageProps} />
      break
    case 'Installment Recovery':
      content = <InstallmentRecovery {...pageProps} />
      break
    default:
      content = (
        <PayrollReportPage
          {...pageProps}
          page={page}
          employeeSearch={employeeSearch}
          setEmployeeSearch={setEmployeeSearch}
        />
      )
  }
  return <div className="payroll-module">{content}</div>
}

export default PayrollModule
