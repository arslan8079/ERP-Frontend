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
  ArrowUpRight,
  Building2,
  ChevronRight,
  CircleDollarSign,
  ListChecks,
  Plus,
  Receipt,
} from '../financeShared'

function SupplierBalancesPage({ data, onNavigate }) {
  const rows = data.suppliers
    .map((supplier) => {
      const bills = data.bills.filter((item) => item.supplier === supplier)
      return {
        supplier,
        bills: bills.length,
        billed: sum(bills, (item) => item.total),
        outstanding: sum(bills, (item) => item.total - item.paid),
      }
    })
    .sort((a, b) => b.outstanding - a.outstanding)
  return (
    <>
      <PageHeader
        title="Supplier Balances"
        subtitle="Review supplier-level purchases, settlements, and outstanding accounts payable."
        icon={ArrowUpRight}
        action={
          <Button onClick={() => onNavigate('Make Payment')}>
            <Plus size={15} />
            Make payment
          </Button>
        }
      />
      <div className="fa-stats compact">
        <Stat icon={Building2} label="Suppliers" value={rows.length} tone="blue" />
        <Stat icon={Receipt} label="Total bills" value={money(sum(rows, (item) => item.billed))} />
        <Stat
          icon={CircleDollarSign}
          label="Outstanding payable"
          value={money(sum(rows, (item) => item.outstanding))}
          tone="amber"
        />
      </div>
      <Card title={`Supplier ledger balances · ${rows.length}`} icon={ListChecks}>
        <Table
          headers={['Supplier', 'Bills', 'Total billed', 'Outstanding', 'Settlement status', '']}
        >
          {rows.map((item) => (
            <tr key={item.supplier}>
              <td>
                <b>{item.supplier}</b>
              </td>
              <td>{item.bills}</td>
              <td>{money(item.billed)}</td>
              <td>
                <b>{money(item.outstanding)}</b>
              </td>
              <td>
                <Status>{item.outstanding ? 'Open' : 'Paid'}</Status>
              </td>
              <td>
                <button className="fa-link" onClick={() => onNavigate('Outstanding Payables')}>
                  View bills <ChevronRight size={13} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {!rows.length && <Empty>Supplier balances appear when bills are recorded.</Empty>}
      </Card>
    </>
  )
}

export default SupplierBalancesPage
