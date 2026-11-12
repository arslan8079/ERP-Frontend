import { useState } from 'react'
import { Pencil, History } from 'lucide-react'

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
    updateDealer,
    toggleDealerStatus,
  } = context
  const page = 'Dealer Profile'
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)

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
            <button
              className="dealer-button secondary"
              onClick={() => {
                setDraft({ ...selectedDealer })
                setEditing(true)
              }}
            >
              <Pencil size={14} /> Edit profile
            </button>
            {['Active', 'Inactive'].includes(selectedDealer.status) && (
              <button
                className="dealer-button secondary"
                disabled={selectedDealer.verification !== 'Verified'}
                onClick={() => toggleDealerStatus(selectedDealer.id)}
              >
                {selectedDealer.status === 'Active' ? 'Deactivate' : 'Reactivate'}
              </button>
            )}
          </div>
        </div>
        {editing && draft && (
          <form
            className="dealer-form-card"
            onSubmit={(event) => {
              event.preventDefault()
              if (updateDealer(selectedDealer.id, draft)) setEditing(false)
            }}
          >
            <div className="dealer-form-heading">
              <span>Edit dealer profile · {selectedDealer.id}</span>
              <small>Existing orders and account history are retained.</small>
            </div>
            <div className="dealer-form-grid">
              {[
                ['name', 'Dealer name', 'text'],
                ['owner', 'Owner / contact', 'text'],
                ['email', 'Email', 'email'],
                ['phone', 'Phone', 'tel'],
                ['city', 'City', 'text'],
                ['category', 'Category', 'text'],
                ['creditLimit', 'Credit limit (PKR)', 'number'],
              ].map(([key, label, type]) => (
                <label className="dealer-field" key={key}>
                  <span>{label}</span>
                  <input
                    type={type}
                    min={key === 'creditLimit' ? '0' : undefined}
                    value={draft[key] ?? ''}
                    required={key !== 'email'}
                    onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
                  />
                </label>
              ))}
            </div>
            <footer>
              <button
                type="button"
                className="dealer-button secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="dealer-button">
                Save profile
              </button>
            </footer>
          </form>
        )}
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
        <section className="dealer-card">
          <header>
            <span>
              <History size={16} />
              Dealer change history
            </span>
          </header>
          {data.history.filter((item) => item.dealerId === selectedDealer.id).length ? (
            <div className="dealer-history-list">
              {data.history
                .filter((item) => item.dealerId === selectedDealer.id)
                .slice(0, 10)
                .map((item) => (
                  <div key={item.id}>
                    <b>{item.type}</b>
                    <span>{item.details}</span>
                    <small>{item.date}</small>
                  </div>
                ))}
            </div>
          ) : (
            <p className="dealer-empty-panel">No dealer changes have been recorded.</p>
          )}
        </section>
      </div>
    )
  }

  return null
}
