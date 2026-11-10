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
} = Shared

export default function PendingSalariesPage({ data, periodName, onNavigate }) {
  const batches = data.batches.filter((item) => item.status === 'Finalized')
  const due = batches.reduce((sum, item) => sum + item.net, 0)
  return (
    <>
      <PageHeader
        title="Pending Salaries"
        subtitle="Review finalized net salary liabilities that have not yet been paid."
        icon={Banknote}
        action={
          <Button onClick={() => onNavigate('Process Payments')}>
            <Banknote size={15} />
            Process payments
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
          value={batches.reduce((sum, item) => sum + item.employeeCount, 0)}
          tone="blue"
        />
      </div>
      <Card title="Finalized salary liabilities" icon={ListChecks}>
        <Table
          headers={[
            'Batch',
            'Pay period',
            'Employees',
            'Net payable',
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
                <b>{money(batch.net)}</b>
              </td>
              <td>{batch.finalizedAt}</td>
              <td>
                <Status>Unpaid</Status>
              </td>
              <td>
                <button className="pr-link" onClick={() => onNavigate('Process Payments')}>
                  Pay salaries <ChevronRight size={14} />
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
