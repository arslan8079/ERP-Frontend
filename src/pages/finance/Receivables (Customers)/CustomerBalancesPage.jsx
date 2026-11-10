import {
  money,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  Empty,
  sum,
  ArrowDownLeft,
  Building2,
  ChevronRight,
  CircleDollarSign,
  ListChecks,
  Plus,
  Receipt,
} from '../financeShared'

function CustomerBalancesPage({ data, onNavigate }) {
  const rows = data.customers
    .map((customer) => {
      const invoices = data.invoices.filter((item) => item.customer === customer)
      return {
        customer,
        invoices: invoices.length,
        billed: sum(invoices, (item) => item.total),
        outstanding: sum(invoices, (item) => item.total - item.allocated),
      }
    })
    .sort((a, b) => b.outstanding - a.outstanding)
  return (
    <>
      <PageHeader
        title="Customer Balances"
        subtitle="Review customer-level billed, collected, and outstanding receivable balances."
        icon={ArrowDownLeft}
        action={
          <Button onClick={() => onNavigate('Receive Payment')}>
            <Plus size={15} />
            Receive payment
          </Button>
        }
      />
      <div className="fa-stats compact">
        <Stat icon={Building2} label="Customers" value={rows.length} tone="blue" />
        <Stat icon={Receipt} label="Total billed" value={money(sum(rows, (item) => item.billed))} />
        <Stat
          icon={CircleDollarSign}
          label="Receivables"
          value={money(sum(rows, (item) => item.outstanding))}
          tone="amber"
        />
      </div>
      <Card title={`Customer ledger balances · ${rows.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Customer',
            'Open invoices',
            'Total invoiced',
            'Outstanding',
            'Collection status',
            '',
          ]}
        >
          {rows.map((item) => (
            <tr key={item.customer}>
              <td>
                <b>{item.customer}</b>
              </td>
              <td>{item.invoices}</td>
              <td>{money(item.billed)}</td>
              <td>
                <b>{money(item.outstanding)}</b>
              </td>
              <td>
                <Status>{item.outstanding ? 'Open' : 'Paid'}</Status>
              </td>
              <td>
                <button className="fa-link" onClick={() => onNavigate('Outstanding Invoices')}>
                  View invoices <ChevronRight size={13} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {!rows.length && <Empty>Customer balances appear when invoices are recorded.</Empty>}
      </Card>
    </>
  )
}

export default CustomerBalancesPage
