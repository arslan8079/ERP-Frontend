export default function RecoveryHistoryPage({ context }) {
  const {
    onNavigate,
    data,
    setSelectedDealerId,
    dealers,
    exportRows,
    table,
    header,
    Banknote,
    Users,
    Wallet,
    Stat,
    money,
    territoryName,
    dueFor,
  } = context
  const page = 'Recovery History'

  if (
    page === 'Dealer Statements' ||
    page === 'Outstanding Balances' ||
    page === 'Outstanding Report' ||
    page === 'Recovery History'
  ) {
    const statementRows = dealers
      .map((dealer) => {
        const orders = data.orders.filter(
          (order) =>
            order.dealerId === dealer.id &&
            ['Approved', 'Dispatched', 'Delivered'].includes(order.status),
        )
        const payments = data.payments.filter(
          (payment) => payment.dealerId === dealer.id && payment.status === 'Posted',
        )
        const returns = data.returns.filter(
          (item) => item.dealerId === dealer.id && item.status === 'Approved',
        )
        return { dealer, orders, payments, returns, balance: dueFor(data, dealer.id) }
      })
      .filter((item) =>
        page === 'Recovery History'
          ? item.payments.length > 0
          : page === 'Dealer Statements'
            ? true
            : item.balance > 0,
      )
    return (
      <div className="dealer-page">
        {header(
          page === 'Dealer Statements'
            ? 'Dealer account activity with order charges, receipts, approved returns, and running balance.'
            : page === 'Recovery History'
              ? 'Posted receipts and collection activity by dealer account.'
              : 'Identify outstanding dealer receivables for timely follow-up and recovery.',
          page === 'Recovery History' ? Banknote : Wallet,
          null,
          () =>
            exportRows(
              page,
              [
                'Dealer',
                'Opening balance',
                'Invoiced',
                'Receipts',
                'Approved returns',
                'Outstanding',
              ],
              statementRows.map(({ dealer, orders, payments, returns, balance }) => [
                dealer.name,
                dealer.openingBalance,
                orders.reduce((sum, item) => sum + item.total, 0),
                payments.reduce((sum, item) => sum + item.amount, 0),
                returns.reduce((sum, item) => sum + item.amount, 0),
                balance,
              ]),
            ),
        )}
        <div className="dealer-stats compact">
          <Stat label="Accounts" value={statementRows.length} icon={Users} />
          <Stat
            label="Outstanding"
            value={money(statementRows.reduce((sum, item) => sum + item.balance, 0))}
            icon={Wallet}
            tone="amber"
          />
          <Stat
            label="Receipts posted"
            value={money(
              data.payments
                .filter((item) => item.status === 'Posted')
                .reduce((sum, item) => sum + item.amount, 0),
            )}
            icon={Banknote}
            tone="blue"
          />
        </div>
        {page === 'Dealer Statements'
          ? table(
              'Dealer account statement',
              ['Dealer', 'Date', 'Transaction', 'Reference', 'Debit', 'Credit', 'Balance'],
              statementRows.flatMap(({ dealer, orders, payments, returns }) => {
                let balance = dealer.openingBalance
                const transactions = [
                  ...orders.map((item) => ({
                    date: item.date,
                    type: 'Sales order',
                    reference: item.id,
                    debit: item.total,
                    credit: 0,
                  })),
                  ...payments.map((item) => ({
                    date: item.date,
                    type: 'Payment received',
                    reference: item.id,
                    debit: 0,
                    credit: item.amount,
                  })),
                  ...returns.map((item) => ({
                    date: item.date,
                    type: 'Approved return credit',
                    reference: item.id,
                    debit: 0,
                    credit: item.amount,
                  })),
                ].sort((a, b) => a.date.localeCompare(b.date))
                return [
                  {
                    date: '—',
                    type: 'Opening balance',
                    reference: dealer.id,
                    debit: dealer.openingBalance,
                    credit: 0,
                  },
                  ...transactions,
                ].map((item) => {
                  balance += item.debit - item.credit
                  return (
                    <tr key={`${dealer.id}-${item.reference}`}>
                      <td>{dealer.name}</td>
                      <td>{item.date}</td>
                      <td>{item.type}</td>
                      <td>{item.reference}</td>
                      <td>{item.debit ? money(item.debit) : '—'}</td>
                      <td>{item.credit ? money(item.credit) : '—'}</td>
                      <td>{money(balance)}</td>
                    </tr>
                  )
                })
              }),
            )
          : table(
              page === 'Recovery History' ? 'Dealer collections' : 'Open dealer balances',
              [
                'Dealer',
                'City / territory',
                'Opening balance',
                'Orders',
                'Receipts',
                'Approved returns',
                'Outstanding',
                'Follow-up',
              ],
              statementRows.map(({ dealer, orders, payments, returns, balance }) => (
                <tr key={dealer.id}>
                  <td>
                    <button
                      className="dealer-table-link"
                      onClick={() => {
                        setSelectedDealerId(dealer.id)
                        onNavigate('Dealer Profile')
                      }}
                    >
                      {dealer.name}
                      <small>{dealer.id}</small>
                    </button>
                  </td>
                  <td>
                    {dealer.city}
                    <small>{territoryName(data, dealer.territoryId)}</small>
                  </td>
                  <td>{money(dealer.openingBalance)}</td>
                  <td>{money(orders.reduce((sum, item) => sum + item.total, 0))}</td>
                  <td>{money(payments.reduce((sum, item) => sum + item.amount, 0))}</td>
                  <td>{money(returns.reduce((sum, item) => sum + item.amount, 0))}</td>
                  <td>
                    <b>{money(balance)}</b>
                  </td>
                  <td>
                    <button className="dealer-mini" onClick={() => onNavigate('Dealer Payments')}>
                      Record payment
                    </button>
                  </td>
                </tr>
              )),
            )}
      </div>
    )
  }

  return null
}
