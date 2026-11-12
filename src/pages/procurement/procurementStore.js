export const procurementStorageKey = 'greenfield-procurement-v1'

const emptyProcurementData = {
  purchaseOrders: [],
  resolutions: [],
}

export function readProcurementData() {
  const serialized = window.localStorage.getItem(procurementStorageKey)
  if (!serialized) return emptyProcurementData

  const saved = JSON.parse(serialized)
  if (!Array.isArray(saved.purchaseOrders) || !Array.isArray(saved.resolutions)) {
    throw new Error('Saved procurement data is missing purchase orders or resolutions.')
  }
  return saved
}

export function writeProcurementData(data) {
  window.localStorage.setItem(procurementStorageKey, JSON.stringify(data))
}
