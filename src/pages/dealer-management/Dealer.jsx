import DealerManagementDashboardPage from './dealer-management/DealerManagementDashboardPage'
import DealerDashboardPage from './dealer-management/DealerDashboardPage'
import DealerListPage from './dealer-management/DealerListPage'
import AddDealerPage from './dealer-management/AddDealerPage'
import DealerProfilePage from './dealer-management/DealerProfilePage'
import DealerVerificationPage from './dealer-management/DealerVerificationPage'
import DealerCategoriesPage from './dealer-management/DealerCategoriesPage'
import DealerReportsPage from './dealer-management/DealerReportsPage'
import SalesTerritoriesPage from './territory-assignments/SalesTerritoriesPage'
import DealerAssignmentsPage from './territory-assignments/DealerAssignmentsPage'
import SalesOfficerAssignmentsPage from './territory-assignments/SalesOfficerAssignmentsPage'
import AssignmentHistoryPage from './territory-assignments/AssignmentHistoryPage'
import CreateOrderPage from './orders-management/CreateOrderPage'
import OrderListPage from './orders-management/OrderListPage'
import PendingOrdersPage from './orders-management/PendingOrdersPage'
import ApprovalQueuePage from './orders-management/ApprovalQueuePage'
import OrderDetailsPage from './orders-management/OrderDetailsPage'
import OrderHistoryPage from './orders-management/OrderHistoryPage'
import PendingDispatchesPage from './dispatch-returns/PendingDispatchesPage'
import CreateDispatchPage from './dispatch-returns/CreateDispatchPage'
import DeliveryRecordsPage from './dispatch-returns/DeliveryRecordsPage'
import SalesReturnsPage from './dispatch-returns/SalesReturnsPage'
import ReturnApprovalsPage from './dispatch-returns/ReturnApprovalsPage'
import CreditLimitsPage from './dealer-accounts/CreditLimitsPage'
import DealerStatementsPage from './dealer-accounts/DealerStatementsPage'
import OutstandingBalancesPage from './dealer-accounts/OutstandingBalancesPage'
import DealerPaymentsPage from './dealer-accounts/DealerPaymentsPage'
import RecoveryHistoryPage from './dealer-accounts/RecoveryHistoryPage'
import DealerSalesReportPage from './dealer-reports/DealerSalesReportPage'
import OrderReportPage from './dealer-reports/OrderReportPage'
import OutstandingReportPage from './dealer-reports/OutstandingReportPage'
import TerritorySalesPage from './dealer-reports/TerritorySalesPage'
import DealerPerformancePage from './dealer-reports/DealerPerformancePage'
import DealerFallbackPage from './DealerFallbackPage'

const dealerScreens = {
  'Dealer Management': DealerManagementDashboardPage,
  'Dealer Dashboard': DealerDashboardPage,
  'Dealer List': DealerListPage,
  'Add Dealer': AddDealerPage,
  'Dealer Profile': DealerProfilePage,
  'Dealer Verification': DealerVerificationPage,
  'Dealer Categories': DealerCategoriesPage,
  'Dealer Reports': DealerReportsPage,
  'Sales Territories': SalesTerritoriesPage,
  'Dealer Assignments': DealerAssignmentsPage,
  'Sales Officer Assignments': SalesOfficerAssignmentsPage,
  'Assignment History': AssignmentHistoryPage,
  'Create Order': CreateOrderPage,
  'Order List': OrderListPage,
  'Pending Orders': PendingOrdersPage,
  'Approval Queue': ApprovalQueuePage,
  'Order Details': OrderDetailsPage,
  'Order History': OrderHistoryPage,
  'Pending Dispatches': PendingDispatchesPage,
  'Create Dispatch': CreateDispatchPage,
  'Delivery Records': DeliveryRecordsPage,
  'Sales Returns': SalesReturnsPage,
  'Return Approvals': ReturnApprovalsPage,
  'Credit Limits': CreditLimitsPage,
  'Dealer Statements': DealerStatementsPage,
  'Outstanding Balances': OutstandingBalancesPage,
  'Dealer Payments': DealerPaymentsPage,
  'Recovery History': RecoveryHistoryPage,
  'Dealer Sales Report': DealerSalesReportPage,
  'Order Report': OrderReportPage,
  'Outstanding Report': OutstandingReportPage,
  'Territory Sales': TerritorySalesPage,
  'Dealer Performance': DealerPerformancePage,
  default: DealerFallbackPage,
}

import { useMemo, useState } from 'react'
import {
  changeInventoryBatchQuantities,
  inventoryBatchIsUsable,
  inventoryStorageKey,
  readInventoryData,
} from '../inventory/inventoryStock'
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  MapPin,
  Package,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { PageHeader, Stat, Status } from './DealerComponents'
import './Dealer.css'

