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
  batchOutstandingAmount,
} = Shared

export default function ProcessPaymentsPage({ data, processPayments, periodName, onNavigate }) {
  const batches = data.batches.filter(
    (item) => item.status === 'Finalized' && batchOutstandingAmount(item, data.payments) > 0,
  )
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
            'Outstanding balance',
            'Pending instructions',
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
                <b>{money(batchOutstandingAmount(batch, data.payments))}</b>
              </td>
              <td>
                {
                  data.payments.filter(
                    (payment) =>
                      payment.batchId === batch.id &&
                      payment.status === 'Pending bank confirmation',
                  ).length
                }
              </td>
              <td>
                <Status>
                  {data.payments.some(
                    (payment) =>
                      payment.batchId === batch.id &&
                      payment.status === 'Pending bank confirmation',
                  )
                    ? 'Instruction pending'
                    : 'Ready to record'}
                </Status>
              </td>
              <td>
                <Button
                  kind="small"
                  disabled={data.payments.some(
                    (payment) =>
                      payment.batchId === batch.id &&
                      payment.status === 'Pending bank confirmation',
                  )}
                  onClick={() => processPayments(batch.id)}
                >
                  <Check size={13} />
                  Create / retry instructions
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {!batches.length && (
          <Empty>
            Finalize a batch with an outstanding payable balance to record instructions.
          </Empty>
        )}
      </Card>
      <Callout
        title="Payment controls"
        text="Instructions are recorded locally. Enter each employee's paid, partial, or failed result in Payment Records; retries cover only the remaining balance. No bank transfer is executed or confirmed here."
        action={
          <Button kind="secondary" onClick={() => onNavigate('Payment Records')}>
            Open payment records
          </Button>
        }
      />
    </>
  )
}
