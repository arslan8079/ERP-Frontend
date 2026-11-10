import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  batchRows as renderBatchRows,
  Button,
  PageHeader,
  productRows as renderProductRows,
  movementRows as renderMovementRows,
} from './InventoryComponents'
import AddProductPage from './product-management/AddProductPage'
import CreateWarehousePage from './warehouse-management/CreateWarehousePage'
import ProductListPage from './product-management/ProductListPage'
import ProductCategoriesPage from './product-management/ProductCategoriesPage'
import UnitsPackagingPage from './product-management/UnitsPackagingPage'
import ProductDetailsPage from './product-management/ProductDetailsPage'
import WarehouseListPage from './warehouse-management/WarehouseListPage'
import StorageLocationsPage from './warehouse-management/StorageLocationsPage'
import WarehouseStockPage from './warehouse-management/WarehouseStockPage'
import BatchStockPage from './batch-expiry/BatchStockPage'
import StockOpeningPage from './stock-operations/StockOpeningPage'
import StockInGRNPage from './stock-operations/StockInGRNPage'
import StockOutIssuePage from './stock-operations/StockOutIssuePage'
import StockTransferPage from './stock-operations/StockTransferPage'
import StockAdjustmentsPage from './stock-operations/StockAdjustmentsPage'
import DamagedStockPage from './stock-verification/DamagedStockPage'
import CreateBatchPage from './batch-expiry/CreateBatchPage'
import PhysicalStockCountPage from './stock-verification/PhysicalStockCountPage'
import StockReconciliationPage from './stock-verification/StockReconciliationPage'
import AdjustmentApprovalsPage from './stock-verification/AdjustmentApprovalsPage'
import BatchRegisterPage from './batch-expiry/BatchRegisterPage'
import NearExpiryStockPage from './batch-expiry/NearExpiryStockPage'
import ExpiredStockPage from './batch-expiry/ExpiredStockPage'
import BatchTraceabilityPage from './batch-expiry/BatchTraceabilityPage'
import StockMovementHistoryPage from './stock-operations/StockMovementHistoryPage'
import ProductMovementPage from './inventory-reports/ProductMovementPage'
import StockSummaryPage from './inventory-reports/StockSummaryPage'
import ProductReportsPage from './product-management/ProductReportsPage'
import LowStockReportPage from './inventory-reports/LowStockReportPage'
import StockValuationPage from './inventory-reports/StockValuationPage'
import WarehouseWiseStockPage from './inventory-reports/WarehouseWiseStockPage'
import ExpiryReportPage from './inventory-reports/ExpiryReportPage'
import InventoryDashboardPage from './dashboard/InventoryDashboardPage'
import './Inventory.css'

const inventoryScreens = {
  'Add Product': AddProductPage,
  'Create Warehouse': CreateWarehousePage,
  'Product List': ProductListPage,
  'Product Categories': ProductCategoriesPage,
  'Units & Packaging': UnitsPackagingPage,
  'Product Details': ProductDetailsPage,
  'Warehouse List': WarehouseListPage,
  'Storage Locations': StorageLocationsPage,
  'Warehouse Stock': WarehouseStockPage,
  'Batch Stock': BatchStockPage,
  'Stock Opening': StockOpeningPage,
  'Stock In (GRN)': StockInGRNPage,
  'Stock Out (Issue)': StockOutIssuePage,
  'Stock Transfer': StockTransferPage,
  'Stock Adjustments': StockAdjustmentsPage,
  'Damaged Stock': DamagedStockPage,
  'Create Batch': CreateBatchPage,
  'Physical Stock Count': PhysicalStockCountPage,
  'Stock Reconciliation': StockReconciliationPage,
  'Adjustment Approvals': AdjustmentApprovalsPage,
  'Batch Register': BatchRegisterPage,
  'Near Expiry Stock': NearExpiryStockPage,
  'Expired Stock': ExpiredStockPage,
  'Batch Traceability': BatchTraceabilityPage,
  'Stock Movement History': StockMovementHistoryPage,
  'Product Movement': ProductMovementPage,
  'Stock Summary': StockSummaryPage,
  'Product Reports': ProductReportsPage,
  'Low Stock Report': LowStockReportPage,
  'Stock Valuation': StockValuationPage,
  'Warehouse-wise Stock': WarehouseWiseStockPage,
  'Expiry Report': ExpiryReportPage,
}

