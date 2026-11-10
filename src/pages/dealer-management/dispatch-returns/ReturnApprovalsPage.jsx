export default function ReturnApprovalsPage({ context }) {
  const { data, decideReturn, table, header, status, Check, Package, X, money, dealerName } =
    context
  const page = 'Return Approvals'

  if (page === 'Return Approvals')
    return (
      <div className="dealer-page">
        {header(
          'Review returned pesticide product and requested account credit before posting.',
          Package,
        )}
        {table(
          'Return authorization queue',
          [
            'Return',
            'Dealer',
            'Original order',
            'Reason / batch detail',
            'Requested credit',
            'Date',
            'Decision',
          ],
          data.returns.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{dealerName(data, item.dealerId)}</td>
              <td>{item.orderId}</td>
              <td>
                {item.reason}
                <small>{item.notes}</small>
              </td>
              <td>{money(item.amount)}</td>
              <td>{item.date}</td>
              <td>
                {item.status === 'Pending Approval' ? (
                  <div className="dealer-row-actions">
                    <button
                      className="dealer-mini approve"
                      onClick={() => decideReturn(item.id, 'Approved')}
                    >
                      <Check size={13} />
                      Approve
                    </button>
                    <button
                      className="dealer-mini reject"
                      onClick={() => decideReturn(item.id, 'Rejected')}
                    >
                      <X size={13} />
                      Reject
                    </button>
                  </div>
                ) : (
                  status(item.status)
                )}
              </td>
            </tr>
          )),
        )}
      </div>
    )

  return null
}
