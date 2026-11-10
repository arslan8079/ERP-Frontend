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
  Field,
  sum,
  ExportAction,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Landmark,
  TrendingDown,
  TrendingUp,
  Wallet,
} from '../financeShared'

function ProfitAndLossPage({ data, statement, onNotify }) {
  const [asOf, setAsOf] = useState(today())
  const yearStart = `${asOf.slice(0, 4)}-01-01`
  const isBalanceSheet = statement === 'Balance Sheet'
  const balances = data.accounts.map((account) => {
    const amount = accountNet(data, account.id, asOf)
    const activity = isBalanceSheet
      ? amount
      : postedLines(data, account.id)
          .filter((line) => line.entry.date >= yearStart && line.entry.date <= asOf)
          .reduce(
            (sum, line) =>
              sum +
              (account.type === 'Revenue'
                ? Number(line.credit) - Number(line.debit)
                : Number(line.debit) - Number(line.credit)),
            0,
          )
    return { ...account, amount: activity }
  })
  const revenue = balances.filter((item) => item.type === 'Revenue')
  const expenses = balances.filter((item) => item.type === 'Expense')
  const assets = balances.filter((item) => item.type === 'Asset')
  const liabilities = balances.filter((item) => item.type === 'Liability')
  const equity = balances.filter((item) => item.type === 'Equity')
  const revenueTotal = sum(revenue, (item) => item.amount)
  const expenseTotal = sum(expenses, (item) => item.amount)
  const netIncome = revenueTotal - expenseTotal
  const reportRows = isBalanceSheet
    ? [
        ['ASSETS', '', ''],
        ...assets.map((item) => [item.code, item.name, item.amount]),
        ['Total assets', '', sum(assets, (item) => item.amount)],
        ['LIABILITIES', '', ''],
        ...liabilities.map((item) => [item.code, item.name, item.amount]),
        ['Total liabilities', '', sum(liabilities, (item) => item.amount)],
        ['EQUITY', '', ''],
        ...equity.map((item) => [item.code, item.name, item.amount]),
        ['Current year earnings', '', netIncome],
        ['Total equity and earnings', '', sum(equity, (item) => item.amount) + netIncome],
      ]
    : [
        ['REVENUE', '', ''],
        ...revenue.map((item) => [item.code, item.name, item.amount]),
        ['Total revenue', '', revenueTotal],
        ['EXPENSES', '', ''],
        ...expenses.map((item) => [item.code, item.name, item.amount]),
        ['Total expenses', '', expenseTotal],
        ['Net income', '', netIncome],
      ]
  const section = (title, items, total, positive = true) => (
    <div className="fa-statement-section">
      <h3>{title}</h3>
      {items.map((item) => (
        <div className="fa-statement-row" key={item.id}>
          <span>
            {item.code} · {item.name}
          </span>
          <b>{money(item.amount)}</b>
        </div>
      ))}
      <div className="fa-statement-total">
        <span>Total {title.toLowerCase()}</span>
        <b>{money(total)}</b>
      </div>
    </div>
  )
  return (
    <>
      <PageHeader
        title={statement}
        subtitle={
          isBalanceSheet
            ? 'Snapshot of assets, liabilities, and equity at the selected reporting date.'
            : 'Year-to-date revenue, operating costs, and net result from posted ledger activity.'
        }
        icon={isBalanceSheet ? Landmark : TrendingUp}
        action={
          <ExportAction
            filename={`${statement.toLowerCase().replaceAll(' ', '-')}.csv`}
            rows={reportRows}
            onNotify={onNotify}
          />
        }
      />
      <div className="fa-toolbar standalone">
        <Field label="Reporting date">
          <input type="date" value={asOf} onChange={(event) => setAsOf(event.target.value)} />
        </Field>
        <span className="fa-period-hint">
          {isBalanceSheet
            ? 'Position as of this date'
            : `Year to date · ${dateLabel(yearStart)} to ${dateLabel(asOf)}`}
        </span>
      </div>
      {isBalanceSheet ? (
        <>
          <div className="fa-statement-grid">
            <Card title="Assets" icon={Wallet}>
              {section(
                'Assets',
                assets.filter((item) => item.amount),
                sum(assets, (item) => item.amount),
              )}
            </Card>
            <div>
              <Card title="Liabilities" icon={ArrowUpRight}>
                {section(
                  'Liabilities',
                  liabilities.filter((item) => item.amount),
                  sum(liabilities, (item) => item.amount),
                )}
              </Card>
              <Card title="Equity" icon={Building2}>
                {section(
                  'Equity',
                  equity.filter((item) => item.amount),
                  sum(equity, (item) => item.amount),
                )}
                <div className="fa-statement-row">
                  <span>Current year earnings</span>
                  <b>{money(netIncome)}</b>
                </div>
                <div className="fa-statement-total">
                  <span>Total equity and earnings</span>
                  <b>{money(sum(equity, (item) => item.amount) + netIncome)}</b>
                </div>
              </Card>
            </div>
          </div>
          <div className="fa-balance-check balanced">
            <span>
              <CheckCircle2 size={16} />
              Statement balances
            </span>
            <b>
              Assets {money(sum(assets, (item) => item.amount))} <i /> Liabilities + equity{' '}
              {money(
                sum(liabilities, (item) => item.amount) +
                  sum(equity, (item) => item.amount) +
                  netIncome,
              )}
            </b>
          </div>
        </>
      ) : (
        <>
          <div className="fa-stats compact">
            <Stat icon={TrendingUp} label="Revenue" value={money(revenueTotal)} tone="green" />
            <Stat icon={TrendingDown} label="Expenses" value={money(expenseTotal)} tone="amber" />
            <Stat
              icon={CircleDollarSign}
              label="Net income"
              value={money(netIncome)}
              tone={netIncome >= 0 ? 'blue' : 'red'}
            />
          </div>
          <div className="fa-statement-grid">
            <Card title="Income" icon={TrendingUp}>
              {section(
                'Revenue',
                revenue.filter((item) => item.amount),
                revenueTotal,
              )}
            </Card>
            <Card title="Operating expenses" icon={TrendingDown}>
              {section(
                'Expenses',
                expenses.filter((item) => item.amount),
                expenseTotal,
              )}
              <div className={`fa-statement-net ${netIncome >= 0 ? 'positive' : 'negative'}`}>
                <span>Net income</span>
                <b>{money(netIncome)}</b>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  )
}

export default ProfitAndLossPage
