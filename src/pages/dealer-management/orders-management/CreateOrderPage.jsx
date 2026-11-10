export default function CreateOrderPage({ context }) {
  const { data, createOrder, formPage, field, ShoppingCart, today, money, productCatalog, dueFor } =
    context
  const page = 'Create Order'

  if (page === 'Create Order')
    return formPage(
      'Dealer sales order',
      'Place a pesticide order for a verified dealer. Credit terms are checked against the available dealer limit.',
      ShoppingCart,
      [
        field('Dealer', 'dealerId', {
          required: true,
          options: data.dealers
            .filter((dealer) => dealer.status === 'Active')
            .map((dealer) => (
              <option key={dealer.id} value={dealer.id}>
                {dealer.name} · available{' '}
                {money(Math.max(0, dealer.creditLimit - dueFor(data, dealer.id)))}
              </option>
            )),
          placeholder: 'Select active dealer',
        }),
        field('Order date', 'date', { required: true, type: 'date', value: today() }),
        field('Pesticide product', 'productCode', {
          required: true,
          options: productCatalog.map((product) => (
            <option key={product.code} value={product.code}>
              {product.name} · {money(product.price)}/{product.unit}
            </option>
          )),
        }),
        field('Quantity', 'quantity', {
          required: true,
          type: 'number',
          min: 1,
          step: 1,
          value: 1,
        }),
        field('Payment terms', 'paymentTerms', {
          required: true,
          options: (
            <>
              <option>Credit · 30 days</option>
              <option>Cash</option>
              <option>Bank transfer</option>
            </>
          ),
        }),
        field('Order notes', 'notes', {
          wide: true,
          textarea: true,
          placeholder: 'Season / delivery instructions / dealer reference',
        }),
      ],
      createOrder,
      'Submit for approval',
    )

  return null
}
