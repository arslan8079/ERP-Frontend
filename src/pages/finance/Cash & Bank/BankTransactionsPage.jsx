import {
  money,
  dateLabel,
  postedLines,
  accountNet,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  Empty,
  Toolbar,
  accountName,
  sum,
  ArrowDownLeft,
  CheckCircle2,
  ClipboardCheck,
  Landmark,
  ListChecks,
} from '../financeShared'

function BankTransactionsPage({ data, search, setSearch, onNavigate }) {
  const bankAccounts = data.accounts.filter((item) => item.control === 'Bank')
  const lines = postedLines(data)
    .filter((line) => bankAccounts.some((item) => item.id === line.accountId))
    .filter((line) =>
      `${line.entry.number} ${line.entry.description} ${line.entry.reference} ${accountName(data, line.accountId)}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date))
  const balance = sum(bankAccounts, (item) => accountNet(data, item.id))
  return (
    <>
      <PageHeader
        title="Bank Transactions"
        subtitle="Review bank-ledger debits and credits, running balances, and cleared status."
        icon={Landmark}
        action={
          <Button onClick={() => onNavigate('Bank Reconciliation')}>
            <ClipboardCheck size={15} />
            Reconcile bank
          </Button>
        }
      />
      <div className="fa-stats compact">
        <Stat icon={Landmark} label="Total bank balance" value={money(balance)} />
        <Stat
          icon={ArrowDownLeft}
          label="Uncleared transactions"
          value={lines.filter((item) => !item.cleared).length}
          tone="amber"
        />
        <Stat
          icon={CheckCircle2}
          label="Cleared transactions"
          value={lines.filter((item) => item.cleared).length}
          tone="green"
        />
      </div>
      <Card title={`Bank ledger transactions · ${lines.length}`} icon={ListChecks}>
        <div className="fa-toolbar">
          <Toolbar
            query={search}
            setQuery={setSearch}
            placeholder="Search bank account, journal, reference"
          />
        </div>
        <Table
          headers={[
            'Date',
            'Bank account',
            'Journal',
            'Description',
            'Reference',
            'Money in',
            'Money out',
            'Reconciliation',
          ]}
        >
          {lines.map((line, index) => (
            <tr key={`${line.entry.id}-${line.accountId}-${index}`}>
              <td>{dateLabel(line.entry.date)}</td>
              <td>{accountName(data, line.accountId)}</td>
              <td>{line.entry.number}</td>
              <td>{line.entry.description}</td>
              <td>{line.entry.reference || '—'}</td>
              <td>{line.debit ? money(line.debit) : '—'}</td>
              <td>{line.credit ? money(line.credit) : '—'}</td>
              <td>
                <Status>{line.cleared ? 'Cleared' : 'Uncleared'}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!lines.length && <Empty>No bank transactions match this search.</Empty>}
      </Card>
    </>
  )
}

export default BankTransactionsPage
