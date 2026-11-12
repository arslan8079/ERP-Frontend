import { MapPin, Plus, ClipboardList } from 'lucide-react'
import { Button, Field, MasterHistoryCard, Status, Card, Table } from '../InventoryComponents'

export default function StorageLocationsPage({ context }) {
  const {
    data,
    warehouse,
    filtered,
    warehouseOptions,
    pageHeader,
    submitLocation,
    editingLocation,
    setEditingLocationId,
    toggleLocationStatus,
    searchBox,
    tableExport,
  } = context
  const page = 'Storage Locations'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Manage bin-level locations and safe segregation for pesticide formulations.',
        MapPin,
      )}
      <form
        className="inv-inline-form"
        key={editingLocation?.id || 'new-location'}
        onSubmit={submitLocation}
      >
        <Field label="Warehouse" required>
          <select name="warehouseId" defaultValue={editingLocation?.warehouseId || undefined}>
            {warehouseOptions}
          </select>
        </Field>
        <Field label="Bin / location code" required>
          <input
            name="code"
            defaultValue={editingLocation?.code || ''}
            placeholder="e.g. A-04-01"
            required
          />
        </Field>
        <Field label="Storage zone / conditions" required>
          <input
            name="zone"
            defaultValue={editingLocation?.zone || ''}
            placeholder="Cool, dry, ventilated, locked cabinet…"
            required
          />
        </Field>
        <Field label="Storage classification" required>
          <select
            name="type"
            defaultValue={editingLocation?.type || 'Pesticide · controlled access'}
          >
            <option>Pesticide · controlled access</option>
            <option>Powder · cool and dry</option>
            <option>Flammable · ventilated cabinet</option>
            <option>Quarantine · segregated</option>
            <option>General warehouse</option>
          </select>
        </Field>
        <Field label="Capacity (base units)" required>
          <input
            name="capacity"
            type="number"
            min="1"
            defaultValue={editingLocation?.capacity || ''}
            required
          />
        </Field>
        <Button type="submit">
          <Plus size={15} />
          {editingLocation ? 'Save changes' : 'Add location'}
        </Button>
        {editingLocation && (
          <Button kind="secondary" onClick={() => setEditingLocationId('')}>
            Cancel edit
          </Button>
        )}
      </form>
      {(() => {
        const config = {
          title: page,
          subtitle:
            'Segregate liquids, powders, quarantine, and damaged pesticide stock as required.',
          icon: MapPin,
          headers: [
            'Warehouse',
            'Location',
            'Zone / storage conditions',
            'Classification',
            'Capacity',
            'Stock',
            'Status',
            '',
          ],
          items: filtered(
            data.locations,
            (item) => `${warehouse(item.warehouseId)?.name} ${item.code} ${item.zone} ${item.type}`,
          ),
          rows: filtered(
            data.locations,
            (item) => `${warehouse(item.warehouseId)?.name} ${item.code} ${item.zone} ${item.type}`,
          ).map((item) => (
            <tr key={item.id}>
              <td>{warehouse(item.warehouseId)?.name}</td>
              <td>
                <b>{item.code}</b>
              </td>
              <td>{item.zone}</td>
              <td>
                <Status>{item.type}</Status>
              </td>
              <td>{item.capacity}</td>
              <td>
                {data.batches
                  .filter(
                    (batch) =>
                      batch.warehouseId === item.warehouseId && batch.location === item.code,
                  )
                  .reduce((sum, batch) => sum + Number(batch.qty), 0)}
              </td>
              <td>
                <Status>{item.status || 'Active'}</Status>
              </td>
              <td>
                <Button kind="small secondary" onClick={() => setEditingLocationId(item.id)}>
                  Edit
                </Button>
                <Button kind="small secondary" onClick={() => toggleLocationStatus(item.id)}>
                  {item.status === 'Inactive' ? 'Reactivate' : 'Deactivate'}
                </Button>
              </td>
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
            <MasterHistoryCard
              items={(data.masterHistory || []).filter((item) => item.entityType === 'Location')}
            />
          </div>
        )
      })()}
    </div>
  )
}
