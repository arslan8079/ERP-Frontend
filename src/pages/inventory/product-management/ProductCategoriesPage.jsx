import { ArrowRight, Package, Plus, ClipboardList } from 'lucide-react'
import { Button, Field, Card, Table } from '../InventoryComponents'

export default function ProductCategoriesPage({ context }) {
  const {
    onNotify,
    onNavigate,
    data,
    setSearch,
    newCategory,
    setNewCategory,
    stockFor,
    filtered,
    save,
    pageHeader,
    searchBox,
    tableExport,
  } = context
  const page = 'Product Categories'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Organize products for safe storage, procurement, and category reports.',
        Package,
      )}
      <form
        className="inv-inline-form"
        onSubmit={(event) => {
          event.preventDefault()
          const value = newCategory.trim()
          if (!value) return
          if (data.categories.some((item) => item.toLowerCase() === value.toLowerCase()))
            return onNotify('That product category already exists.')
          if (
            save({ ...data, categories: [...data.categories, value] }, 'Pesticide category added.')
          )
            setNewCategory('')
        }}
      >
        <Field label="New pesticide category" required>
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="e.g. Bio-pesticides"
          />
        </Field>
        <Button type="submit">
          <Plus size={15} />
          Add category
        </Button>
      </form>
      {(() => {
        const config = {
          title: page,
          subtitle: 'Product classification used by product records and inventory reports.',
          icon: Package,
          headers: ['Category', 'Registered products', 'Available stock', 'Action'],
          items: filtered(data.categories, (item) => item),
          rows: filtered(data.categories, (item) => item).map((item) => {
            const matches = data.products.filter((record) => record.category === item)
            return (
              <tr key={item}>
                <td>
                  <b>{item}</b>
                </td>
                <td>{matches.length}</td>
                <td>{matches.reduce((sum, record) => sum + stockFor(record.id), 0)}</td>
                <td>
                  <Button
                    kind="small secondary"
                    onClick={() => {
                      setSearch(item)
                      onNavigate('Product List')
                    }}
                  >
                    View products <ArrowRight size={13} />
                  </Button>
                </td>
              </tr>
            )
          }),
        }
        const title = config.title === undefined ? page : config.title
        const subtitle = config.subtitle
        const icon = config.icon === undefined ? ClipboardList : config.icon
        const headers = config.headers
        const items = config.items
        const action = config.action
        const exportHeaders = config.exportHeaders
        const exportRows = config.exportRows
        const empty = config.empty
        const tableRows = config.rows
        return (
          <div className="inv-page">
            {pageHeader(
              title,
              subtitle ||
                'Review pesticide inventory records with batch, warehouse and traceability context.',
              icon,
              action,
              exportRows ? tableExport(title, exportHeaders || headers, exportRows) : null,
            )}
            <div className="inv-toolbar">
              {searchBox}
              <span>
                {items.length} record{items.length === 1 ? '' : 's'}
              </span>
            </div>
            <Card title={`${title} \u00b7 ${items.length}`} icon={icon}>
              <Table headers={headers} empty={empty}>
                {tableRows}
              </Table>
            </Card>
          </div>
        )
      })()}
    </div>
  )
}
