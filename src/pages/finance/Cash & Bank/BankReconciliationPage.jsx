import { useState } from 'react'
import {
  monthKey,
  money,
  dateLabel,
  monthLabel,
  accountNet,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Field,
  Empty,
  accountName,
  Check,
  ClipboardCheck,
  FileClock,
  Landmark,
} from '../financeShared'

function BankReconciliationPage({ data, createReconciliation, onNotify }) {
  const banks = data.accounts.filter((item) => item.control === 'Bank')
  const [accountId, setAccountId] = useState(banks[0]?.id || '')
  const [periodId, setPeriodId] = useState(monthKey())
  const [statementBalance, setStatementBalance] = useState('')
  const entryLines = data.entries
    .filter((entry) => entry.status === 'Posted' && entry.date.slice(0, 7) === periodId)
    .flatMap((entry) => entry.lines.map((line, index) => ({ ...line, entry, index })))
    .filter((line) => line.accountId === accountId && !line.cleared)
  const formLines = data.entries
    .filter((entry) => entry.status === 'Posted' && entry.date.slice(0, 7) === periodId)
    .flatMap((entry) => entry.lines.map((line, index) => ({ ...line, entry, index })))
    .filter((line) => line.accountId === accountId)
  const [matchedKeys, setMatchedKeys] = useState([])
  const bookBalance = accountNet(data, accountId, `${periodId}-31`)
  const difference = Number(statementBalance || 0) - bookBalance
  const toggle = (key) =>
    setMatchedKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    )
  const submit = (event) => {
    event.preventDefault()
    if (!accountId || statementBalance === '' || !Number.isFinite(Number(statementBalance)))
      return onNotify('Choose a bank account and enter the statement closing balance.')
    createReconciliation({ accountId, periodId, statementBalance, matchedKeys })
    setMatchedKeys([])
  }
  return (
    <>
      <PageHeader
        title="Bank Reconciliation"
        subtitle="Match bank statement activity against posted ledger lines and resolve the closing balance difference."
        icon={ClipboardCheck}
      />
      <Card title="Statement reconciliation" icon={Landmark}>
        <form onSubmit={submit}>
          <div className="fa-form-grid">
            <Field label="Bank account">
              <select
                required
                value={accountId}
                onChange={(event) => {
                  setAccountId(event.target.value)
                  setMatchedKeys([])
                }}
              >
                {banks.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} · {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Statement month">
              <input
                type="month"
                required
                value={periodId}
                onChange={(event) => {
                  setPeriodId(event.target.value)
                  setMatchedKeys([])
                }}
              />
            </Field>
            <Field label="Statement closing balance (PKR)">
              <input
                type="number"
                step="0.01"
                required
                value={statementBalance}
                onChange={(event) => setStatementBalance(event.target.value)}
              />
            </Field>
            <div className="fa-reconcile-summary">
              <span>
                Book balance <b>{money(bookBalance)}</b>
              </span>
              <span
                className={
                  Math.abs(difference) < 0.01 && matchedKeys.length === entryLines.length
                    ? 'balanced'
                    : 'unbalanced'
                }
              >
                Difference <b>{money(difference)}</b>
              </span>
            </div>
          </div>
          <div className="fa-match-toolbar">
            <span>
              {matchedKeys.length} of {entryLines.length} new ledger lines matched
            </span>
            <button
              type="button"
              className="fa-link"
              onClick={() =>
                setMatchedKeys(entryLines.map((line) => `${line.entry.id}:${line.index}`))
              }
            >
              Match all listed <Check size={13} />
            </button>
          </div>
          <div className="fa-form-actions">
            <span>
              {entryLines.length} uncleared ledger line(s) in {monthLabel(periodId)}. Select
              statement-matched transactions.
            </span>
            <Button type="submit" disabled={!banks.length}>
              <Check size={15} />
              Save reconciliation
            </Button>
          </div>
        </form>
        <Table
          headers={['Match', 'Date', 'Journal', 'Description', 'Reference', 'Debit', 'Credit']}
        >
          {formLines.map((line) => {
            const key = `${line.entry.id}:${line.index}`
            const checked = Boolean(matchedKeys.includes(key) || line.cleared)
            return (
              <tr key={key}>
                <td>
                  <input
                    aria-label={`Match ${line.entry.number} ${line.memo || line.entry.description}`}
                    type="checkbox"
                    checked={checked}
                    disabled={line.cleared}
                    onChange={() => toggle(key)}
                  />
                </td>
                <td>{dateLabel(line.entry.date)}</td>
                <td>{line.entry.number}</td>
                <td>{line.memo || line.entry.description}</td>
                <td>{line.entry.reference || '—'}</td>
                <td>{line.debit ? money(line.debit) : '—'}</td>
                <td>{line.credit ? money(line.credit) : '—'}</td>
              </tr>
            )
          })}
        </Table>
        {!formLines.length && (
          <Empty>No posted ledger transactions for this bank and period.</Empty>
        )}
      </Card>
      <Card title={`Previous reconciliations · ${data.reconciliations.length}`} icon={FileClock}>
        <Table
          headers={[
            'Reference',
            'Bank account',
            'Period',
            'Statement balance',
            'Book balance',
            'Difference',
            'Status',
          ]}
        >
          {data.reconciliations.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>{accountName(data, item.accountId)}</td>
              <td>{monthLabel(item.periodId)}</td>
              <td>{money(item.statementBalance)}</td>
              <td>{money(item.bookBalance)}</td>
              <td>{money(item.difference)}</td>
              <td>
                <Status>{item.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!data.reconciliations.length && (
          <Empty>Completed reconciliations and unresolved differences will be listed here.</Empty>
        )}
      </Card>
    </>
  )
}

export default BankReconciliationPage
