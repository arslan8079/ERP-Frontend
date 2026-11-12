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
    selectedOrderId,
    setSelectedOrderId,
    inventoryData,
    productCatalog,
    inventoryBatchIsUsable,
  } = context
  const page = 'Create Dispatch'

  if (page === 'Create Dispatch') {
    const order = eligibleDispatchOrders.find((item) => item.id === selectedOrderId)
    const allocationFields = order
      ? order.items.flatMap((line) => {
          const product = productCatalog.find((item) => item.code === line.productCode)
          const availableBatches =
            inventoryData?.batches.filter(
              (batch) =>
                batch.productId === line.productCode &&
                inventoryBatchIsUsable(batch) &&
                inventoryData.warehouses.some((warehouse) => warehouse.id === batch.warehouseId),
            ) || []
          const availableQty = availableBatches.reduce((sum, batch) => sum + Number(batch.qty), 0)
          return [
            field(
              `${product?.name || line.productCode} · ${line.qty} ${product?.unit || 'units'}`,
              `batch-${line.productCode}`,
              {
                required: true,
                options: availableBatches.map((batch) => {
                  const warehouse = inventoryData.warehouses.find(
                    (item) => item.id === batch.warehouseId,
                  )
                  return (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNo} · {warehouse?.name || batch.warehouseId} · {batch.qty}{' '}
                      available
                    </option>
                  )
                }),
                placeholder: availableBatches.length
                  ? 'Select released, unexpired batch'
                  : 'No eligible stock batches',
              },
            ),
            availableQty < Number(line.qty) ? (
              <p className="dealer-form-stock-warning" key={`shortage-${line.productCode}`}>
                Required: {line.qty} {product?.unit || 'units'} · available: {availableQty}. This
                order cannot be dispatched until enough released stock is available.
              </p>
            ) : null,
          ].filter(Boolean)
        })
      : []
    return formPage(
      'Dispatch an approved order',
      'Select released inventory batches for each order line. Stock is issued from those batches when the dispatch is created.',
      Truck,
      [
        field('Approved order', 'orderId', {
          required: true,
          value: selectedOrderId || '',
          onChange: (event) => setSelectedOrderId(event.target.value),
          options: eligibleDispatchOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id} · {dealerName(data, order.dealerId)} · {money(order.total)}
            </option>
          )),
          placeholder: eligibleDispatchOrders.length
            ? 'Select an approved order'
            : 'No approved orders awaiting dispatch',
        }),
        ...(!inventoryData
          ? [
              <p className="dealer-form-stock-warning" key="inventory-unavailable">
                Saved inventory stock is unavailable. Open Inventory and save stock records before
                dispatching an order.
              </p>,
            ]
          : []),
        ...allocationFields,
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
  }

  return null
}
