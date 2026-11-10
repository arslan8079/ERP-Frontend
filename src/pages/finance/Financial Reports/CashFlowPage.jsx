import { useState } from 'react'
import {
  today,
  money,
  dateLabel,
  accountById,
  PageHeader,
  Card,
  Table,
  Field,
  Empty,
  sum,
  ExportAction,
  ArrowDownLeft,
  Building2,
  Landmark,
  ListChecks,
  Wallet,
} from '../financeShared'

function CashFlowPage({ data, onNotify }) {
  const [startDate, setStartDate] = useState(`${new Date().getFullYear()}-01-01`)
  const [endDate, setEndDate] = useState(today())
  const cashIds = new Set(
    data.accounts.filter((item) => ['Cash', 'Bank'].includes(item.control)).map((item) => item.id),
  )
  const entries = data.entries.filter(
    (item) =>
      item.status === 'Posted' &&
      item.source !== 'Opening' &&
      item.date >= startDate &&
      item.date <= endDate,
  )
  const movements = entries.flatMap((entry) => {
    const cashLines = entry.lines.filter((line) => cashIds.has(line.accountId))
    const counterpartTypes = entry.lines
      .filter((line) => !cashIds.has(line.accountId))
      .map((line) => accountById(data, line.accountId)?.type)
    const category = counterpartTypes.some((type) => type === 'Equity' || type === 'Liability')
      ? 'Financing'
      : counterpartTypes.some(
            (type) =>
              accountById(data, entry.lines.find((line) => !cashIds.has(line.accountId))?.accountId)
                ?.group === 'Fixed Assets',
          )
        ? 'Investing'
        : 'Operating'
    return cashLines.map((line) => ({
      entry,
      category,
      inflow: Number(line.debit),
      outflow: Number(line.credit),
    }))
  })
  const categories = ['Operating', 'Investing', 'Financing']
  const totals = Object.fromEntries(
    categories.map((category) => [
      category,
      {
        inflow: sum(
          movements.filter((item) => item.category === category),
          (item) => item.inflow,
        ),
        outflow: sum(
          movements.filter((item) => item.category === category),
          (item) => item.outflow,
        ),
      },
    ]),
  )
  const netChange = sum(
    categories,
    (category) => totals[category].inflow - totals[category].outflow,
  )
  const reportRows = [
    ['Category', 'Cash received', 'Cash paid', 'Net movement'],
    ...categories.map((category) => [
      category,
      totals[category].inflow,
      totals[category].outflow,
      totals[category].inflow - totals[category].outflow,
    ]),
    ['Net cash change', '', '', netChange],
  ]
  return (
    <>
      <PageHeader
        title="Cash Flow"
        subtitle="Summarize posted cash and bank movements as operating, investing, and financing activity."
        icon={ArrowDownLeft}
        action={<ExportAction filename="cash-flow.csv" rows={reportRows} onNotify={onNotify} />}
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
        <span className="fa-period-hint">
          {dateLabel(startDate)} — {dateLabel(endDate)}
        </span>
      </div>
      <div className="fa-cashflow-grid">
        {categories.map((category) => (
          <Card
            key={category}
            title={`${category} activities`}
            icon={
              category === 'Operating' ? Wallet : category === 'Investing' ? Building2 : Landmark
            }
          >
            <div className="fa-statement-row">
              <span>Cash received</span>
              <b className="fa-positive">{money(totals[category].inflow)}</b>
            </div>
            <div className="fa-statement-row">
              <span>Cash paid</span>
              <b className="fa-negative">{money(totals[category].outflow)}</b>
            </div>
            <div className="fa-statement-total">
              <span>Net {category.toLowerCase()} cash</span>
              <b>{money(totals[category].inflow - totals[category].outflow)}</b>
            </div>
          </Card>
        ))}
      </div>
      <Card title="Cash movement detail" icon={ListChecks}>
        <Table
          headers={['Date', 'Journal', 'Description', 'Activity', 'Cash received', 'Cash paid']}
        >
          {movements.map((item, index) => (
            <tr key={`${item.entry.id}-${index}`}>
              <td>{dateLabel(item.entry.date)}</td>
              <td>{item.entry.number}</td>
              <td>{item.entry.description}</td>
              <td>{item.category}</td>
              <td>{item.inflow ? money(item.inflow) : '—'}</td>
              <td>{item.outflow ? money(item.outflow) : '—'}</td>
            </tr>
          ))}
        </Table>
        {!movements.length && <Empty>No cash or bank movement in this period.</Empty>}
      </Card>
      <div className="fa-report-total">
        <b>Net change in cash and cash equivalents</b>
        <b>{money(netChange)}</b>
      </div>
    </>
  )
}

export default CashFlowPage
