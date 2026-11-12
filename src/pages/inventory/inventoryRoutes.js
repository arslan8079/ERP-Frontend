const routes = [
  { page: 'Inventory Dashboard', category: 'dashboard', slug: 'inventory-dashboard' },
  { page: 'Product List', category: 'product-management', slug: 'product-list' },
  { page: 'Add Product', category: 'product-management', slug: 'add-product' },
  { page: 'Product Categories', category: 'product-management', slug: 'product-categories' },
  { page: 'Units & Packaging', category: 'product-management', slug: 'units-packaging' },
  { page: 'Product Details', category: 'product-management', slug: 'product-details' },
  { page: 'Product Reports', category: 'product-management', slug: 'product-reports' },
  { page: 'Warehouse List', category: 'warehouse-management', slug: 'warehouse-list' },
  { page: 'Create Warehouse', category: 'warehouse-management', slug: 'create-warehouse' },
  { page: 'Storage Locations', category: 'warehouse-management', slug: 'storage-locations' },
  { page: 'Warehouse Stock', category: 'warehouse-management', slug: 'warehouse-stock' },
  { page: 'Stock Opening', category: 'stock-operations', slug: 'stock-opening' },
  { page: 'Stock In (GRN)', category: 'stock-operations', slug: 'stock-in-grn' },
  { page: 'Stock Out (Issue)', category: 'stock-operations', slug: 'stock-out-issue' },
  { page: 'Stock Transfer', category: 'stock-operations', slug: 'stock-transfer' },
  { page: 'Stock Adjustments', category: 'stock-operations', slug: 'stock-adjustments' },
  { page: 'Stock Movement History', category: 'stock-operations', slug: 'stock-movement-history' },
  { page: 'Batch Register', category: 'batch-expiry', slug: 'batch-register' },
  { page: 'Create Batch', category: 'batch-expiry', slug: 'create-batch' },
  { page: 'Batch Stock', category: 'batch-expiry', slug: 'batch-stock' },
  { page: 'Near Expiry Stock', category: 'batch-expiry', slug: 'near-expiry-stock' },
  { page: 'Expired Stock', category: 'batch-expiry', slug: 'expired-stock' },
  { page: 'Batch Traceability', category: 'batch-expiry', slug: 'batch-traceability' },
  { page: 'Physical Stock Count', category: 'stock-verification', slug: 'physical-stock-count' },
  { page: 'Stock Reconciliation', category: 'stock-verification', slug: 'stock-reconciliation' },
  { page: 'Damaged Stock', category: 'stock-verification', slug: 'damaged-stock' },
  { page: 'Adjustment Approvals', category: 'stock-verification', slug: 'adjustment-approvals' },
  { page: 'QC Inspections', category: 'stock-verification', slug: 'qc-inspections' },
  { page: 'Stock Summary', category: 'inventory-reports', slug: 'stock-summary' },
  { page: 'Warehouse-wise Stock', category: 'inventory-reports', slug: 'warehouse-wise-stock' },
  { page: 'Product Movement', category: 'inventory-reports', slug: 'product-movement' },
  { page: 'Low Stock Report', category: 'inventory-reports', slug: 'low-stock-report' },
  { page: 'Stock Valuation', category: 'inventory-reports', slug: 'stock-valuation' },
  { page: 'Expiry Report', category: 'inventory-reports', slug: 'expiry-report' },
]

export const inventoryPageRoutes = new Map(
  routes.map(({ page, category, slug }) => [page, `/pages/inventory/${category}/${slug}`]),
)

const inventoryPageByPath = new Map([...inventoryPageRoutes].map(([page, path]) => [path, page]))

export const isInventoryPage = (page) => inventoryPageRoutes.has(page)

export const inventoryPathForPage = (page) => inventoryPageRoutes.get(page)

export const inventoryPageForPath = (pathname) =>
  inventoryPageByPath.get(pathname.replace(/\/+$/, '') || '/')
