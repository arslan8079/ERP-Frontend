export default function CreateDispatchPage({ context }) {
  const {
    data,
    createDispatch,
    eligibleDispatchOrders,
    formPage,
    field,
    Truck,
    today,
    money,
    dealerName,
  } = context
  const page = 'Create Dispatch'

  if (page === 'Create Dispatch')
    return formPage(
      'Dispatch an approved order',
      'Create delivery documentation for an approved order. Dispatching moves the order into transit.',
      Truck,
      [
        field('Approved order', 'orderId', {
          required: true,
          options: eligibleDispatchOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id} · {dealerName(data, order.dealerId)} · {money(order.total)}
            </option>
          )),
          placeholder: eligibleDispatchOrders.length
            ? 'Select an approved order'
            : 'No approved orders awaiting dispatch',
        }),
        field('Dispatch date', 'date', { required: true, type: 'date', value: today() }),
        field('Carrier / transporter', 'carrier', {
          required: true,
          placeholder: 'Transport company',
        }),
        field('Vehicle / tracking reference', 'vehicle', {
          required: true,
          placeholder: 'Vehicle registration or tracking ID',
        }),
      ],
      createDispatch,
      'Create dispatch',
    )

  return null
}
