export default function OrderDetailsPage({ context }) {
  const {
    data,
    selectedOrderId,
    selectedOrder,
    table,
    header,
    status,
    FileCheck2,
    FileText,
    Truck,
    money,
    productCatalog,
    dealerName,
    dueFor,
  } = context
  const page = 'Order Details'

  if (page === 'Order Details') {
    const order = data.orders.find((item) => item.id === selectedOrderId) || selectedOrder
    return (
      <div className="dealer-page">
        {header('Review line items, dealer terms, approval history and delivery status.', FileText)}
        {!order ? (
          <div className="dealer-empty-panel">No orders are available.</div>
        ) : (
          <>
            <div className="dealer-order-hero">
              <div>
                <span className="dealer-eyebrow">SALES ORDER</span>
                <h2>{order.id}</h2>
                <p>
                  {dealerName(data, order.dealerId)} · {order.date}
                </p>
              </div>
              {status(order.status)}
              <strong>{money(order.total)}</strong>
            </div>
            {table(
              'Order lines',
              ['Product', 'Product code', 'Quantity', 'Unit price', 'Line total'],
              order.items.map((item) => {
                const product = productCatalog.find((record) => record.code === item.productCode)
                return (
                  <tr key={item.productCode}>
                    <td>{product?.name || item.productCode}</td>
                    <td>{item.productCode}</td>
                    <td>
                      {item.qty} {product?.unit}
                    </td>
                    <td>{money(product?.price)}</td>
                    <td>{money(item.qty * (product?.price || 0))}</td>
                  </tr>
                )
              }),
            )}
            <div className="dealer-profile-grid">
              <section className="dealer-card">
                <header>
                  <span>
                    <FileCheck2 size={16} />
                    Order terms
                  </span>
                </header>
                <dl className="dealer-detail-list">
                  <div>
                    <dt>Payment terms</dt>
                    <dd>{order.paymentTerms}</dd>
                  </div>
                  <div>
                    <dt>Dealer outstanding</dt>
                    <dd>{money(dueFor(data, order.dealerId))}</dd>
                  </div>
                  <div>
                    <dt>Credit limit</dt>
                    <dd>
                      {money(data.dealers.find((item) => item.id === order.dealerId)?.creditLimit)}
                    </dd>
                  </div>
                  <div>
                    <dt>Notes</dt>
                    <dd>{order.notes || '—'}</dd>
                  </div>
                </dl>
              </section>
              <section className="dealer-card">
                <header>
                  <span>
                    <Truck size={16} />
                    Delivery
                  </span>
                </header>
                {data.dispatches
                  .filter((item) => item.orderId === order.id)
                  .map((dispatch) => (
                    <p key={dispatch.id}>
                      {dispatch.reference} · {dispatch.carrier} · {status(dispatch.status)}
                    </p>
                  ))}
                {!data.dispatches.some((item) => item.orderId === order.id) && (
                  <p className="dealer-muted">No dispatch recorded.</p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    )
  }

  return null
}
