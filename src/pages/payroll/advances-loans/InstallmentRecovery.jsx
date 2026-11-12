import { HandCoins, ListChecks, TrendingUp } from 'lucide-react'
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

export default function RecoveryPage({ data, employees, periodName }) {
  return (
    <>
      <PageHeader
        title="Installment Recovery"
        subtitle="Review loan deductions posted when an approved payroll batch is finalized."
        icon={TrendingUp}
      />
      <Card title={`Payroll recovery ledger · ${data.recoveries.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Recovery',
            'Employee',
            'Loan',
            'Payroll batch',
            'Pay period',
            'Recovered amount',
            'Posted',
            'Status',
            'Reversal reason',
          ]}
        >
          {data.recoveries.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>
                {employees.find((row) => row.id === item.employeeId)?.name || 'Unknown employee'}
              </td>
              <td>{item.loanId}</td>
              <td>{item.batchId}</td>
              <td>{periodName(item.periodId)}</td>
              <td>{money(item.amount)}</td>
              <td>{item.date}</td>
              <td>
                <Status>{item.status || 'Posted'}</Status>
              </td>
              <td>{item.reversalReason || '—'}</td>
            </tr>
          ))}
        </Table>
        {!data.recoveries.length && (
          <Empty>Loan installments are recorded here when payroll is finalized.</Empty>
        )}
      </Card>
      <Card
        title={`Active repayment schedules · ${data.loans.filter((item) => item.status === 'Active').length}`}
        icon={HandCoins}
      >
        <Table
          headers={[
            'Employee',
            'Loan',
            'Installment per month',
            'Balance remaining',
            'Schedule status',
          ]}
        >
          {data.loans
            .filter((item) => item.status === 'Active')
            .map((item) => (
              <tr key={item.id}>
                <td>
                  {employees.find((row) => row.id === item.employeeId)?.name || 'Unknown employee'}
                </td>
                <td>{item.id}</td>
                <td>{money(item.installment)}</td>
                <td>{money(item.amount - item.recovered)}</td>
                <td>
                  <Status>{item.status}</Status>
                </td>
              </tr>
            ))}
        </Table>
      </Card>
    </>
  )
}
