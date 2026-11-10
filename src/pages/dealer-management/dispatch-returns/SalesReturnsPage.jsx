export default function SalesReturnsPage({ context }) {
  const { data, createReturn, returnableOrders, formPage, field, Package, dealerName } = context
  const page = 'Sales Returns'

  if (page === 'Sales Returns')
    return formPage(
      'Register a dealer return',
      'Record returned pesticide stock for independent review. An approved return reduces the dealer receivable.',
      Package,
      [
        field('Original order', 'orderId', {
          required: true,
          options: returnableOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id} · {dealerName(data, order.dealerId)}
            </option>
          )),
          placeholder: 'Select a dispatched order',
        }),
        field('Requested credit (PKR)', 'amount', {
          required: true,
          type: 'number',
          min: 1,
          step: 1,
        }),
        field('Reason', 'reason', {
          required: true,
          placeholder: 'Damaged, recall, incorrect product…',
        }),
        field('Batch / quantity details', 'notes', {
          wide: true,
          textarea: true,
          placeholder: 'Batch number, product, quantity, evidence reference',
        }),
      ],
      createReturn,
      'Submit return for approval',
    )

  return null
}
