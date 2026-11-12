import { Banknote, Check, ChevronRight, Landmark } from 'lucide-react'
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

export default function ProcessPaymentsPage({ data, processPayments, periodName, onNavigate }) {
  const batches = data.batches.filter((item) => item.status === 'Finalized')
  return (
    <>
      <PageHeader
        title="Record Payment Instructions"
        subtitle="Create local payment instructions for finalized salaries. No bank transfer is executed or confirmed here."
        icon={Banknote}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Payment Records')}>
            Payment records <ChevronRight size={15} />
          </Button>
        }
      />
      <Card title={`Finalized batches ready for instructions · ${batches.length}`} icon={Landmark}>
        <Table
          headers={[
            'Batch / period',
            'Employees',
            'Instruction method',
            'Instruction amount',
            'Status',
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
              <td>Bank transfer instruction</td>
              <td>
                <b>{money(batch.net)}</b>
              </td>
              <td>
                <Status>Ready to record</Status>
              </td>
              <td>
                <Button kind="small" onClick={() => processPayments(batch.id)}>
                  <Check size={13} />
                  Create instructions
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {!batches.length && (
          <Empty>Finalize an approved payroll batch before recording payment instructions.</Empty>
        )}
      </Card>
      <Callout
        title="Payment controls"
        text="This prototype records an instruction per employee only. It does not connect to a bank, execute transfers, or confirm settlement; batches remain finalized and unpaid until an external payment outcome is represented."
      />
    </>
  )
}
