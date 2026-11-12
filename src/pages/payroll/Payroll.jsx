import { useMemo, useRef, useState } from 'react'
import { buildPaymentInstructions } from './paymentInstructions'
import {
  today,
  monthKey,
  monthLabel,
  idFor,
  activeEmployees,
  calculateSalary,
  batchHasVarianceReasons,
  batchIsSettled,
  periodCanClose,
  payrollVariances,
  summarizePayrollBasis,
} from './shared'
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
    masterHistory: [],
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
    periodHistory: [],
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
  const [editingStructureId, setEditingStructureId] = useState('')
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
        masterHistory: [
          {
            id: idFor('PMH'),
            date: today(),
            entityType: 'Salary structure',
            entityName: values.name.trim(),
            action: 'Created',
            details: 'Salary structure created.',
          },
          ...(current.masterHistory || []),
        ],
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
  const saveStructure = (structureId, values) => {
    const existing = dataRef.current.structures.find((item) => item.id === structureId)
    if (!existing) return notify('Salary structure record not found.')
    if (
      dataRef.current.structures.some(
        (item) =>
          item.id !== structureId && item.name.toLowerCase() === values.name.trim().toLowerCase(),
      )
    )
      return notify('A salary structure with this name already exists.')
    const basicPercent = Number(values.basicPercent)
    if (
      !values.name.trim() ||
      !Number.isFinite(basicPercent) ||
      basicPercent < 1 ||
      basicPercent > 100
    )
      return notify('Enter a structure name and a basic-pay percentage from 1 to 100.')
    const updateComponents = (items, name, amount) => {
      const trimmed = name.trim()
      if (!items.length)
        return trimmed ? [{ name: trimmed, type: 'Fixed', amount: Number(amount) || 0 }] : []
      return trimmed
        ? [{ ...items[0], name: trimmed, amount: Number(amount) || 0 }, ...items.slice(1)]
        : items.slice(1)
    }
    return updateData(
      (current) => ({
        ...current,
        structures: current.structures.map((item) =>
          item.id === structureId
            ? {
                ...item,
                name: values.name.trim(),
                basicPercent,
                allowances: updateComponents(
                  item.allowances || [],
                  values.allowanceName,
                  values.allowanceAmount,
                ),
                deductions: updateComponents(
                  item.deductions || [],
                  values.deductionName,
                  values.deductionAmount,
                ),
              }
            : item,
        ),
        masterHistory: [
          {
            id: idFor('PMH'),
            date: today(),
            entityType: 'Salary structure',
            entityName: existing.name,
            action: 'Updated',
            details:
              'Structure name, basic-pay percentage, and primary recurring components updated; additional components retained.',
          },
          ...(current.masterHistory || []),
        ],
      }),
      'Salary structure changes saved',
    )
  }
  const toggleStructureStatus = (structureId) => {
    const structure = dataRef.current.structures.find((item) => item.id === structureId)
    if (!structure) return notify('Salary structure record not found.')
    const currentStatus = structure.status || 'Active'
    const status = currentStatus === 'Active' ? 'Inactive' : 'Active'
    const assigned = dataRef.current.assignments.some(
      (item) => item.structureId === structureId && item.status !== 'Inactive',
    )
    if (status === 'Inactive' && assigned)
      return notify('Reassign employees before deactivating this salary structure.')
    return updateData(
      (current) => ({
        ...current,
        structures: current.structures.map((item) =>
          item.id === structureId ? { ...item, status } : item,
        ),
        masterHistory: [
          {
            id: idFor('PMH'),
            date: today(),
            entityType: 'Salary structure',
            entityName: structure.name,
            action: status === 'Active' ? 'Reactivated' : 'Deactivated',
            details: `Status changed from ${currentStatus} to ${status}.`,
          },
          ...(current.masterHistory || []),
        ],
      }),
      `Salary structure ${status.toLowerCase()}`,
    )
  }
  const createComponent = (values) =>
    updateData(
      (current) => ({
        ...current,
        masterHistory: [
          {
            id: idFor('PMH'),
            date: today(),
            entityType: 'Payroll component',
            entityName: values.name.trim(),
            action: 'Created',
            details: 'Payroll component created.',
          },
          ...(current.masterHistory || []),
        ],
        components: [
          ...current.components,
          { ...values, id: idFor('PC'), amount: Number(values.amount), status: 'Active' },
        ],
      }),
      'Payroll component created',
    )
  const saveComponent = (componentId, values) => {
    const existing = dataRef.current.components.find((item) => item.id === componentId)
    if (!existing) return notify('Payroll component record not found.')
    if (
      dataRef.current.components.some(
        (item) =>
          item.id !== componentId && item.name.toLowerCase() === values.name.trim().toLowerCase(),
      )
    )
      return notify('A payroll component with this name already exists.')
    if (!values.name.trim() || !Number.isFinite(Number(values.amount)) || Number(values.amount) < 0)
      return notify('Enter a component name and a non-negative amount or rate.')
    return updateData(
      (current) => ({
        ...current,
        components: current.components.map((item) =>
          item.id === componentId
            ? { ...item, ...values, name: values.name.trim(), amount: Number(values.amount) }
            : item,
        ),
        masterHistory: [
          {
            id: idFor('PMH'),
            date: today(),
            entityType: 'Payroll component',
            entityName: existing.name,
            action: 'Updated',
            details: 'Component name, calculation, amount/rate, and tax treatment updated.',
          },
          ...(current.masterHistory || []),
        ],
      }),
      'Payroll component changes saved',
    )
  }
  const toggleComponentStatus = (componentId) => {
    const component = dataRef.current.components.find((item) => item.id === componentId)
    if (!component) return notify('Payroll component record not found.')
    const currentStatus = component.status || 'Active'
    const status = currentStatus === 'Active' ? 'Inactive' : 'Active'
    return updateData(
      (current) => ({
        ...current,
        components: current.components.map((item) =>
          item.id === componentId ? { ...item, status } : item,
        ),
        masterHistory: [
          {
            id: idFor('PMH'),
            date: today(),
            entityType: 'Payroll component',
            entityName: component.name,
            action: status === 'Active' ? 'Reactivated' : 'Deactivated',
            details: `Status changed from ${currentStatus} to ${status}; existing salary structures and payroll remain unchanged.`,
          },
          ...(current.masterHistory || []),
        ],
      }),
      `Payroll component ${status.toLowerCase()}`,
    )
  }
  const saveAssignment = (values) => {
    if (
      !dataRef.current.structures.some(
        (item) => item.id === values.structureId && item.status === 'Active',
      )
    )
      return notify('Choose an active salary structure.')
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
    const current = dataRef.current
    const period = current.periods.find((item) => item.id === periodId)
    if (!period || period.status !== 'Open')
      return notify('Only an open payroll period can be processed.')
    if (current.batches.some((item) => item.periodId === periodId && item.status !== 'Reversed'))
      return notify('A payroll batch already exists for this period.')
    const payrollBasis = summarizePayrollBasis(periodId, employees)
    const slips = employees.map((employee) =>
      calculateSalary(
        employee,
        current.assignments.find((item) => item.employeeId === employee.id),
        current.structures,
        current.loans,
      ),
    )
    if (!slips.length || slips.some((item) => item.structureName === 'Unassigned'))
      return notify(
        'Assign an active salary structure to every employee before generating payroll.',
      )
    const variances = slips.map((slip) => {
      const previousBatch = current.batches
        .filter(
          (item) =>
            item.status === 'Paid' &&
            item.periodId < periodId &&
            item.payslips.some((previous) => previous.employeeId === slip.employeeId),
        )
        .sort((a, b) => b.periodId.localeCompare(a.periodId))[0]
      const previousSlip = previousBatch?.payslips.find(
        (item) => item.employeeId === slip.employeeId,
      )
      return {
        employeeId: slip.employeeId,
        employeeName: slip.employeeName,
        previousBatchId: previousBatch?.id || '',
        previousNet: previousSlip ? Number(previousSlip.net) : null,
        currentNet: slip.net,
        varianceAmount: previousSlip ? slip.net - Number(previousSlip.net) : null,
        reason: '',
      }
    })
    const revision = current.batches.filter((item) => item.periodId === periodId).length + 1
    const batch = {
      id: `PAY-${periodId.replace('-', '')}-${String(revision).padStart(2, '0')}`,
      periodId,
      revision,
      status: 'Draft',
      payslips: slips,
      gross: slips.reduce((sum, item) => sum + item.gross, 0),
      deductions: slips.reduce((sum, item) => sum + item.totalDeductions, 0),
      net: slips.reduce((sum, item) => sum + item.net, 0),
      employeeCount: slips.length,
      createdAt: today(),
      basis: payrollBasis,
      variances,
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
  const setBatchStatus = (batchId, status) => {
    const current = dataRef.current
    const batch = current.batches.find((item) => item.id === batchId)
    if (!batch || batch.status === 'Reversed') return notify('Payroll batch is not available.')
    if (status === 'Reviewed' && !batchHasVarianceReasons(batch, current.batches))
      return notify('Record a reason for every payroll variance before approving this batch.')
    return updateData(
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
  }
  const finalizePayroll = (batchId) => {
    const current = dataRef.current
    const batch = current.batches.find((item) => item.id === batchId)
    if (!batch || batch.status !== 'Reviewed')
      return notify('Only an approved payroll batch can be finalized.')
    const period = current.periods.find((item) => item.id === batch.periodId)
    if (period?.status === 'Closed')
      return notify('Reopen the payroll period with a reason before finalizing a correction.')
    const finalStatus = batchIsSettled(batch, current.payments) ? 'Paid' : 'Finalized'
    const batchesAfterFinalization = current.batches.map((item) =>
      item.id === batchId ? { ...item, status: finalStatus } : item,
    )
    const periodStatus =
      period?.status === 'Reopened'
        ? 'Reopened'
        : periodCanClose(batch.periodId, batchesAfterFinalization, current.payments)
          ? 'Paid'
          : 'Finalized'
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
          item.id === batchId
            ? {
                ...item,
                status: finalStatus,
                finalizedAt: today(),
                ...(finalStatus === 'Paid' ? { paidAt: today() } : {}),
              }
            : item,
        ),
        periods: current.periods.map((item) =>
          item.id === batch.periodId && item.status !== 'Reopened'
            ? { ...item, status: periodStatus }
            : item,
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
      'Payroll finalized. Payment instructions can now be recorded; no bank transfer is executed here.',
    )
  }
  const processPayments = (batchId) => {
    const current = dataRef.current
    const batch = current.batches.find((item) => item.id === batchId)
    if (!batch || batch.status !== 'Finalized')
      return notify('Finalize the approved payroll batch before processing payments.')
    const payments = buildPaymentInstructions(batch, current.payments, () => idFor('PM'), today())
    if (!payments.length)
      return notify('No outstanding balance is ready for a new payment instruction.')
    updateData(
      (current) => ({
        ...current,
        payments: [...payments, ...current.payments],
      }),
      `${payments.length} payment instruction(s) recorded locally; bank settlement is not confirmed`,
    )
  }
  const saveVarianceReason = (batchId, employeeId, reason) =>
    updateData(
      (current) => ({
        ...current,
        batches: current.batches.map((batch) =>
          batch.id === batchId
            ? {
                ...batch,
                variances: payrollVariances(batch, current.batches).map((variance) =>
                  variance.employeeId === employeeId ? { ...variance, reason } : variance,
                ),
              }
            : batch,
        ),
      }),
      '',
    )
  const recordPaymentOutcome = (paymentId, values) => {
    const current = dataRef.current
    const payment = current.payments.find((item) => item.id === paymentId)
    if (!payment || payment.status !== 'Pending bank confirmation')
      return notify('Only a pending payment instruction can receive an outcome.')
    if (!values.date) return notify('Enter the date of the payment outcome.')
    if (values.status === 'Failed' && !String(values.failureReason || '').trim())
      return notify('Enter a reason for the failed payment.')
    if (
      ['Paid', 'Partially Paid'].includes(values.status) &&
      !String(values.reference || '').trim()
    )
      return notify('Enter the settlement reference for this payment.')
    const paidAmount =
      values.status === 'Paid'
        ? Number(payment.amount)
        : values.status === 'Partially Paid'
          ? Number(values.paidAmount)
          : 0
    if (
      values.status === 'Partially Paid' &&
      (!Number.isFinite(paidAmount) || paidAmount <= 0 || paidAmount >= Number(payment.amount))
    )
      return notify(
        'A partial payment must be greater than zero and less than the instructed amount.',
      )
    const nextPayments = current.payments.map((item) =>
      item.id === paymentId
        ? {
            ...item,
            status: values.status,
            paidAmount,
            outcomeDate: values.date,
            settlementReference: String(values.reference || '').trim(),
            failureReason: String(values.failureReason || '').trim(),
          }
        : item,
    )
    const batch = current.batches.find((item) => item.id === payment.batchId)
    if (!batch) return notify('The payroll batch for this instruction was not found.')
    if (current.periods.find((item) => item.id === batch.periodId)?.status === 'Closed')
      return notify('Reopen the payroll period before recording a payment outcome.')
    const settled = batchIsSettled(batch, nextPayments)
    updateData(
      (latest) => ({
        ...latest,
        payments: nextPayments,
        batches: latest.batches.map((item) =>
          item.id === batch.id
            ? {
                ...item,
                status: settled ? 'Paid' : 'Finalized',
                ...(settled ? { paidAt: today() } : {}),
              }
            : item,
        ),
        periods: latest.periods.map((item) => {
          if (item.id !== batch.periodId || item.status === 'Reopened') return item
          if (
            periodCanClose(
              item.id,
              latest.batches.map((row) =>
                row.id === batch.id ? { ...row, status: settled ? 'Paid' : 'Finalized' } : row,
              ),
              nextPayments,
            )
          )
            return { ...item, status: 'Paid' }
          return item.status === 'Paid' ? { ...item, status: 'Finalized' } : item
        }),
      }),
      values.status === 'Failed'
        ? 'Payment failure recorded; the unpaid balance remains due.'
        : values.status === 'Partially Paid'
          ? 'Partial payment recorded; only the outstanding balance can be retried.'
          : 'Payment outcome recorded.',
    )
  }
  const reversePayroll = (batchId, reason) => {
    const current = dataRef.current
    const batch = current.batches.find((item) => item.id === batchId)
    if (!batch || batch.status !== 'Finalized')
      return notify('Only a finalized, unpaid payroll batch can be reversed.')
    if (!String(reason || '').trim()) return notify('Enter a reason for reversing this run.')
    if (current.payments.some((item) => item.batchId === batchId))
      return notify('A payment instruction already exists. Use an adjustment run instead.')
    const period = current.periods.find((item) => item.id === batch.periodId)
    if (
      period?.status === 'Closed' ||
      (period?.status === 'Reopened' && batch.type !== 'Adjustment')
    )
      return notify('Use an adjustment run for a closed or reopened payroll period.')
    const remainingBatches = current.batches.filter(
      (item) =>
        item.periodId === batch.periodId && item.id !== batchId && item.status !== 'Reversed',
    )
    const remainingSettled =
      remainingBatches.length > 0 &&
      remainingBatches.every(
        (item) => item.status === 'Paid' && batchIsSettled(item, current.payments),
      )
    const recoveryAmounts = current.recoveries
      .filter((item) => item.batchId === batchId && item.status !== 'Reversed')
      .reduce((totals, item) => {
        totals[item.loanId] = (totals[item.loanId] || 0) + Number(item.amount || 0)
        return totals
      }, {})
    updateData(
      (latest) => ({
        ...latest,
        batches: latest.batches.map((item) =>
          item.id === batchId
            ? {
                ...item,
                status: 'Reversed',
                reversedAt: today(),
                reversalReason: String(reason).trim(),
              }
            : item,
        ),
        periods: latest.periods.map((item) =>
          item.id === batch.periodId
            ? {
                ...item,
                status:
                  item.status === 'Reopened'
                    ? 'Reopened'
                    : remainingBatches.length === 0
                      ? 'Open'
                      : remainingSettled
                        ? 'Paid'
                        : 'Processing',
              }
            : item,
        ),
        loans: latest.loans.map((loan) => {
          const amount = recoveryAmounts[loan.id] || 0
          if (!amount) return loan
          const recovered = Math.max(0, Number(loan.recovered) - amount)
          return {
            ...loan,
            recovered,
            status: recovered >= Number(loan.amount) ? 'Repaid' : 'Active',
          }
        }),
        recoveries: latest.recoveries.map((item) =>
          item.batchId === batchId
            ? {
                ...item,
                status: 'Reversed',
                reversedAt: today(),
                reversalReason: String(reason).trim(),
              }
            : item,
        ),
        periodHistory: [
          {
            id: idFor('PER'),
            periodId: batch.periodId,
            action: 'Run reversed',
            date: today(),
            reason: String(reason).trim(),
            batchId,
          },
          ...latest.periodHistory,
        ],
      }),
      'Unpaid payroll run reversed. The period is open for a corrected revision.',
    )
  }
  const createAdjustmentRun = (sourceBatchId, values) => {
    const current = dataRef.current
    const sourceBatch = current.batches.find((item) => item.id === sourceBatchId)
    if (!sourceBatch || !['Finalized', 'Paid'].includes(sourceBatch.status))
      return notify('Adjustments require a finalized or paid source batch.')
    const period = current.periods.find((item) => item.id === sourceBatch.periodId)
    if (period?.status === 'Closed')
      return notify('Reopen the period with a reason before creating an adjustment.')
    const paymentStarted =
      sourceBatch.status === 'Paid' ||
      current.payments.some((item) => item.batchId === sourceBatchId)
    if (!paymentStarted && period?.status !== 'Reopened')
      return notify('Reverse and regenerate this run before payment instructions are created.')
    const sourceSlip = sourceBatch.payslips.find((item) => item.employeeId === values.employeeId)
    const amount = Number(values.amount)
    const reason = String(values.reason || '').trim()
    if (!sourceSlip) return notify('Choose an employee from the source payroll batch.')
    if (!Number.isFinite(amount) || amount === 0)
      return notify('Enter a non-zero adjustment amount.')
    if (!reason) return notify('Enter a reason for the payroll adjustment.')
    const payable = Math.max(0, amount)
    const recoveryDue = Math.max(0, -amount)
    const slip = {
      ...sourceSlip,
      structureName: 'Payroll adjustment',
      basic: 0,
      allowances: payable ? [{ name: 'Payroll correction adjustment', amount: payable }] : [],
      deductions: [],
      loanDeductions: [],
      gross: payable,
      totalDeductions: 0,
      net: payable,
      paymentStatus: 'Pending',
      adjustmentAmount: amount,
      adjustmentReason: reason,
      recoveryDue,
      recoveryResolution: null,
    }
    const adjustmentBatch = {
      id: idFor('PAY-ADJ'),
      periodId: sourceBatch.periodId,
      revision: current.batches.filter((item) => item.periodId === sourceBatch.periodId).length + 1,
      type: 'Adjustment',
      adjustmentOf: sourceBatchId,
      status: 'Draft',
      payslips: [slip],
      gross: payable,
      deductions: 0,
      net: payable,
      employeeCount: 1,
      createdAt: today(),
      variances: [
        {
          employeeId: slip.employeeId,
          employeeName: slip.employeeName,
          previousBatchId: sourceBatchId,
          previousNet: sourceSlip.net,
          currentNet: sourceSlip.net + amount,
          varianceAmount: amount,
          reason,
        },
      ],
    }
    updateData(
      (latest) => ({
        ...latest,
        batches: [adjustmentBatch, ...latest.batches],
        periods: latest.periods.map((item) =>
          item.id === sourceBatch.periodId && item.status !== 'Reopened'
            ? { ...item, status: 'Processing' }
            : item,
        ),
      }),
      'Adjustment run created and sent through review; the source payroll remains unchanged.',
    )
  }
  const resolveRecoveryDue = (batchId, employeeId, values) => {
    const current = dataRef.current
    const batch = current.batches.find((item) => item.id === batchId)
    const slip = batch?.payslips.find((item) => item.employeeId === employeeId)
    if (!batch || batch.status !== 'Finalized' || !slip?.recoveryDue)
      return notify('Only a finalized adjustment with outstanding recovery can be resolved.')
    if (
      !values.date ||
      !String(values.reference || '').trim() ||
      !String(values.reason || '').trim()
    )
      return notify('Enter the recovery date, reference, and resolution reason.')
    const payslips = batch.payslips.map((item) =>
      item.employeeId === employeeId
        ? {
            ...item,
            recoveryResolution: {
              date: values.date,
              reference: String(values.reference).trim(),
              reason: String(values.reason).trim(),
            },
          }
        : item,
    )
    const updatedBatch = { ...batch, payslips }
    const settled = batchIsSettled(updatedBatch, current.payments)
    updateData(
      (latest) => ({
        ...latest,
        batches: latest.batches.map((item) =>
          item.id === batchId
            ? {
                ...item,
                payslips,
                status: settled ? 'Paid' : item.status,
                ...(settled ? { paidAt: today() } : {}),
              }
            : item,
        ),
        periods: latest.periods.map((item) => {
          if (item.id !== batch.periodId || item.status === 'Reopened') return item
          const batches = latest.batches.map((row) =>
            row.id === batchId ? { ...row, payslips, status: settled ? 'Paid' : row.status } : row,
          )
          return periodCanClose(item.id, batches, latest.payments)
            ? { ...item, status: 'Paid' }
            : item
        }),
      }),
      'Recovery resolution recorded; no automatic deduction was made.',
    )
  }
  const closePeriod = (periodId) => {
    const current = dataRef.current
    const period = current.periods.find((item) => item.id === periodId)
    if (!period || period.status === 'Closed') return notify('Payroll period is already closed.')
    if (!periodCanClose(periodId, current.batches, current.payments))
      return notify('Settle all employee payments and recovery balances before closing the period.')
    updateData(
      (latest) => ({
        ...latest,
        periods: latest.periods.map((item) =>
          item.id === periodId ? { ...item, status: 'Closed', closedAt: today() } : item,
        ),
        periodHistory: [
          { id: idFor('PER'), periodId, action: 'Period closed', date: today() },
          ...latest.periodHistory,
        ],
      }),
      `${periodName(periodId)} payroll period closed.`,
    )
  }
  const reopenPeriod = (periodId, reason) => {
    const current = dataRef.current
    const period = current.periods.find((item) => item.id === periodId)
    if (!period || period.status !== 'Closed')
      return notify('Only a closed period can be reopened.')
    if (!String(reason || '').trim()) return notify('Enter a reason for reopening the period.')
    updateData(
      (latest) => ({
        ...latest,
        periods: latest.periods.map((item) =>
          item.id === periodId
            ? {
                ...item,
                status: 'Reopened',
                reopenedAt: today(),
                reopenReason: String(reason).trim(),
              }
            : item,
        ),
        periodHistory: [
          {
            id: idFor('PER'),
            periodId,
            action: 'Period reopened',
            date: today(),
            reason: String(reason).trim(),
          },
          ...latest.periodHistory,
        ],
      }),
      `${periodName(periodId)} reopened for adjustment runs; original batches remain unchanged.`,
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
    saveStructure,
    editingStructure: data.structures.find((item) => item.id === editingStructureId),
    setEditingStructureId,
    editStructure: (structureId) => {
      setEditingStructureId(structureId)
      onNavigate('Create Salary Structure')
    },
    toggleStructureStatus,
    createComponent,
    saveComponent,
    toggleComponentStatus,
    saveAssignment,
    createPeriod,
    generatePayroll,
    setBatchStatus,
    saveVarianceReason,
    finalizePayroll,
    reversePayroll,
    createAdjustmentRun,
    resolveRecoveryDue,
    closePeriod,
    reopenPeriod,
    processPayments,
    recordPaymentOutcome,
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
      content = (
        <CreateSalaryStructure
          key={pageProps.editingStructure?.id || 'new-structure'}
          {...pageProps}
        />
      )
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
          statuses={['Finalized', 'Paid', 'Reversed']}
          title="Payroll History"
          subtitle="Review finalized, paid, and reversed runs; corrections preserve the source payroll."
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