const storageKey = 'greenfield-inventory-warehouse-v1'
const day = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}
const money = (amount) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
let idSequence = 0
const makeId = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${(++idSequence).toString(36).toUpperCase()}`
const initials = [
  {
    id: 'PRD-001',
    name: 'Imidacloprid 20% SL',
    active: 'Imidacloprid',
    formulation: '20% SL',
    category: 'Insecticides',
    registration: 'PARC-INS-2025-001',
    hazard: 'Class II · Moderate',
    unit: 'L',
    reorder: 60,
    cost: 1850,
    status: 'Active',
  },
  {
    id: 'PRD-002',
    name: 'Lambda-cyhalothrin 2.5% EC',
    active: 'Lambda-cyhalothrin',
    formulation: '2.5% EC',
    category: 'Insecticides',
    registration: 'PARC-INS-2025-014',
    hazard: 'Class II · Moderate',
    unit: 'L',
    reorder: 45,
    cost: 2250,
    status: 'Active',
  },
  {
    id: 'PRD-003',
    name: 'Mancozeb 80% WP',
    active: 'Mancozeb',
    formulation: '80% WP',
    category: 'Fungicides',
    registration: 'PARC-FUN-2024-031',
    hazard: 'Class III · Caution',
    unit: 'kg',
    reorder: 90,
    cost: 760,
    status: 'Active',
  },
  {
    id: 'PRD-004',
    name: 'Glyphosate 41% SL',
    active: 'Glyphosate',
    formulation: '41% SL',
    category: 'Herbicides',
    registration: 'PARC-HER-2025-008',
    hazard: 'Class III · Caution',
    unit: 'L',
    reorder: 75,
    cost: 1480,
    status: 'Active',
  },
  {
    id: 'PRD-005',
    name: 'Copper oxychloride 50% WP',
    active: 'Copper oxychloride',
    formulation: '50% WP',
    category: 'Fungicides',
    registration: 'PARC-FUN-2024-044',
    hazard: 'Class III · Caution',
    unit: 'kg',
    reorder: 35,
    cost: 920,
    status: 'Active',
  },
]
const initialBatches = [
  {
    id: 'LOT-001',
    productId: 'PRD-001',
    batchNo: 'IMI-26-041',
    warehouseId: 'WH-LHR',
    location: 'A-01-02',
    manufactured: day(-150),
    expiry: day(165),
    qty: 124,
    unitCost: 1850,
    quality: 'Released',
    source: 'Opening balance',
  },
  {
    id: 'LOT-002',
    productId: 'PRD-001',
    batchNo: 'IMI-26-052',
    warehouseId: 'WH-LHR',
    location: 'A-01-03',
    manufactured: day(-115),
    expiry: day(22),
    qty: 38,
    unitCost: 1820,
    quality: 'Released',
    source: 'GRN-2026-0018',
  },
  {
    id: 'LOT-003',
    productId: 'PRD-002',
    batchNo: 'LCH-26-018',
    warehouseId: 'WH-KHI',
    location: 'B-02-01',
    manufactured: day(-100),
    expiry: day(275),
    qty: 96,
    unitCost: 2250,
    quality: 'Released',
    source: 'Opening balance',
  },
  {
    id: 'LOT-004',
    productId: 'PRD-003',
    batchNo: 'MZB-25-103',
    warehouseId: 'WH-LHR',
    location: 'C-01-01',
    manufactured: day(-540),
    expiry: day(-24),
    qty: 18,
    unitCost: 760,
    quality: 'Expired',
    source: 'Opening balance',
  },
  {
    id: 'LOT-005',
    productId: 'PRD-003',
    batchNo: 'MZB-26-027',
    warehouseId: 'WH-FSD',
    location: 'A-03-02',
    manufactured: day(-80),
    expiry: day(340),
    qty: 132,
    unitCost: 745,
    quality: 'Released',
    source: 'Opening balance',
  },
  {
    id: 'LOT-006',
    productId: 'PRD-004',
    batchNo: 'GLY-26-014',
    warehouseId: 'WH-KHI',
    location: 'D-01-01',
    manufactured: day(-130),
    expiry: day(17),
    qty: 42,
    unitCost: 1480,
    quality: 'Released',
    source: 'GRN-2026-0012',
  },
  {
    id: 'LOT-007',
    productId: 'PRD-005',
    batchNo: 'COP-26-007',
    warehouseId: 'WH-LHR',
    location: 'C-02-01',
    manufactured: day(-45),
    expiry: day(520),
    qty: 54,
    unitCost: 920,
    quality: 'Quarantine',
    source: 'GRN-2026-0023',
  },
]
const warehousesSeed = [
  {
    id: 'WH-LHR',
    name: 'Lahore Central Warehouse',
    branch: 'Lahore',
    address: 'Sundar Industrial Estate',
    manager: 'A. Raza',
    capacity: 2400,
    status: 'Active',
  },
  {
    id: 'WH-KHI',
    name: 'Karachi Distribution Hub',
    branch: 'Karachi',
    address: 'SITE Industrial Area',
    manager: 'S. Ahmed',
    capacity: 1800,
    status: 'Active',
  },
  {
    id: 'WH-FSD',
    name: 'Faisalabad Agro Depot',
    branch: 'Faisalabad',
    address: 'Jaranwala Road',
    manager: 'M. Iqbal',
    capacity: 1200,
    status: 'Active',
  },
]

function seedData() {
  return {
    products: initials,
    categories: ['Insecticides', 'Herbicides', 'Fungicides', 'Seed Treatments', 'Adjuvants'],
    units: [
      { name: 'Litre', symbol: 'L', type: 'Volume' },
      { name: 'Kilogram', symbol: 'kg', type: 'Weight' },
      { name: 'Pack (1 L)', symbol: '1 L pack', type: 'Packaging' },
    ],
    warehouses: warehousesSeed,
    locations: [
      {
        id: 'LOC-001',
        warehouseId: 'WH-LHR',
        code: 'A-01-02',
        zone: 'Flammable liquid cabinet',
        type: 'Pesticide · controlled access',
        capacity: 200,
      },
      {
        id: 'LOC-002',
        warehouseId: 'WH-LHR',
        code: 'C-01-01',
        zone: 'Dry chemical rack',
        type: 'Powder · cool and dry',
        capacity: 250,
      },
      {
        id: 'LOC-003',
        warehouseId: 'WH-KHI',
        code: 'B-02-01',
        zone: 'Chemical rack B',
        type: 'Pesticide · controlled access',
        capacity: 180,
      },
      {
        id: 'LOC-004',
        warehouseId: 'WH-FSD',
        code: 'A-03-02',
        zone: 'Dry chemical rack',
        type: 'Powder · cool and dry',
        capacity: 250,
      },
    ],
    batches: initialBatches,
    movements: initialBatches
      .filter((batch) => batch.qty > 0)
      .map((batch, index) => ({
        id: `MOV-OPEN-${index + 1}`,
        date: day(-30 + index),
        type: 'Opening',
        batchNo: batch.batchNo,
        productId: batch.productId,
        warehouseId: batch.warehouseId,
        qty: batch.qty,
        unitCost: batch.unitCost,
        reference: batch.source === 'Opening balance' ? 'OB-2026-0001' : batch.source,
        note: 'Verified opening stock',
        actor: 'Admin',
      })),
    counts: [],
    approvals: [],
  }
}

function loadData() {
  const fallback = seedData()
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return fallback
    const parsed = JSON.parse(saved)
    return Object.fromEntries(
      Object.keys(fallback).map((key) => [
        key,
        Array.isArray(parsed[key]) ? parsed[key] : fallback[key],
      ]),
    )
  } catch (error) {
    console.error('Unable to load inventory data:', error)
    return fallback
  }
}

function exportCsv(name, headers, rows, notify) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  link.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${day()}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
  notify('CSV export downloaded.')
}

function InventoryModule({ page, onNotify, onNavigate }) {
  const [data, setData] = useState(loadData)
  const [search, setSearch] = useState('')
  const [selectedProductId, setSelectedProductId] = useState(initials[0].id)
  const [countWarehouseId, setCountWarehouseId] = useState(warehousesSeed[0].id)
  const [newCategory, setNewCategory] = useState('')
  const [newUnit, setNewUnit] = useState({ name: '', symbol: '', type: 'Volume' })
  const [countValues, setCountValues] = useState({})
  const [receivingWarehouseId, setReceivingWarehouseId] = useState(warehousesSeed[0].id)
  const [batchWarehouseId, setBatchWarehouseId] = useState(warehousesSeed[0].id)
  const [issueProductId, setIssueProductId] = useState(initials[0].id)
  const [issueWarehouseId, setIssueWarehouseId] = useState(warehousesSeed[0].id)
  const [transferBatchId, setTransferBatchId] = useState(initialBatches[0].id)
  const [transferWarehouseId, setTransferWarehouseId] = useState(warehousesSeed[1].id)
  const product = (id) => data.products.find((item) => item.id === id)
  const warehouse = (id) => data.warehouses.find((item) => item.id === id)
  const totalFor = (id) =>
    data.batches
      .filter((item) => item.productId === id)
      .reduce((sum, item) => sum + Number(item.qty || 0), 0)
  const usable = (batch) =>
    batch.quality === 'Released' && batch.expiry >= day() && Number(batch.qty) > 0
  const stockFor = (id) =>
    data.batches
      .filter((item) => item.productId === id && usable(item))
      .reduce((sum, item) => sum + Number(item.qty || 0), 0)
  const filtered = (rows, getText) =>
    rows.filter((row) => getText(row).toLowerCase().includes(search.toLowerCase()))
  const save = (updater, message) => {
    const next = typeof updater === 'function' ? updater(data) : { ...data, ...updater }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      setData(next)
      if (message) onNotify(message)
      return true
    } catch (error) {
      console.error('Unable to save inventory data:', error)
      onNotify('Inventory changes could not be saved. Check browser storage and try again.')
      return false
    }
  }
  const recordMovement = (next, movement) => ({
    ...next,
    movements: [{ id: makeId('MOV'), date: day(), actor: 'Admin', ...movement }, ...next.movements],
  })
  const lookup = (id) => product(id)?.name || 'Unknown product'
  const warehouseOptions = data.warehouses.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))
  const productOptions = data.products
    .filter((item) => item.status === 'Active')
    .map((item) => (
      <option key={item.id} value={item.id}>
        {item.name} · {item.id}
      </option>
    ))
  const receivingLocations = data.locations.filter(
    (item) => item.warehouseId === receivingWarehouseId,
  )
  const registeredBatchLocations = data.locations.filter(
    (item) => item.warehouseId === batchWarehouseId,
  )
  const transferSource = data.batches.find((item) => item.id === transferBatchId)
  const transferLocations = data.locations.filter(
    (item) => item.warehouseId === transferWarehouseId,
  )
  const issueBatches = data.batches.filter(
    (item) =>
      item.productId === issueProductId && item.warehouseId === issueWarehouseId && usable(item),
  )
  const searchBox = (
    <label className="inv-search">
      <Search size={16} />
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products, batches, warehouses…"
      />
    </label>
  )
  const tableExport = (title, headers, rows) => () => exportCsv(title, headers, rows, onNotify)
  const newAction = (label, Icon = Plus) => (
    <Button onClick={() => onNavigate(label)}>
      <Icon size={15} />
      {label}
    </Button>
  )
  const productHeaders = [
    'Product / registration',
    'Active ingredient',
    'Formulation',
    'Category',
    'Available stock',
    'Reorder at',
    'Status',
    '',
  ]
  const productRows = (items) =>
    renderProductRows(items, { stockFor, totalFor, setSelectedProductId, onNavigate })
  const batchHeaders = [
    'Batch / product',
    'Warehouse / bin',
    'Manufactured',
    'Expiry',
    'Days left',
    'On hand',
    'Unit cost',
    'Quality',
  ]
  const batchRows = (items) =>
    renderBatchRows(items, { day, lookup, warehouse, product, setSearch, onNavigate, money })
  const movementHeaders = [
    'Date',
    'Reference',
    'Movement',
    'Product / batch',
    'Warehouse',
    'Quantity',
    'Notes / user',
  ]
  const movementRows = (items) => renderMovementRows(items, { lookup, warehouse, product })
  const pageHeader = (title, subtitle, icon, action, exportFn) => (
    <PageHeader title={title} subtitle={subtitle} icon={icon} action={action} onExport={exportFn} />
  )
  const submitProduct = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const id = values.id.trim().toUpperCase()
    const registration = values.registration.trim()
    if (
      data.products.some(
        (item) =>
          item.id.toUpperCase() === id ||
          item.registration.toLowerCase() === registration.toLowerCase(),
      )
    )
      return onNotify('Product code and pesticide registration number must be unique.')
    if (
      !Number.isFinite(Number(values.reorder)) ||
      Number(values.reorder) <= 0 ||
      !Number.isFinite(Number(values.cost)) ||
      Number(values.cost) <= 0 ||
      !registration
    )
      return onNotify('Enter the registration number, a positive reorder level, and unit cost.')
    const nextProduct = {
      ...values,
      id,
      registration,
      name: values.name.trim(),
      active: values.active.trim(),
      reorder: Number(values.reorder),
      cost: Number(values.cost),
      status: 'Active',
    }
    if (
      save(
        { ...data, products: [...data.products, nextProduct] },
        'Registered product added to the inventory catalogue.',
      )
    )
      onNavigate('Product List')
  }
  const submitWarehouse = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const id = values.id.trim().toUpperCase()
    if (data.warehouses.some((item) => item.id.toUpperCase() === id))
      return onNotify('That warehouse code is already in use.')
    const nextWarehouse = {
      ...values,
      id,
      name: values.name.trim(),
      branch: values.branch.trim(),
      address: values.address.trim(),
      manager: values.manager.trim(),
      capacity: Number(values.capacity),
      status: 'Active',
    }
    if (
      !nextWarehouse.name ||
      !Number.isFinite(nextWarehouse.capacity) ||
      nextWarehouse.capacity <= 0
    )
      return onNotify('Enter a warehouse name and positive capacity.')
    if (
      save(
        { ...data, warehouses: [...data.warehouses, nextWarehouse] },
        'Warehouse created. Add storage locations before receiving stock.',
      )
    )
      onNavigate('Warehouse List')
  }
  const submitLocation = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const code = values.code.trim()
    if (!warehouse(values.warehouseId))
      return onNotify('Choose a valid warehouse for this location.')
    if (
      data.locations.some(
        (item) =>
          item.warehouseId === values.warehouseId && item.code.toLowerCase() === code.toLowerCase(),
      )
    )
      return onNotify('That bin/location already exists in this warehouse.')
    if (!code || !Number.isFinite(Number(values.capacity)) || Number(values.capacity) <= 0)
      return onNotify('Enter a location code and positive bin capacity.')
    const location = { ...values, id: makeId('LOC'), code, capacity: Number(values.capacity) }
    if (
      save(
        { ...data, locations: [...data.locations, location] },
        'Controlled storage location added.',
      )
    )
      event.currentTarget.reset()
  }
  const saveBatchReceipt = (event, opening = false) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const quantity = Number(values.qty)
    const unitCost = Number(values.unitCost)
    const item = product(values.productId)
    if (!item || quantity <= 0 || unitCost <= 0)
      return onNotify('Select a product and enter positive quantity and unit cost.')
    if (
      values.manufactured > day() ||
      values.expiry <= values.manufactured ||
      values.expiry <= day()
    )
      return onNotify(
        'Check manufacture/expiry dates. New stock must be unexpired and manufactured no later than today.',
      )
    if (
      !data.locations.some(
        (location) =>
          location.warehouseId === values.warehouseId && location.code === values.location,
      )
    )
      return onNotify('Choose a storage location belonging to the receiving warehouse.')
    const existing = data.batches.find(
      (batch) =>
        batch.productId === values.productId &&
        batch.batchNo.toLowerCase() === values.batchNo.trim().toLowerCase() &&
        batch.warehouseId === values.warehouseId,
    )
    let updatedBatches
    let batchId
    if (existing) {
      if (existing.expiry !== values.expiry || existing.manufactured !== values.manufactured)
        return onNotify(
          'This batch number is already registered with different manufacture/expiry dates.',
        )
      batchId = existing.id
      updatedBatches = data.batches.map((batch) =>
        batch.id === existing.id
          ? {
              ...batch,
              qty: Number(batch.qty) + quantity,
              unitCost,
              quality: opening ? batch.quality : values.quality || batch.quality,
              location: values.location,
              source: values.reference,
            }
          : batch,
      )
    } else {
      batchId = makeId('LOT')
      updatedBatches = [
        ...data.batches,
        {
          id: batchId,
          productId: values.productId,
          batchNo: values.batchNo.trim().toUpperCase(),
          warehouseId: values.warehouseId,
          location: values.location,
          manufactured: values.manufactured,
          expiry: values.expiry,
          qty: quantity,
          unitCost,
          quality: values.quality || 'Released',
          source: values.reference,
        },
      ]
    }
    const qtyLabel = `${quantity} ${item.unit}`
    const next = recordMovement(
      { ...data, batches: updatedBatches },
      {
        type: opening ? 'Opening' : 'GRN',
        batchNo: values.batchNo.trim().toUpperCase(),
        productId: values.productId,
        warehouseId: values.warehouseId,
        qty: quantity,
        unitCost,
        reference: values.reference.trim().toUpperCase(),
        note: opening
          ? `Opening balance · ${values.note || 'Verified stock take'}`
          : `Received from ${values.supplier || 'supplier'} · ${values.quality || 'Released'}`,
      },
    )
    if (
      save(
        next,
        `${qtyLabel} recorded against batch ${values.batchNo.toUpperCase()}${values.quality === 'Quarantine' ? ' · held from issue pending QC' : ''}.`,
      )
    )
      event.currentTarget.reset()
  }
  const submitBatch = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (
      data.batches.some(
        (item) =>
          item.productId === values.productId &&
          item.batchNo.toLowerCase() === values.batchNo.trim().toLowerCase(),
      )
    )
      return onNotify(
        'That product batch is already registered; use Stock In (GRN) to receive quantity.',
      )
    if (values.manufactured > day() || values.expiry <= values.manufactured)
      return onNotify('Expiry must be after manufacture; manufacture cannot be in the future.')
    if (
      !data.locations.some(
        (location) =>
          location.warehouseId === values.warehouseId && location.code === values.location,
      )
    )
      return onNotify('Choose a storage location belonging to the selected warehouse.')
    const batch = {
      ...values,
      id: makeId('LOT'),
      batchNo: values.batchNo.trim().toUpperCase(),
      location: values.location,
      qty: 0,
      unitCost: 0,
      quality: 'Quarantine',
      source: 'Batch registration',
    }
    if (
      save(
        { ...data, batches: [...data.batches, batch] },
        'Batch registered in quarantine. Record the GRN and QC release before issuing stock.',
      )
    )
      onNavigate('Batch Register')
  }
  const submitIssue = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    let quantity = Number(values.qty)
    if (quantity <= 0 || !values.reference.trim())
      return onNotify('Enter a positive issue quantity and reference/document number.')
    const eligible = data.batches
      .filter(
        (batch) =>
          batch.productId === values.productId &&
          batch.warehouseId === values.warehouseId &&
          usable(batch) &&
          (!values.batchNo || batch.batchNo === values.batchNo),
      )
      .sort((a, b) => a.expiry.localeCompare(b.expiry))
    if (eligible.reduce((sum, batch) => sum + Number(batch.qty), 0) < quantity)
      return onNotify(
        'Insufficient released, unexpired stock for this issue. Quarantined and expired batches are not issuable.',
      )
    let next = { ...data, batches: [...data.batches] }
    const ref = values.reference.trim().toUpperCase()
    for (const batch of eligible) {
      if (quantity <= 0) break
      const issued = Math.min(quantity, Number(batch.qty))
      next.batches = next.batches.map((record) =>
        record.id === batch.id ? { ...record, qty: Number(record.qty) - issued } : record,
      )
      next = recordMovement(next, {
        type: 'Issue',
        batchNo: batch.batchNo,
        productId: batch.productId,
        warehouseId: batch.warehouseId,
        qty: -issued,
        unitCost: batch.unitCost,
        reference: ref,
        note: `${values.purpose} · FEFO`,
      })
      quantity -= issued
    }
    if (
      save(
        next,
        `Stock issued using earliest-expiry-first (FEFO) from eligible batches. Reference ${ref}.`,
      )
    )
      event.currentTarget.reset()
  }
  const submitTransfer = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const quantity = Number(values.qty)
    const source = data.batches.find((batch) => batch.id === values.batchId)
    const location = data.locations.find(
      (item) => item.warehouseId === values.toWarehouseId && item.code === values.toLocation,
    )
    if (!source || !usable(source) || quantity <= 0 || quantity > Number(source.qty))
      return onNotify('Transfer quantity must be available in a released, unexpired source batch.')
    if (!location || values.toWarehouseId === source.warehouseId)
      return onNotify('Choose a valid storage bin in a different destination warehouse.')
    const ref = values.reference.trim().toUpperCase() || makeId('TRF')
    let next = { ...data }
    if (quantity === Number(source.qty)) {
      next.batches = data.batches.map((batch) =>
        batch.id === source.id
          ? { ...batch, warehouseId: values.toWarehouseId, location: values.toLocation }
          : batch,
      )
    } else {
      const moved = {
        ...source,
        id: makeId('LOT'),
        warehouseId: values.toWarehouseId,
        location: values.toLocation,
        qty: quantity,
        source: ref,
      }
      next.batches = [
        ...data.batches.map((batch) =>
          batch.id === source.id ? { ...batch, qty: Number(batch.qty) - quantity } : batch,
        ),
        moved,
      ]
    }
    next = recordMovement(next, {
      type: 'Transfer',
      batchNo: source.batchNo,
      productId: source.productId,
      warehouseId: source.warehouseId,
      toWarehouseId: values.toWarehouseId,
      qty: quantity,
      unitCost: source.unitCost,
      reference: ref,
      note: `To ${warehouse(values.toWarehouseId)?.name} · ${values.toLocation}`,
    })
    if (
      save(
        next,
        `Transferred ${quantity} ${product(source.productId)?.unit} of batch ${source.batchNo}.`,
      )
    )
      event.currentTarget.reset()
  }
  const submitAdjustment = (event, damaged = false) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const batch = data.batches.find((item) => item.id === values.batchId)
    const quantity = Number(values.qty)
    const direction = damaged || values.direction === 'Decrease' ? -1 : 1
    if (!batch || quantity <= 0 || !values.reason.trim())
      return onNotify('Choose a batch and enter a positive quantity and reason.')
    if (data.approvals.some((item) => item.batchId === batch.id && item.status === 'Pending'))
      return onNotify(
        'This batch already has a pending stock decision. Resolve it before submitting another adjustment.',
      )
    if (direction < 0 && quantity > Number(batch.qty))
      return onNotify('Adjustment exceeds the batch quantity on hand.')
    if (batch.quality === 'Expired' && direction > 0)
      return onNotify('Expired stock cannot be increased or released by adjustment.')
    const approval = {
      id: makeId('ADJ'),
      date: day(),
      batchId: batch.id,
      batchNo: batch.batchNo,
      productId: batch.productId,
      warehouseId: batch.warehouseId,
      qty: quantity,
      direction,
      reason: `${damaged ? 'Damaged stock · ' : ''}${values.reason.trim()}`,
      type: damaged ? 'Damage write-off' : 'Stock adjustment',
      reference: makeId('ADJ-REQ'),
      status: 'Pending',
      countId: values.countId || '',
      previousQuality: batch.quality,
    }
    const batches = damaged
      ? data.batches.map((item) =>
          item.id === batch.id ? { ...item, quality: 'Quarantine' } : item,
        )
      : data.batches
    if (
      save(
        { ...data, batches, approvals: [approval, ...data.approvals] },
        `${approval.type} submitted for approval. The batch is quarantined until the decision; on-hand quantity changes only after approval.`,
      )
    )
      event.currentTarget.reset()
  }
  const submitPhysicalCount = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const selected = data.batches.filter((batch) => batch.warehouseId === values.warehouseId)
    if (!selected.length)
      return onNotify('No registered batches are available to count at this warehouse.')
    const missing = selected.find(
      (batch) =>
        countValues[batch.id] === undefined ||
        countValues[batch.id] === '' ||
        !Number.isFinite(Number(countValues[batch.id])) ||
        Number(countValues[batch.id]) < 0,
    )
    if (missing) return onNotify(`Enter a valid physical count for batch ${missing.batchNo}.`)
    const countId = makeId('CNT')
    const count = {
      id: countId,
      date: day(),
      warehouseId: values.warehouseId,
      lines: selected.map((batch) => ({
        batchId: batch.id,
        batchNo: batch.batchNo,
        productId: batch.productId,
        bookQty: Number(batch.qty),
        countedQty: Number(countValues[batch.id]),
      })),
      status: 'Completed',
    }
    const differences = count.lines
      .filter((line) => line.bookQty !== line.countedQty)
      .map((line) => ({
        id: makeId('ADJ'),
        date: day(),
        batchId: line.batchId,
        batchNo: line.batchNo,
        productId: line.productId,
        warehouseId: values.warehouseId,
        qty: Math.abs(line.countedQty - line.bookQty),
        direction: Math.sign(line.countedQty - line.bookQty),
        reason: `Physical reconciliation · ${countId} · book ${line.bookQty}, counted ${line.countedQty}`,
        type: 'Count variance',
        reference: countId,
        status: 'Pending',
        countId,
      }))
    count.status = differences.length ? 'Awaiting approval' : 'Reconciled'
    if (
      save(
        {
          ...data,
          counts: [count, ...data.counts],
          approvals: [...differences, ...data.approvals],
        },
        differences.length
          ? `${differences.length} count variance(s) sent to approval; book stock remains unchanged until approved.`
          : 'Physical count matches book stock; count reconciled.',
      )
    )
      setCountValues({})
  }
  const decideApproval = (approval, decision) => {
    if (approval.status !== 'Pending') return
    let next = { ...data }
    if (decision === 'Approved') {
      const batch = next.batches.find((item) => item.id === approval.batchId)
      if (!batch) return onNotify('The source batch for this approval no longer exists.')
      if (approval.direction < 0 && approval.qty > Number(batch.qty))
        return onNotify('Approval blocked: requested write-off now exceeds remaining batch stock.')
      next.batches = next.batches.map((item) => {
        if (item.id !== batch.id) return item
        const qty = Number(item.qty) + approval.direction * approval.qty
        return {
          ...item,
          qty,
          quality:
            approval.type === 'Damage write-off'
              ? qty === 0
                ? 'Damaged'
                : approval.previousQuality || 'Released'
              : item.quality,
        }
      })
      next = recordMovement(next, {
        type: approval.direction < 0 ? 'Adjustment out' : 'Adjustment in',
        batchNo: batch.batchNo,
        productId: batch.productId,
        warehouseId: batch.warehouseId,
        qty: approval.direction * approval.qty,
        unitCost: batch.unitCost,
        reference: approval.reference,
        note: `${approval.reason} · approved`,
      })
    } else if (approval.type === 'Damage write-off') {
      next.batches = next.batches.map((item) =>
        item.id === approval.batchId
          ? { ...item, quality: approval.previousQuality || 'Released' }
          : item,
      )
    }
    next.approvals = next.approvals.map((item) =>
      item.id === approval.id ? { ...item, status: decision, decidedAt: day() } : item,
    )
    if (approval.countId) {
      const remains = next.approvals.some(
        (item) =>
          item.countId === approval.countId && item.id !== approval.id && item.status === 'Pending',
      )
      if (!remains) {
        const allApproved = next.approvals
          .filter((item) => item.countId === approval.countId)
          .every((item) => item.status === 'Approved')
        next.counts = next.counts.map((count) =>
          count.id === approval.countId
            ? { ...count, status: allApproved ? 'Reconciled' : 'Review required' }
            : count,
        )
      }
    }
    save(next, `Adjustment ${decision.toLowerCase()}.`)
  }

  const expiring = data.batches.filter(
    (batch) => batch.qty > 0 && batch.expiry >= day() && batch.expiry <= day(90),
  )
  const expired = data.batches.filter((batch) => batch.qty > 0 && batch.expiry < day())
  const lowProducts = data.products.filter((item) => stockFor(item.id) <= Number(item.reorder))
  const pending = data.approvals.filter((item) => item.status === 'Pending')
  const pageContext = {
    page,
    onNotify,
    onNavigate,
    data,
    search,
    setSearch,
    selectedProductId,
    setSelectedProductId,
    countWarehouseId,
    setCountWarehouseId,
    newCategory,
    setNewCategory,
    newUnit,
    setNewUnit,
    countValues,
    setCountValues,
    receivingWarehouseId,
    setReceivingWarehouseId,
    batchWarehouseId,
    setBatchWarehouseId,
    issueProductId,
    setIssueProductId,
    issueWarehouseId,
    setIssueWarehouseId,
    transferBatchId,
    setTransferBatchId,
    transferWarehouseId,
    setTransferWarehouseId,
    product,
    warehouse,
    totalFor,
    usable,
    stockFor,
    filtered,
    save,
    recordMovement,
    lookup,
    warehouseOptions,
    productOptions,
    receivingLocations,
    registeredBatchLocations,
    transferSource,
    transferLocations,
    issueBatches,
    searchBox,
    tableExport,
    newAction,
    productHeaders,
    productRows,
    batchHeaders,
    batchRows,
    movementHeaders,
    movementRows,
    pageHeader,
    submitProduct,
    submitWarehouse,
    submitLocation,
    saveBatchReceipt,
    submitBatch,
    submitIssue,
    submitTransfer,
    submitAdjustment,
    submitPhysicalCount,
    decideApproval,
    expiring,
    expired,
    lowProducts,
    pending,
    day,
    money,
  }
  const Screen = inventoryScreens[page] || InventoryDashboardPage
  return <Screen context={pageContext} />
}

export default InventoryModule
