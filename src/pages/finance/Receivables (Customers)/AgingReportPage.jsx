import {
  money,
  dateLabel,
  agingDays,
  agingBucket,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Empty,
  openInvoices,
  openBills,
  sum,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ListChecks,
  TrendingDown,
} from '../financeShared'

function AgingReportPage({ data, receivable = false, onNavigate }) {
  const records = receivable ? openInvoices(data) : openBills(data)
  const party = receivable ? (item) => item.customer : (item) => item.supplier
  const remaining = (item) => item.total - (receivable ? item.allocated : item.paid)
  const buckets = ['0–30 days', '31–60 days', '61–90 days', '90+ days']
  const totals = Object.fromEntries(
    buckets.map((bucket) => [
      bucket,
      sum(
        records.filter((item) => agingBucket(agingDays(item.dueDate)) === bucket),
        remaining,
      ),
    ]),
  )
  const kind = receivable ? 'Receivables' : 'Payables'
  return (
    <>
      <PageHeader
        title={receivable ? 'Aging Report' : 'Payable Aging'}
        subtitle={`Age open ${receivable ? 'customer invoices' : 'supplier bills'} by due date to prioritize collection and settlement.`}
        icon={CalendarDays}
        action={
          <Button
            kind="secondary"
            onClick={() => onNavigate(receivable ? 'Outstanding Invoices' : 'Outstanding Payables')}
          >
            Open detail <ChevronRight size={14} />
          </Button>
        }
      />
      <div className="fa-aging-cards">
        {buckets.map((bucket, index) => (
          <Stat
            key={bucket}
            icon={index > 1 ? TrendingDown : Clock3}
            label={bucket}
            value={money(totals[bucket])}
            tone={index > 1 ? 'red' : index === 1 ? 'amber' : 'blue'}
            hint={`${records.filter((item) => agingBucket(agingDays(item.dueDate)) === bucket).length} document(s)`}
          />
        ))}
        <Stat
          icon={CircleDollarSign}
          label={`Total ${kind.toLowerCase()}`}
          value={money(sum(records, remaining))}
          tone="green"
        />
      </div>
      <Card title={`${kind} aging detail · ${records.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Document',
            receivable ? 'Customer' : 'Supplier',
            'Due date',
            'Days overdue',
            '0–30 days',
            '31–60 days',
            '61–90 days',
            '90+ days',
            'Open balance',
          ]}
        >
          {records.map((item) => {
            const days = agingDays(item.dueDate)
            const bucket = agingBucket(days)
            return (
              <tr key={item.id}>
                <td>
                  <b>{item.id}</b>
                </td>
                <td>{party(item)}</td>
                <td>{dateLabel(item.dueDate)}</td>
                <td>{days || 'Current'}</td>
                {buckets.map((value) => (
                  <td key={value}>{bucket === value ? money(remaining(item)) : '—'}</td>
                ))}
                <td>
                  <b>{money(remaining(item))}</b>
                </td>
              </tr>
            )
          })}
        </Table>
        {!records.length && <Empty>No open items to age.</Empty>}
      </Card>
    </>
  )
}

export default AgingReportPage
