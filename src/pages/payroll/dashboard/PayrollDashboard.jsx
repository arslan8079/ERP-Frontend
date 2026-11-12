import {
  ArrowRight,
  BadgeDollarSign,
  Banknote,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Coins,
  FileClock,
  HandCoins,
  LockKeyhole,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
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
  batchOutstandingAmount,
} = Shared

export default function Dashboard({ data, employees, periodName, onNavigate }) {
  const currentId = monthKey()
  const currentBatches = data.batches.filter(
    (item) => item.periodId === currentId && item.status !== 'Reversed',
  )
  const currentBatch = currentBatches[0]
  const currentPeriod = data.periods.find((item) => item.id === currentId)
  const outstanding = data.batches
    .filter((batch) => batch.status === 'Finalized')
    .reduce((sum, batch) => sum + batchOutstandingAmount(batch, data.payments), 0)
  const pendingAdvances = data.advances.filter((item) => item.status === 'Pending').length
  const quickLinks = [
    'Generate Payroll',
    'Review & Approval',
    'Process Payments',
    'Salary Register',
  ]
  return (
    <>
      <PageHeader
        title="Payroll Management"
        subtitle="Configure compensation, run payroll, approve batches and reconcile salary payments."
        icon={Wallet}
        action={
          <Button
            onClick={() =>
              onNavigate(currentPeriod?.status === 'Open' ? 'Generate Payroll' : 'Payroll Periods')
            }
          >
            <Coins size={16} />
            Run payroll
          </Button>
        }
      />
      <div className="pr-stats">
        <Stat
          icon={Users}
          label="Active employees"
          value={employees.length}
          hint={`${data.assignments.length} salary assignments`}
        />
        <Stat
          icon={CalendarDays}
          label="Current pay period"
          value={periodName(currentId).split(' ')[0]}
          tone="blue"
          hint={currentPeriod?.status || 'Not opened'}
        />
        <Stat
          icon={CircleDollarSign}
          label="Current net payroll"
          value={money(currentBatches.reduce((sum, batch) => sum + batch.net, 0))}
          tone="green"
          hint={
            currentBatch
              ? `${currentBatches.length} run(s) · ${currentBatch.status}`
              : 'Not generated yet'
          }
        />
        <Stat
          icon={Clock3}
          label="Pending advances"
          value={pendingAdvances}
          tone="amber"
          hint="Awaiting manager review"
        />
      </div>
      <div className="pr-dashboard-grid">
        <Card title="Payroll run status" icon={TrendingUp} className="pr-run-card">
          <div className="pr-run-summary">
            <span className="pr-run-icon">
              <BadgeDollarSign size={25} />
            </span>
            <div>
              <b>{currentBatch ? money(currentBatch.net) : 'Ready to run'}</b>
              <small>
                {currentBatch
                  ? `${currentBatch.employeeCount} employees · ${periodName(currentId)}`
                  : `Open period · ${periodName(currentId)}`}
              </small>
            </div>
            <Status>{currentBatch?.status || currentPeriod?.status || 'No period'}</Status>
          </div>
          <div className="pr-workflow">
            <span className={currentBatch ? 'done' : 'current'}>
              1 <small>Generate</small>
            </span>
            <i />
            <span
              className={
                ['In Review', 'Reviewed', 'Finalized', 'Paid'].includes(currentBatch?.status)
                  ? 'done'
                  : currentBatch?.status === 'Draft'
                    ? 'current'
                    : ''
              }
            >
              2 <small>Review</small>
            </span>
            <i />
            <span
              className={
                ['Finalized', 'Paid'].includes(currentBatch?.status)
                  ? 'done'
                  : currentBatch?.status === 'Reviewed'
                    ? 'current'
                    : ''
              }
            >
              3 <small>Finalize</small>
            </span>
            <i />
            <span
              className={
                currentBatch?.status === 'Paid'
                  ? 'done'
                  : currentBatch?.status === 'Finalized'
                    ? 'current'
                    : ''
              }
            >
              4 <small>Pay</small>
            </span>
          </div>
          <div className="pr-inline-actions">
            <Button kind="secondary" onClick={() => onNavigate('Payroll Periods')}>
              Manage periods
            </Button>
            <Button
              onClick={() =>
                onNavigate(
                  currentBatch?.status === 'Draft'
                    ? 'Payroll Drafts'
                    : currentBatch?.status === 'In Review'
                      ? 'Review & Approval'
                      : currentBatch?.status === 'Reviewed'
                        ? 'Finalize Payroll'
                        : currentBatch?.status === 'Finalized'
                          ? 'Process Payments'
                          : currentBatch?.status === 'Paid'
                            ? 'Payroll History'
                            : 'Payroll Periods',
                )
              }
            >
              Continue workflow <ArrowRight size={15} />
            </Button>
          </div>
        </Card>
        <Card title="Action queue" icon={ShieldCheck} className="pr-queue-card">
          <div className="pr-queue-list">
            <button onClick={() => onNavigate('Review & Approval')}>
              <span className="pr-queue-icon amber">
                <ClipboardCheck size={17} />
              </span>
              <span>
                <b>
                  {data.batches.filter((item) => item.status === 'In Review').length} payroll
                  batch(es)
                </b>
                <small>Waiting for payroll review</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => onNavigate('Finalize Payroll')}>
              <span className="pr-queue-icon blue">
                <LockKeyhole size={17} />
              </span>
              <span>
                <b>
                  {data.batches.filter((item) => item.status === 'Reviewed').length} approved
                  batch(es)
                </b>
                <small>Ready for finalization</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => onNavigate('Pending Salaries')}>
              <span className="pr-queue-icon green">
                <Banknote size={17} />
              </span>
              <span>
                <b>
                  {data.batches.filter((item) => item.status === 'Finalized').length} salary
                  batch(es)
                </b>
                <small>{money(outstanding)} ready for payment</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => onNavigate('Approve Advances')}>
              <span className="pr-queue-icon purple">
                <HandCoins size={17} />
              </span>
              <span>
                <b>{pendingAdvances} advance request(s)</b>
                <small>Awaiting approval</small>
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </Card>
        <Card title="Quick access" icon={ArrowRight} className="pr-quick-card">
          <div className="pr-quick-links">
            {quickLinks.map((item) => (
              <button key={item} onClick={() => onNavigate(item)}>
                <ArrowRight size={15} />
                {item}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Latest payroll batches" icon={FileClock} className="pr-recent-card">
          <Table headers={['Payroll batch', 'Period', 'Employees', 'Net payroll', 'Status']}>
            {data.batches.slice(0, 5).map((batch) => (
              <tr key={batch.id}>
                <td>
                  <b>{batch.id}</b>
                </td>
                <td>{periodName(batch.periodId)}</td>
                <td>{batch.employeeCount}</td>
                <td>{money(batch.net)}</td>
                <td>
                  <Status>{batch.status}</Status>
                </td>
              </tr>
            ))}
          </Table>
          {!data.batches.length && (
            <Empty>Generate a payroll run to start the batch register.</Empty>
          )}
        </Card>
      </div>
    </>
  )
}
