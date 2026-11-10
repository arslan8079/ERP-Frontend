import {
  money,
  postedLines,
  accountNet,
  PageHeader,
  Button,
  Stat,
  Card,
  Status,
  Empty,
  accountAmount,
  sum,
  ArrowRight,
  Building2,
  ChevronRight,
  FileClock,
  Landmark,
  Plus,
  ShieldCheck,
  Wallet,
} from '../financeShared'

function CashAccountsPage({ data, control, title, onNavigate }) {
  const accounts = data.accounts.filter((item) => item.control === control)
  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          control === 'Cash'
            ? 'Monitor physical cash ledgers and posted collection and disbursement activity.'
            : 'Maintain bank ledger balances and reconcile statements to posted transactions.'
        }
        icon={control === 'Cash' ? Wallet : Landmark}
        action={
          <Button onClick={() => onNavigate('Create Ledger Account')}>
            <Plus size={15} />
            Add account
          </Button>
        }
      />
      <div className="fa-stats compact">
        <Stat
          icon={control === 'Cash' ? Wallet : Landmark}
          label={`${title} balance`}
          value={money(sum(accounts, (item) => accountNet(data, item.id)))}
        />
        <Stat
          icon={Building2}
          label="Active accounts"
          value={accounts.filter((item) => item.status === 'Active').length}
          tone="blue"
        />
        <Stat
          icon={FileClock}
          label="Unreconciled lines"
          value={sum(
            accounts,
            (account) => postedLines(data, account.id).filter((line) => !line.cleared).length,
          )}
          tone="amber"
        />
      </div>
      <div className="fa-account-cards">
        {accounts.map((item) => (
          <article className="fa-bank-card" key={item.id}>
            <div>
              <span className="fa-bank-icon">
                {control === 'Cash' ? <Wallet size={19} /> : <Landmark size={19} />}
              </span>
              <Status>{item.status}</Status>
            </div>
            <small>
              {item.code} · {control === 'Cash' ? 'CASH LEDGER' : 'BANK LEDGER'}
            </small>
            <h2>{item.name}</h2>
            <strong>{accountAmount(data, item)}</strong>
            <footer>
              <span>{postedLines(data, item.id).length} posted transactions</span>
              <button
                className="fa-link"
                onClick={() =>
                  onNavigate(control === 'Cash' ? 'Cash Receipts' : 'Bank Transactions')
                }
              >
                View activity <ChevronRight size={13} />
              </button>
            </footer>
          </article>
        ))}
      </div>
      {!accounts.length && (
        <Empty>
          No {title.toLowerCase()} are configured. Create a ledger account and set its control type
          to {control}.
        </Empty>
      )}
      <Card title="Account workflow" icon={ShieldCheck}>
        <div className="fa-note">
          <b>Safe cash and bank control</b>
          <p>
            All receipts and disbursements create balanced posted journal entries. Bank
            reconciliation compares the statement closing balance against the selected bank ledger
            and marks matched journal lines as cleared.
          </p>
          <div>
            <Button
              kind="secondary"
              onClick={() =>
                onNavigate(control === 'Cash' ? 'Cash Receipts' : 'Bank Reconciliation')
              }
            >
              {control === 'Cash' ? 'Record receipt' : 'Start reconciliation'}{' '}
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}

export default CashAccountsPage
