import { useRef, useState } from 'react'
import { accountNet, monthKey, money, newId, today } from './financeShared'

import FinanceDashboard from './Dashboard/FinanceDashboard'
import AccountGroupsPage from './Chart of Accounts/AccountGroupsPage'
import AccountFormPage from './Chart of Accounts/AccountFormPage'
import AccountDirectoryPage from './Chart of Accounts/AccountDirectoryPage'
import AccountDetailsPage from './Chart of Accounts/AccountDetailsPage'
import JournalFormPage from './Journal Entries/JournalFormPage'
import DraftEntriesPage from './Journal Entries/DraftEntriesPage'
import PostedEntriesPage from './Journal Entries/PostedEntriesPage'
import ReversalsPage from './Journal Entries/ReversalsPage'
import JournalReportPage from './Journal Entries/JournalReportPage'
import CashAccountsPage from './Cash & Bank/CashAccountsPage'
import CashReceiptsPage from './Cash & Bank/CashReceiptsPage'
import CashPaymentsPage from './Cash & Bank/CashPaymentsPage'
import BankAccountsPage from './Cash & Bank/BankAccountsPage'
import BankTransactionsPage from './Cash & Bank/BankTransactionsPage'
import BankReconciliationPage from './Cash & Bank/BankReconciliationPage'
import CustomerBalancesPage from './Receivables (Customers)/CustomerBalancesPage'
import OutstandingInvoicesPage from './Receivables (Customers)/OutstandingInvoicesPage'
import ReceivePaymentPage from './Receivables (Customers)/ReceivePaymentPage'
import PaymentAllocationPage from './Receivables (Customers)/PaymentAllocationPage'
import AgingReportPage from './Receivables (Customers)/AgingReportPage'
import SupplierBalancesPage from './Payables (Suppliers)/SupplierBalancesPage'
import SupplierBillsPage from './Payables (Suppliers)/SupplierBillsPage'
import MakePaymentPage from './Payables (Suppliers)/MakePaymentPage'
import OutstandingPayablesPage from './Payables (Suppliers)/OutstandingPayablesPage'
import PayableAgingPage from './Payables (Suppliers)/PayableAgingPage'
import GeneralLedgerPage from './Financial Reports/GeneralLedgerPage'
import TrialBalancePage from './Financial Reports/TrialBalancePage'
import ProfitAndLossPage from './Financial Reports/ProfitAndLossPage'
import BalanceSheetPage from './Financial Reports/BalanceSheetPage'
import CashFlowPage from './Financial Reports/CashFlowPage'
import TaxReportsPage from './Financial Reports/TaxReportsPage'

