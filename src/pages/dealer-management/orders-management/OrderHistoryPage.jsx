export default function OrderHistoryPage({ context }) {
  const {
    onNavigate,
    data,
    search,
    exportRows,
    orderRows,
    table,
    button,
    header,
    searchBar,
    Banknote,
    BarChart3,
    CheckCircle2,
    Clock3,
    Plus,
    ShoppingCart,
    Stat,
    money,
    dealerName,
    territoryName,
    productName,
  } = context
  const page = 'Order History'

  if (
    page === 'Order List' ||
    page === 'Pending Orders' ||
    page === 'Approval Queue' ||
    page === 'Order History' ||
    page === 'Order Report' ||
    page === 'Dealer Sales Report' ||
    page === 'Territory Sales' ||
    page === 'Dealer Performance'
  ) {
    let rows = data.orders
    if (page === 'Pending Orders' || page === 'Approval Queue')
      rows = rows.filter((order) => order.status === 'Pending Approval')
    if (page === 'Order History') rows = data.orders
    if (page === 'Territory Sales')
      rows = rows.filter((order) => {
        const dealer = data.dealers.find((item) => item.id === order.dealerId)
        return (
          !dealer ||
          territoryName(data, dealer.territoryId).toLowerCase().includes(search.toLowerCase())
        )
      })
    if (['Dealer Sales Report', 'Dealer Performance'].includes(page))
      rows = rows.filter((order) =>
        `${dealerName(data, order.dealerId)} ${territoryName(data, data.dealers.find((item) => item.id === order.dealerId)?.territoryId)}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    const reportTitle =
      page === 'Dealer Sales Report'
        ? 'Dealer sales performance'
        : page === 'Territory Sales'
          ? 'Sales by territory'
          : page === 'Dealer Performance'
            ? 'Dealer performance scorecard'
            : page === 'Order Report'
              ? 'Order report'
              : page === 'Approval Queue'
                ? 'Order approval queue'
                : page === 'Order History'
                  ? 'Order history'
                  : page === 'Pending Orders'
                    ? 'Orders awaiting approval'
                    : 'Dealer orders'
    return (
      <div className="dealer-page">
        {header(
          page === 'Approval Queue' || page === 'Pending Orders'
            ? 'Review submitted orders and check dealer credit before approval.'
            : page === 'Order History'
              ? 'Review order stages and open a record for its timeline, amendment, cancellation and decision reasons.'
              : 'Monitor dealer pesticide orders, status, value, territory and sales performance.',
          page.includes('Report') || page.includes('Sales') || page === 'Dealer Performance'
            ? BarChart3
            : ShoppingCart,
          page === 'Order List'
            ? button('Create order', () => onNavigate('Create Order'), false, Plus)
            : null,
          () =>
            exportRows(
              page,
              ['Order', 'Dealer', 'Territory', 'Date', 'Products', 'Value PKR', 'Terms', 'Status'],
              rows.map((order) => [
                order.id,
                dealerName(data, order.dealerId),
                territoryName(
                  data,
                  data.dealers.find((item) => item.id === order.dealerId)?.territoryId,
                ),
                order.date,
                order.items
                  .map((item) => `${productName(item.productCode)} ${item.qty}`)
                  .join('; '),
                order.total,
                order.paymentTerms,
                order.status,
              ]),
            ),
        )}
        <div className="dealer-stats compact">
          <Stat label="Orders" value={rows.length} icon={ShoppingCart} />
          <Stat
            label="Pending approval"
            value={rows.filter((item) => item.status === 'Pending Approval').length}
            icon={Clock3}
            tone="amber"
          />
          <Stat
            label="Order value"
            value={money(rows.reduce((sum, item) => sum + item.total, 0))}
            icon={Banknote}
            tone="blue"
          />
          <Stat
            label="Approved / fulfilled"
            value={
              rows.filter((item) => ['Approved', 'Dispatched', 'Delivered'].includes(item.status))
                .length
            }
            icon={CheckCircle2}
          />
        </div>
        {searchBar}
        {table(
          reportTitle,
          ['Order', 'Dealer', 'Pesticide / quantity', 'Total', 'Terms', 'Status', ''],
          orderRows(rows),
        )}
      </div>
    )
  }

  return null
}
