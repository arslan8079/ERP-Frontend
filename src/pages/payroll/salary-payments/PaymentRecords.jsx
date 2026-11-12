import { Fragment, useState } from 'react'
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
  paymentPaidAmount,
} = Shared

export default function PaymentRecordsPage({ data, periodName, onNotify, recordPaymentOutcome }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [outcomes, setOutcomes] = useState({})
  const outcomeFor = (payment) =>
    outcomes[payment.id] || {
      status: 'Paid',
      paidAmount: String(payment.amount),
      date: today(),
      reference: '',
      failureReason: '',
    }
  const updateOutcome = (payment, field, value) => {
    setOutcomes({
      ...outcomes,
      [payment.id]: { ...outcomeFor(payment), [field]: value },
    })
  }
  const rows = data.payments.filter((item) =>
    `${item.employeeName} ${item.employeeId} ${item.reference} ${item.settlementReference || ''} ${item.failureReason || ''} ${item.batchId}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  return (
    <>
      <PageHeader
        title="Payment Records"
        subtitle="Review locally recorded payment instructions. Bank settlement is not confirmed by this prototype."
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
                'Instruction amount',
                'Paid amount',
                'Method',
                'Reference',
                'Recorded date',
                'Outcome date',
                'Settlement reference',
                'Failure reason',
                'Status',
              ],
              ...rows.map((item) => [
                item.id,
                item.employeeName,
                item.employeeId,
                item.periodId,
                item.amount,
                paymentPaidAmount(item),
                item.method,
                item.reference,
                item.date,
                item.outcomeDate || '',
                item.settlementReference || '',
                item.failureReason || '',
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
            'Instruction amount',
            'Paid amount',
            'Method',
            'Recorded date',
            'Status',
            'Outcome',
          ]}
        >
          {rows.map((item) => {
            const outcome = outcomeFor(item)
            const editing = selectedId === item.id && item.status === 'Pending bank confirmation'
            return (
              <Fragment key={item.id}>
                <tr>
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
                  <td>
                    <b>{money(paymentPaidAmount(item))}</b>
                  </td>
                  <td>{item.method}</td>
                  <td>{item.date}</td>
                  <td>
                    <Status>{item.status}</Status>
                  </td>
                  <td>
                    {item.status === 'Pending bank confirmation' ? (
                      <Button kind="small" onClick={() => setSelectedId(editing ? '' : item.id)}>
                        {editing ? 'Cancel' : 'Record outcome'}
                      </Button>
                    ) : (
                      <span>
                        {item.outcomeDate || '—'}
                        {item.settlementReference && (
                          <small className="pr-cell-sub">{item.settlementReference}</small>
                        )}
                        {item.failureReason && (
                          <small className="pr-cell-sub">{item.failureReason}</small>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
                {editing && (
                  <tr>
                    <td colSpan={9}>
                      <form
                        className="pr-inline-form"
                        onSubmit={(event) => {
                          event.preventDefault()
                          recordPaymentOutcome(item.id, outcome)
                        }}
                      >
                        <Field label={`Outcome for ${item.employeeName}`}>
                          <select
                            value={outcome.status}
                            onChange={(event) => updateOutcome(item, 'status', event.target.value)}
                          >
                            <option>Paid</option>
                            <option>Partially Paid</option>
                            <option>Failed</option>
                          </select>
                        </Field>
                        {outcome.status !== 'Failed' && (
                          <Field label="Actual paid amount">
                            <input
                              type="number"
                              min="1"
                              max={item.amount}
                              step="1"
                              required
                              disabled={outcome.status === 'Paid'}
                              value={outcome.status === 'Paid' ? item.amount : outcome.paidAmount}
                              onChange={(event) =>
                                updateOutcome(item, 'paidAmount', event.target.value)
                              }
                            />
                          </Field>
                        )}
                        <Field label="Outcome date">
                          <input
                            type="date"
                            required
                            value={outcome.date}
                            onChange={(event) => updateOutcome(item, 'date', event.target.value)}
                          />
                        </Field>
                        {outcome.status !== 'Failed' && (
                          <Field label="Settlement reference">
                            <input
                              required
                              value={outcome.reference}
                              onChange={(event) =>
                                updateOutcome(item, 'reference', event.target.value)
                              }
                            />
                          </Field>
                        )}
                        {outcome.status === 'Failed' && (
                          <Field label="Failure reason">
                            <input
                              required
                              value={outcome.failureReason}
                              onChange={(event) =>
                                updateOutcome(item, 'failureReason', event.target.value)
                              }
                            />
                          </Field>
                        )}
                        <Button type="submit">Save outcome</Button>
                      </form>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </Table>
        {!rows.length && <Empty>No payment records match this search.</Empty>}
      </Card>
    </>
  )
}
