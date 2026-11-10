import { useState } from 'react'
import {
  today,
  money,
  dateLabel,
  postedLines,
  PageHeader,
  Stat,
  Card,
  Table,
  Field,
  sum,
  ExportAction,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  ListChecks,
  ShieldCheck,
} from '../financeShared'

function TrialBalancePage({ data, onNotify }) {
  const [asOf, setAsOf] = useState(today())
  const rows = data.accounts
    .map((account) => {
      const raw = postedLines(data, account.id)
        .filter((item) => item.entry.date <= asOf)
        .reduce((sum, item) => sum + Number(item.debit) - Number(item.credit), 0)
      return { ...account, debit: Math.max(0, raw), credit: Math.max(0, -raw) }
    })
    .filter((item) => item.debit || item.credit)
  const debit = sum(rows, (item) => item.debit)
  const credit = sum(rows, (item) => item.credit)
  const isBalanced = Math.abs(debit - credit) < 0.01
  const reportRows = [
    ['Account code', 'Account name', 'Type', 'Debit', 'Credit'],
    ...rows.map((item) => [item.code, item.name, item.type, item.debit, item.credit]),
    ['TOTAL', '', '', debit, credit],
  ]
  return (
    <>
      <PageHeader
        title="Trial Balance"
        subtitle="Verify that total posted ledger debits equal credits at the reporting date."
        icon={ClipboardCheck}
        action={<ExportAction filename="trial-balance.csv" rows={reportRows} onNotify={onNotify} />}
      />
      <div className="fa-toolbar standalone">
        <Field label="Balance as of">
          <input type="date" value={asOf} onChange={(event) => setAsOf(event.target.value)} />
        </Field>
        <div className={`fa-balance-pill ${isBalanced ? 'balanced' : 'unbalanced'}`}>
          {isBalanced ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
          {isBalanced ? 'In balance' : `Out by ${money(Math.abs(debit - credit))}`}
        </div>
      </div>
      <div className="fa-stats compact">
        <Stat icon={ArrowDownLeft} label="Total debit balances" value={money(debit)} />
        <Stat icon={ArrowUpRight} label="Total credit balances" value={money(credit)} tone="blue" />
        <Stat icon={ListChecks} label="Accounts with balances" value={rows.length} tone="green" />
      </div>
      <Card title={`Trial balance · ${dateLabel(asOf)}`} icon={ListChecks}>
        <Table headers={['Code', 'Account', 'Type', 'Debit balance', 'Credit balance']}>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.code}</b>
              </td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.debit ? money(item.debit) : '—'}</td>
              <td>{item.credit ? money(item.credit) : '—'}</td>
            </tr>
          ))}
        </Table>
        <div className="fa-report-total">
          <b>Total</b>
          <b>{money(debit)}</b>
          <b>{money(credit)}</b>
        </div>
      </Card>
    </>
  )
}

export default TrialBalancePage
