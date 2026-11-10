export default function DealerVerificationPage({ context }) {
  const { data, dealers, verifyDealer, table, header, status, Check, ShieldCheck, X } = context
  const page = 'Dealer Verification'

  if (page === 'Dealer Verification')
    return (
      <div className="dealer-page">
        {header(
          'Review dealer identity and business information before activating an account.',
          ShieldCheck,
        )}
        <div className="dealer-verification-banner">
          <ShieldCheck size={20} />
          <span>
            Verification is a gate for sales orders: only verified, active dealer accounts may order
            pesticide products.
          </span>
          <b>{data.dealers.filter((item) => item.verification === 'Pending').length} pending</b>
        </div>
        {table(
          'Verification queue',
          ['Dealer', 'Owner / phone', 'Email', 'City', 'Submitted', 'Decision'],
          dealers
            .filter((dealer) => dealer.verification !== 'Verified')
            .map((dealer) => (
              <tr key={dealer.id}>
                <td>
                  {dealer.name}
                  <small>
                    {dealer.id} · {dealer.category}
                  </small>
                </td>
                <td>
                  {dealer.owner}
                  <small>{dealer.phone}</small>
                </td>
                <td>{dealer.email || '—'}</td>
                <td>{dealer.city}</td>
                <td>{dealer.createdAt}</td>
                <td>
                  {dealer.verification === 'Pending' ? (
                    <div className="dealer-row-actions">
                      <button
                        className="dealer-mini approve"
                        onClick={() => verifyDealer(dealer.id, 'Verified')}
                      >
                        <Check size={13} />
                        Verify
                      </button>
                      <button
                        className="dealer-mini reject"
                        onClick={() => verifyDealer(dealer.id, 'Rejected')}
                      >
                        <X size={13} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    status(dealer.verification)
                  )}
                </td>
              </tr>
            )),
        )}
      </div>
    )

  return null
}
