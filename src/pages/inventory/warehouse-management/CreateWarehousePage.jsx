import { Check, Warehouse } from 'lucide-react'
import { Button, Field } from '../InventoryComponents'

export default function CreateWarehousePage({ context }) {
  const { onNavigate, pageHeader, submitWarehouse } = context
  const page = 'Create Warehouse'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Set up a branch warehouse before defining its controlled storage bins.',
        Warehouse,
      )}
      <form className="inv-form-card" onSubmit={submitWarehouse}>
        <h2>
          <Warehouse size={18} />
          Warehouse profile
        </h2>
        <div className="inv-form-grid">
          <Field label="Warehouse code" required>
            <input name="id" placeholder="e.g. WH-MUL" required />
          </Field>
          <Field label="Warehouse name" required>
            <input name="name" placeholder="Branch distribution warehouse" required />
          </Field>
          <Field label="Branch / city" required>
            <input name="branch" placeholder="City or operating branch" required />
          </Field>
          <Field label="Site address" required>
            <input name="address" placeholder="Industrial estate / address" required />
          </Field>
          <Field label="Warehouse manager" required>
            <input name="manager" required />
          </Field>
          <Field label="Capacity (base units)" required>
            <input name="capacity" type="number" min="1" required />
          </Field>
        </div>
        <div className="inv-form-actions">
          <span>
            Next: create safe storage locations and segregate chemicals by label/storage
            requirements.
          </span>
          <div>
            <Button kind="secondary" onClick={() => onNavigate('Warehouse List')}>
              Cancel
            </Button>
            <Button type="submit">
              <Check size={15} />
              Create warehouse
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
