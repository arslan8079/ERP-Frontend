import { CheckCircle2, CircleDollarSign, HandCoins, ListChecks } from 'lucide-react'
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

export default function LoanRecordsPage({ data, employees }) {
  return (
    <>
      <PageHeader
        title="Loan Records"
        subtitle="Track approved salary advances, outstanding balances and repayment status."
        icon={HandCoins}
      />
      <div className="pr-stats compact">
        <Stat
          icon={HandCoins}
          label="Active loans"
          value={data.loans.filter((item) => item.status === 'Active').length}
          tone="blue"
        />
        <Stat
          icon={CircleDollarSign}
          label="Outstanding balance"
          value={money(
            data.loans
              .filter((item) => item.status === 'Active')
              .reduce((sum, item) => sum + item.amount - item.recovered, 0),
          )}
        />
        <Stat
          icon={CheckCircle2}
          label="Fully repaid"
          value={data.loans.filter((item) => item.status === 'Repaid').length}
          tone="green"
        />
      </div>
      <Card title={`Loan register · ${data.loans.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Loan',
            'Employee',
            'Principal',
            'Monthly installment',
            'Recovered',
            'Balance',
            'Issued',
            'Status',
          ]}
        >
          {data.loans.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
                <small className="pr-cell-sub">Advance {item.advanceId}</small>
              </td>
              <td>
                {employees.find((row) => row.id === item.employeeId)?.name || 'Unknown employee'}
              </td>
              <td>{money(item.amount)}</td>
              <td>{money(item.installment)}</td>
              <td>{money(item.recovered)}</td>
              <td>
                <b>{money(Math.max(0, item.amount - item.recovered))}</b>
              </td>
              <td>{item.issuedAt}</td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!data.loans.length && <Empty>Approved advances create loan records automatically.</Empty>}
      </Card>
    </>
  )
}
