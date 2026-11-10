export const inventoryGroups = [
  {
    title: 'Product Management',
    items: [
      'Product List',
      'Add Product',
      'Product Categories',
      'Units & Packaging',
      'Product Details',
      'Product Reports',
    ],
  },
  {
    title: 'Warehouse Management',
    items: ['Warehouse List', 'Create Warehouse', 'Storage Locations', 'Warehouse Stock'],
  },
  {
    title: 'Stock Operations',
    items: [
      'Stock Opening',
      'Stock In (GRN)',
      'Stock Out (Issue)',
      'Stock Transfer',
      'Stock Adjustments',
      'Stock Movement History',
    ],
  },
  {
    title: 'Batch & Expiry',
    items: [
      'Batch Register',
      'Create Batch',
      'Batch Stock',
      'Near Expiry Stock',
      'Expired Stock',
      'Batch Traceability',
    ],
  },
  {
    title: 'Stock Verification',
    items: [
      'Physical Stock Count',
      'Stock Reconciliation',
      'Damaged Stock',
      'Adjustment Approvals',
    ],
  },
  {
    title: 'Inventory Reports',
    items: [
      'Stock Summary',
      'Warehouse-wise Stock',
      'Product Movement',
      'Low Stock Report',
      'Stock Valuation',
      'Expiry Report',
    ],
  },
]

export const inventoryPages = new Set([
  'Inventory Dashboard',
  ...inventoryGroups.flatMap((group) => group.items),
])
