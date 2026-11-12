import { useState } from 'react'
import { CalendarDays, ChevronRight, Coins, ListChecks, Plus } from 'lucide-react'
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
  periodCanClose,
} = Shared

export default function PeriodsPage({ data, createPeriod, closePeriod, reopenPeriod, onNavigate }) {
  const [period, setPeriod] = useState(monthKey())
  const [reopenReasons, setReopenReasons] = useState({})
  const submit = (event) => {
    event.preventDefault()
    createPeriod(period)
  }
  return (
    <>
      <PageHeader
        title="Payroll Periods"
        subtitle="Open and close monthly pay periods to control payroll processing."
        icon={CalendarDays}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Generate Payroll')}>
            <Coins size={15} />
            Generate payroll
          </Button>
        }
      />
      <Card title="Open a monthly period" icon={Plus}>
        <form className="pr-inline-form" onSubmit={submit}>
          <Field label="Payroll month">
            <input
              type="month"
              required
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            />
          </Field>
          <Button type="submit">
            <Plus size={15} />
            Create period
          </Button>
        </form>
      </Card>
      <Card title={`Period register · ${data.periods.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Period',
            'Status',
            'Payroll batch',
            'Employees',
            'Net payroll',
            'Next step',
            'Period control',
          ]}
        >
          {data.periods.map((item) => {
            const periodBatches = data.batches.filter(
              (row) => row.periodId === item.id && row.status !== 'Reversed',
            )
            const batch = periodBatches[0]
            const employeeCount = new Set(
              periodBatches.flatMap((row) => row.payslips.map((slip) => slip.employeeId)),
            ).size
            const netPayroll = periodBatches.reduce((sum, row) => sum + row.net, 0)
            const destination = !batch
              ? 'Generate Payroll'
              : batch.status === 'Draft'
                ? 'Payroll Drafts'
                : batch.status === 'In Review'
                  ? 'Review & Approval'
                  : batch.status === 'Reviewed'
                    ? 'Finalize Payroll'
                    : batch.status === 'Finalized'
                      ? 'Process Payments'
                      : 'Payroll History'
            const canClose = periodCanClose(item.id, data.batches, data.payments)
            return (
              <tr key={item.id}>
                <td>
                  <b>{monthLabel(item.id)}</b>
                  <small className="pr-cell-sub">{item.id}</small>
                </td>
                <td>
                  <Status>{item.status}</Status>
                </td>
                <td>
                  {batch?.id || 'Not generated'}
                  {periodBatches.length > 1 && (
                    <small className="pr-cell-sub">+ {periodBatches.length - 1} other run(s)</small>
                  )}
                </td>
                <td>{periodBatches.length ? employeeCount : '—'}</td>
                <td>{periodBatches.length ? money(netPayroll) : '—'}</td>
                <td>
                  <button className="pr-link" onClick={() => onNavigate(destination)}>
                    {batch ? 'Open batch' : 'Start run'} <ChevronRight size={14} />
                  </button>
                </td>
                <td>
                  {item.status === 'Closed' ? (
                    <form
                      className="pr-inline-form"
                      onSubmit={(event) => {
                        event.preventDefault()
                        reopenPeriod(item.id, reopenReasons[item.id])
                      }}
                    >
                      <Field label={`Reason to reopen ${monthLabel(item.id)}`}>
                        <input
                          required
                          value={reopenReasons[item.id] || ''}
                          onChange={(event) =>
                            setReopenReasons({
                              ...reopenReasons,
                              [item.id]: event.target.value,
                            })
                          }
                        />
                      </Field>
                      <Button type="submit" kind="small">
                        Reopen period
                      </Button>
                    </form>
                  ) : (
                    <Button
                      kind="small"
                      disabled={!canClose}
                      title={
                        canClose
                          ? 'Close this fully settled period'
                          : 'Settle all employee payments and recovery balances before closing.'
                      }
                      onClick={() => closePeriod(item.id)}
                    >
                      Close period
                    </Button>
                  )}
                  {item.status === 'Reopened' && (
                    <small className="pr-cell-sub">
                      Reopened {item.reopenedAt}: {item.reopenReason}
                    </small>
                  )}
                </td>
              </tr>
            )
          })}
        </Table>
        {!data.periods.length && <Empty>Create a period to begin processing salaries.</Empty>}
      </Card>
      <Card title={`Period and run events · ${data.periodHistory.length}`} icon={CalendarDays}>
        <Table headers={['Period', 'Event', 'Date', 'Batch', 'Reason']}>
          {data.periodHistory.map((item) => (
            <tr key={item.id}>
              <td>{monthLabel(item.periodId)}</td>
              <td>{item.action}</td>
              <td>{item.date}</td>
              <td>{item.batchId || '—'}</td>
              <td>{item.reason || '—'}</td>
            </tr>
          ))}
        </Table>
        {!data.periodHistory.length && (
          <Empty>Period close, reopen, and reversal events appear here.</Empty>
        )}
      </Card>
    </>
  )
}
