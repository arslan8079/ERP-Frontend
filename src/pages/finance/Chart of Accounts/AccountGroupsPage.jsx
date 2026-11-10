import {
  money,
  accountTypes,
  accountNet,
  PageHeader,
  Button,
  Card,
  accountAmount,
  sum,
  BookOpen,
  Building2,
  ChevronRight,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from '../financeShared'

function AccountGroupsPage({ data, onNavigate }) {
  return (
    <>
      <PageHeader
        title="Account Groups"
        subtitle="Browse the financial statement hierarchy and review balances by account class."
        icon={Building2}
        action={
          <Button onClick={() => onNavigate('Create Ledger Account')}>
            <Plus size={15} />
            New account
          </Button>
        }
      />
      <div className="fa-account-groups">
        {accountTypes.map((type) => {
          const accounts = data.accounts.filter((item) => item.type === type)
          const total = sum(accounts, (item) => accountNet(data, item.id))
          return (
            <Card
              key={type}
              title={`${type} · ${accounts.length} accounts`}
              icon={
                type === 'Asset'
                  ? Wallet
                  : type === 'Revenue'
                    ? TrendingUp
                    : type === 'Expense'
                      ? TrendingDown
                      : BookOpen
              }
              action={<b className="fa-group-total">{money(total)}</b>}
            >
              <div className="fa-group-list">
                {accounts.map((item) => (
                  <button key={item.id} onClick={() => onNavigate('Account Directory')}>
                    <span>
                      {item.code} · {item.name}
                    </span>
                    <b>{accountAmount(data, item)}</b>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}

export default AccountGroupsPage