const storageKey = 'greenfield-dealer-management-v1'
let idSequence = 0
const today = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}
const money = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
const id = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${(++idSequence).toString(36).toUpperCase()}`
const productCatalog = [
  { code: 'PRD-001', name: 'Imidacloprid 20% SL', unit: 'L', price: 1850 },
  { code: 'PRD-002', name: 'Lambda-cyhalothrin 2.5% EC', unit: 'L', price: 2250 },
  { code: 'PRD-003', name: 'Mancozeb 80% WP', unit: 'kg', price: 760 },
]

function seedData() {
  return {
    categories: [
      'Authorized Distributor',
      'Wholesale Dealer',
      'Retail Dealer',
      'Institutional Buyer',
    ],
    dealers: [
      {
        id: 'DLR-001',
        name: 'Green Valley Traders',
        category: 'Authorized Distributor',
        owner: 'Muhammad Aslam',
        phone: '+92 300 555 0181',
        email: 'accounts@greenvalley.example',
        city: 'Lahore',
        territoryId: 'TER-001',
        status: 'Active',
        verification: 'Verified',
        creditLimit: 1500000,
        openingBalance: 215000,
        createdAt: '2026-01-12',
      },
      {
        id: 'DLR-002',
        name: 'Agri Supply House',
        category: 'Wholesale Dealer',
        owner: 'Sana Tariq',
        phone: '+92 301 555 0182',
        email: 'office@agrisupply.example',
        city: 'Faisalabad',
        territoryId: 'TER-002',
        status: 'Active',
        verification: 'Verified',
        creditLimit: 900000,
        openingBalance: 0,
        createdAt: '2026-02-04',
      },
      {
        id: 'DLR-003',
        name: 'Punjab Crop Care',
        category: 'Retail Dealer',
        owner: 'Bilal Ahmad',
        phone: '+92 302 555 0183',
        email: 'billing@cropcare.example',
        city: 'Multan',
        territoryId: 'TER-003',
        status: 'Active',
        verification: 'Verified',
        creditLimit: 500000,
        openingBalance: 120000,
        createdAt: '2026-03-19',
      },
      {
        id: 'DLR-004',
        name: 'Kisan Agro Centre',
        category: 'Wholesale Dealer',
        owner: 'Rashid Mehmood',
        phone: '+92 303 555 0184',
        email: 'kisan@example.com',
        city: 'Sahiwal',
        territoryId: 'TER-001',
        status: 'Pending Verification',
        verification: 'Pending',
        creditLimit: 250000,
        openingBalance: 0,
        createdAt: '2026-11-02',
      },
    ],
    territories: [
      {
        id: 'TER-001',
        name: 'Central Punjab',
        region: 'Punjab',
        cities: 'Lahore, Sahiwal, Okara',
        status: 'Active',
      },
      {
        id: 'TER-002',
        name: 'Faisalabad Division',
        region: 'Punjab',
        cities: 'Faisalabad, Jhang, Toba Tek Singh',
        status: 'Active',
      },
      {
        id: 'TER-003',
        name: 'South Punjab',
        region: 'Punjab',
        cities: 'Multan, Bahawalpur, Rahim Yar Khan',
        status: 'Active',
      },
      {
        id: 'TER-004',
        name: 'Sindh North',
        region: 'Sindh',
        cities: 'Hyderabad, Sukkur, Larkana',
        status: 'Active',
      },
    ],
    officers: [
      {
        id: 'SO-001',
        name: 'Sana Iqbal',
        phone: '+92 300 555 1101',
        territoryId: 'TER-001',
        status: 'Active',
      },
      {
        id: 'SO-002',
        name: 'Hassan Javed',
        phone: '+92 300 555 1102',
        territoryId: 'TER-002',
        status: 'Active',
      },
      {
        id: 'SO-003',
        name: 'Noor Fatima',
        phone: '+92 300 555 1103',
        territoryId: 'TER-003',
        status: 'Active',
      },
    ],
    assignments: [
      {
        id: 'ASN-001',
        dealerId: 'DLR-001',
        territoryId: 'TER-001',
        officerId: 'SO-001',
        startDate: '2026-01-12',
        status: 'Active',
      },
      {
        id: 'ASN-002',
        dealerId: 'DLR-002',
        territoryId: 'TER-002',
        officerId: 'SO-002',
        startDate: '2026-02-04',
        status: 'Active',
      },
      {
        id: 'ASN-003',
        dealerId: 'DLR-003',
        territoryId: 'TER-003',
        officerId: 'SO-003',
        startDate: '2026-03-19',
        status: 'Active',
      },
    ],
    orders: [
      {
        id: 'ORD-2026-0142',
        dealerId: 'DLR-001',
        date: '2026-11-06',
        items: [
          { productCode: 'PRD-001', qty: 120 },
          { productCode: 'PRD-003', qty: 80 },
        ],
        total: 282800,
        status: 'Dispatched',
        paymentTerms: 'Credit · 30 days',
        notes: '',
      },
      {
        id: 'ORD-2026-0143',
        dealerId: 'DLR-002',
        date: '2026-11-08',
        items: [{ productCode: 'PRD-002', qty: 75 }],
        total: 168750,
        status: 'Pending Approval',
        paymentTerms: 'Credit · 30 days',
        notes: 'Seasonal replenishment',
      },
      {
        id: 'ORD-2026-0144',
        dealerId: 'DLR-003',
        date: '2026-11-09',
        items: [{ productCode: 'PRD-003', qty: 150 }],
        total: 114000,
        status: 'Dispatched',
        paymentTerms: 'Cash',
        notes: '',
      },
      {
        id: 'ORD-2026-0145',
        dealerId: 'DLR-001',
        date: '2026-11-10',
        items: [{ productCode: 'PRD-001', qty: 60 }],
        total: 111000,
        status: 'Pending Approval',
        paymentTerms: 'Credit · 30 days',
        notes: '',
      },
    ],
    dispatches: [
      {
        id: 'DSP-2026-0080',
        orderId: 'ORD-2026-0142',
        dealerId: 'DLR-001',
        date: '2026-11-08',
        carrier: 'GreenField Logistics',
        vehicle: 'LEA-24-6308',
        status: 'Delivered',
        reference: 'DN-2026-0080',
        deliveredAt: '2026-11-09',
      },
      {
        id: 'DSP-2026-0081',
        orderId: 'ORD-2026-0144',
        dealerId: 'DLR-003',
        date: '2026-11-10',
        carrier: 'GreenField Logistics',
        vehicle: 'LEA-24-6312',
        status: 'In Transit',
        reference: 'DN-2026-0081',
      },
    ],
    returns: [
      {
        id: 'RET-2026-0012',
        dealerId: 'DLR-001',
        orderId: 'ORD-2026-0142',
        date: '2026-11-10',
        reason: 'Damaged outer packaging',
        amount: 18500,
        status: 'Pending Approval',
        inspection: 'Damaged on receipt',
        disposition: 'Credit without restock',
        notes: 'Batch IMI-26-041 · 10 L',
      },
    ],
    fulfillments: [
      {
        id: 'FUL-2026-0001',
        orderId: 'ORD-2026-0142',
        dealerId: 'DLR-001',
        warehouse: 'Lahore Central Warehouse',
        batch: 'IMI-26-041',
        allocatedQty: 200,
        pickedQty: 200,
        status: 'Delivered',
        allocatedAt: '2026-11-07',
        pickedAt: '2026-11-08',
      },
      {
        id: 'FUL-2026-0002',
        orderId: 'ORD-2026-0144',
        dealerId: 'DLR-003',
        warehouse: 'Multan Regional Warehouse',
        batch: 'MZB-26-015',
        allocatedQty: 150,
        pickedQty: 150,
        status: 'In Transit',
        allocatedAt: '2026-11-09',
        pickedAt: '2026-11-10',
      },
    ],
    payments: [
      {
        id: 'RCP-2026-0068',
        dealerId: 'DLR-002',
        date: '2026-11-07',
        amount: 80000,
        method: 'Bank transfer',
        reference: 'HBL-906821',
        status: 'Posted',
      },
    ],
    history: [],
    nextOrder: 146,
    nextCreditNote: 1,
  }
}

function loadData() {
  const defaults = seedData()
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
    if (!stored) return defaults
    return Object.fromEntries(
      Object.keys(defaults).map((key) => [
        key,
        Array.isArray(defaults[key])
          ? Array.isArray(stored[key])
            ? stored[key]
            : defaults[key]
          : (stored[key] ?? defaults[key]),
      ]),
    )
  } catch (error) {
    console.error('Unable to load dealer management data:', error)
    return defaults
  }
}

const dealerName = (data, dealerId) =>
  data.dealers.find((dealer) => dealer.id === dealerId)?.name || 'Unknown dealer'
const territoryName = (data, territoryId) =>
  data.territories.find((territory) => territory.id === territoryId)?.name || 'Unassigned'
const officerName = (data, officerId) =>
  data.officers.find((officer) => officer.id === officerId)?.name || 'Unassigned'
const productName = (code) => productCatalog.find((product) => product.code === code)?.name || code
const reservedReturnQuantity = (item) => {
  if (item.status === 'Rejected') return 0
  if (item.status === 'Approved')
    return Number(item.acceptedQuantity ?? item.quantity ?? item.receivedQuantity) || 0
  return Number(item.receivedQuantity ?? item.quantity) || 0
}
const dueFor = (data, dealerId) => {
  const invoiced = data.orders
    .filter(
      (order) =>
        order.dealerId === dealerId &&
        ['Approved', 'Dispatched', 'Delivered'].includes(order.status),
    )
    .reduce((sum, order) => sum + order.total, 0)
  const paid = data.payments
    .filter((payment) => payment.dealerId === dealerId && payment.status === 'Posted')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const returns = data.returns
    .filter((item) => item.dealerId === dealerId && item.status === 'Approved')
    .reduce((sum, item) => sum + item.amount, 0)
  const dealer = data.dealers.find((item) => item.id === dealerId)
  return Math.max(0, (dealer?.openingBalance || 0) + invoiced - paid - returns)
}

function DealerModule({ page, onNotify, onNavigate }) {
  const [data, setData] = useState(loadData)
  const [inventoryData, setInventoryData] = useState(() => {
    try {
      return readInventoryData()
    } catch (error) {
      console.error('Unable to load inventory stock for dealer workflows:', error)
      return null
    }
  })
  const [search, setSearch] = useState('')
  const [selectedDealerId, setSelectedDealerId] = useState('DLR-001')
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [categoryDraft, setCategoryDraft] = useState('')
  const [creditDrafts, setCreditDrafts] = useState({})

  const save = (next, message) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      setData(next)
      if (message) onNotify(message)
      return true
    } catch (error) {
      console.error('Unable to save dealer management data:', error)
      onNotify('Dealer changes could not be saved. Check browser storage and try again.')
      return false
    }
  }
  const update = (updater, message) =>
    save(typeof updater === 'function' ? updater(data) : { ...data, ...updater }, message)
  const dealers = useMemo(
    () =>
      data.dealers.filter((dealer) =>
        `${dealer.id} ${dealer.name} ${dealer.owner} ${dealer.city} ${dealer.phone} ${dealer.category}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      ),
    [data.dealers, search],
  )
  const selectedDealer =
    data.dealers.find((dealer) => dealer.id === selectedDealerId) || data.dealers[0]
  const selectedOrder = data.orders.find((order) => order.id === selectedOrderId) || data.orders[0]
  const totalOutstanding = data.dealers.reduce((sum, dealer) => sum + dueFor(data, dealer.id), 0)
  const pendingOrders = data.orders.filter((order) => order.status === 'Pending Approval')

  const createDealer = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const name = values.name.trim()
    const phone = values.phone.trim()
    if (!name || !values.owner.trim() || !phone || !values.city.trim())
      return onNotify('Dealer name, owner, phone, and city are required.')
    if (
      data.dealers.some(
        (dealer) =>
          dealer.phone === phone ||
          (values.email && dealer.email.toLowerCase() === values.email.trim().toLowerCase()),
      )
    )
      return onNotify('A dealer with this phone number or email already exists.')
    const dealer = {
      ...values,
      id: id('DLR'),
      name,
      owner: values.owner.trim(),
      phone,
      email: values.email.trim().toLowerCase(),
      creditLimit: Number(values.creditLimit) || 0,
      openingBalance: 0,
      verification: 'Pending',
      status: 'Pending Verification',
      createdAt: today(),
    }
    if (
      update(
        (current) => ({
          ...current,
          dealers: [dealer, ...current.dealers],
          history: [
            {
              id: id('AH'),
              type: 'Dealer created',
              entityType: 'Dealer',
              dealerId: dealer.id,
              details: 'Dealer registered; verification is pending.',
              date: today(),
            },
            ...current.history,
          ],
        }),
        'Dealer registered. Complete verification before accepting orders.',
      )
    ) {
      setSelectedDealerId(dealer.id)
      onNavigate('Dealer Verification')
    }
  }
  const updateDealer = (dealerId, values) => {
    const currentDealer = data.dealers.find((item) => item.id === dealerId)
    if (!currentDealer) return onNotify('Dealer record was not found.')
    const name = values.name.trim()
    const owner = values.owner.trim()
    const phone = values.phone.trim()
    const email = values.email.trim().toLowerCase()
    const creditLimit = Number(values.creditLimit)
    if (!name || !owner || !phone || !values.city.trim())
      return onNotify('Dealer name, owner, phone, and city are required.')
    if (!Number.isFinite(creditLimit) || creditLimit < 0)
      return onNotify('Credit limit must be zero or greater.')
    if (
      data.dealers.some(
        (dealer) =>
          dealer.id !== dealerId &&
          (dealer.phone === phone || (email && (dealer.email || '').toLowerCase() === email)),
      )
    )
      return onNotify('A dealer with this phone number or email already exists.')
    if (creditLimit < dueFor(data, dealerId))
      return onNotify('Credit limit cannot be lower than the dealer’s current outstanding balance.')
    const updated = {
      ...currentDealer,
      ...values,
      name,
      owner,
      phone,
      email,
      city: values.city.trim(),
      category: values.category.trim(),
      creditLimit,
    }
    const changed = ['name', 'owner', 'email', 'phone', 'city', 'category', 'creditLimit'].filter(
      (key) => String(currentDealer[key] ?? '') !== String(updated[key] ?? ''),
    )
    if (!changed.length) return onNotify('No dealer profile changes to save.')
    return update(
      (current) => ({
        ...current,
        dealers: current.dealers.map((item) => (item.id === dealerId ? updated : item)),
        history: [
          {
            id: id('AH'),
            type: 'Dealer profile updated',
            entityType: 'Dealer',
            dealerId,
            details: `Updated ${changed.join(', ')}`,
            date: today(),
          },
          ...current.history,
        ],
      }),
      'Dealer profile updated',
    )
  }
  const toggleDealerStatus = (dealerId) => {
    const dealer = data.dealers.find((item) => item.id === dealerId)
    if (!dealer) return onNotify('Dealer record was not found.')
    if (!['Active', 'Inactive'].includes(dealer.status))
      return onNotify('Complete dealer verification before changing its active status.')
    if (dealer.status === 'Active' && dealer.verification !== 'Verified')
      return onNotify('Only verified dealers can be deactivated or reactivated.')
    if (
      dealer.status === 'Active' &&
      data.orders.some(
        (order) =>
          order.dealerId === dealerId && ['Pending Approval', 'Approved'].includes(order.status),
      )
    )
      return onNotify('Resolve pending or approved-but-undispatched orders before deactivating.')
    const status = dealer.status === 'Active' ? 'Inactive' : 'Active'
    return update(
      (current) => ({
        ...current,
        dealers: current.dealers.map((item) => (item.id === dealerId ? { ...item, status } : item)),
        history: [
          {
            id: id('AH'),
            type: `Dealer ${status === 'Active' ? 'reactivated' : 'deactivated'}`,
            entityType: 'Dealer',
            dealerId,
            details: `Status changed from ${dealer.status} to ${status}`,
            date: today(),
          },
          ...current.history,
        ],
      }),
      `Dealer ${status === 'Active' ? 'reactivated' : 'deactivated'}`,
    )
  }
  const addTerritory = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (!values.name.trim() || !values.region.trim())
      return onNotify('Territory name and region are required.')
    if (
      data.territories.some(
        (territory) => territory.name.toLowerCase() === values.name.trim().toLowerCase(),
      )
    )
      return onNotify('A territory with this name already exists.')
    update(
      (current) => ({
        ...current,
        territories: [...current.territories, { ...values, id: id('TER'), status: 'Active' }],
      }),
      'Sales territory created',
    )
    event.currentTarget.reset()
  }
  const assignDealer = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const dealer = data.dealers.find((item) => item.id === values.dealerId)
    if (!dealer || dealer.status !== 'Active')
      return onNotify('Only verified, active dealers can be assigned.')
    const officer = data.officers.find((item) => item.id === values.officerId)
    if (!officer || officer.territoryId !== values.territoryId)
      return onNotify('Assign a sales officer responsible for the selected territory.')
    const existing = data.assignments.find(
      (item) => item.dealerId === dealer.id && item.status === 'Active',
    )
    const assignment = {
      ...values,
      id: id('ASN'),
      startDate: values.startDate || today(),
      status: 'Active',
    }
    update(
      (current) => ({
        ...current,
        assignments: [
          ...current.assignments.map((item) =>
            item.id === existing?.id ? { ...item, status: 'Reassigned', endDate: today() } : item,
          ),
          assignment,
        ],
        dealers: current.dealers.map((item) =>
          item.id === dealer.id ? { ...item, territoryId: values.territoryId } : item,
        ),
        history: [
          {
            id: id('AH'),
            type: existing ? 'Dealer reassigned' : 'Dealer assigned',
            dealerId: dealer.id,
            details: `${territoryName(current, values.territoryId)} · ${officerName(current, values.officerId)}`,
            date: today(),
          },
          ...current.history,
        ],
      }),
      'Dealer territory and sales officer assignment saved',
    )
    event.currentTarget.reset()
  }
  const createOrder = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const dealer = data.dealers.find((item) => item.id === values.dealerId)
    const product = productCatalog.find((item) => item.code === values.productCode)
    const quantity = Number(values.quantity)
    if (!dealer || dealer.status !== 'Active')
      return onNotify('Select an active, verified dealer before placing an order.')
    if (!product || !Number.isFinite(quantity) || quantity <= 0)
      return onNotify('Choose a product and enter a positive order quantity.')
    const amount = quantity * product.price
    const exceedsLimit =
      values.paymentTerms === 'Credit · 30 days' &&
      dueFor(data, dealer.id) + amount > Number(dealer.creditLimit)
    const order = {
      id: `ORD-${new Date().getFullYear()}-${String(data.nextOrder).padStart(4, '0')}`,
      dealerId: dealer.id,
      date: values.date || today(),
      items: [{ productCode: product.code, qty: quantity, unitPrice: product.price }],
      total: amount,
      status: 'Pending Approval',
      paymentTerms: values.paymentTerms,
      notes: `${values.notes.trim()}${exceedsLimit ? `${values.notes.trim() ? ' · ' : ''}Credit limit review required` : ''}`,
      timeline: [
        {
          id: id('OE'),
          action: 'Submitted',
          fromStatus: '',
          toStatus: 'Pending Approval',
          reason: 'Order submitted for approval.',
          date: today(),
          actor: 'Admin',
        },
      ],
    }
    if (
      update(
        (current) => ({
          ...current,
          nextOrder: current.nextOrder + 1,
          orders: [order, ...current.orders],
        }),
        `${order.id} submitted for approval`,
      )
    )
      onNavigate('Pending Orders')
  }
  const amendOrder = (orderId, values) => {
    const order = data.orders.find((item) => item.id === orderId)
    if (!order || order.status !== 'Pending Approval')
      return onNotify('Only orders awaiting approval can be amended.')
    const reason = String(values.reason || '').trim()
    if (!reason) return onNotify('Enter a reason for amending this order.')
    const lines = Array.isArray(values.items) ? values.items : []
    if (!lines.length) return onNotify('An order must contain at least one product.')
    const normalizedItems = []
    for (const line of lines) {
      const product = productCatalog.find((item) => item.code === line.productCode)
      const quantity = Number(line.qty)
      if (!product || !Number.isInteger(quantity) || quantity <= 0)
        return onNotify(
          'Choose a product and enter a positive whole-number quantity for each line.',
        )
      if (normalizedItems.some((item) => item.productCode === product.code))
        return onNotify('Each product can appear only once in an order.')
      normalizedItems.push({
        productCode: product.code,
        qty: quantity,
        unitPrice:
          Number.isFinite(Number(line.unitPrice)) && Number(line.unitPrice) >= 0
            ? Number(line.unitPrice)
            : product.price,
      })
    }
    const total = normalizedItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    if (!Number.isFinite(total) || total <= 0)
      return onNotify('The amended order total must be greater than zero.')
    const event = {
      id: id('OE'),
      action: 'Amended',
      fromStatus: order.status,
      toStatus: order.status,
      reason,
      date: today(),
      actor: 'Admin',
    }
    return update(
      (current) => ({
        ...current,
        orders: current.orders.map((item) =>
          item.id === orderId
            ? {
                ...item,
                date: values.date || item.date,
                items: normalizedItems,
                total,
                paymentTerms: values.paymentTerms,
                notes: String(values.notes || '').trim(),
                timeline: [...(Array.isArray(item.timeline) ? item.timeline : []), event],
              }
            : item,
        ),
      }),
      `${order.id} amended and remains pending approval`,
    )
  }
  const cancelOrder = (orderId, reason) => {
    const order = data.orders.find((item) => item.id === orderId)
    if (!order || order.status !== 'Pending Approval')
      return onNotify('Only orders awaiting approval can be cancelled.')
    const cancellationReason = String(reason || '').trim()
    if (!cancellationReason) return onNotify('Enter a reason for cancelling this order.')
    const event = {
      id: id('OE'),
      action: 'Cancelled',
      fromStatus: order.status,
      toStatus: 'Cancelled',
      reason: cancellationReason,
      date: today(),
      actor: 'Admin',
    }
    return update(
      (current) => ({
        ...current,
        orders: current.orders.map((item) =>
          item.id === orderId
            ? {
                ...item,
                status: 'Cancelled',
                cancelledAt: today(),
                timeline: [...(Array.isArray(item.timeline) ? item.timeline : []), event],
              }
            : item,
        ),
      }),
      `${order.id} cancelled`,
    )
  }
  const decideOrder = (orderId, status, reason = '') => {
    const order = data.orders.find((item) => item.id === orderId)
    if (!order || order.status !== 'Pending Approval')
      return onNotify('This order is no longer waiting for approval.')
    if (!['Approved', 'Rejected'].includes(status))
      return onNotify('Choose a valid order decision.')
    const decisionReason = String(reason || '').trim()
    if (status === 'Rejected' && !decisionReason)
      return onNotify('Enter a reason before rejecting this order.')
    if (status === 'Approved' && order.paymentTerms.startsWith('Credit')) {
      const dealer = data.dealers.find((item) => item.id === order.dealerId)
      if (dueFor(data, order.dealerId) + order.total > Number(dealer?.creditLimit || 0))
        return onNotify('Approval blocked: dealer credit limit would be exceeded.')
    }
    return update((current) => {
      const existingFulfillments = Array.isArray(current.fulfillments) ? current.fulfillments : []
      const fulfillment =
        status === 'Approved'
          ? {
              id: id('FUL'),
              orderId: order.id,
              dealerId: order.dealerId,
              warehouse: '',
              batch: '',
              allocatedQty: 0,
              pickedQty: 0,
              status: 'Awaiting Allocation',
              allocatedAt: today(),
              pickedAt: '',
            }
          : null
      return {
        ...current,
        orders: current.orders.map((item) =>
          item.id === orderId
            ? {
                ...item,
                status,
                reviewedAt: today(),
                timeline: [
                  ...(Array.isArray(item.timeline) ? item.timeline : []),
                  {
                    id: id('OE'),
                    action: status,
                    fromStatus: item.status,
                    toStatus: status,
                    reason: decisionReason || 'Approved for fulfillment.',
                    date: today(),
                    actor: 'Admin',
                  },
                ],
              }
            : item,
        ),
        fulfillments: fulfillment
          ? [fulfillment, ...existingFulfillments.filter((item) => item.orderId !== order.id)]
          : existingFulfillments,
        history: [
          {
            id: id('AH'),
            type: `Order ${status.toLowerCase()}`,
            dealerId: order.dealerId,
            details: order.id,
            date: today(),
          },
          ...current.history,
        ],
      }
    }, `${order.id} ${status.toLowerCase()}`)
  }
  const requestOrderDecision = (orderId, status) => {
    if (status === 'Rejected') {
      setSelectedOrderId(orderId)
      onNavigate('Order Details')
      return
    }
    decideOrder(orderId, status)
  }
  const createDispatch = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const order = data.orders.find((item) => item.id === values.orderId)
    if (!order || order.status !== 'Approved')
      return onNotify('Only approved, undispatched orders can be dispatched.')
    if (data.dispatches.some((item) => item.orderId === order.id))
      return onNotify('A dispatch already exists for this order.')
    let inventory
    try {
      inventory = readInventoryData()
    } catch (error) {
      console.error('Unable to read inventory for dealer dispatch:', error)
      return onNotify('Inventory stock data is unavailable. Reopen Inventory and try again.')
    }
    if (!inventory)
      return onNotify(
        'No saved inventory is available. Register stock in Inventory before dispatch.',
      )

    const allocations = order.items.map((line) => {
      const batch = inventory.batches.find(
        (item) => item.id === values[`batch-${line.productCode}`],
      )
      const quantity = Number(line.qty)
      if (
        !batch ||
        batch.productId !== line.productCode ||
        !inventoryBatchIsUsable(batch) ||
        quantity > Number(batch.qty) ||
        !inventory.warehouses.some((warehouse) => warehouse.id === batch.warehouseId)
      )
        return null
      return {
        productCode: line.productCode,
        batchId: batch.id,
        batchNo: batch.batchNo,
        warehouseId: batch.warehouseId,
        quantity,
      }
    })
    if (allocations.some((item) => !item))
      return onNotify(
        'Each order line needs a released, unexpired batch with enough available stock.',
      )

    const reference = `DN-${new Date().getFullYear()}-${String(data.dispatches.length + 82).padStart(4, '0')}`
    const dispatch = {
      id: id('DSP'),
      orderId: order.id,
      dealerId: order.dealerId,
      date: values.date || today(),
      carrier: String(values.carrier || '').trim(),
      vehicle: String(values.vehicle || '').trim(),
      status: 'In Transit',
      reference,
      allocations,
    }
    const changes = allocations.map((allocation) => ({
      batchId: allocation.batchId,
      quantity: allocation.quantity,
      quantityDelta: -allocation.quantity,
      movementId: id('MOV'),
      date: dispatch.date,
      type: 'Issue',
      reference: dispatch.reference,
      note: `Dealer order ${order.id} dispatched`,
    }))
    let nextInventory
    try {
      nextInventory = changeInventoryBatchQuantities(inventory, changes)
    } catch (error) {
      onNotify(error.message)
      return
    }
    const batchNames = [...new Set(allocations.map((item) => item.batchNo))]
    const warehouseNames = [
      ...new Set(
        allocations.map(
          (item) =>
            inventory.warehouses.find((warehouse) => warehouse.id === item.warehouseId)?.name,
        ),
      ),
    ]
    const fulfillment = {
      id: data.fulfillments?.find((item) => item.orderId === order.id)?.id || id('FUL'),
      orderId: order.id,
      dealerId: order.dealerId,
      warehouse: warehouseNames.join(', '),
      batch: batchNames.join(', '),
      allocatedQty: allocations.reduce((sum, item) => sum + item.quantity, 0),
      pickedQty: allocations.reduce((sum, item) => sum + item.quantity, 0),
      allocations,
      status: 'In Transit',
      allocatedAt: today(),
      pickedAt: today(),
    }
    const nextData = {
      ...data,
      dispatches: [dispatch, ...data.dispatches],
      orders: data.orders.map((item) =>
        item.id === order.id
          ? {
              ...item,
              status: 'Dispatched',
              timeline: [
                ...(Array.isArray(item.timeline) ? item.timeline : []),
                {
                  id: id('OE'),
                  action: 'Dispatched',
                  fromStatus: item.status,
                  toStatus: 'Dispatched',
                  reason: `Dispatch ${dispatch.reference} created.`,
                  date: dispatch.date,
                  actor: 'Admin',
                },
              ],
            }
          : item,
      ),
      fulfillments: [
        fulfillment,
        ...(data.fulfillments || []).filter((item) => item.orderId !== order.id),
      ],
    }
    const previousInventory = window.localStorage.getItem(inventoryStorageKey)
    try {
      window.localStorage.setItem(inventoryStorageKey, JSON.stringify(nextInventory))
    } catch (error) {
      console.error('Unable to save inventory for dealer dispatch:', error)
      return onNotify('Dispatch was not created because inventory stock could not be saved.')
    }
    if (!save(nextData, `${dispatch.reference} created for ${order.id}`)) {
      try {
        if (previousInventory === null) window.localStorage.removeItem(inventoryStorageKey)
        else window.localStorage.setItem(inventoryStorageKey, previousInventory)
      } catch (error) {
        console.error('Unable to roll back inventory after dealer dispatch save failed:', error)
        onNotify(
          'Dispatch save failed and inventory rollback also failed. Reconcile this dispatch before continuing.',
        )
      }
      return
    }
    setInventoryData(nextInventory)
    setSelectedOrderId('')
    onNavigate('Delivery Records')
  }
  const markDelivered = (dispatchId) => {
    const dispatch = data.dispatches.find((item) => item.id === dispatchId)
    if (!dispatch || dispatch.status !== 'In Transit') return
    update(
      (current) => ({
        ...current,
        dispatches: current.dispatches.map((item) =>
          item.id === dispatchId ? { ...item, status: 'Delivered', deliveredAt: today() } : item,
        ),
        orders: current.orders.map((item) =>
          item.id === dispatch.orderId
            ? {
                ...item,
                status: 'Delivered',
                timeline: [
                  ...(Array.isArray(item.timeline) ? item.timeline : []),
                  {
                    id: id('OE'),
                    action: 'Delivered',
                    fromStatus: item.status,
                    toStatus: 'Delivered',
                    reason: `Delivery ${dispatch.reference} confirmed.`,
                    date: today(),
                    actor: 'Admin',
                  },
                ],
              }
            : item,
        ),
        fulfillments: (Array.isArray(current.fulfillments) ? current.fulfillments : []).map(
          (item) => (item.orderId === dispatch.orderId ? { ...item, status: 'Delivered' } : item),
        ),
      }),
      `Delivery ${dispatch.reference} confirmed`,
    )
  }
  const createReturn = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const order = data.orders.find((item) => item.id === values.orderId)
    const amount = Number(values.amount)
    const quantity = Number(values.quantity)
    const inspection = String(values.inspection || '').trim()
    const disposition = String(values.disposition || '').trim()
    if (!order || !['Dispatched', 'Delivered'].includes(order.status))
      return onNotify('Returns can only be raised against a dispatched order.')
    if (
      data.returns.some(
        (item) =>
          item.orderId === order.id &&
          item.status === 'Pending Approval' &&
          (!item.productCode || !item.batchId),
      )
    )
      return onNotify(
        'Resolve the pending legacy return with missing product or batch details before raising another return for this order.',
      )
    const orderLine = order.items.find((line) => line.productCode === values.productCode)
    const dispatch = data.dispatches.find((item) => item.orderId === order.id)
    const allocation = dispatch?.allocations?.find(
      (item) => item.productCode === values.productCode && item.batchId === values.batchId,
    )
    const returnedQty = data.returns
      .filter(
        (item) =>
          item.orderId === order.id &&
          item.productCode === values.productCode &&
          item.batchId === values.batchId &&
          item.status !== 'Rejected',
      )
      .reduce((sum, item) => sum + reservedReturnQuantity(item), 0)
    const product = productCatalog.find((item) => item.code === values.productCode)
    const unitPrice = Number(orderLine?.unitPrice ?? product?.price ?? 0)
    if (
      !orderLine ||
      !allocation ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      quantity > allocation.quantity - returnedQty ||
      !product ||
      amount <= 0 ||
      amount > quantity * unitPrice ||
      !values.reason.trim() ||
      !inspection ||
      !disposition
    )
      return onNotify(
        'Enter a valid source batch, return quantity, credit amount, reason, inspection result and disposition.',
      )
    if (disposition === 'Restock after inspection' && inspection !== 'Accepted')
      return onNotify('Only product accepted during inspection can be returned to stock.')
    const item = {
      ...values,
      id: id('RET'),
      dealerId: order.dealerId,
      date: today(),
      amount,
      requestedAmount: amount,
      quantity,
      receivedQuantity: quantity,
      unitPrice,
      batchNo: allocation.batchNo,
      inspection,
      disposition,
      status: 'Pending Approval',
    }
    update(
      (current) => ({ ...current, returns: [item, ...current.returns] }),
      `${item.id} submitted for review`,
    )
    event.currentTarget.reset()
  }
  const decideReturn = (returnId, status, values = {}) => {
    const item = data.returns.find((record) => record.id === returnId)
    if (!item || item.status !== 'Pending Approval') {
      onNotify('This return has already been reviewed.')
      return false
    }
    if (!['Approved', 'Rejected'].includes(status)) {
      onNotify('Choose a valid return decision.')
      return false
    }
    const receivedQuantity = Number(
      values.receivedQuantity ?? item.receivedQuantity ?? item.quantity,
    )
    const recordedReceivedQuantity = Number(item.receivedQuantity ?? item.quantity)
    const decisionReason = String(values.decisionReason || '').trim()
    if (!Number.isInteger(receivedQuantity) || receivedQuantity <= 0) {
      onNotify('Enter the physically received quantity before deciding this return.')
      return false
    }
    if (
      Number.isInteger(recordedReceivedQuantity) &&
      recordedReceivedQuantity > 0 &&
      receivedQuantity !== recordedReceivedQuantity
    ) {
      onNotify('Received quantity is fixed from intake and cannot be changed during review.')
      return false
    }
    if (!decisionReason) {
      onNotify('Enter a decision reason before completing this review.')
      return false
    }

    let acceptedQuantity = 0
    let rejectedQuantity = receivedQuantity
    let approvedCredit = 0
    let finalInspection = 'Rejected'
    let finalDisposition = 'Return rejected'
    let creditReference = ''
    let orderLine
    let unitPrice = 0
    if (status === 'Approved') {
      acceptedQuantity = Number(values.acceptedQuantity)
      rejectedQuantity = Number(values.rejectedQuantity)
      approvedCredit = Number(values.approvedCredit)
      finalInspection = String(values.finalInspection || '').trim()
      finalDisposition = String(values.finalDisposition || '').trim()
      const order = data.orders.find((record) => record.id === item.orderId)
      orderLine = order?.items?.find((line) => line.productCode === item.productCode)
      const product = productCatalog.find((entry) => entry.code === item.productCode)
      unitPrice = Number(orderLine?.unitPrice ?? product?.price ?? item.unitPrice ?? 0)
      const requestedAmount = Number(item.requestedAmount ?? item.amount)
      const creditCap = Math.min(requestedAmount, acceptedQuantity * unitPrice)
      if (
        !order ||
        !orderLine ||
        !item.productCode ||
        !Number.isFinite(unitPrice) ||
        unitPrice <= 0
      ) {
        onNotify(
          'This legacy return is missing its order product or unit price. It cannot be approved until traceable order details are restored.',
        )
        return false
      }
      if (
        !Number.isInteger(acceptedQuantity) ||
        !Number.isInteger(rejectedQuantity) ||
        acceptedQuantity < 0 ||
        rejectedQuantity < 0 ||
        acceptedQuantity + rejectedQuantity !== receivedQuantity
      ) {
        onNotify(
          'Accepted and rejected quantities must be whole numbers that add up to received quantity.',
        )
        return false
      }
      if (acceptedQuantity <= 0) {
        onNotify(
          'At least one received unit must be accepted. Reject the return if none are accepted.',
        )
        return false
      }
      if (!Number.isFinite(approvedCredit) || approvedCredit < 0 || approvedCredit > creditCap) {
        onNotify(
          `Approved credit cannot exceed ${money(Math.max(0, creditCap))}, based on accepted quantity and the requested amount.`,
        )
        return false
      }
      if (
        ![
          'Accepted',
          'Partially accepted',
          'Damaged on receipt',
          'Incorrect delivery',
          'Other',
        ].includes(finalInspection) ||
        !['Restock after inspection', 'Credit without restock', 'Write-off and reconcile'].includes(
          finalDisposition,
        )
      ) {
        onNotify('Select the final inspection result and disposition.')
        return false
      }
      if (finalDisposition === 'Restock after inspection') {
        if (!['Accepted', 'Partially accepted'].includes(finalInspection) || !item.batchId) {
          onNotify(
            'Restocking requires accepted units and a traceable source batch. This return remains pending.',
          )
          return false
        }
      }
      if (approvedCredit > 0) {
        creditReference = `CRN-${new Date().getFullYear()}-${String(
          Number(data.nextCreditNote) || 1,
        ).padStart(4, '0')}`
      }
    }
    let inventory
    let nextInventory
    if (status === 'Approved' && finalDisposition === 'Restock after inspection') {
      try {
        inventory = readInventoryData()
        if (!inventory) {
          onNotify('Saved inventory is unavailable; this return cannot be restocked.')
          return false
        }
        nextInventory = changeInventoryBatchQuantities(inventory, [
          {
            batchId: item.batchId,
            quantity: acceptedQuantity,
            quantityDelta: acceptedQuantity,
            movementId: id('MOV'),
            date: today(),
            type: 'Customer Return',
            reference: item.id,
            note: `${acceptedQuantity} accepted unit(s) from dealer return against order ${item.orderId}`,
          },
        ])
      } catch (error) {
        console.error('Unable to prepare inventory restock for dealer return:', error)
        onNotify(error.message)
        return false
      }
    }
    const accountOutcome =
      approvedCredit > 0
        ? `Local dealer credit ${money(approvedCredit)} · ${creditReference}; no Finance journal posted.`
        : 'No local dealer credit applied.'
    const stockOutcome =
      status !== 'Approved'
        ? 'No stock added.'
        : finalDisposition === 'Restock after inspection'
          ? `${acceptedQuantity} unit(s) restocked to ${item.batchNo || item.batchId}.`
          : `No stock added under ${finalDisposition}.`
    const nextData = {
      ...data,
      returns: data.returns.map((record) =>
        record.id === returnId
          ? {
              ...record,
              status,
              requestedAmount: Number(record.requestedAmount ?? record.amount) || 0,
              amount: status === 'Approved' ? approvedCredit : record.amount,
              receivedQuantity,
              acceptedQuantity,
              rejectedQuantity,
              finalInspection,
              finalDisposition,
              approvedCredit,
              decisionReason,
              creditReference,
              stockOutcome,
              accountOutcome,
              unitPrice: unitPrice || record.unitPrice,
              reviewedAt: today(),
            }
          : record,
      ),
      nextCreditNote:
        status === 'Approved' && approvedCredit > 0
          ? (Number(data.nextCreditNote) || 1) + 1
          : Number(data.nextCreditNote) || 1,
      history: [
        {
          id: id('AH'),
          type: `Return ${status.toLowerCase()}`,
          dealerId: item.dealerId,
          details:
            status === 'Approved'
              ? `${item.id} · ${acceptedQuantity} accepted / ${rejectedQuantity} rejected · ${finalDisposition} · ${accountOutcome}`
              : `${item.id} · ${receivedQuantity} received · ${decisionReason}`,
          date: today(),
        },
        ...data.history,
      ],
    }
    const previousInventory = nextInventory && window.localStorage.getItem(inventoryStorageKey)
    if (nextInventory) {
      try {
        window.localStorage.setItem(inventoryStorageKey, JSON.stringify(nextInventory))
      } catch (error) {
        console.error('Unable to save inventory for dealer return:', error)
        onNotify('Return was not approved because inventory stock could not be saved.')
        return false
      }
    }
    if (!save(nextData, `${item.id} ${status.toLowerCase()}`)) {
      if (nextInventory) {
        try {
          if (previousInventory === null) window.localStorage.removeItem(inventoryStorageKey)
          else window.localStorage.setItem(inventoryStorageKey, previousInventory)
        } catch (error) {
          console.error('Unable to roll back inventory after dealer return save failed:', error)
          onNotify(
            'Return save failed and inventory rollback also failed. Reconcile this return before continuing.',
          )
        }
      }
      return false
    }
    if (nextInventory) setInventoryData(nextInventory)
    return true
  }
  const recordPayment = (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const amount = Number(values.amount)
    if (!values.dealerId || amount <= 0 || !values.reference.trim())
      return onNotify('Choose a dealer and enter a positive payment amount and reference.')
    const payment = {
      ...values,
      id: id('RCP'),
      amount,
      date: values.date || today(),
      status: 'Posted',
    }
    update(
      (current) => ({
        ...current,
        payments: [payment, ...current.payments],
        history: [
          {
            id: id('AH'),
            type: 'Dealer payment received',
            dealerId: payment.dealerId,
            details: `${payment.id} · ${money(amount)}`,
            date: payment.date,
          },
          ...current.history,
        ],
      }),
      `${payment.id} posted to dealer account`,
    )
    event.currentTarget.reset()
  }
  const verifyDealer = (dealerId, verification) => {
    update(
      (current) => ({
        ...current,
        dealers: current.dealers.map((dealer) =>
          dealer.id === dealerId
            ? {
                ...dealer,
                verification,
                status: verification === 'Verified' ? 'Active' : 'Verification Rejected',
                verifiedAt: today(),
              }
            : dealer,
        ),
        history: [
          {
            id: id('AH'),
            type: `Dealer ${verification.toLowerCase()}`,
            dealerId,
            details: dealerName(current, dealerId),
            date: today(),
          },
          ...current.history,
        ],
      }),
      `Dealer ${verification.toLowerCase()}`,
    )
  }
  const saveCreditLimit = (dealerId) => {
    const limit = Number(creditDrafts[dealerId])
    if (!Number.isFinite(limit) || limit < 0)
      return onNotify('Enter a valid non-negative credit limit.')
    update(
      (current) => ({
        ...current,
        dealers: current.dealers.map((dealer) =>
          dealer.id === dealerId ? { ...dealer, creditLimit: limit } : dealer,
        ),
      }),
      'Dealer credit limit updated',
    )
  }
  const addCategory = (event) => {
    event.preventDefault()
    const category = categoryDraft.trim()
    if (!category) return onNotify('Enter a dealer category.')
    if (data.categories.some((item) => item.toLowerCase() === category.toLowerCase()))
      return onNotify('That dealer category already exists.')
    if (
      update(
        (current) => ({ ...current, categories: [...current.categories, category] }),
        'Dealer category added',
      )
    )
      setCategoryDraft('')
  }
  const exportRows = (filename, headers, rows) => {
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    link.download = `${filename.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }
  const dealerRows = (items) =>
    items.map((dealer) => (
      <tr key={dealer.id}>
        <td>
          <button
            className="dealer-table-link"
            onClick={() => {
              setSelectedDealerId(dealer.id)
              onNavigate('Dealer Profile')
            }}
          >
            {dealer.name}
            <small>
              {dealer.id} · {dealer.category}
            </small>
          </button>
        </td>
        <td>
          {dealer.owner}
          <small>{dealer.phone}</small>
        </td>
        <td>{dealer.city}</td>
        <td>{territoryName(data, dealer.territoryId)}</td>
        <td>
          <Status>{dealer.status}</Status>
        </td>
        <td>{money(dueFor(data, dealer.id))}</td>
        <td>
          <button
            className="dealer-icon-button"
            title="Open dealer profile"
            onClick={() => {
              setSelectedDealerId(dealer.id)
              onNavigate('Dealer Profile')
            }}
          >
            <ChevronRight size={16} />
          </button>
        </td>
      </tr>
    ))
  const orderRows = (items) =>
    items.map((order) => (
      <tr key={order.id}>
        <td>
          <button
            className="dealer-table-link"
            onClick={() => {
              setSelectedOrderId(order.id)
              onNavigate('Order Details')
            }}
          >
            {order.id}
            <small>{order.date}</small>
          </button>
        </td>
        <td>{dealerName(data, order.dealerId)}</td>
        <td>
          {order.items.map((item) => `${productName(item.productCode)} · ${item.qty}`).join(', ')}
        </td>
        <td>{money(order.total)}</td>
        <td>{order.paymentTerms}</td>
        <td>
          <Status>{order.status}</Status>
        </td>
        <td>
          {order.status === 'Pending Approval' ? (
            <div className="dealer-row-actions">
              <button
                className="dealer-mini approve"
                onClick={() => requestOrderDecision(order.id, 'Approved')}
              >
                <Check size={13} />
                Approve
              </button>
              <button
                className="dealer-mini reject"
                onClick={() => requestOrderDecision(order.id, 'Rejected')}
              >
                <X size={13} />
                Reject
              </button>
            </div>
          ) : (
            <button
              className="dealer-icon-button"
              title="View order"
              onClick={() => {
                setSelectedOrderId(order.id)
                onNavigate('Order Details')
              }}
            >
              <ChevronRight size={16} />
            </button>
          )}
        </td>
      </tr>
    ))
  const table = (title, headers, rows, empty = 'No records to display.') => (
    <section className="dealer-card">
      <header>
        <span>
          <ClipboardCheck size={17} />
          {title}
        </span>
        <small>{rows.length} records</small>
      </header>
      <div className="dealer-table-wrap">
        <table className="dealer-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows
            ) : (
              <tr>
                <td className="dealer-empty" colSpan={headers.length}>
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
  const button = (label, action, secondary = false, Icon = Plus) => (
    <button className={`dealer-button${secondary ? ' secondary' : ''}`} onClick={action}>
      <Icon size={15} />
      {label}
    </button>
  )
  const header = (subtitle, icon = Building2, action = null, exportAction = null) => (
    <PageHeader
      page={page === 'Dealer Management' ? 'Dealer Management Dashboard' : page}
      subtitle={subtitle}
      icon={icon}
      action={action}
      onExport={exportAction}
    />
  )
  const dealerOptions = data.dealers.map((dealer) => (
    <option key={dealer.id} value={dealer.id}>
      {dealer.name} · {dealer.id}
    </option>
  ))
  const territoryOptions = data.territories.map((territory) => (
    <option key={territory.id} value={territory.id}>
      {territory.name}
    </option>
  ))
  const officerOptions = data.officers
    .filter((officer) => officer.status === 'Active')
    .map((officer) => (
      <option key={officer.id} value={officer.id}>
        {officer.name}
      </option>
    ))
  const eligibleDispatchOrders = data.orders.filter(
    (order) =>
      order.status === 'Approved' &&
      !data.dispatches.some((dispatch) => dispatch.orderId === order.id),
  )
  const returnableOrders = data.orders.filter((order) => {
    if (!['Dispatched', 'Delivered'].includes(order.status)) return false
    if (
      data.returns.some(
        (item) =>
          item.orderId === order.id &&
          item.status === 'Pending Approval' &&
          (!item.productCode || !item.batchId),
      )
    )
      return false
    const allocations =
      data.dispatches.find((dispatch) => dispatch.orderId === order.id)?.allocations || []
    return allocations.some((allocation) => {
      const returnedQty = data.returns
        .filter(
          (item) =>
            item.orderId === order.id &&
            item.productCode === allocation.productCode &&
            item.batchId === allocation.batchId &&
            item.status !== 'Rejected',
        )
        .reduce((sum, item) => sum + reservedReturnQuantity(item), 0)
      return Number(allocation.quantity) > returnedQty
    })
  })
  const formPage = (title, subtitle, icon, fields, onSubmit, submitLabel) => (
    <div className="dealer-page">
      {header(subtitle, icon)}
      <form className="dealer-form-card" onSubmit={onSubmit}>
        <div className="dealer-form-heading">
          <span>{title}</span>
          <small>Required fields are marked with *</small>
        </div>
        <div className="dealer-form-grid">{fields}</div>
        <footer>
          <button
            type="button"
            className="dealer-button secondary"
            onClick={() => onNavigate('Dealer Management')}
          >
            Cancel
          </button>
          <button type="submit" className="dealer-button">
            <Check size={15} />
            {submitLabel}
          </button>
        </footer>
      </form>
    </div>
  )
  const field = (label, name, options = {}) => (
    <label className={`dealer-field${options.wide ? ' wide' : ''}`} key={options.key || name}>
      <span>
        {label}
        {options.required && <b> *</b>}
      </span>
      {options.options ? (
        <select
          name={name}
          required={options.required}
          defaultValue={options.value ?? ''}
          onChange={options.onChange}
        >
          {options.placeholder && (
            <option value="" disabled>
              {options.placeholder}
            </option>
          )}
          {options.options}
        </select>
      ) : options.textarea ? (
        <textarea
          name={name}
          rows={3}
          required={options.required}
          defaultValue={options.value ?? ''}
          placeholder={options.placeholder}
        />
      ) : (
        <input
          name={name}
          type={options.type || 'text'}
          required={options.required}
          min={options.min}
          max={options.max}
          step={options.step}
          defaultValue={options.value ?? ''}
          placeholder={options.placeholder}
        />
      )}
    </label>
  )
  const searchBar = (
    <div className="dealer-toolbar">
      <label className="dealer-search">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search dealer, order, territory…"
        />
      </label>
      <span>{dealers.length} matching dealers</span>
    </div>
  )
  const status = (value) => <Status>{value}</Status>
  const availablePages = (items) =>
    items.map((item) => (
      <button key={item} onClick={() => onNavigate(item)}>
        {item}
        <ArrowRight size={14} />
      </button>
    ))

  const pageContext = {
    data,
    creditDrafts,
    setCreditDrafts,
    dealers,
    saveCreditLimit,
    table,
    header,
    Wallet,
    money,
    dueFor,
    recordPayment,
    dealerOptions,
    formPage,
    field,
    Banknote,
    today,
    onNavigate,
    setSelectedDealerId,
    setSelectedOrderId,
    exportRows,
    Users,
    Stat,
    territoryName,
    createDealer,
    updateDealer,
    toggleDealerStatus,
    territoryOptions,
    categoryDraft,
    setCategoryDraft,
    addCategory,
    Plus,
    totalOutstanding,
    pendingOrders,
    verifyDealer,
    orderRows,
    amendOrder,
    cancelOrder,
    decideOrder,
    requestOrderDecision,
    button,
    eligibleDispatchOrders,
    status,
    Building2,
    Check,
    ChevronRight,
    ClipboardCheck,
    Truck,
    dealerRows,
    searchBar,
    BarChart3,
    CheckCircle2,
    Clock3,
    selectedDealer,
    MapPin,
    ShoppingCart,
    officerName,
    ShieldCheck,
    X,
    search,
    dealerName,
    productName,
    createDispatch,
    markDelivered,
    ArrowRight,
    decideReturn,
    Package,
    createReturn,
    returnableOrders,
    reservedReturnQuantity,
    inventoryData,
    productCatalog,
    inventoryBatchIsUsable,
    createOrder,
    fulfillments: data.fulfillments || [],
    selectedOrderId,
    selectedOrder,
    FileCheck2,
    FileText,
    assignDealer,
    officerOptions,
    addTerritory,
    page,
    onNotify,
  }
  const Screen = dealerScreens[page] || dealerScreens.default
  return <Screen context={pageContext} onNavigate={onNavigate} />
}

export default DealerModule
