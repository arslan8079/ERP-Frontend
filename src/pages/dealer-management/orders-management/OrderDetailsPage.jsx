import { useState } from 'react'

export default function OrderDetailsPage({ context }) {
  const {
    onNavigate,
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
    amendOrder,
    cancelOrder,
    decideOrder,
  } = context
  const page = 'Order Details'
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [decisionReason, setDecisionReason] = useState('')

  if (page === 'Order Details') {
    const order = data.orders.find((item) => item.id === selectedOrderId) || selectedOrder
    const fulfillments = (data.fulfillments || []).filter((item) => item.orderId === order?.id)
    const orderReturns = (data.returns || []).filter((item) => item.orderId === order?.id)
    const dispatches = data.dispatches.filter((item) => item.orderId === order?.id)
    const timeline = Array.isArray(order?.timeline) ? order.timeline : []
    const nextAction =
      order?.status === 'Pending Approval'
        ? 'An approver must review the order. It may be amended or cancelled until a decision is recorded.'
        : order?.status === 'Approved'
          ? 'Confirm stock allocation and create a dispatch.'
          : order?.status === 'Dispatched'
            ? dispatches.some((item) => item.status === 'In Transit')
              ? 'Confirm delivery when the shipment reaches the dealer.'
              : dispatches.some((item) => item.status === 'Delivered')
                ? 'The dispatch is marked delivered; reconcile the order status against its delivery record.'
                : 'Review the dispatch record and confirm delivery when the shipment reaches the dealer.'
            : order?.status === 'Delivered'
              ? 'Delivery is complete. Submit a return request if goods need review.'
              : order?.status === 'Rejected'
                ? 'This order is closed. Create a new order if the dealer still needs these products.'
                : order?.status === 'Cancelled'
                  ? 'This order is cancelled and cannot be reopened.'
                  : 'Review the order and follow its current status.'

    const beginAmendment = () => {
      setDraft({
        date: order.date || '',
        items: order.items.map((item) => ({
          ...item,
          unitPrice: Number.isFinite(Number(item.unitPrice))
            ? Number(item.unitPrice)
            : Number(productCatalog.find((product) => product.code === item.productCode)?.price) ||
              0,
        })),
        paymentTerms: order.paymentTerms,
        notes: order.notes || '',
        reason: '',
      })
      setEditing(true)
      setCancelling(false)
    }

    const updateLine = (index, key, value) =>
      setDraft((current) => ({
        ...current,
        items: current.items.map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [key]: value,
                ...(key === 'productCode'
                  ? {
                      unitPrice:
                        productCatalog.find((product) => product.code === value)?.price || 0,
                    }
                  : {}),
              }
            : item,
        ),
      }))

    const submitAmendment = (event) => {
      event.preventDefault()
      if (amendOrder(order.id, draft)) {
        setEditing(false)
        setDraft(null)
      }
    }

    const submitCancellation = (event) => {
      event.preventDefault()
      if (cancelOrder(order.id, cancelReason)) {
        setCancelling(false)
        setCancelReason('')
      }
    }
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
            <section className="dealer-card">
              <header>
                <span>Current stage and next action</span>
                <small>{order.status}</small>
              </header>
              <p className="dealer-muted">{nextAction}</p>
              {order.status === 'Approved' && (
                <button className="dealer-button" onClick={() => onNavigate('Create Dispatch')}>
                  Create dispatch
                </button>
              )}
              {order.status === 'Dispatched' &&
                dispatches.some((item) => item.status === 'In Transit') && (
                  <button className="dealer-button" onClick={() => onNavigate('Delivery Records')}>
                    Review delivery
                  </button>
                )}
              {order.status === 'Delivered' && (
                <button
                  className="dealer-button secondary"
                  onClick={() => onNavigate('Sales Returns')}
                >
                  Start return review
                </button>
              )}
              <p className="dealer-muted">
                Actions use the Admin prototype session. Server-side user and role authorization is
                not enforced in this frontend.
              </p>
            </section>
            {order.status === 'Pending Approval' && (
              <section className="dealer-card">
                <header>
                  <span>Approval decision</span>
                  <small>Rejection requires a reason</small>
                </header>
                <label className="dealer-field dealer-order-reason">
                  <span>Decision reason or note</span>
                  <textarea
                    aria-label="Decision reason or note"
                    value={decisionReason}
                    onChange={(event) => setDecisionReason(event.target.value)}
                    placeholder="Required for rejection; optional for approval"
                  />
                </label>
                <footer className="dealer-order-actions">
                  <button
                    className="dealer-button"
                    onClick={() => {
                      if (decideOrder(order.id, 'Approved', decisionReason)) setDecisionReason('')
                    }}
                  >
                    Approve order
                  </button>
                  <button
                    className="dealer-button secondary"
                    onClick={() => {
                      if (decideOrder(order.id, 'Rejected', decisionReason)) setDecisionReason('')
                    }}
                  >
                    Reject order
                  </button>
                </footer>
              </section>
            )}
            {order.status === 'Pending Approval' && !editing && !cancelling && (
              <div className="dealer-order-actions">
                <button className="dealer-button secondary" onClick={beginAmendment}>
                  Amend order
                </button>
                <button
                  className="dealer-button secondary"
                  onClick={() => {
                    setCancelling(true)
                    setEditing(false)
                  }}
                >
                  Cancel order
                </button>
              </div>
            )}
            {editing && draft && order.status === 'Pending Approval' && (
              <form className="dealer-form-card" onSubmit={submitAmendment}>
                <div className="dealer-form-heading">
                  <span>Amend order · {order.id}</span>
                  <small>Changes remain pending approval until reviewed.</small>
                </div>
                <div className="dealer-form-grid">
                  <label className="dealer-field">
                    <span>Order date</span>
                    <input
                      type="date"
                      required
                      value={draft.date}
                      onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                    />
                  </label>
                  <label className="dealer-field">
                    <span>Payment terms</span>
                    <select
                      required
                      value={draft.paymentTerms}
                      onChange={(event) => setDraft({ ...draft, paymentTerms: event.target.value })}
                    >
                      <option>Credit · 30 days</option>
                      <option>Cash</option>
                      <option>Bank transfer</option>
                    </select>
                  </label>
                  <div className="dealer-field wide">
                    <span>Products and quantities</span>
                    {draft.items.map((item, index) => {
                      const product = productCatalog.find(
                        (candidate) => candidate.code === item.productCode,
                      )
                      return (
                        <div
                          className="dealer-order-amend-line"
                          key={`${index}-${item.productCode}`}
                        >
                          <select
                            aria-label={`Product ${index + 1}`}
                            required
                            value={item.productCode}
                            onChange={(event) =>
                              updateLine(index, 'productCode', event.target.value)
                            }
                          >
                            {productCatalog.map((option) => (
                              <option key={option.code} value={option.code}>
                                {option.name} · {money(option.price)}/{option.unit}
                              </option>
                            ))}
                          </select>
                          <input
                            aria-label={`Quantity ${index + 1}`}
                            type="number"
                            min="1"
                            step="1"
                            required
                            value={item.qty}
                            onChange={(event) => updateLine(index, 'qty', event.target.value)}
                          />
                          <span>{money(Number(item.qty) * Number(item.unitPrice))}</span>
                          <button
                            type="button"
                            className="dealer-button secondary"
                            disabled={draft.items.length <= 1}
                            onClick={() =>
                              setDraft({
                                ...draft,
                                items: draft.items.filter((_, itemIndex) => itemIndex !== index),
                              })
                            }
                          >
                            Remove
                          </button>
                          {draft.items.some(
                            (line, lineIndex) =>
                              lineIndex !== index && line.productCode === item.productCode,
                          ) && <small role="alert">Choose each product only once.</small>}
                          {!product && (
                            <small role="alert">This product is no longer available.</small>
                          )}
                        </div>
                      )
                    })}
                    <button
                      type="button"
                      className="dealer-button secondary"
                      disabled={draft.items.length >= productCatalog.length}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          items: [
                            ...draft.items,
                            {
                              productCode:
                                productCatalog.find(
                                  (product) =>
                                    !draft.items.some((item) => item.productCode === product.code),
                                )?.code || productCatalog[0].code,
                              qty: 1,
                              unitPrice:
                                productCatalog.find(
                                  (product) =>
                                    !draft.items.some((item) => item.productCode === product.code),
                                )?.price || 0,
                            },
                          ],
                        })
                      }
                    >
                      Add product
                    </button>
                  </div>
                  <label className="dealer-field wide">
                    <span>Order notes</span>
                    <textarea
                      value={draft.notes}
                      onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                    />
                  </label>
                  <label className="dealer-field wide">
                    <span>
                      Amendment reason <b>*</b>
                    </span>
                    <textarea
                      aria-label="Amendment reason"
                      required
                      value={draft.reason}
                      onChange={(event) => setDraft({ ...draft, reason: event.target.value })}
                    />
                  </label>
                </div>
                <footer>
                  <button
                    type="button"
                    className="dealer-button secondary"
                    onClick={() => {
                      setEditing(false)
                      setDraft(null)
                    }}
                  >
                    Keep original order
                  </button>
                  <button type="submit" className="dealer-button">
                    Save amendment
                  </button>
                </footer>
              </form>
            )}
            {cancelling && order.status === 'Pending Approval' && (
              <form className="dealer-form-card" onSubmit={submitCancellation}>
                <div className="dealer-form-heading">
                  <span>Cancel order · {order.id}</span>
                  <small>
                    This action closes the order; dispatched orders cannot be cancelled here.
                  </small>
                </div>
                <div className="dealer-form-grid">
                  <label className="dealer-field wide">
                    <span>
                      Cancellation reason <b>*</b>
                    </span>
                    <textarea
                      aria-label="Cancellation reason"
                      required
                      value={cancelReason}
                      onChange={(event) => setCancelReason(event.target.value)}
                    />
                  </label>
                </div>
                <footer>
                  <button
                    type="button"
                    className="dealer-button secondary"
                    onClick={() => {
                      setCancelling(false)
                      setCancelReason('')
                    }}
                  >
                    Keep order
                  </button>
                  <button type="submit" className="dealer-button">
                    Confirm cancellation
                  </button>
                </footer>
              </form>
            )}
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
                    <td>{money(item.unitPrice ?? product?.price)}</td>
                    <td>{money(item.qty * (item.unitPrice ?? product?.price ?? 0))}</td>
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
                    Fulfillment and delivery
                  </span>
                </header>
                {fulfillments.length ? (
                  fulfillments.map((fulfillment) => (
                    <div key={fulfillment.id} className="dealer-detail-list">
                      <div>
                        <dt>Warehouse</dt>
                        <dd>{fulfillment.warehouse || 'Unassigned'}</dd>
                      </div>
                      <div>
                        <dt>Batch</dt>
                        <dd>{fulfillment.batch || '—'}</dd>
                      </div>
                      <div>
                        <dt>Allocated / picked</dt>
                        <dd>
                          {fulfillment.allocatedQty || 0} / {fulfillment.pickedQty || 0} units
                        </dd>
                      </div>
                      <div>
                        <dt>Flow status</dt>
                        <dd>{status(fulfillment.status)}</dd>
                      </div>
                      {(fulfillment.allocations || []).map((allocation) => {
                        const product = productCatalog.find(
                          (record) => record.code === allocation.productCode,
                        )
                        return (
                          <div key={allocation.batchId}>
                            <dt>{product?.name || allocation.productCode}</dt>
                            <dd>
                              {allocation.quantity} · {allocation.batchNo} ·{' '}
                              {allocation.warehouseId}
                            </dd>
                          </div>
                        )
                      })}
                    </div>
                  ))
                ) : (
                  <p className="dealer-muted">No allocation or dispatch has been recorded yet.</p>
                )}
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
            <section className="dealer-card">
              <header>
                <span>Order status timeline</span>
                <small>{timeline.length} recorded events</small>
              </header>
              {timeline.length ? (
                <div className="dealer-history-list">
                  {timeline.map((event) => (
                    <div key={event.id}>
                      <b>{event.action}</b>
                      <span>
                        {event.fromStatus
                          ? `${event.fromStatus} → ${event.toStatus}`
                          : `Submitted · ${event.toStatus}`}
                      </span>
                      <span>{event.reason || 'No reason was recorded.'}</span>
                      <small>
                        {event.date || 'Date not recorded'} · {event.actor || 'Actor not recorded'}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dealer-muted">
                  This order predates detailed event tracking. Its current stage is shown above;
                  earlier status-change reasons were not saved.
                </p>
              )}
            </section>
            {orderReturns.length > 0 && (
              <section className="dealer-card">
                <header>
                  <span>
                    <FileText size={16} />
                    Return disposition
                  </span>
                </header>
                {orderReturns.map((item) => {
                  const approvedCredit =
                    item.approvedCredit ?? (item.status === 'Approved' ? item.amount : 0)
                  return (
                    <div key={item.id} className="dealer-detail-list">
                      <div>
                        <dt>Return</dt>
                        <dd>{item.id}</dd>
                      </div>
                      <div>
                        <dt>Received / accepted / rejected</dt>
                        <dd>
                          {item.receivedQuantity ?? item.quantity ?? 'Not recorded'} received ·{' '}
                          {item.acceptedQuantity ?? '—'} accepted · {item.rejectedQuantity ?? '—'}{' '}
                          rejected
                        </dd>
                      </div>
                      <div>
                        <dt>Inspection / disposition</dt>
                        <dd>
                          {item.finalInspection || item.inspection || 'Pending review'} ·{' '}
                          {item.finalDisposition || item.disposition || 'Awaiting decision'}
                          {item.batchNo ? ` · ${item.batchNo}` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt>Credit requested / approved</dt>
                        <dd>
                          {money(Number(item.requestedAmount ?? item.amount) || 0)} /{' '}
                          {money(Number(approvedCredit) || 0)}
                          {item.creditReference ? ` · ${item.creditReference}` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt>Stock outcome</dt>
                        <dd>{item.stockOutcome || 'Pending review'}</dd>
                      </div>
                      <div>
                        <dt>Local account outcome</dt>
                        <dd>{item.accountOutcome || 'Pending review'}</dd>
                      </div>
                      <div>
                        <dt>Decision reason</dt>
                        <dd>{item.decisionReason || 'Pending review'}</dd>
                      </div>
                    </div>
                  )
                })}
              </section>
            )}
          </>
        )}
      </div>
    )
  }

  return null
}
