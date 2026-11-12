export default function PendingDispatchesPage({ context }) {
  const {
    onNavigate,
    data,
    markDelivered,
    table,
    button,
    header,
    status,
    ArrowRight,
    Check,
    Plus,
    Truck,
    money,
    dealerName,
    setSelectedOrderId,
  } = context
  const page = 'Pending Dispatches'

  if (page === 'Pending Dispatches' || page === 'Delivery Records') {
    const rows =
      page === 'Pending Dispatches'
        ? data.orders.filter(
            (order) =>
              order.status === 'Approved' &&
              !data.dispatches.some((item) => item.orderId === order.id),
          )
        : data.dispatches
    return (
      <div className="dealer-page">
        {header(
          page === 'Pending Dispatches'
            ? 'Approved orders that are ready for warehouse picking and dispatch.'
            : 'Track shipment documents and confirm delivery against dealer orders.',
          Truck,
          page === 'Pending Dispatches'
            ? button('Create dispatch', () => onNavigate('Create Dispatch'), false, Plus)
            : null,
        )}
        {page === 'Pending Dispatches'
          ? table(
              'Orders ready for dispatch',
              ['Order', 'Dealer', 'Order date', 'Value', 'Payment terms', ''],
              rows.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{dealerName(data, order.dealerId)}</td>
                  <td>{order.date}</td>
                  <td>{money(order.total)}</td>
                  <td>{order.paymentTerms}</td>
                  <td>
                    <button
                      className="dealer-mini"
                      onClick={() => {
                        setSelectedOrderId(order.id)
                        onNavigate('Create Dispatch')
                      }}
                    >
                      Dispatch <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              )),
            )
          : table(
              'Dispatch and delivery register',
              [
                'Delivery note',
                'Order',
                'Dealer',
                'Carrier / vehicle',
                'Dispatch date',
                'Status',
                'Action',
              ],
              rows.map((dispatch) => (
                <tr key={dispatch.id}>
                  <td>
                    {dispatch.reference}
                    <small>{dispatch.id}</small>
                  </td>
                  <td>{dispatch.orderId}</td>
                  <td>{dealerName(data, dispatch.dealerId)}</td>
                  <td>
                    {dispatch.carrier}
                    <small>{dispatch.vehicle}</small>
                  </td>
                  <td>{dispatch.date}</td>
                  <td>{status(dispatch.status)}</td>
                  <td>
                    {dispatch.status === 'In Transit' ? (
                      <button
                        className="dealer-mini approve"
                        onClick={() => markDelivered(dispatch.id)}
                      >
                        <Check size={13} />
                        Mark delivered
                      </button>
                    ) : (
                      dispatch.deliveredAt || '—'
                    )}
                  </td>
                </tr>
              )),
            )}
      </div>
    )
  }

  return null
}
