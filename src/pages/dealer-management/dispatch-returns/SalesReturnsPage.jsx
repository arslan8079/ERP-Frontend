import { useState } from 'react'

export default function SalesReturnsPage({ context }) {
  const {
    data,
    createReturn,
    returnableOrders,
    formPage,
    field,
    Package,
    dealerName,
    productCatalog,
    inventoryData,
    reservedReturnQuantity,
  } = context
  const page = 'Sales Returns'
  const firstOrder = returnableOrders[0]
  const firstDispatch = data.dispatches.find((item) => item.orderId === firstOrder?.id)
  const firstProductCode = firstOrder?.items.find((line) =>
    firstDispatch?.allocations?.some((item) => item.productCode === line.productCode),
  )?.productCode
  const [selectedOrderId, setSelectedOrderId] = useState(firstOrder?.id || '')
  const [productCode, setProductCode] = useState(firstProductCode || '')
  const [batchId, setBatchId] = useState(
    firstDispatch?.allocations?.find((item) => item.productCode === firstProductCode)?.batchId ||
      '',
  )

  if (page === 'Sales Returns') {
    const order = returnableOrders.find((item) => item.id === selectedOrderId)
    const dispatch = data.dispatches.find((item) => item.orderId === order?.id)
    const productLines =
      order?.items.filter((line) =>
        dispatch?.allocations?.some((item) => item.productCode === line.productCode),
      ) || []
    const allocations =
      dispatch?.allocations?.filter((item) => item.productCode === productCode) || []
    const remainingQty = (allocation) => {
      const alreadyReturned = data.returns
        .filter(
          (item) =>
            item.orderId === order?.id &&
            item.productCode === productCode &&
            item.batchId === allocation.batchId &&
            item.status !== 'Rejected',
        )
        .reduce((sum, item) => sum + reservedReturnQuantity(item), 0)
      return Number(allocation.quantity) - alreadyReturned
    }
    const batchOptions = allocations
      .filter((allocation) => remainingQty(allocation) > 0)
      .map((allocation) => {
        const warehouse = inventoryData?.warehouses.find(
          (item) => item.id === allocation.warehouseId,
        )
        return (
          <option key={allocation.batchId} value={allocation.batchId}>
            {allocation.batchNo} · {warehouse?.name || allocation.warehouseId} · up to{' '}
            {remainingQty(allocation)} returnable
          </option>
        )
      })
    const selectedAllocation = allocations.find((item) => item.batchId === batchId)
    const product = productCatalog.find((item) => item.code === productCode)
    const orderLine = order?.items.find((line) => line.productCode === productCode)
    const unitPrice = Number(orderLine?.unitPrice ?? product?.price ?? 0)

    return formPage(
      'Register a dealer return',
      'Record the physically received quantity and requested credit. A reviewer will split accepted/rejected units and decide any stock or local account outcome; no Finance journal is posted.',
      Package,
      [
        field('Original order', 'orderId', {
          required: true,
          value: selectedOrderId,
          key: selectedOrderId,
          onChange: (event) => {
            const nextOrderId = event.target.value
            const nextOrder = returnableOrders.find((item) => item.id === nextOrderId)
            const nextDispatch = data.dispatches.find((item) => item.orderId === nextOrderId)
            const nextProduct =
              nextOrder?.items.find((line) =>
                nextDispatch?.allocations?.some((item) => item.productCode === line.productCode),
              )?.productCode || ''
            setSelectedOrderId(nextOrderId)
            setProductCode(nextProduct)
            setBatchId(
              nextDispatch?.allocations?.find((item) => item.productCode === nextProduct)
                ?.batchId || '',
            )
          },
          options: returnableOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id} · {dealerName(data, order.dealerId)}
            </option>
          )),
          placeholder: returnableOrders.length
            ? 'Select a dispatched order'
            : 'No traceable dispatched quantities remain',
        }),
        field('Returned product', 'productCode', {
          required: true,
          value: productCode,
          key: `${selectedOrderId}-${productCode}`,
          onChange: (event) => {
            const nextProductCode = event.target.value
            setProductCode(nextProductCode)
            setBatchId(
              dispatch?.allocations?.find((item) => item.productCode === nextProductCode)
                ?.batchId || '',
            )
          },
          options: productLines.map((line) => {
            const item = productCatalog.find((record) => record.code === line.productCode)
            return (
              <option key={line.productCode} value={line.productCode}>
                {item?.name || line.productCode}
              </option>
            )
          }),
          placeholder: 'Select a dispatched product',
        }),
        field('Source batch', 'batchId', {
          required: true,
          value: batchId,
          key: `${selectedOrderId}-${productCode}-${batchId}`,
          onChange: (event) => setBatchId(event.target.value),
          options: batchOptions,
          placeholder: batchOptions.length ? 'Select returned batch' : 'No returnable batch',
        }),
        field('Received quantity', 'quantity', {
          required: true,
          type: 'number',
          min: 1,
          max: selectedAllocation ? remainingQty(selectedAllocation) : undefined,
          step: 1,
        }),
        field('Requested credit (PKR)', 'amount', {
          required: true,
          type: 'number',
          min: 1,
          max: unitPrice
            ? unitPrice * (selectedAllocation ? remainingQty(selectedAllocation) : 0)
            : undefined,
          step: 1,
        }),
        field('Intake inspection note', 'inspection', {
          required: true,
          options: [
            <option key="accepted" value="Accepted">
              Accepted for restock
            </option>,
            <option key="damaged" value="Damaged on receipt">
              Damaged on receipt
            </option>,
            <option key="incorrect" value="Incorrect delivery">
              Incorrect delivery
            </option>,
            <option key="other" value="Other issue">
              Other issue
            </option>,
          ],
          placeholder: 'Select inspection result',
        }),
        field('Requested disposition', 'disposition', {
          required: true,
          options: [
            <option key="restock" value="Restock after inspection">
              Restock after inspection
            </option>,
            <option key="credit" value="Credit without restock">
              Credit without restock
            </option>,
            <option key="write-off" value="Write-off and reconcile">
              Write-off and reconcile
            </option>,
          ],
          placeholder: 'Select disposition',
        }),
        field('Reason', 'reason', {
          required: true,
          placeholder: 'Damaged, recall, incorrect product…',
        }),
        field('Inspection notes', 'notes', {
          wide: true,
          textarea: true,
          placeholder: 'Condition, evidence reference and inspection details',
        }),
      ],
      createReturn,
      'Submit return for approval',
    )
  }

  return null
}
