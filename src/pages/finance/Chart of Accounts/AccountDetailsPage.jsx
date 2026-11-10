import {
  money,
  dateLabel,
  postedLines,
  accountNet,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Field,
  Empty,
  accountAmount,
  BookOpen,
  ChevronRight,
  ListChecks,
} from '../financeShared'

function AccountDetailsPage({ data, selectedAccountId, setSelectedAccountId, onNavigate }) {
  const account = data.accounts.find((item) => item.id === selectedAccountId) || data.accounts[0]
  const lines = postedLines(data, account?.id).sort((a, b) =>
    b.entry.date.localeCompare(a.entry.date),
  )
  return (
    <>
      <PageHeader
        title="Account Details"
        subtitle="Inspect the account classification, balance, and source journal history."
        icon={BookOpen}
        action={
          <Button kind="secondary" onClick={() => onNavigate('General Ledger')}>
            General ledger <ChevronRight size={14} />
          </Button>
        }
      />
      <div className="fa-toolbar standalone">
        <Field label="Select account">
          <select
            value={account?.id || ''}
            onChange={(event) => setSelectedAccountId(event.target.value)}
          >
            {data.accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {account && (
        <>
          <div className="fa-account-hero">
            <div>
              <span>
                {account.code} · {account.group}
              </span>
              <h2>{account.name}</h2>
              <Status>{account.type}</Status>
            </div>
            <strong>{accountAmount(data, account)}</strong>
          </div>
          <Card title={`Posted ledger activity · ${lines.length} line(s)`} icon={ListChecks}>
            <Table
              headers={[
                'Date',
                'Journal',
                'Description',
                'Reference',
                'Debit',
                'Credit',
                'Balance',
              ]}
            >
              {lines.map((line, index) => (
                <tr key={`${line.entry.id}-${index}`}>
                  <td>{dateLabel(line.entry.date)}</td>
                  <td>{line.entry.number}</td>
                  <td>{line.memo || line.entry.description}</td>
                  <td>{line.entry.reference || '—'}</td>
                  <td>{line.debit ? money(line.debit) : '—'}</td>
                  <td>{line.credit ? money(line.credit) : '—'}</td>
                  <td>{money(accountNet(data, account.id, line.entry.date))}</td>
                </tr>
              ))}
            </Table>
            {!lines.length && <Empty>No posted activity for this account.</Empty>}
          </Card>
        </>
      )}
    </>
  )
}

export default AccountDetailsPage
