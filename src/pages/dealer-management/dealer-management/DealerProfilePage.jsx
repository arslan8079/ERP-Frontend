export default function DealerProfilePage({ context }) {
  const {
    onNavigate,
    data,
    selectedDealer,
    orderRows,
    table,
    button,
    header,
    status,
    Building2,
    MapPin,
    ShoppingCart,
    Users,
    money,
    territoryName,
    officerName,
    dueFor,
  } = context
  const page = 'Dealer Profile'

  if (page === 'Dealer Profile') {
    if (!selectedDealer)
      return (
        <div className="dealer-page">
          {header('No dealer accounts have been registered.', Users)}
          <div className="dealer-empty-panel">Add a dealer to view its profile.</div>
        </div>
      )
    return (
      <div className="dealer-page">
        {header(
          'Dealer identity, sales coverage, order activity and account position.',
          Building2,
          button('Create order', () => onNavigate('Create Order'), false, ShoppingCart),
        )}
        <div className="dealer-profile-hero">
          <span className="dealer-profile-avatar">
            {selectedDealer.name
              .split(/\s+/)
              .slice(0, 2)
              .map((item) => item[0])
              .join('')
              .toUpperCase()}
          </span>
          <div>
            <span className="dealer-eyebrow">
              {selectedDealer.id} · {selectedDealer.category}
            </span>
            <h2>{selectedDealer.name}</h2>
            <p>
              {selectedDealer.owner} · {selectedDealer.city} · {selectedDealer.phone}
            </p>
          </div>
          <div className="dealer-profile-status">
            {status(selectedDealer.status)}
            <small>Verified: {selectedDealer.verification}</small>
          </div>
        </div>
        <div className="dealer-profile-grid">
          <section className="dealer-card">
            <header>
              <span>
                <Building2 size={16} />
                Business details
              </span>
            </header>
            <dl className="dealer-detail-list">
              <div>
                <dt>Dealer ID</dt>
                <dd>{selectedDealer.id}</dd>
              </div>
              <div>
                <dt>Owner / contact</dt>
                <dd>{selectedDealer.owner}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{selectedDealer.email || '—'}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{selectedDealer.phone}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{selectedDealer.city}</dd>
              </div>
              <div>
                <dt>Registered</dt>
                <dd>{selectedDealer.createdAt}</dd>
              </div>
            </dl>
          </section>
          <section className="dealer-card">
            <header>
              <span>
                <MapPin size={16} />
                Sales coverage & credit
              </span>
            </header>
            <dl className="dealer-detail-list">
              <div>
                <dt>Territory</dt>
                <dd>{territoryName(data, selectedDealer.territoryId)}</dd>
              </div>
              <div>
                <dt>Sales officer</dt>
                <dd>
                  {officerName(
                    data,
                    data.assignments.find(
                      (item) => item.dealerId === selectedDealer.id && item.status === 'Active',
                    )?.officerId,
                  )}
                </dd>
              </div>
              <div>
                <dt>Credit limit</dt>
                <dd>{money(selectedDealer.creditLimit)}</dd>
              </div>
              <div>
                <dt>Outstanding</dt>
                <dd>{money(dueFor(data, selectedDealer.id))}</dd>
              </div>
              <div>
                <dt>Available credit</dt>
                <dd>
                  {money(Math.max(0, selectedDealer.creditLimit - dueFor(data, selectedDealer.id)))}
                </dd>
              </div>
            </dl>
            <button className="dealer-button secondary" onClick={() => onNavigate('Credit Limits')}>
              Manage credit limit
            </button>
          </section>
        </div>
        {table(
          'Recent orders',
          ['Order', 'Order date', 'Items', 'Total', 'Terms', 'Status', ''],
          orderRows(
            data.orders.filter((order) => order.dealerId === selectedDealer.id).slice(0, 5),
          ),
        )}
        {table(
          'Recent payments',
          ['Receipt', 'Date', 'Method', 'Reference', 'Amount', 'Status'],
          data.payments
            .filter((payment) => payment.dealerId === selectedDealer.id)
            .map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.date}</td>
                <td>{payment.method}</td>
                <td>{payment.reference}</td>
                <td>{money(payment.amount)}</td>
                <td>{status(payment.status)}</td>
              </tr>
            )),
        )}
      </div>
    )
  }

  return null
}
