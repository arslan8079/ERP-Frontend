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
} = Shared

export default function PeriodsPage({ data, createPeriod, onNavigate, onNotify }) {
  const [period, setPeriod] = useState(monthKey())
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
          headers={['Period', 'Status', 'Payroll batch', 'Employees', 'Net payroll', 'Next step']}
        >
          {data.periods.map((item) => {
            const batch = data.batches.find((row) => row.periodId === item.id)
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
            return (
              <tr key={item.id}>
                <td>
                  <b>{monthLabel(item.id)}</b>
                  <small className="pr-cell-sub">{item.id}</small>
                </td>
                <td>
                  <Status>{item.status}</Status>
                </td>
                <td>{batch?.id || 'Not generated'}</td>
                <td>{batch?.employeeCount || '—'}</td>
                <td>{batch ? money(batch.net) : '—'}</td>
                <td>
                  <button className="pr-link" onClick={() => onNavigate(destination)}>
                    {batch ? 'Open batch' : 'Start run'} <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            )
          })}
        </Table>
        {!data.periods.length && <Empty>Create a period to begin processing salaries.</Empty>}
      </Card>
    </>
  )
}
