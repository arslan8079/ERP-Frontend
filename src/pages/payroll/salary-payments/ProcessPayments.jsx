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
        title="Process Payments"
        subtitle="Record salary disbursements after payroll is finalized."
        icon={Banknote}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Payment Records')}>
            Payment records <ChevronRight size={15} />
          </Button>
        }
      />
      <Card title={`Finalized batches ready to pay · ${batches.length}`} icon={Landmark}>
        <Table
          headers={[
            'Batch / period',
            'Employees',
            'Payment method',
            'Total disbursement',
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
              <td>Bank transfer</td>
              <td>
                <b>{money(batch.net)}</b>
              </td>
              <td>
                <Status>Ready</Status>
              </td>
              <td>
                <Button kind="small" onClick={() => processPayments(batch.id)}>
                  <Check size={13} />
                  Record payments
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {!batches.length && (
          <Empty>Finalize an approved payroll batch before processing its payments.</Empty>
        )}
      </Card>
      <Callout
        title="Payment controls"
        text="Processing records an individual payment reference for each employee and closes the period as paid. Payment records remain available for reconciliation."
      />
    </>
  )
}
