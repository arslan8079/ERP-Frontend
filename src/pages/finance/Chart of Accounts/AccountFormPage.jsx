import { useState } from 'react'
import {
  accountTypes,
  typeGroups,
  PageHeader,
  Button,
  Field,
  BookOpen,
  Check,
  ChevronRight,
  Plus,
} from '../financeShared'

function AccountFormPage({ data, createAccount, onNotify, onNavigate }) {
  const [form, setForm] = useState({
    code: '',
    name: '',
    type: 'Asset',
    group: 'Current Assets',
    control: '',
  })
  const groups = typeGroups[form.type]
  const submit = (event) => {
    event.preventDefault()
    if (!/^\d{3,8}$/.test(form.code.trim()))
      return onNotify('Account code must contain 3 to 8 digits.')
    createAccount({ ...form, group: groups.includes(form.group) ? form.group : groups[0] })
  }
  return (
    <>
      <PageHeader
        title="Create Ledger Account"
        subtitle="Add a uniquely coded account to the general ledger chart."
        icon={Plus}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Account Directory')}>
            Account directory <ChevronRight size={14} />
          </Button>
        }
      />
      <form className="fa-form-card" onSubmit={submit}>
        <h2>
          <BookOpen size={18} />
          Ledger account setup
        </h2>
        <div className="fa-form-grid">
          <Field label="Account code">
            <input
              required
              inputMode="numeric"
              pattern="[0-9]{3,8}"
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value })}
              placeholder="e.g. 5400"
            />
          </Field>
          <Field label="Account name">
            <input
              required
              maxLength="70"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Account name"
            />
          </Field>
          <Field label="Account type">
            <select
              value={form.type}
              onChange={(event) =>
                setForm({
                  ...form,
                  type: event.target.value,
                  group: typeGroups[event.target.value][0],
                  control: '',
                })
              }
            >
              {accountTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Account group">
            <select
              value={form.group}
              onChange={(event) => setForm({ ...form, group: event.target.value })}
            >
              {groups.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          {form.type === 'Asset' && (
            <Field label="Control account">
              <select
                value={form.control}
                onChange={(event) => setForm({ ...form, control: event.target.value })}
              >
                <option value="">None</option>
                <option>Cash</option>
                <option>Bank</option>
                <option>Receivables</option>
              </select>
            </Field>
          )}
        </div>
        <div className="fa-form-actions">
          <span>Codes must be unique. Accounts used in posted journals cannot be deleted.</span>
          <Button type="submit">
            <Check size={15} />
            Create account
          </Button>
        </div>
      </form>
    </>
  )
}

export default AccountFormPage
