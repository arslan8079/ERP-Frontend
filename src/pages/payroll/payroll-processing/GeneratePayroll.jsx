import { useState } from 'react'
import { ArrowRight, CalendarDays, Coins, ShieldCheck } from 'lucide-react'
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

export default function GeneratePayrollPage({
  data,
  employees,
  generatePayroll,
  periodName,
  onNavigate,
  onNotify,
}) {
  const available = data.periods.filter(
    (item) => item.status === 'Open' && !data.batches.some((batch) => batch.periodId === item.id),
  )
  const [periodId, setPeriodId] = useState(available[0]?.id || '')
  const estimate = employees.reduce((sum, employee) => {
    const assignment = data.assignments.find((item) => item.employeeId === employee.id)
    return sum + calculateSalary(employee, assignment, data.structures, data.loans).net
  }, 0)
  const assignedCount = employees.filter((item) =>
    data.assignments.some(
      (row) =>
        row.employeeId === item.id &&
        data.structures.some((structure) => structure.id === row.structureId),
    ),
  ).length
  return (
    <>
      <PageHeader
        title="Generate Payroll"
        subtitle="Calculate monthly earnings, deductions and loan installments from approved salary assignments."
        icon={Coins}
      />
      <div className="pr-generate-layout">
        <section className="pr-form-card">
          <h2>
            <CalendarDays size={18} />
            Payroll run setup
          </h2>
          <div className="pr-form-grid">
            <Field label="Open pay period">
              <select value={periodId} onChange={(event) => setPeriodId(event.target.value)}>
                <option value="">Select an open period</option>
                {available.map((item) => (
                  <option key={item.id} value={item.id}>
                    {periodName(item.id)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Employees included">
              <input readOnly value={`${assignedCount} of ${employees.length} active employees`} />
            </Field>
            <Field label="Estimated net payroll">
              <input readOnly value={money(estimate)} />
            </Field>
            <Field label="Run basis">
              <input readOnly value="Active salary assignments + loan installments" />
            </Field>
          </div>
          <div className="pr-form-actions">
            <span>Generation creates a draft only; it does not finalize or pay salaries.</span>
            <Button
              disabled={!periodId || assignedCount !== employees.length}
              onClick={() => generatePayroll(periodId)}
            >
              <Coins size={15} />
              Generate draft
            </Button>
          </div>
        </section>
        <aside className="pr-callout-panel">
          <span>
            <ShieldCheck size={20} />
          </span>
          <h3>Controlled payroll workflow</h3>
          <p>
            Generated drafts are routed to review. After approval, an authorized payroll user must
            finalize the batch before payment processing is enabled.
          </p>
          <Button kind="link" onClick={() => onNavigate('Payroll Drafts')}>
            View payroll drafts <ArrowRight size={14} />
          </Button>
        </aside>
      </div>
      {!available.length && (
        <Callout
          title="No open period is available"
          text="Create an open period in Payroll Periods. A period can only have one payroll batch."
          action={
            <Button kind="secondary" onClick={() => onNavigate('Payroll Periods')}>
              Manage periods
            </Button>
          }
        />
      )}
      {assignedCount < employees.length && (
        <Callout
          title="Salary assignments need attention"
          text={`${employees.length - assignedCount} active employee(s) need a valid salary structure assignment before payroll can be generated.`}
          action={
            <Button kind="secondary" onClick={() => onNavigate('Employee Salary Assignment')}>
              Review assignments
            </Button>
          }
        />
      )}
    </>
  )
}
