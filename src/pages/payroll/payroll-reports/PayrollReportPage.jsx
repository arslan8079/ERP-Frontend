import { useState } from 'react'
import {
  BadgeDollarSign,
  Banknote,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Download,
  FileClock,
  Filter,
  Landmark,
  TrendingUp,
  Users,
} from 'lucide-react'
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

export default function PayrollReportPage({
  page,
  data,
  employees,
  periodName,
  employeeSearch,
  setEmployeeSearch,
  onNotify,
}) {
  const [periodId, setPeriodId] = useState(data.batches[0]?.periodId || monthKey())
  const [query, setQuery] = useState('')
  const batch = data.batches.find((item) => item.periodId === periodId)
  const slips = batch?.payslips || []
  const search = page === 'Employee Salary History' ? employeeSearch : query
  const setSearch = page === 'Employee Salary History' ? setEmployeeSearch : setQuery
  const visibleSlips = slips.filter(
    (slip) =>
      !search ||
      `${slip.employeeName} ${slip.employeeId}`.toLowerCase().includes(search.toLowerCase()),
  )
  const totals = visibleSlips.reduce(
    (result, slip) => ({
      gross: result.gross + slip.gross,
      deductions: result.deductions + slip.totalDeductions,
      net: result.net + slip.net,
    }),
    { gross: 0, deductions: 0, net: 0 },
  )
  const paymentTotal = data.payments
    .filter((item) => item.periodId === periodId)
    .reduce((sum, item) => sum + item.amount, 0)
  const reports = {
    'Monthly Payroll Report': {
      subtitle: 'Monthly headcount, gross earnings, deductions and net payroll at a glance.',
      icon: CalendarDays,
      headers: ['Employee', 'Department', 'Basic pay', 'Allowances', 'Deductions', 'Net pay'],
    },
    'Salary Register': {
      subtitle: 'Full employee-level salary register for a selected pay period.',
      icon: Users,
      headers: [
        'Employee',
        'Department',
        'Branch',
        'Basic pay',
        'Gross earnings',
        'Deductions',
        'Net pay',
      ],
    },
    'Deductions Report': {
      subtitle: 'Review statutory, recurring and loan deductions by employee.',
      icon: Filter,
      headers: ['Employee', 'Deduction breakdown', 'Total deductions', 'Net pay'],
    },
    'Payment Summary': {
      subtitle: 'Reconcile payroll liability against recorded salary disbursements.',
      icon: Landmark,
      headers: ['Employee', 'Payment reference', 'Method', 'Amount', 'Status'],
    },
    'Employee Salary History': {
      subtitle: 'Compare finalized employee salary history across processed payroll periods.',
      icon: TrendingUp,
      headers: [
        'Employee',
        'Pay period',
        'Basic pay',
        'Allowances',
        'Deductions',
        'Net pay',
        'Payroll status',
      ],
    },
  }
  const report = reports[page] || reports['Monthly Payroll Report']
  const paymentRows = data.payments.filter((item) => item.periodId === periodId)
  const historyBatches = data.batches.filter(
    (item) =>
      ['Finalized', 'Paid'].includes(item.status) &&
      item.payslips.some(
        (slip) =>
          !employeeSearch ||
          `${slip.employeeName} ${slip.employeeId}`.toLowerCase().includes(employeeSearch),
      ),
  )
  const exportDataRows =
    page === 'Deductions Report'
      ? visibleSlips.map((slip) => [
          slip.employeeName,
          slip.deductions.map((item) => `${item.name}: ${money(item.amount)}`).join(' · '),
          slip.totalDeductions,
          slip.net,
        ])
      : page === 'Salary Register'
        ? visibleSlips.map((slip) => [
            slip.employeeName,
            slip.department,
            slip.branch,
            slip.basic,
            slip.gross,
            slip.totalDeductions,
            slip.net,
          ])
        : page === 'Payment Summary'
          ? paymentRows.map((item) => [
              item.employeeName,
              item.reference,
              item.method,
              item.amount,
              item.status,
            ])
          : page === 'Employee Salary History'
            ? historyBatches.flatMap((item) =>
                item.payslips
                  .filter(
                    (slip) =>
                      !employeeSearch ||
                      `${slip.employeeName} ${slip.employeeId}`
                        .toLowerCase()
                        .includes(employeeSearch),
                  )
                  .map((slip) => [
                    `${slip.employeeName} · ${slip.employeeId}`,
                    periodName(item.periodId),
                    slip.basic,
                    slip.allowances.reduce((sum, value) => sum + value.amount, 0),
                    slip.totalDeductions,
                    slip.net,
                    item.status,
                  ]),
              )
            : visibleSlips.map((slip) => [
                slip.employeeName,
                slip.department,
                slip.basic,
                slip.allowances.reduce((sum, item) => sum + item.amount, 0),
                slip.totalDeductions,
                slip.net,
              ])
  const exportRows = [report.headers, ...exportDataRows]
  const exportAction = (
    <Button
      kind="secondary"
      onClick={() =>
        downloadCsv(`${page.toLowerCase().replaceAll(' ', '-')}.csv`, exportRows, onNotify)
      }
    >
      <Download size={15} />
      Export report
    </Button>
  )
  return (
    <>
      <PageHeader
        title={page}
        subtitle={report.subtitle}
        icon={report.icon}
        action={exportAction}
      />
      {page !== 'Employee Salary History' && (
        <div className="pr-toolbar standalone">
          <Field label="Payroll period">
            <select value={periodId} onChange={(event) => setPeriodId(event.target.value)}>
              {data.periods.map((item) => (
                <option key={item.id} value={item.id}>
                  {periodName(item.id)}
                </option>
              ))}
            </select>
          </Field>
          {['Salary Register', 'Deductions Report'].includes(page) && (
            <Toolbar query={query} setQuery={setQuery} placeholder="Filter employee" />
          )}
        </div>
      )}
      {page === 'Employee Salary History' && (
        <div className="pr-toolbar standalone">
          <Field label="Employee">
            <select
              value={employeeSearch}
              onChange={(event) => setEmployeeSearch(event.target.value)}
            >
              <option value="">All employees</option>
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.id}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
      {page === 'Monthly Payroll Report' && (
        <div className="pr-stats compact">
          <Stat
            icon={Users}
            label="Employees processed"
            value={batch?.employeeCount || 0}
            tone="blue"
          />
          <Stat icon={BadgeDollarSign} label="Gross earnings" value={money(totals.gross)} />
          <Stat
            icon={Filter}
            label="Total deductions"
            value={money(totals.deductions)}
            tone="amber"
          />
          <Stat
            icon={CircleDollarSign}
            label="Net payroll"
            value={money(totals.net)}
            tone="green"
          />
        </div>
      )}
      {page === 'Payment Summary' && (
        <div className="pr-stats compact">
          <Stat
            icon={CircleDollarSign}
            label="Payroll net liability"
            value={money(batch?.net || 0)}
          />
          <Stat
            icon={Banknote}
            label="Payments recorded"
            value={money(paymentTotal)}
            tone="green"
          />
          <Stat
            icon={Clock3}
            label="Unpaid balance"
            value={money(Math.max(0, (batch?.net || 0) - paymentTotal))}
            tone="amber"
          />
        </div>
      )}
      {page === 'Employee Salary History' ? (
        <Card title={`Historical payroll · ${historyBatches.length} run(s)`} icon={FileClock}>
          <Table headers={report.headers}>
            {historyBatches.map((item) =>
              item.payslips
                .filter(
                  (slip) =>
                    !employeeSearch ||
                    `${slip.employeeName} ${slip.employeeId}`
                      .toLowerCase()
                      .includes(employeeSearch),
                )
                .map((slip) => (
                  <tr key={`${item.id}-${slip.employeeId}`}>
                    <td>
                      {slip.employeeName}
                      <small className="pr-cell-sub">{slip.employeeId}</small>
                    </td>
                    <td>{periodName(item.periodId)}</td>
                    <td>{money(slip.basic)}</td>
                    <td>{money(slip.allowances.reduce((sum, value) => sum + value.amount, 0))}</td>
                    <td>{money(slip.totalDeductions)}</td>
                    <td>
                      <b>{money(slip.net)}</b>
                    </td>
                    <td>
                      <Status>{item.status}</Status>
                    </td>
                  </tr>
                )),
            )}
          </Table>
          {!historyBatches.length && (
            <Empty>Employee salary history appears after payroll runs are finalized.</Empty>
          )}
        </Card>
      ) : page === 'Payment Summary' ? (
        <Card
          title={`Disbursements · ${data.payments.filter((item) => item.periodId === periodId).length}`}
          icon={Landmark}
        >
          <Table headers={report.headers}>
            {data.payments
              .filter((item) => item.periodId === periodId)
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.employeeName}</td>
                  <td>{item.reference}</td>
                  <td>{item.method}</td>
                  <td>{money(item.amount)}</td>
                  <td>
                    <Status>{item.status}</Status>
                  </td>
                </tr>
              ))}
          </Table>
          {!data.payments.some((item) => item.periodId === periodId) && (
            <Empty>No salary payments are recorded for this period.</Empty>
          )}
        </Card>
      ) : (
        <Card title={`${page} · ${visibleSlips.length} employee(s)`} icon={report.icon}>
          <Table headers={report.headers}>
            {visibleSlips.map((slip) =>
              page === 'Deductions Report' ? (
                <tr key={slip.employeeId}>
                  <td>
                    {slip.employeeName}
                    <small className="pr-cell-sub">{slip.employeeId}</small>
                  </td>
                  <td>
                    {slip.deductions
                      .map((item) => `${item.name}: ${money(item.amount)}`)
                      .join(' · ') || 'No deductions'}
                  </td>
                  <td>
                    <b>{money(slip.totalDeductions)}</b>
                  </td>
                  <td>{money(slip.net)}</td>
                </tr>
              ) : (
                <tr key={slip.employeeId}>
                  <td>
                    {slip.employeeName}
                    <small className="pr-cell-sub">{slip.employeeId}</small>
                  </td>
                  <td>{slip.department}</td>
                  {page === 'Salary Register' && <td>{slip.branch}</td>}
                  <td>{money(slip.basic)}</td>
                  {page === 'Monthly Payroll Report' && (
                    <td>{money(slip.allowances.reduce((sum, item) => sum + item.amount, 0))}</td>
                  )}
                  {page === 'Salary Register' && <td>{money(slip.gross)}</td>}
                  <td>{money(slip.totalDeductions)}</td>
                  <td>
                    <b>{money(slip.net)}</b>
                  </td>
                </tr>
              ),
            )}
          </Table>
          {!visibleSlips.length && <Empty>No payroll data is available for this period.</Empty>}
        </Card>
      )}
    </>
  )
}
