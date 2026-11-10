import {
  today,
  money,
  dateLabel,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Empty,
  openBills,
  sum,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  Clock3,
  ListChecks,
  Receipt,
} from '../financeShared'

function OutstandingPayablesPage({ data, onNavigate }) {
  const bills = openBills(data)
  return (
    <>
      <PageHeader
        title="Outstanding Payables"
        subtitle="Review open supplier obligations and prioritize upcoming payments."
        icon={ArrowUpRight}
        action={
          <Button onClick={() => onNavigate('Make Payment')}>
            <Banknote size={15} />
            Make payment
          </Button>
        }
      />
      <div className="fa-stats compact">
        <Stat icon={Receipt} label="Open bills" value={bills.length} tone="blue" />
        <Stat
          icon={CircleDollarSign}
          label="Total due"
          value={money(sum(bills, (item) => item.total - item.paid))}
        />
        <Stat
          icon={Clock3}
          label="Past due bills"
          value={bills.filter((item) => item.dueDate < today()).length}
          tone="amber"
        />
      </div>
      <Card
        title={`Open supplier obligations · ${bills.length}`}
        icon={ListChecks}
        action={
          <Button kind="link" onClick={() => onNavigate('Payable Aging')}>
            View aging <ArrowRight size={13} />
          </Button>
        }
      >
        <Table
          headers={[
            'Bill',
            'Supplier',
            'Bill date',
            'Due date',
            'Original amount',
            'Paid to date',
            'Remaining',
          ]}
        >
          {bills.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.id}</b>
              </td>
              <td>{item.supplier}</td>
              <td>{dateLabel(item.date)}</td>
              <td className={item.dueDate < today() ? 'fa-overdue' : ''}>
                {dateLabel(item.dueDate)}
              </td>
              <td>{money(item.total)}</td>
              <td>{money(item.paid)}</td>
              <td>
                <b>{money(item.total - item.paid)}</b>
              </td>
            </tr>
          ))}
        </Table>
        {!bills.length && <Empty>No outstanding supplier bills.</Empty>}
      </Card>
    </>
  )
}

export default OutstandingPayablesPage
