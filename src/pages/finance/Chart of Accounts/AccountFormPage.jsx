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

function AccountFormPage({
  data,
  createAccount,
  saveAccount,
  editingAccount,
  setEditingAccountId,
  accountClassificationLocked,
  onNotify,
  onNavigate,
}) {
  const [form, setForm] = useState(() => ({
    code: editingAccount?.code || '',
    name: editingAccount?.name || '',
    type: editingAccount?.type || 'Asset',
    group: editingAccount?.group || 'Current Assets',
    control: editingAccount?.control || '',
  }))
  const groups = typeGroups[form.type]
  const submit = (event) => {
    event.preventDefault()
    if (!/^\d{3,8}$/.test(form.code.trim()))
      return onNotify('Account code must contain 3 to 8 digits.')
    const values = { ...form, group: groups.includes(form.group) ? form.group : groups[0] }
    const saved = editingAccount ? saveAccount(editingAccount.id, values) : createAccount(values)
    if (saved && editingAccount) {
      setEditingAccountId('')
      onNavigate('Account Directory')
    }
  }
  return (
    <>
      <PageHeader
        title={editingAccount ? 'Edit Ledger Account' : 'Create Ledger Account'}
        subtitle={
          editingAccount
            ? 'Update account details without deleting or replacing the ledger record.'
            : 'Add a uniquely coded account to the general ledger chart.'
        }
        icon={Plus}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Account Directory')}>
            Account directory <ChevronRight size={14} />
          </Button>
        }
      />
      <form className="fa-form-card" key={editingAccount?.id || 'new-account'} onSubmit={submit}>
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
              disabled={Boolean(accountClassificationLocked)}
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
              disabled={Boolean(accountClassificationLocked)}
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
              disabled={Boolean(accountClassificationLocked)}
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
                disabled={Boolean(accountClassificationLocked)}
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
          <span>
            {accountClassificationLocked
              ? 'Code and classification are locked because posted journals reference this account.'
              : 'Codes must be unique. Accounts used in posted journals cannot be deleted.'}
          </span>
          {editingAccount && (
            <Button
              kind="secondary"
              onClick={() => {
                setEditingAccountId('')
                onNavigate('Account Directory')
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">
            <Check size={15} />
            {editingAccount ? 'Save changes' : 'Create account'}
          </Button>
        </div>
      </form>
    </>
  )
}

export default AccountFormPage
