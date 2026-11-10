import { useState } from 'react'
import {
  today,
  money,
  dateLabel,
  accountById,
  postedLines,
  accountNet,
  PageHeader,
  Stat,
  Card,
  Table,
  Field,
  Empty,
  Toolbar,
  ExportAction,
  ArrowDownLeft,
  BookOpen,
  CircleDollarSign,
  ListChecks,
  TrendingUp,
} from '../financeShared'

function GeneralLedgerPage({ data, search, setSearch, onNotify }) {
  const [accountId, setAccountId] = useState(data.accounts[0]?.id || '')
  const [startDate, setStartDate] = useState(`${new Date().getFullYear()}-01-01`)
  const [endDate, setEndDate] = useState(today())
  const account = accountById(data, accountId)
  const matches = postedLines(data, accountId).filter(
    (line) =>
      line.entry.date >= startDate &&
      line.entry.date <= endDate &&
      `${line.entry.number} ${line.entry.description} ${line.memo} ${line.entry.reference}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )
  const opening = accountNet(
    data,
    accountId,
    startDate
      ? new Date(new Date(`${startDate}T00:00:00`).getTime() - 86400000).toISOString().slice(0, 10)
      : '0000-00-00',
  )
  let running = opening
  const rows = [...matches]
    .sort((a, b) => a.entry.date.localeCompare(b.entry.date))
    .map((line, index) => {
      const change =
        account?.type === 'Asset' || account?.type === 'Expense'
          ? Number(line.debit) - Number(line.credit)
          : Number(line.credit) - Number(line.debit)
      running += change
      return { ...line, running, index }
    })
  const visibleRows = [...rows].reverse()
  const exportRows = [
    ['Date', 'Account', 'Journal', 'Description', 'Reference', 'Debit', 'Credit', 'Balance'],
    ...rows.map((line) => [
      line.entry.date,
      `${account.code} ${account.name}`,
      line.entry.number,
      line.memo || line.entry.description,
      line.entry.reference,
      line.debit,
      line.credit,
      line.running,
    ]),
  ]
  return (
    <>
      <PageHeader
        title="General Ledger"
        subtitle="Inspect posted account activity with opening and running balances."
        icon={BookOpen}
        action={
          <ExportAction filename="general-ledger.csv" rows={exportRows} onNotify={onNotify} />
        }
      />
      <div className="fa-toolbar standalone">
        <Field label="Ledger account">
          <select value={accountId} onChange={(event) => setAccountId(event.target.value)}>
            {data.accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        </Field>
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
        <Toolbar query={search} setQuery={setSearch} placeholder="Filter journal or memo" />
      </div>
      <div className="fa-stats compact">
        <Stat icon={BookOpen} label="Account" value={account?.code || '—'} hint={account?.name} />
        <Stat icon={ArrowDownLeft} label="Opening balance" value={money(opening)} />
        <Stat
          icon={TrendingUp}
          label="Period movement"
          value={money(running - opening)}
          tone="blue"
        />
        <Stat icon={CircleDollarSign} label="Closing balance" value={money(running)} tone="green" />
      </div>
      <Card title={`Ledger activity · ${visibleRows.length} line(s)`} icon={ListChecks}>
        <Table
          headers={[
            'Date',
            'Journal',
            'Description / memo',
            'Reference',
            'Debit',
            'Credit',
            'Running balance',
          ]}
        >
          {visibleRows.map((line) => (
            <tr key={`${line.entry.id}-${line.index}`}>
              <td>{dateLabel(line.entry.date)}</td>
              <td>
                <b>{line.entry.number}</b>
              </td>
              <td>{line.memo || line.entry.description}</td>
              <td>{line.entry.reference || '—'}</td>
              <td>{line.debit ? money(line.debit) : '—'}</td>
              <td>{line.credit ? money(line.credit) : '—'}</td>
              <td>
                <b>{money(line.running)}</b>
              </td>
            </tr>
          ))}
        </Table>
        {!visibleRows.length && <Empty>No ledger activity within the selected period.</Empty>}
      </Card>
    </>
  )
}

export default GeneralLedgerPage
