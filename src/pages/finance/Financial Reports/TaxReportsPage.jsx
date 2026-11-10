import { useState } from 'react'
import {
  today,
  money,
  dateLabel,
  postedLines,
  accountNet,
  PageHeader,
  Stat,
  Card,
  Table,
  Field,
  Empty,
  sum,
  ExportAction,
  BookOpen,
  ListChecks,
  Receipt,
  ShieldCheck,
  TrendingUp,
} from '../financeShared'

function TaxReportsPage({ data, onNotify }) {
  const [startDate, setStartDate] = useState(`${new Date().getFullYear()}-01-01`)
  const [endDate, setEndDate] = useState(today())
  const taxAccount = data.accounts.find((item) => item.code === '2100')
  const taxBalance = taxAccount ? accountNet(data, taxAccount.id, endDate) : 0
  const salesAccounts = data.accounts.filter((item) => item.type === 'Revenue')
  const taxableSales = sum(salesAccounts, (account) =>
    postedLines(data, account.id)
      .filter((line) => line.entry.date >= startDate && line.entry.date <= endDate)
      .reduce((total, line) => total + Number(line.credit) - Number(line.debit), 0),
  )
  const taxLines = postedLines(data, taxAccount?.id).filter(
    (line) => line.entry.date >= startDate && line.entry.date <= endDate,
  )
  const exportRows = [
    ['Tax ledger transaction', 'Date', 'Journal', 'Description', 'Debit', 'Credit'],
    ...taxLines.map((line) => [
      line.entry.reference,
      line.entry.date,
      line.entry.number,
      line.entry.description,
      line.debit,
      line.credit,
    ]),
  ]
  return (
    <>
      <PageHeader
        title="Tax Reports"
        subtitle="Review taxable sales activity and posted tax-control balances for the selected period."
        icon={Receipt}
        action={
          <ExportAction filename="tax-ledger-report.csv" rows={exportRows} onNotify={onNotify} />
        }
      />
      <div className="fa-toolbar standalone">
        <Field label="From">
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </Field>
        <Field label="To">
          <input
            type="date"
            min={startDate}
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </Field>
      </div>
      <div className="fa-stats compact">
        <Stat
          icon={TrendingUp}
          label="Revenue ledger activity"
          value={money(taxableSales)}
          tone="green"
          hint="Posted revenue accounts"
        />
        <Stat
          icon={Receipt}
          label="Tax payable balance"
          value={money(taxBalance)}
          tone="amber"
          hint="As of reporting date"
        />
        <Stat icon={ListChecks} label="Tax-account entries" value={taxLines.length} tone="blue" />
      </div>
      <div className="fa-warning">
        <ShieldCheck size={18} />
        <span>
          <b>Ledger-based management report.</b> This summary does not calculate statutory tax or
          replace a tax filing. Review tax codes, jurisdiction rules, and source documents before
          filing.
        </span>
      </div>
      <Card title={`Tax payable ledger activity · ${taxLines.length}`} icon={BookOpen}>
        <Table
          headers={[
            'Date',
            'Journal',
            'Description',
            'Reference',
            'Debit',
            'Credit',
            'Running balance',
          ]}
        >
          {taxLines.map((line, index) => (
            <tr key={`${line.entry.id}-${index}`}>
              <td>{dateLabel(line.entry.date)}</td>
              <td>{line.entry.number}</td>
              <td>{line.entry.description}</td>
              <td>{line.entry.reference || '—'}</td>
              <td>{line.debit ? money(line.debit) : '—'}</td>
              <td>{line.credit ? money(line.credit) : '—'}</td>
              <td>{money(accountNet(data, taxAccount.id, line.entry.date))}</td>
            </tr>
          ))}
        </Table>
        {!taxLines.length && <Empty>No tax-control postings exist for this date range.</Empty>}
      </Card>
    </>
  )
}

export default TaxReportsPage
