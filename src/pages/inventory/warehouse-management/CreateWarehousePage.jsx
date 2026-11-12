import { Check, Warehouse } from 'lucide-react'
import { Button, Field } from '../InventoryComponents'

export default function CreateWarehousePage({ context }) {
  const { onNavigate, pageHeader, submitWarehouse, editingWarehouse, setEditingWarehouseId } =
    context
  const page = 'Create Warehouse'

  return (
    <div className="inv-page">
      {pageHeader(
        editingWarehouse ? 'Edit Warehouse' : page,
        editingWarehouse
          ? 'Update warehouse details while retaining its warehouse identifier and stock history.'
          : 'Set up a branch warehouse before defining its controlled storage bins.',
        Warehouse,
      )}
      <form
        className="inv-form-card"
        key={editingWarehouse?.id || 'new-warehouse'}
        onSubmit={submitWarehouse}
      >
        <h2>
          <Warehouse size={18} />
          Warehouse profile
        </h2>
        <div className="inv-form-grid">
          <Field label="Warehouse code" required>
            <input
              name="id"
              defaultValue={editingWarehouse?.id || ''}
              placeholder="e.g. WH-MUL"
              disabled={Boolean(editingWarehouse)}
              required
            />
          </Field>
          <Field label="Warehouse name" required>
            <input
              name="name"
              defaultValue={editingWarehouse?.name || ''}
              placeholder="Branch distribution warehouse"
              required
            />
          </Field>
          <Field label="Branch / city" required>
            <input
              name="branch"
              defaultValue={editingWarehouse?.branch || ''}
              placeholder="City or operating branch"
              required
            />
          </Field>
          <Field label="Site address" required>
            <input
              name="address"
              defaultValue={editingWarehouse?.address || ''}
              placeholder="Industrial estate / address"
              required
            />
          </Field>
          <Field label="Warehouse manager" required>
            <input name="manager" defaultValue={editingWarehouse?.manager || ''} required />
          </Field>
          <Field label="Capacity (base units)" required>
            <input
              name="capacity"
              type="number"
              min="1"
              defaultValue={editingWarehouse?.capacity || ''}
              required
            />
          </Field>
        </div>
        <div className="inv-form-actions">
          <span>
            {editingWarehouse
              ? 'Existing stock and warehouse transactions remain linked to this record.'
              : 'Next: create safe storage locations and segregate chemicals by label/storage requirements.'}
          </span>
          <div>
            <Button
              kind="secondary"
              onClick={() => {
                setEditingWarehouseId('')
                onNavigate('Warehouse List')
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Check size={15} />
              {editingWarehouse ? 'Save changes' : 'Create warehouse'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
