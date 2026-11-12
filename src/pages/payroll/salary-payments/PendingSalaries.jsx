import { Banknote, ChevronRight, CircleDollarSign, Clock3, ListChecks, Users } from 'lucide-react'
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
  employeeOutstandingAmount,
} = Shared

export default function PendingSalariesPage({ data, periodName, onNavigate }) {
  const batches = data.batches.filter(
    (item) => item.status === 'Finalized' && batchOutstandingAmount(item, data.payments) > 0,
  )
  const due = batches.reduce((sum, item) => sum + batchOutstandingAmount(item, data.payments), 0)
  return (
    <>
      <PageHeader
        title="Pending Salaries"
        subtitle="Review finalized net salary liabilities that have not yet been paid."
        icon={Banknote}
        action={
          <Button onClick={() => onNavigate('Process Payments')}>
            <Banknote size={15} />
            Record instructions
          </Button>
        }
      />
      <div className="pr-stats compact">
        <Stat icon={Clock3} label="Unpaid batches" value={batches.length} tone="amber" />
        <Stat
          icon={CircleDollarSign}
          label="Total pending salaries"
          value={money(due)}
          tone="green"
        />
        <Stat
          icon={Users}
          label="Employees to pay"
          value={batches.reduce(
            (sum, batch) =>
              sum +
              batch.payslips.filter(
                (slip) => employeeOutstandingAmount(batch, slip, data.payments) > 0,
              ).length,
            0,
          )}
          tone="blue"
        />
      </div>
      <Card title="Finalized salary liabilities" icon={ListChecks}>
        <Table
          headers={[
            'Batch',
            'Pay period',
            'Employees',
            'Outstanding balance',
            'Finalized',
            'Payment status',
            '',
          ]}
        >
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>
                <b>{batch.id}</b>
              </td>
              <td>{periodName(batch.periodId)}</td>
              <td>{batch.employeeCount}</td>
              <td>
                <b>{money(batchOutstandingAmount(batch, data.payments))}</b>
              </td>
              <td>{batch.finalizedAt}</td>
              <td>
                <Status>
                  {data.payments.some(
                    (payment) =>
                      payment.batchId === batch.id &&
                      payment.status === 'Pending bank confirmation',
                  )
                    ? 'Instruction pending'
                    : data.payments.some(
                          (payment) => payment.batchId === batch.id && payment.status === 'Failed',
                        )
                      ? 'Failed payment · retry due'
                      : 'Unpaid / partial'}
                </Status>
              </td>
              <td>
                <button
                  className="pr-link"
                  onClick={() =>
                    onNavigate(
                      data.payments.some(
                        (payment) =>
                          payment.batchId === batch.id &&
                          payment.status === 'Pending bank confirmation',
                      )
                        ? 'Payment Records'
                        : 'Process Payments',
                    )
                  }
                >
                  {data.payments.some(
                    (payment) =>
                      payment.batchId === batch.id &&
                      payment.status === 'Pending bank confirmation',
                  )
                    ? 'Record outcomes'
                    : 'Record / retry instructions'}{' '}
                  <ChevronRight size={14} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {!batches.length && <Empty>There are no finalized salary batches awaiting payment.</Empty>}
      </Card>
    </>
  )
}
