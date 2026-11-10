export default function DealerReportsPage({ context }) {
  const {
    onNavigate,
    data,
    dealers,
    totalOutstanding,
    dealerRows,
    table,
    button,
    header,
    searchBar,
    BarChart3,
    CheckCircle2,
    Clock3,
    Users,
    Wallet,
    Stat,
    money,
  } = context
  const page = 'Dealer Reports'

  if (page === 'Dealer List' || page === 'Dealer Reports')
    return (
      <div className="dealer-page">
        {header(
          page === 'Dealer Reports'
            ? 'Dealer directory grouped by status, category, territory, and account exposure.'
            : 'Search and manage registered dealers across the company network.',
          page === 'Dealer Reports' ? BarChart3 : Users,
          button('Add dealer', () => onNavigate('Add Dealer')),
        )}
        <div className="dealer-stats compact">
          <Stat
            label="Active"
            value={data.dealers.filter((item) => item.status === 'Active').length}
            icon={CheckCircle2}
          />
          <Stat
            label="Verification pending"
            value={data.dealers.filter((item) => item.verification === 'Pending').length}
            icon={Clock3}
            tone="amber"
          />
          <Stat
            label="Credit exposure"
            value={money(totalOutstanding)}
            icon={Wallet}
            tone="purple"
          />
        </div>
        {searchBar}
        {table(
          'Dealer directory',
          [
            'Dealer / category',
            'Owner / contact',
            'City',
            'Territory',
            'Status',
            'Outstanding',
            '',
          ],
          dealerRows(dealers),
        )}
      </div>
    )

  return null
}