const storageKey = 'greenfield-finance-accounting-v1'
function seedData() {
  const accounts = [
    {
      id: 'AC-1000',
      code: '1000',
      name: 'Cash on Hand',
      type: 'Asset',
      group: 'Current Assets',
      control: 'Cash',
      status: 'Active',
    },
    {
      id: 'AC-1010',
      code: '1010',
      name: 'Main Bank Account',
      type: 'Asset',
      group: 'Current Assets',
      control: 'Bank',
      status: 'Active',
    },
    {
      id: 'AC-1100',
      code: '1100',
      name: 'Accounts Receivable',
      type: 'Asset',
      group: 'Current Assets',
      control: 'Receivables',
      status: 'Active',
    },
    {
      id: 'AC-1200',
      code: '1200',
      name: 'Inventory',
      type: 'Asset',
      group: 'Current Assets',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-1500',
      code: '1500',
      name: 'Equipment',
      type: 'Asset',
      group: 'Fixed Assets',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-2000',
      code: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      group: 'Current Liabilities',
      control: 'Payables',
      status: 'Active',
    },
    {
      id: 'AC-2100',
      code: '2100',
      name: 'Tax Payable',
      type: 'Liability',
      group: 'Current Liabilities',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-2300',
      code: '2300',
      name: 'Payroll Payable',
      type: 'Liability',
      group: 'Current Liabilities',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-3000',
      code: '3000',
      name: 'Retained Earnings',
      type: 'Equity',
      group: 'Equity',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-3100',
      code: '3100',
      name: 'Owner Capital',
      type: 'Equity',
      group: 'Equity',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-4000',
      code: '4000',
      name: 'Product Sales',
      type: 'Revenue',
      group: 'Operating Revenue',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-4100',
      code: '4100',
      name: 'Service & Other Income',
      type: 'Revenue',
      group: 'Other Income',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-5000',
      code: '5000',
      name: 'Cost of Goods Sold',
      type: 'Expense',
      group: 'Cost of Sales',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-5100',
      code: '5100',
      name: 'Salaries & Wages',
      type: 'Expense',
      group: 'Operating Expense',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-5200',
      code: '5200',
      name: 'Rent & Utilities',
      type: 'Expense',
      group: 'Operating Expense',
      control: '',
      status: 'Active',
    },
    {
      id: 'AC-5300',
      code: '5300',
      name: 'Bank Charges',
      type: 'Expense',
      group: 'Operating Expense',
      control: '',
      status: 'Active',
    },
  ]
  const currentMonth = monthKey()
  const postedEntries = [
    {
      id: 'JE-OPEN-2026',
      number: 'JE-2026-0001',
      date: `${currentMonth}-01`,
      reference: 'OPEN-2026',
      description: 'Opening balances · brought forward',
      status: 'Posted',
      source: 'Opening',
      lines: [
        ['AC-1000', 1000000, 0],
        ['AC-1010', 4000000, 0],
        ['AC-1100', 1200000, 0],
        ['AC-1200', 2500000, 0],
        ['AC-2000', 0, 850000],
        ['AC-3100', 0, 7850000],
      ].map(([accountId, debit, credit]) => ({
        accountId,
        debit,
        credit,
        memo: 'Opening balance',
        cleared: false,
      })),
    },
    {
      id: 'JE-SALES-2026',
      number: 'JE-2026-0002',
      date: `${currentMonth}-03`,
      reference: 'INV-OPEN-01',
      description: 'Monthly product sales',
      status: 'Posted',
      source: 'Sales',
      lines: [
        { accountId: 'AC-1100', debit: 650000, credit: 0, memo: 'Credit sales' },
        { accountId: 'AC-4000', debit: 0, credit: 650000, memo: 'Product revenue' },
        { accountId: 'AC-5000', debit: 310000, credit: 0, memo: 'Cost of sold inventory' },
        { accountId: 'AC-1200', debit: 0, credit: 310000, memo: 'Inventory issued' },
      ],
    },
    {
      id: 'JE-EXP-2026',
      number: 'JE-2026-0003',
      date: `${currentMonth}-05`,
      reference: 'EXP-OPEN-01',
      description: 'Monthly payroll and occupancy costs',
      status: 'Posted',
      source: 'Expense',
      lines: [
        { accountId: 'AC-5100', debit: 185000, credit: 0, memo: 'Monthly wages' },
        { accountId: 'AC-5200', debit: 72000, credit: 0, memo: 'Rent and utilities' },
        { accountId: 'AC-1010', debit: 0, credit: 257000, memo: 'Bank payment' },
      ],
    },
  ]
  const invoices = [
    {
      id: 'INV-2026-0162',
      customer: 'Green Valley Traders',
      date: `${currentMonth}-03`,
      dueDate: `${currentMonth}-18`,
      total: 650000,
      allocated: 0,
      status: 'Outstanding',
    },
    {
      id: 'INV-2026-0142',
      customer: 'Green Valley Traders',
      date: '2026-10-10',
      dueDate: '2026-10-25',
      total: 420000,
      allocated: 0,
      status: 'Outstanding',
    },
    {
      id: 'INV-2026-0153',
      customer: 'Agri Supply House',
      date: '2026-10-18',
      dueDate: '2026-11-02',
      total: 350000,
      allocated: 0,
      status: 'Outstanding',
    },
    {
      id: 'INV-2026-0161',
      customer: 'Punjab Crop Care',
      date: '2026-10-26',
      dueDate: '2026-11-10',
      total: 430000,
      allocated: 0,
      status: 'Outstanding',
    },
  ]
  const bills = [
    {
      id: 'BILL-2026-0088',
      supplier: 'AgroChem Supplies Ltd',
      date: '2026-10-13',
      dueDate: '2026-10-28',
      total: 320000,
      paid: 0,
      status: 'Outstanding',
    },
    {
      id: 'BILL-2026-0093',
      supplier: 'Pak Packaging Industries',
      date: '2026-10-20',
      dueDate: '2026-11-04',
      total: 285000,
      paid: 0,
      status: 'Outstanding',
    },
    {
      id: 'BILL-2026-0101',
      supplier: 'Farm Inputs Trading',
      date: '2026-10-29',
      dueDate: '2026-11-13',
      total: 245000,
      paid: 0,
      status: 'Outstanding',
    },
  ]
  return {
    accounts,
    masterHistory: [],
    entries: postedEntries,
    invoices,
    bills,
    receipts: [],
    payments: [],
    reconciliations: [],
    customers: [...new Set(invoices.map((item) => item.customer))],
    suppliers: [...new Set(bills.map((item) => item.supplier))],
    nextJournalNumber: 4,
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
    console.error('Unable to load finance data:', error)
    return defaults
  }
}
function FinanceModule({ page, onNotify, onNavigate }) {
  const [data, setData] = useState(loadData)
  const dataRef = useRef(data)
  const [search, setSearch] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [editingAccountId, setEditingAccountId] = useState('')
  const updateData = (updater, message) => {
    const next =
      typeof updater === 'function' ? updater(dataRef.current) : { ...dataRef.current, ...updater }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      dataRef.current = next
      setData(next)
      if (message) onNotify(message)
      return true
    } catch (error) {
      console.error('Unable to save finance data:', error)
      onNotify('Finance changes could not be saved. Check available browser storage and try again.')
      return false
    }
  }
  const createJournal = (values, status = 'Draft', navigate = true) => {
    const debit = values.lines.reduce((sum, line) => sum + Number(line.debit || 0), 0)
    const credit = values.lines.reduce((sum, line) => sum + Number(line.credit || 0), 0)
    if (
      values.lines.length < 2 ||
      values.lines.some(
        (line) => !line.accountId || Number(line.debit) > 0 === Number(line.credit) > 0,
      )
    ) {
      onNotify(
        'Add at least two valid journal lines. Each line must contain a debit or a credit, not both.',
      )
      return false
    }
    if (
      values.lines.some(
        (line) =>
          !dataRef.current.accounts.some(
            (account) => account.id === line.accountId && account.status === 'Active',
          ),
      )
    ) {
      onNotify('Journal lines must use active ledger accounts.')
      return false
    }
    if (Math.abs(debit - credit) > 0.005) {
      onNotify(
        `Journal is out of balance by ${money(Math.abs(debit - credit))}. Debits and credits must match.`,
      )
      return false
    }
    const number = `JE-${new Date(values.date).getFullYear()}-${String(data.nextJournalNumber).padStart(4, '0')}`
    const entry = {
      ...values,
      id: newId('JE'),
      number,
      status,
      source: values.source || 'Manual',
      lines: values.lines.map((line) => ({
        ...line,
        debit: Number(line.debit) || 0,
        credit: Number(line.credit) || 0,
        cleared: false,
      })),
      ...(status === 'Posted' ? { postedAt: today() } : {}),
    }
    const saved = updateData(
      (current) => ({
        ...current,
        nextJournalNumber: current.nextJournalNumber + 1,
        entries: [entry, ...current.entries],
      }),
      status === 'Posted' ? `${number} posted to the ledger` : `${number} saved as a draft`,
    )
    if (saved && status === 'Posted' && navigate) onNavigate('Posted Entries')
    return saved
  }
  const postJournal = (id) => {
    const entry = data.entries.find((item) => item.id === id)
    if (!entry || entry.status !== 'Draft') return
    if (
      entry.lines.some(
        (line) =>
          !dataRef.current.accounts.some(
            (account) => account.id === line.accountId && account.status === 'Active',
          ),
      )
    )
      return onNotify('Reactivate every ledger account used by this draft before posting.')
    updateData(
      (current) => ({
        ...current,
        entries: current.entries.map((item) =>
          item.id === id ? { ...item, status: 'Posted', postedAt: today() } : item,
        ),
      }),
      `${entry.number} posted successfully`,
    )
  }
  const reverseJournal = (id, reason) => {
    const source = data.entries.find((item) => item.id === id)
    if (
      !source ||
      source.status !== 'Posted' ||
      data.entries.some((item) => item.reversalOf === id)
    )
      return onNotify('This entry cannot be reversed.')
    const lines = source.lines.map((line) => ({
      accountId: line.accountId,
      debit: line.credit,
      credit: line.debit,
      memo: `Reversal · ${line.memo || source.description}`,
      cleared: false,
    }))
    const number = `JE-${new Date().getFullYear()}-${String(data.nextJournalNumber).padStart(4, '0')}`
    updateData(
      (current) => ({
        ...current,
        nextJournalNumber: current.nextJournalNumber + 1,
        entries: [
          {
            id: newId('JE'),
            number,
            date: today(),
            reference: source.number,
            description: `Reversal: ${reason.trim()}`,
            status: 'Posted',
            source: 'Reversal',
            reversalOf: id,
            postedAt: today(),
            lines,
          },
          ...current.entries,
        ],
      }),
      `${source.number} reversed with ${number}`,
    )
  }
  const createAccount = (values) => {
    if (
      data.accounts.some(
        (item) =>
          item.code === values.code.trim() ||
          item.name.toLowerCase() === values.name.trim().toLowerCase(),
      )
    )
      return onNotify('Account code and name must be unique.')
    const account = {
      ...values,
      id: newId('AC'),
      code: values.code.trim(),
      name: values.name.trim(),
      status: 'Active',
    }
    if (
      updateData(
        (current) => ({
          ...current,
          masterHistory: [
            {
              id: newId('AMH'),
              date: today(),
              entityType: 'Account',
              entityName: `${account.code} · ${account.name}`,
              action: 'Created',
              details: 'Ledger account created.',
            },
            ...(current.masterHistory || []),
          ],
          accounts: [...current.accounts, account].sort((a, b) => a.code.localeCompare(b.code)),
        }),
        'Ledger account created',
      )
    ) {
      setSelectedAccountId(account.id)
      onNavigate('Account Details')
    }
  }
  const saveAccount = (accountId, values) => {
    const existing = dataRef.current.accounts.find((item) => item.id === accountId)
    if (!existing) return onNotify('Ledger account record not found.')
    const code = values.code.trim()
    const name = values.name.trim()
    if (!/^\d{3,8}$/.test(code)) return onNotify('Account code must contain 3 to 8 digits.')
    if (
      dataRef.current.accounts.some(
        (item) =>
          item.id !== accountId &&
          (item.code === code || item.name.toLowerCase() === name.toLowerCase()),
      )
    )
      return onNotify('Account code and name must be unique.')
    const postedReference = dataRef.current.entries.some(
      (entry) =>
        entry.status === 'Posted' && entry.lines.some((line) => line.accountId === accountId),
    )
    if (
      postedReference &&
      (code !== existing.code ||
        values.type !== existing.type ||
        values.group !== existing.group ||
        values.control !== existing.control)
    )
      return onNotify(
        'Code and classification cannot change after the account is used in a posted journal.',
      )
    return updateData(
      (current) => ({
        ...current,
        accounts: current.accounts
          .map((item) =>
            item.id === accountId
              ? { ...item, ...values, code, name, status: item.status || 'Active' }
              : item,
          )
          .sort((a, b) => a.code.localeCompare(b.code)),
        masterHistory: [
          {
            id: newId('AMH'),
            date: today(),
            entityType: 'Account',
            entityName: `${existing.code} · ${existing.name}`,
            action: 'Updated',
            details: 'Account details updated; ledger identity and posted history retained.',
          },
          ...(current.masterHistory || []),
        ],
      }),
      'Ledger account changes saved',
    )
  }
  const toggleAccountStatus = (accountId) => {
    const account = dataRef.current.accounts.find((item) => item.id === accountId)
    if (!account) return onNotify('Ledger account record not found.')
    const currentStatus = account.status || 'Active'
    const status = currentStatus === 'Active' ? 'Inactive' : 'Active'
    const referenced = dataRef.current.entries.some((entry) =>
      entry.lines.some((line) => line.accountId === accountId),
    )
    if (status === 'Inactive' && referenced)
      return onNotify('An account referenced by a journal cannot be deactivated.')
    return updateData(
      (current) => ({
        ...current,
        accounts: current.accounts.map((item) =>
          item.id === accountId ? { ...item, status } : item,
        ),
        masterHistory: [
          {
            id: newId('AMH'),
            date: today(),
            entityType: 'Account',
            entityName: `${account.code} · ${account.name}`,
            action: status === 'Active' ? 'Reactivated' : 'Deactivated',
            details: `Status changed from ${currentStatus} to ${status}.`,
          },
          ...(current.masterHistory || []),
        ],
      }),
      `Ledger account ${status.toLowerCase()}`,
    )
  }
  const createBill = (values) => {
    const bill = {
      ...values,
      id: newId('BILL'),
      total: Number(values.total),
      paid: 0,
      status: 'Outstanding',
    }
    const entry = createJournal(
      {
        date: values.date,
        reference: bill.id,
        description: `Supplier bill · ${values.supplier}`,
        source: 'Supplier Bill',
        lines: [
          {
            accountId: values.expenseAccountId,
            debit: bill.total,
            credit: 0,
            memo: `Bill ${bill.id}`,
          },
          { accountId: 'AC-2000', debit: 0, credit: bill.total, memo: values.supplier },
        ],
      },
      'Posted',
      false,
    )
    if (!entry) return
    updateData(
      (current) => ({
        ...current,
        bills: [bill, ...current.bills],
        suppliers: [...new Set([...current.suppliers, bill.supplier])],
      }),
      `${bill.id} posted to Accounts Payable`,
    )
  }
  const createInvoice = (values) => {
    const invoice = {
      ...values,
      id: newId('INV'),
      total: Number(values.total),
      allocated: 0,
      status: 'Outstanding',
    }
    const entry = createJournal(
      {
        date: values.date,
        reference: invoice.id,
        description: `Customer invoice · ${invoice.customer}`,
        source: 'Customer Invoice',
        lines: [
          { accountId: 'AC-1100', debit: invoice.total, credit: 0, memo: invoice.id },
          {
            accountId: values.revenueAccountId,
            debit: 0,
            credit: invoice.total,
            memo: invoice.customer,
          },
        ],
      },
      'Posted',
      false,
    )
    if (!entry) return
    updateData(
      (current) => ({
        ...current,
        invoices: [invoice, ...current.invoices],
        customers: [...new Set([...current.customers, invoice.customer])],
      }),
      `${invoice.id} posted to Accounts Receivable`,
    )
  }
  const receivePayment = (values) => {
    const invoice = data.invoices.find((item) => item.id === values.invoiceId)
    const amount = Number(values.amount)
    if (!invoice || amount <= 0 || amount > invoice.total - invoice.allocated)
      return onNotify('Payment amount must not exceed the invoice balance.')
    const receipt = {
      ...values,
      id: newId('RCPT'),
      amount,
      allocated: amount,
      status: 'Allocated',
      date: values.date,
    }
    const entry = createJournal(
      {
        date: values.date,
        reference: receipt.id,
        description: `Customer receipt · ${invoice.customer}`,
        source: 'Receipt',
        lines: [
          { accountId: values.accountId, debit: amount, credit: 0, memo: `Receipt ${receipt.id}` },
          { accountId: 'AC-1100', debit: 0, credit: amount, memo: invoice.id },
        ],
      },
      'Posted',
      false,
    )
    if (!entry) return
    updateData(
      (current) => ({
        ...current,
        receipts: [receipt, ...current.receipts],
        invoices: current.invoices.map((item) =>
          item.id === invoice.id
            ? {
                ...item,
                allocated: item.allocated + amount,
                status: item.allocated + amount >= item.total ? 'Paid' : 'Part-paid',
              }
            : item,
        ),
        customers: [...new Set([...current.customers, invoice.customer])],
      }),
      `Receipt ${receipt.id} posted and allocated`,
    )
  }
  const allocateReceipt = (receiptId, invoiceId, amount) => {
    const receipt = data.receipts.find((item) => item.id === receiptId)
    const invoice = data.invoices.find((item) => item.id === invoiceId)
    const value = Number(amount)
    if (
      !receipt ||
      !invoice ||
      value <= 0 ||
      value > receipt.amount - receipt.allocated ||
      value > invoice.total - invoice.allocated
    )
      return onNotify('Allocation must fit both the unallocated receipt and invoice balance.')
    updateData(
      (current) => ({
        ...current,
        receipts: current.receipts.map((item) =>
          item.id === receiptId
            ? {
                ...item,
                allocated: item.allocated + value,
                status: item.allocated + value >= item.amount ? 'Allocated' : 'Part-allocated',
              }
            : item,
        ),
        invoices: current.invoices.map((item) =>
          item.id === invoiceId
            ? {
                ...item,
                allocated: item.allocated + value,
                status: item.allocated + value >= item.total ? 'Paid' : 'Part-paid',
              }
            : item,
        ),
      }),
      `${money(value)} allocated to ${invoice.id}`,
    )
  }
  const payBill = (values) => {
    const bill = data.bills.find((item) => item.id === values.billId)
    const amount = Number(values.amount)
    if (!bill || amount <= 0 || amount > bill.total - bill.paid)
      return onNotify('Payment must not exceed the supplier bill balance.')
    const payment = {
      ...values,
      id: newId('PAY'),
      amount,
      supplier: bill.supplier,
      status: 'Posted',
    }
    const entry = createJournal(
      {
        date: values.date,
        reference: payment.id,
        description: `Supplier payment · ${bill.supplier}`,
        source: 'Supplier Payment',
        lines: [
          { accountId: 'AC-2000', debit: amount, credit: 0, memo: bill.id },
          { accountId: values.accountId, debit: 0, credit: amount, memo: payment.id },
        ],
      },
      'Posted',
    )
    if (!entry) return
    updateData(
      (current) => ({
        ...current,
        payments: [payment, ...current.payments],
        bills: current.bills.map((item) =>
          item.id === bill.id
            ? {
                ...item,
                paid: item.paid + amount,
                status: item.paid + amount >= item.total ? 'Paid' : 'Part-paid',
              }
            : item,
        ),
      }),
      `Payment ${payment.id} posted to the ledger`,
    )
  }
  const recordCashTransaction = (values, direction) => {
    const amount = Number(values.amount)
    if (amount <= 0) return onNotify('Transaction amount must be greater than zero.')
    const incoming = direction === 'Receipt'
    const transaction = {
      ...values,
      id: newId(incoming ? 'RCPT' : 'PAY'),
      amount,
      status: 'Posted',
    }
    const lines = incoming
      ? [
          { accountId: values.cashAccountId, debit: amount, credit: 0, memo: values.description },
          {
            accountId: values.offsetAccountId,
            debit: 0,
            credit: amount,
            memo: values.counterparty,
          },
        ]
      : [
          { accountId: values.offsetAccountId, debit: amount, credit: 0, memo: values.description },
          { accountId: values.cashAccountId, debit: 0, credit: amount, memo: values.counterparty },
        ]
    const saved = createJournal(
      {
        date: values.date,
        reference: transaction.id,
        description: `${incoming ? 'Cash receipt' : 'Cash payment'} · ${values.counterparty}`,
        source: direction,
        lines,
      },
      'Posted',
      false,
    )
    if (!saved) return
    updateData(
      (current) =>
        incoming
          ? {
              ...current,
              receipts: [
                {
                  ...transaction,
                  allocated: 0,
                  customer: values.counterparty,
                  accountId: values.cashAccountId,
                  offsetAccountId: values.offsetAccountId,
                  status: 'Unallocated',
                },
                ...current.receipts,
              ],
              customers: [...new Set([...current.customers, values.counterparty])],
            }
          : {
              ...current,
              payments: [
                {
                  ...transaction,
                  supplier: values.counterparty,
                  accountId: values.cashAccountId,
                  offsetAccountId: values.offsetAccountId,
                },
                ...current.payments,
              ],
            },
      `${transaction.id} posted to the ledger`,
    )
  }
  const createReconciliation = (values) => {
    const statement = Number(values.statementBalance)
    const book = accountNet(data, values.accountId, `${values.periodId}-31`)
    const ledgerLines = data.entries
      .filter((entry) => entry.status === 'Posted' && entry.date.slice(0, 7) === values.periodId)
      .flatMap((entry) => entry.lines.map((line, index) => ({ ...line, entry, lineIndex: index })))
      .filter((line) => line.accountId === values.accountId)
    const selected = new Set(values.matchedKeys || [])
    const matched = ledgerLines.filter((line) => selected.has(`${line.entry.id}:${line.lineIndex}`))
    const uncleared = ledgerLines.filter((line) => !line.cleared)
    const allMatched = uncleared.every((line) => selected.has(`${line.entry.id}:${line.lineIndex}`))
    const difference = statement - book
    const status = values.finalize
      ? Math.abs(difference) < 0.01 && allMatched
        ? 'Reconciled'
        : 'In Progress'
      : 'In Progress'
    const reconcile = {
      id: values.resumeId || newId('REC'),
      accountId: values.accountId,
      periodId: values.periodId,
      statementBalance: statement,
      bookBalance: book,
      difference,
      matched: matched.length,
      status,
      date: today(),
      matchedKeys: [...selected],
    }
    if (values.finalize && (Math.abs(difference) > 0.01 || !allMatched)) {
      onNotify(
        'The reconciliation is still out of balance or has unmatched ledger lines. Continue matching before completing it.',
      )
      return false
    }
    const didSave = updateData(
      (current) => ({
        ...current,
        entries:
          status === 'Reconciled'
            ? current.entries.map((entry) =>
                entry.status !== 'Posted'
                  ? entry
                  : {
                      ...entry,
                      lines: entry.lines.map((line, index) =>
                        selected.has(`${entry.id}:${index}`) ? { ...line, cleared: true } : line,
                      ),
                    },
              )
            : current.entries,
        reconciliations: current.reconciliations.some((item) => item.id === reconcile.id)
          ? current.reconciliations.map((item) =>
              item.id === reconcile.id ? { ...item, ...reconcile } : item,
            )
          : [reconcile, ...current.reconciliations],
      }),
      status === 'Reconciled'
        ? 'Bank reconciliation completed'
        : `Reconciliation saved with a ${money(Math.abs(reconcile.difference))} difference`,
    )
    return didSave ? reconcile.id : false
  }
  const editingAccount = data.accounts.find((item) => item.id === editingAccountId)
  const accountClassificationLocked = Boolean(
    editingAccount &&
    data.entries.some(
      (entry) =>
        entry.status === 'Posted' &&
        entry.lines.some((line) => line.accountId === editingAccount.id),
    ),
  )
  const props = {
    data,
    search,
    setSearch,
    selectedAccountId,
    setSelectedAccountId,
    updateData,
    createJournal,
    postJournal,
    reverseJournal,
    createAccount,
    saveAccount,
    editingAccount,
    setEditingAccountId,
    accountClassificationLocked,
    editAccount: (accountId) => {
      setEditingAccountId(accountId)
      onNavigate('Create Ledger Account')
    },
    toggleAccountStatus,
    createBill,
    createInvoice,
    receivePayment,
    allocateReceipt,
    payBill,
    recordCashTransaction,
    createReconciliation,
    onNotify,
    onNavigate,
  }
  const pageComponents = {
    'Finance Dashboard': <FinanceDashboard {...props} />,
    'Account Groups': <AccountGroupsPage {...props} />,
    'Create Ledger Account': (
      <AccountFormPage key={editingAccount?.id || 'new-account'} {...props} />
    ),
    'Account Directory': <AccountDirectoryPage {...props} />,
    'Account Details': <AccountDetailsPage {...props} />,
    'Create Journal Entry': <JournalFormPage {...props} />,
    'Draft Entries': (
      <DraftEntriesPage {...props} title="Draft Entries" statuses={['Draft']} action="Post" />
    ),
    'Posted Entries': <PostedEntriesPage {...props} title="Posted Entries" statuses={['Posted']} />,
    Reversals: <ReversalsPage {...props} />,
    'Journal Report': <JournalReportPage {...props} />,
    'Cash Accounts': <CashAccountsPage {...props} control="Cash" title="Cash Accounts" />,
    'Cash Receipts': <CashReceiptsPage {...props} control="Cash" direction="Receipt" />,
    'Cash Payments': <CashPaymentsPage {...props} control="Cash" direction="Payment" />,
    'Bank Accounts': <BankAccountsPage {...props} control="Bank" title="Bank Accounts" />,
    'Bank Transactions': <BankTransactionsPage {...props} />,
    'Bank Reconciliation': <BankReconciliationPage {...props} />,
    'Customer Balances': <CustomerBalancesPage {...props} />,
    'Outstanding Invoices': <OutstandingInvoicesPage {...props} />,
    'Receive Payment': <ReceivePaymentPage {...props} />,
    'Payment Allocation': <PaymentAllocationPage {...props} />,
    'Aging Report': <AgingReportPage {...props} receivable />,
    'Supplier Balances': <SupplierBalancesPage {...props} />,
    'Supplier Bills': <SupplierBillsPage {...props} />,
    'Make Payment': <MakePaymentPage {...props} />,
    'Outstanding Payables': <OutstandingPayablesPage {...props} />,
    'Payable Aging': <PayableAgingPage {...props} />,
    'General Ledger': <GeneralLedgerPage {...props} />,
    'Trial Balance': <TrialBalancePage {...props} />,
    'Profit & Loss': <ProfitAndLossPage {...props} statement="Profit & Loss" />,
    'Balance Sheet': <BalanceSheetPage {...props} statement="Balance Sheet" />,
    'Cash Flow': <CashFlowPage {...props} />,
    'Tax Reports': <TaxReportsPage {...props} />,
  }
  const content = pageComponents[page] || <TaxReportsPage {...props} />
  return <div className="finance-module">{content}</div>
}

export default FinanceModule
