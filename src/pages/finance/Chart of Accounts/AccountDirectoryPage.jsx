import {
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Empty,
  Toolbar,
  accountAmount,
  BookOpen,
  ChevronRight,
  ListChecks,
  Plus,
} from '../financeShared'

function AccountDirectoryPage({ data, search, setSearch, setSelectedAccountId, onNavigate }) {
  const accounts = data.accounts.filter((item) =>
    `${item.code} ${item.name} ${item.type} ${item.group}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )
  return (
    <>
      <PageHeader
        title="Account Directory"
        subtitle="Search ledger accounts and inspect posted balances."
        icon={BookOpen}
        action={
          <Button onClick={() => onNavigate('Create Ledger Account')}>
            <Plus size={15} />
            Create account
          </Button>
        }
      />
      <Card title={`Chart of accounts · ${accounts.length}`} icon={ListChecks}>
        <div className="fa-toolbar">
          <Toolbar
            query={search}
            setQuery={setSearch}
            placeholder="Search code, account or group"
          />
        </div>
        <Table
          headers={['Code', 'Account name', 'Type', 'Group', 'Control', 'Balance', 'Status', '']}
        >
          {accounts.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.code}</b>
              </td>
              <td>{item.name}</td>
              <td>
                <Status>{item.type}</Status>
              </td>
              <td>{item.group}</td>
              <td>{item.control || '—'}</td>
              <td>
                <b>{accountAmount(data, item)}</b>
              </td>
              <td>
                <Status>{item.status}</Status>
              </td>
              <td>
                <button
                  className="fa-link"
                  onClick={() => {
                    setSelectedAccountId(item.id)
                    onNavigate('Account Details')
                  }}
                >
                  Details <ChevronRight size={13} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {!accounts.length && <Empty>No ledger accounts match this search.</Empty>}
      </Card>
    </>
  )
}

export default AccountDirectoryPage
