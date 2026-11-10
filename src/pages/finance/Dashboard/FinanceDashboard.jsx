import {
  today,
  money,
  dateLabel,
  accountNet,
  periodLines,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  openInvoices,
  openBills,
  sum,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  FileClock,
  Landmark,
  Plus,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from '../financeShared'

function FinanceDashboard({ data, onNavigate }) {
  const cash = data.accounts
    .filter((item) => ['Cash', 'Bank'].includes(item.control))
    .reduce((total, item) => total + accountNet(data, item.id), 0)
  const receivables = sum(openInvoices(data), (item) => item.total - item.allocated)
  const payables = sum(openBills(data), (item) => item.total - item.paid)
  const pendingDrafts = data.entries.filter((item) => item.status === 'Draft').length
  const start = `${today().slice(0, 7)}-01`
  const revenue = sum(
    data.accounts.filter((item) => item.type === 'Revenue'),
    (account) =>
      periodLines(data, start, today())
        .filter((line) => line.accountId === account.id)
        .reduce((total, line) => total + Number(line.credit) - Number(line.debit), 0),
  )
  const expenses = sum(
    data.accounts.filter((item) => item.type === 'Expense'),
    (account) =>
      periodLines(data, start, today())
        .filter((line) => line.accountId === account.id)
        .reduce((total, line) => total + Number(line.debit) - Number(line.credit), 0),
  )
  return (
    <>
      <PageHeader
        title="Finance & Accounting"
        subtitle="A real-time view of cash, working capital, journal activity and financial controls."
        icon={Landmark}
        action={
          <Button onClick={() => onNavigate('Create Journal Entry')}>
            <Plus size={16} />
            New journal
          </Button>
        }
      />
      <div className="fa-stats">
        <Stat icon={Wallet} label="Cash & bank" value={money(cash)} hint="Posted ledger balance" />
        <Stat
          icon={ArrowDownLeft}
          label="Customer receivables"
          value={money(receivables)}
          tone="blue"
          hint={`${openInvoices(data).length} open invoices`}
        />
        <Stat
          icon={ArrowUpRight}
          label="Supplier payables"
          value={money(payables)}
          tone="amber"
          hint={`${openBills(data).length} open bills`}
        />
        <Stat
          icon={BookOpen}
          label="Current period net"
          value={money(revenue - expenses)}
          tone="green"
          hint={`${pendingDrafts} journal draft(s)`}
        />
      </div>
      <div className="fa-dashboard-grid">
        <Card title="Working capital" icon={TrendingUp} className="fa-working-capital">
          <div className="fa-capital">
            <div>
              <span>Liquid funds</span>
              <b>{money(cash)}</b>
              <small>Cash on hand + bank accounts</small>
            </div>
            <div>
              <span>Net working capital</span>
              <b>{money(cash + receivables - payables)}</b>
              <small>Cash + receivables − payables</small>
            </div>
          </div>
          <div className="fa-capital-bar">
            <i
              style={{
                width: `${Math.min(100, (cash / Math.max(1, cash + receivables + payables)) * 100)}%`,
              }}
            />
          </div>
          <div className="fa-capital-legend">
            <span>Cash & bank</span>
            <span>{money(cash)}</span>
          </div>
        </Card>
        <Card title="Month-to-date performance" icon={TrendingUp}>
          <div className="fa-performance">
            <div>
              <span>Revenue</span>
              <b>{money(revenue)}</b>
            </div>
            <div>
              <span>Expenses</span>
              <b>{money(expenses)}</b>
            </div>
            <div className={revenue >= expenses ? 'positive' : 'negative'}>
              <span>Net result</span>
              <b>{money(revenue - expenses)}</b>
            </div>
          </div>
          <Button kind="link" onClick={() => onNavigate('Profit & Loss')}>
            Open Profit & Loss <ArrowRight size={14} />
          </Button>
        </Card>
        <Card title="Finance action queue" icon={ShieldCheck} className="fa-queue">
          <div className="fa-queue-list">
            <button onClick={() => onNavigate('Draft Entries')}>
              <span className="orange">
                <FileClock size={17} />
              </span>
              <b>{pendingDrafts} journal drafts</b>
              <small>Review and post entries</small>
              <ChevronRight size={15} />
            </button>
            <button onClick={() => onNavigate('Outstanding Invoices')}>
              <span className="blue">
                <ArrowDownLeft size={17} />
              </span>
              <b>{openInvoices(data).length} open invoices</b>
              <small>{money(receivables)} due from customers</small>
              <ChevronRight size={15} />
            </button>
            <button onClick={() => onNavigate('Outstanding Payables')}>
              <span className="purple">
                <ArrowUpRight size={17} />
              </span>
              <b>{openBills(data).length} supplier bills</b>
              <small>{money(payables)} due to suppliers</small>
              <ChevronRight size={15} />
            </button>
          </div>
        </Card>
        <Card title="Recent journal activity" icon={BookOpen} className="fa-recent">
          <Table headers={['Entry', 'Date', 'Description', 'Debit / Credit', 'Status']}>
            {data.entries.slice(0, 5).map((entry) => {
              const total = sum(entry.lines, (line) => Number(line.debit))
              return (
                <tr key={entry.id}>
                  <td>
                    <b>{entry.number}</b>
                  </td>
                  <td>{dateLabel(entry.date)}</td>
                  <td>{entry.description}</td>
                  <td>{money(total)}</td>
                  <td>
                    <Status>{entry.status}</Status>
                  </td>
                </tr>
              )
            })}
          </Table>
        </Card>
        <Card title="Quick access" icon={ArrowRight} className="fa-quick">
          <div className="fa-quick-links">
            {[
              'Account Directory',
              'Create Journal Entry',
              'Receive Payment',
              'Make Payment',
              'Trial Balance',
              'Bank Reconciliation',
            ].map((item) => (
              <button key={item} onClick={() => onNavigate(item)}>
                <ArrowRight size={14} />
                {item}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

export default FinanceDashboard
