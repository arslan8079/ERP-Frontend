import { Check, FlaskConical, PackagePlus, ShieldCheck } from 'lucide-react'
import { Button, Field } from '../InventoryComponents'

export default function AddProductPage({ context }) {
  const { onNavigate, data, pageHeader, submitProduct } = context
  const page = 'Add Product'

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Create a traceable, regulatory-ready pesticide catalogue item.',
        PackagePlus,
        null,
      )}
      <form className="inv-form-card" onSubmit={submitProduct}>
        <h2>
          <FlaskConical size={18} />
          Product and regulatory details
        </h2>
        <div className="inv-form-grid">
          <Field label="Product code" required>
            <input name="id" placeholder="e.g. PRD-006" required />
          </Field>
          <Field label="Trade / product name" required>
            <input name="name" placeholder="Registered trade name" required />
          </Field>
          <Field label="Active ingredient" required>
            <input name="active" placeholder="Common chemical name" required />
          </Field>
          <Field label="Formulation / concentration" required>
            <input name="formulation" placeholder="e.g. 20% SL" required />
          </Field>
          <Field label="Pesticide category" required>
            <select name="category" required>
              {data.categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Registration number" required>
            <input name="registration" placeholder="Regulator registration / licence" required />
          </Field>
          <Field label="WHO hazard class" required>
            <select name="hazard">
              <option>Class III · Caution</option>
              <option>Class II · Moderate</option>
              <option>Class Ib · Highly hazardous</option>
              <option>Class Ia · Extremely hazardous</option>
            </select>
          </Field>
          <Field label="Stock unit" required>
            <select name="unit">
              {data.units.map((item) => (
                <option key={item.symbol} value={item.symbol}>
                  {item.name} ({item.symbol})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Reorder level" required>
            <input name="reorder" type="number" min="0.01" step="any" defaultValue="25" required />
          </Field>
          <Field label="Standard unit cost (PKR)" required>
            <input name="cost" type="number" min="0.01" step="any" required />
          </Field>
          <p className="inv-form-hint">
            <ShieldCheck size={16} />
            Register the exact pesticide approval and formulation shown on the approved product
            label. Do not mix concentrations or active ingredients under one code.
          </p>
        </div>
        <div className="inv-form-actions">
          <span>
            Product codes and registrations are unique; batch expiry is tracked separately.
          </span>
          <div>
            <Button kind="secondary" onClick={() => onNavigate('Product List')}>
              Cancel
            </Button>
            <Button type="submit">
              <Check size={15} />
              Save product
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
