import { useState } from 'react'
import { Landmark, ReceiptText } from 'lucide-react'
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

export default function PaymentRecordsPage({ data, periodName, onNotify }) {
  const [query, setQuery] = useState('')
  const rows = data.payments.filter((item) =>
    `${item.employeeName} ${item.employeeId} ${item.reference} ${item.batchId}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  return (
    <>
      <PageHeader
        title="Payment Records"
        subtitle="Search and reconcile salary disbursements with payroll batches and bank references."
        icon={ReceiptText}
        action={
          <ExportButton
            filename="payroll-payments.csv"
            rows={[
              [
                'Payment ID',
                'Employee',
                'Employee ID',
                'Period',
                'Amount',
                'Method',
                'Reference',
                'Date',
                'Status',
              ],
              ...rows.map((item) => [
                item.id,
                item.employeeName,
                item.employeeId,
                item.periodId,
                item.amount,
                item.method,
                item.reference,
                item.date,
                item.status,
              ]),
            ]}
            onNotify={onNotify}
          />
        }
      />
      <Card title={`Payment register · ${rows.length}`} icon={Landmark}>
        <Toolbar
          query={query}
          setQuery={setQuery}
          placeholder="Search employee, payment, batch or reference"
        />
        <Table
          headers={[
            'Payment reference',
            'Employee',
            'Pay period',
            'Amount',
            'Method',
            'Paid date',
            'Status',
          ]}
        >
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.reference}</b>
                <small className="pr-cell-sub">
                  {item.id} · {item.batchId}
                </small>
              </td>
              <td>
                {item.employeeName}
                <small className="pr-cell-sub">{item.employeeId}</small>
              </td>
              <td>{periodName(item.periodId)}</td>
              <td>
                <b>{money(item.amount)}</b>
              </td>
              <td>{item.method}</td>
              <td>{item.date}</td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!rows.length && <Empty>No payment records match this search.</Empty>}
      </Card>
    </>
  )
}
