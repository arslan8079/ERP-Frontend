export const inventoryStorageKey = 'greenfield-inventory-warehouse-v1'

export const readInventoryData = () => {
  const serialized = window.localStorage.getItem(inventoryStorageKey)
  if (!serialized) return null

  const data = JSON.parse(serialized)
  if (
    !Array.isArray(data.products) ||
    !Array.isArray(data.warehouses) ||
    !Array.isArray(data.batches) ||
    !Array.isArray(data.movements)
  )
    throw new Error('Saved inventory data is missing required stock records.')
  return data
}

export const inventoryBatchIsUsable = (batch, date = new Date()) => {
  const today = new Date(date)
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  return (
    batch.quality === 'Released' &&
    batch.expiry >= today.toISOString().slice(0, 10) &&
    Number(batch.qty) > 0
  )
}

export const changeInventoryBatchQuantities = (inventory, changes) => {
  const batches = [...inventory.batches]
  const movements = []

  changes.forEach((change) => {
    const index = batches.findIndex((batch) => batch.id === change.batchId)
    if (index < 0) throw new Error(`Inventory batch ${change.batchId} was not found.`)

    const batch = batches[index]
    const quantity = Number(change.quantity)
    const nextQuantity = Number(batch.qty) + Number(change.quantityDelta)
    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(nextQuantity) ||
      nextQuantity < 0
    )
      throw new Error(`Invalid stock quantity for batch ${batch.batchNo}.`)
    if (
      change.quantityDelta < 0 &&
      (!inventoryBatchIsUsable(batch) || quantity > Number(batch.qty))
    )
      throw new Error(`Insufficient released, unexpired stock in batch ${batch.batchNo}.`)
    if (change.quantityDelta > 0 && !inventoryBatchIsUsable({ ...batch, qty: 1 }))
      throw new Error(`Batch ${batch.batchNo} is not eligible to receive returned stock.`)

    batches[index] = { ...batch, qty: nextQuantity }
    movements.push({
      id: change.movementId,
      date: change.date,
      type: change.type,
      batchNo: batch.batchNo,
      productId: batch.productId,
      warehouseId: batch.warehouseId,
      qty: change.quantityDelta,
      unitCost: batch.unitCost,
      reference: change.reference,
      note: change.note,
      actor: 'Admin',
    })
  })

  return { ...inventory, batches, movements: [...movements, ...inventory.movements] }
}
