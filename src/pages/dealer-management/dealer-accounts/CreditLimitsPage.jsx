export default function CreditLimitsPage({ context }) {
  const {
    data,
    creditDrafts,
    setCreditDrafts,
    dealers,
    saveCreditLimit,
    table,
    header,
    Wallet,
    money,
    dueFor,
  } = context
  const page = 'Credit Limits'

  if (page === 'Credit Limits')
    return (
      <div className="dealer-page">
        {header(
          'Set account exposure limits. Orders on credit are blocked when available credit is insufficient.',
          Wallet,
        )}
        {table(
          'Dealer credit control',
          [
            'Dealer',
            'Credit limit',
            'Outstanding',
            'Available credit',
            'Utilization',
            'Update limit',
          ],
          dealers.map((dealer) => {
            const outstanding = dueFor(data, dealer.id)
            const utilization = dealer.creditLimit
              ? Math.min(100, Math.round((outstanding / dealer.creditLimit) * 100))
              : outstanding
                ? 100
                : 0
            return (
              <tr key={dealer.id}>
                <td>
                  {dealer.name}
                  <small>
                    {dealer.id} · {dealer.city}
                  </small>
                </td>
                <td>{money(dealer.creditLimit)}</td>
                <td>{money(outstanding)}</td>
                <td>{money(Math.max(0, dealer.creditLimit - outstanding))}</td>
                <td>
                  <div className="dealer-progress">
                    <i style={{ width: `${utilization}%` }} />
                  </div>
                  <small>{utilization}% used</small>
                </td>
                <td>
                  <div className="dealer-credit-edit">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      aria-label={`Credit limit for ${dealer.name}`}
                      value={creditDrafts[dealer.id] ?? dealer.creditLimit}
                      onChange={(event) =>
                        setCreditDrafts((current) => ({
                          ...current,
                          [dealer.id]: event.target.value,
                        }))
                      }
                    />
                    <button className="dealer-mini" onClick={() => saveCreditLimit(dealer.id)}>
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            )
          }),
        )}
      </div>
    )

  return null
}
