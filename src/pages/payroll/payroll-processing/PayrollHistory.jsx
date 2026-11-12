import { useState } from 'react'
import { CalendarClock, FileClock, RotateCcw } from 'lucide-react'
import * as Shared from '../shared'
const {
  today,
  money,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Empty,
  Field,
  batchOutstandingAmount,
  batchRecoveryOutstanding,
} = Shared

export default function PayrollHistoryPage({
  data,
  statuses,
  title,
  subtitle,
  periodName,
  onNavigate,
  reversePayroll,
  createAdjustmentRun,
  resolveRecoveryDue,
}) {
  const batches = data.batches.filter((item) => statuses.includes(item.status))
  const [selectedId, setSelectedId] = useState('')
  const [reversalReason, setReversalReason] = useState('')
  const [adjustmentEmployeeId, setAdjustmentEmployeeId] = useState('')
  const [adjustmentAmount, setAdjustmentAmount] = useState('')
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [recovery, setRecovery] = useState({ date: today(), reference: '', reason: '' })
  const selected = batches.find((item) => item.id === selectedId) || batches[0]
  const selectedPeriod = data.periods.find((item) => item.id === selected?.periodId)
  const paymentStarted =
    selected?.status === 'Paid' || data.payments.some((payment) => payment.batchId === selected?.id)
  const outstandingRecovery = selected ? batchRecoveryOutstanding(selected) : 0

  const submitAdjustment = (event) => {
    event.preventDefault()
    createAdjustmentRun(selected.id, {
      employeeId: adjustmentEmployeeId || selected.payslips[0]?.employeeId,
      amount: adjustmentAmount,
      reason: adjustmentReason,
    })
    setAdjustmentAmount('')
    setAdjustmentReason('')
  }

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={FileClock}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Generate Payroll')}>
            <CalendarClock size={15} />
            Generate payroll
          </Button>
        }
      />
      <Card title={`Payroll batches · ${batches.length}`} icon={FileClock}>
        <Table
          headers={[
            'Batch / period',
            'Type',
            'Employees',
            'Gross earnings',
            'Deductions',
            'Net payable',
            'Outstanding',
            'Created',
            'Status',
          ]}
        >
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>
                <button
                  className="pr-table-link"
                  onClick={() => {
                    setSelectedId(batch.id)
                    setAdjustmentEmployeeId('')
                    setAdjustmentAmount('')
                    setAdjustmentReason('')
                  }}
                >
                  {batch.id}
                  <small>{periodName(batch.periodId)}</small>
                </button>
              </td>
              <td>
                {batch.type === 'Adjustment' ? `Adjustment · ${batch.adjustmentOf}` : 'Regular'}
              </td>
              <td>{batch.employeeCount}</td>
              <td>{money(batch.gross)}</td>
              <td>{money(batch.deductions)}</td>
              <td>
                <b>{money(batch.net)}</b>
              </td>
              <td>
                {batch.status === 'Reversed'
                  ? '—'
                  : money(
                      batchOutstandingAmount(batch, data.payments) +
                        batchRecoveryOutstanding(batch),
                    )}
              </td>
              <td>{batch.createdAt}</td>
              <td>
                <Status>{batch.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!batches.length && <Empty>There are no payroll batches at this stage.</Empty>}
      </Card>
      {selected && (
        <Card title={`Run controls · ${selected.id}`} icon={RotateCcw}>
          <p className="pr-card-note">
            {selected.type === 'Adjustment'
              ? `Adjustment against ${selected.adjustmentOf}. The original run is preserved.`
              : `${periodName(selected.periodId)} · ${selected.employeeCount} employee(s)`}
          </p>
          {selected.status === 'Finalized' &&
            !paymentStarted &&
            selectedPeriod?.status !== 'Closed' &&
            (selectedPeriod?.status !== 'Reopened' || selected.type === 'Adjustment') && (
              <form
                className="pr-inline-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  reversePayroll(selected.id, reversalReason)
                  setReversalReason('')
                }}
              >
                <Field label="Reason for reversal">
                  <input
                    required
                    value={reversalReason}
                    onChange={(event) => setReversalReason(event.target.value)}
                  />
                </Field>
                <Button type="submit" kind="secondary">
                  Reverse run
                </Button>
              </form>
            )}
          {['Finalized', 'Paid'].includes(selected.status) &&
            selectedPeriod?.status !== 'Closed' &&
            (paymentStarted || selectedPeriod?.status === 'Reopened') && (
              <form className="pr-inline-form" onSubmit={submitAdjustment}>
                <Field label="Employee">
                  <select
                    required
                    value={adjustmentEmployeeId || selected.payslips[0]?.employeeId || ''}
                    onChange={(event) => setAdjustmentEmployeeId(event.target.value)}
                  >
                    {selected.payslips.map((slip) => (
                      <option key={slip.employeeId} value={slip.employeeId}>
                        {slip.employeeName} · {slip.employeeId}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Signed adjustment amount">
                  <input
                    type="number"
                    step="1"
                    required
                    value={adjustmentAmount}
                    onChange={(event) => setAdjustmentAmount(event.target.value)}
                    placeholder="Positive to pay; negative becomes recovery due"
                  />
                </Field>
                <Field label="Adjustment reason">
                  <input
                    required
                    value={adjustmentReason}
                    onChange={(event) => setAdjustmentReason(event.target.value)}
                  />
                </Field>
                <Button type="submit">Create adjustment run</Button>
              </form>
            )}
          {selected.status === 'Finalized' &&
            selected.type === 'Adjustment' &&
            outstandingRecovery > 0 && (
              <form
                className="pr-inline-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  resolveRecoveryDue(selected.id, selected.payslips[0].employeeId, recovery)
                  setRecovery({ date: today(), reference: '', reason: '' })
                }}
              >
                <p className="pr-card-note">
                  Recovery due: {money(outstandingRecovery)}. Record an external resolution; no
                  automatic deduction is made.
                </p>
                <Field label="Recovery date">
                  <input
                    type="date"
                    required
                    value={recovery.date}
                    onChange={(event) => setRecovery({ ...recovery, date: event.target.value })}
                  />
                </Field>
                <Field label="Recovery reference">
                  <input
                    required
                    value={recovery.reference}
                    onChange={(event) =>
                      setRecovery({ ...recovery, reference: event.target.value })
                    }
                  />
                </Field>
                <Field label="Resolution reason">
                  <input
                    required
                    value={recovery.reason}
                    onChange={(event) => setRecovery({ ...recovery, reason: event.target.value })}
                  />
                </Field>
                <Button type="submit">Record recovery resolved</Button>
              </form>
            )}
          {selected.status === 'Reversed' && (
            <p className="pr-card-note">
              Reversed {selected.reversedAt}: {selected.reversalReason}
            </p>
          )}
          {selectedPeriod?.status === 'Closed' && (
            <p className="pr-card-note">
              Reopen the period with a reason before creating corrections.
            </p>
          )}
          {['Finalized', 'Paid'].includes(selected.status) &&
            selectedPeriod?.status === 'Reopened' && (
              <p className="pr-card-note">
                Period reopened {selectedPeriod.reopenedAt}: {selectedPeriod.reopenReason}
              </p>
            )}
        </Card>
      )}
    </>
  )
}
