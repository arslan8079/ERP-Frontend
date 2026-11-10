import { Boxes, Plus, ClipboardList } from 'lucide-react'
import { Button, Field, Card, Table } from '../InventoryComponents'

export default function UnitsPackagingPage({ context }) {
  const { onNotify, data, newUnit, setNewUnit, save, pageHeader, searchBox, tableExport } = context
  const page = 'Units & Packaging'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Keep stock quantities in a consistent base unit; package conversion is explicit.',
        Boxes,
      )}
      <form
        className="inv-inline-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (!newUnit.name.trim() || !newUnit.symbol.trim())
            return onNotify('Enter both a unit name and a short symbol.')
          if (
            data.units.some(
              (item) => item.symbol.toLowerCase() === newUnit.symbol.trim().toLowerCase(),
            )
          )
            return onNotify('Unit symbol already exists.')
          if (
            save(
              {
                ...data,
                units: [
                  ...data.units,
                  { ...newUnit, name: newUnit.name.trim(), symbol: newUnit.symbol.trim() },
                ],
              },
              'Stock unit added.',
            )
          )
            setNewUnit({ name: '', symbol: '', type: 'Volume' })
        }}
      >
        <Field label="Unit name" required>
          <input
            value={newUnit.name}
            onChange={(event) => setNewUnit({ ...newUnit, name: event.target.value })}
          />
        </Field>
        <Field label="Unit symbol" required>
          <input
            value={newUnit.symbol}
            onChange={(event) => setNewUnit({ ...newUnit, symbol: event.target.value })}
          />
        </Field>
        <Field label="Unit type">
          <select
            value={newUnit.type}
            onChange={(event) => setNewUnit({ ...newUnit, type: event.target.value })}
          >
            <option>Volume</option>
            <option>Weight</option>
            <option>Packaging</option>
          </select>
        </Field>
        <Button type="submit">
          <Plus size={15} />
          Add unit
        </Button>
      </form>
      {(() => {
        const config = {
          title: page,
          subtitle:
            'Packaging shown separately from base-unit stock; no implicit quantity conversions.',
          icon: Boxes,
          headers: ['Unit name', 'Symbol', 'Measure', 'Products using unit'],
          items: data.units,
          rows: data.units.map((item) => (
            <tr key={item.symbol}>
              <td>
                <b>{item.name}</b>
              </td>
              <td>{item.symbol}</td>
              <td>{item.type}</td>
              <td>{data.products.filter((record) => record.unit === item.symbol).length}</td>
            </tr>
          )),
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
