import { ArrowRight, Coins, FileClock, ListChecks } from 'lucide-react'
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

export default function BatchListPage({
  data,
  statuses,
  title,
  subtitle,
  action,
  nextStatus,
  setBatchStatus,
  periodName,
  onNavigate,
}) {
  const batches = data.batches.filter((item) => statuses.includes(item.status))
  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={FileClock}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Generate Payroll')}>
            <Coins size={15} />
            Generate payroll
          </Button>
        }
      />
      <Card title={`Payroll batches · ${batches.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Batch / period',
            'Employees',
            'Gross earnings',
            'Deductions',
            'Net payable',
            'Created',
            'Status',
            ...(action ? ['Action'] : []),
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
              <td>{batch.createdAt}</td>
              <td>
                <Status>{batch.status}</Status>
              </td>
              {action && (
                <td>
                  <Button kind="small" onClick={() => setBatchStatus(batch.id, nextStatus)}>
                    {action} <ArrowRight size={13} />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </Table>
        {!batches.length && <Empty>There are no payroll batches at this stage.</Empty>}
      </Card>
    </>
  )
}
