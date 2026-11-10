export default function DealerDashboardPage({ context }) {
  const {
    onNavigate,
    data,
    totalOutstanding,
    pendingOrders,
    verifyDealer,
    orderRows,
    table,
    button,
    header,
    eligibleDispatchOrders,
    status,
    Building2,
    Check,
    ChevronRight,
    ClipboardCheck,
    Truck,
    Users,
    Wallet,
    Stat,
    money,
  } = context
  const page = 'Dealer Dashboard'

  if (page === 'Dealer Management' || page === 'Dealer Dashboard')
    return (
      <div className="dealer-page dealer-dashboard">
        {header(
          'Dealer network, order approvals, dispatches and receivables across your sales territories.',
          Building2,
          button('Add dealer', () => onNavigate('Add Dealer')),
          null,
        )}
        <div className="dealer-stats">
          <Stat
            label="Active dealers"
            value={data.dealers.filter((item) => item.status === 'Active').length}
            note={`${data.dealers.length} registered accounts`}
            icon={Users}
          />
          <Stat
            label="Orders awaiting approval"
            value={pendingOrders.length}
            note="Credit and order review queue"
            icon={ClipboardCheck}
            tone="amber"
          />
          <Stat
            label="Open dispatches"
            value={data.dispatches.filter((item) => item.status === 'In Transit').length}
            note="Deliveries in transit"
            icon={Truck}
            tone="blue"
          />
          <Stat
            label="Dealer receivables"
            value={money(totalOutstanding)}
            note="Outstanding account balances"
            icon={Wallet}
            tone="purple"
          />
        </div>
        <section className="dealer-shortcuts">
          <div className="dealer-section-heading">
            <div>
              <span className="dealer-eyebrow">DEALER OPERATIONS</span>
              <h2>Work queues</h2>
            </div>
          </div>
          <div className="dealer-shortcut-grid">
            {[
              ['Dealer List', Users, `${data.dealers.length} dealer accounts`],
              ['Approval Queue', ClipboardCheck, `${pendingOrders.length} orders to review`],
              ['Pending Dispatches', Truck, `${eligibleDispatchOrders.length} approved orders`],
              ['Outstanding Balances', Wallet, `${money(totalOutstanding)} receivables`],
            ].map(([label, Icon, note]) => (
              <button key={label} onClick={() => onNavigate(label)}>
                <span>
                  <Icon size={19} />
                </span>
                <div>
                  <b>{label}</b>
                  <small>{note}</small>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </section>
        <div className="dealer-dashboard-grid">
          {table(
            'Recent dealer orders',
            ['Order', 'Dealer', 'Pesticide / quantity', 'Total', 'Terms', 'Status', ''],
            orderRows(data.orders.slice(0, 5)),
          )}
          {table(
            'Dealer verification queue',
            ['Dealer', 'Owner / contact', 'City', 'Registered', 'Verification', ''],
            data.dealers
              .filter((item) => item.verification === 'Pending')
              .map((dealer) => (
                <tr key={dealer.id}>
                  <td>
                    {dealer.name}
                    <small>{dealer.id}</small>
                  </td>
                  <td>
                    {dealer.owner}
                    <small>{dealer.phone}</small>
                  </td>
                  <td>{dealer.city}</td>
                  <td>{dealer.createdAt}</td>
                  <td>{status(dealer.verification)}</td>
                  <td>
                    <button
                      className="dealer-mini approve"
                      onClick={() => verifyDealer(dealer.id, 'Verified')}
                    >
                      <Check size={13} />
                      Verify
                    </button>
                  </td>
                </tr>
              )),
          )}
        </div>
      </div>
    )

  return null
}
