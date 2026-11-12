import { CheckCircle2, ChevronRight, LockKeyhole, ShieldCheck } from 'lucide-react'
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

export default function FinalizePage({ data, finalizePayroll, periodName, onNavigate }) {
  const batches = data.batches.filter((item) => item.status === 'Reviewed')
  return (
    <>
      <PageHeader
        title="Finalize Payroll"
        subtitle="Lock an approved payroll batch and post its loan installment recoveries."
        icon={LockKeyhole}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Payroll History')}>
            Payroll history <ChevronRight size={15} />
          </Button>
        }
      />
      <div className="pr-warning">
        <ShieldCheck size={19} />
        <span>
          <b>Finalization is a controlled step.</b> It locks the reviewed batch, posts loan
          recoveries once, and enables local payment-instruction recording. It does not execute or
          confirm a bank transfer.
        </span>
      </div>
      <Card title={`Approved batches · ${batches.length}`} icon={CheckCircle2}>
        <Table
          headers={[
            'Batch / period',
            'Employees',
            'Gross',
            'Deductions',
            'Net to pay',
            'Approved',
            'Action',
          ]}
        >
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>
                <b>{batch.id}</b>
                <small className="pr-cell-sub">{periodName(batch.periodId)}</small>
              </td>
              <td>{batch.employeeCount}</td>
              <td>{money(batch.gross)}</td>
              <td>{money(batch.deductions)}</td>
              <td>
                <b>{money(batch.net)}</b>
              </td>
              <td>{batch.approvedAt || '—'}</td>
              <td>
                <Button kind="small" onClick={() => finalizePayroll(batch.id)}>
                  <LockKeyhole size={13} />
                  Finalize run
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {!batches.length && <Empty>Only approved payroll batches can be finalized.</Empty>}
      </Card>
    </>
  )
}
