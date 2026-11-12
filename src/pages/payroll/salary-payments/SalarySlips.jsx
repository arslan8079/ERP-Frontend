import { useState } from 'react'
import { Download, ReceiptText } from 'lucide-react'
import * as Shared from '../shared'
const {
  today,
  monthKey,
  monthLabel,
  money,
  idFor,
  activeEmployees,
  calculateSalary,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  Empty,
  SalarySlip,
  AdvanceTable,
  PayslipTable,
  Field,
  Toolbar,
  Callout,
  ExportButton,
  downloadCsv,
} = Shared

export default function SalarySlipsPage({ data, employees, periodName, onNotify }) {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '')
  const employeeBatches = data.batches
    .filter(
      (batch) =>
        ['Finalized', 'Paid'].includes(batch.status) &&
        batch.payslips.some((slip) => slip.employeeId === employeeId),
    )
    .sort((a, b) => b.periodId.localeCompare(a.periodId) || b.id.localeCompare(a.id))
  const [batchId, setBatchId] = useState('')
  const batch = employeeBatches.find((item) => item.id === batchId) || employeeBatches[0]
  const slip = batch?.payslips.find((item) => item.employeeId === employeeId)
  const exportSlip = () => {
    if (!slip || !batch)
      return onNotify('No salary slip is available for this employee and period.')
    downloadCsv(
      `salary-slip-${employeeId}-${batch.periodId}.csv`,
      [
        ['Employee', slip.employeeName],
        ['Employee ID', slip.employeeId],
        ['Pay period', periodName(batch.periodId)],
        ['Basic salary', slip.basic],
        ...slip.allowances.map((item) => [item.name, item.amount]),
        ...slip.deductions.map((item) => [item.name, -item.amount]),
        ['Gross earnings', slip.gross],
        ['Total deductions', slip.totalDeductions],
        ['Net salary', slip.net],
        ...(slip.recoveryDue ? [['Recovery due', slip.recoveryDue]] : []),
      ],
      onNotify,
    )
  }
  return (
    <>
      <PageHeader
        title="Salary Slips"
        subtitle="View and download an employee’s itemized monthly earnings and deductions."
        icon={ReceiptText}
        action={
          <Button kind="secondary" onClick={exportSlip}>
            <Download size={15} />
            Download slip
          </Button>
        }
      />
      <div className="pr-toolbar standalone">
        <Field label="Employee">
          <select
            value={employeeId}
            onChange={(event) => {
              setEmployeeId(event.target.value)
              setBatchId('')
            }}
          >
            {employees.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.id}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Payroll run">
          <select
            value={batchId || batch?.id || ''}
            onChange={(event) => setBatchId(event.target.value)}
          >
            {employeeBatches.map((item) => (
              <option key={item.id} value={item.id}>
                {periodName(item.periodId)} · {item.id}
                {item.type === 'Adjustment' ? ' · Adjustment' : ''}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {slip && batch ? (
        <SalarySlip slip={slip} batch={batch} periodName={periodName} />
      ) : (
        <Empty>No processed payroll is available for this employee yet.</Empty>
      )}
    </>
  )
}
