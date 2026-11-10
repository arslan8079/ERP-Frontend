import { useState } from 'react'
import {
  today,
  money,
  PageHeader,
  Button,
  Card,
  Field,
  sum,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  ListChecks,
  Plus,
  ShieldCheck,
} from '../financeShared'

function JournalFormPage({ data, createJournal, onNotify, onNavigate }) {
  const [form, setForm] = useState({
    date: today(),
    reference: '',
    description: '',
    source: 'Manual',
    lines: [
      { accountId: '', debit: '', credit: '', memo: '' },
      { accountId: '', debit: '', credit: '', memo: '' },
    ],
  })
  const debit = sum(form.lines, (item) => Number(item.debit) || 0)
  const credit = sum(form.lines, (item) => Number(item.credit) || 0)
  const updateLine = (index, key, value) =>
    setForm((current) => ({
      ...current,
      lines: current.lines.map((line, rowIndex) =>
        rowIndex === index
          ? {
              ...line,
              [key]: value,
              ...(key === 'debit' && value ? { credit: '' } : {}),
              ...(key === 'credit' && value ? { debit: '' } : {}),
            }
          : line,
      ),
    }))
  const submit = (event, status) => {
    event.preventDefault()
    if (!form.description.trim()) return onNotify('Enter a clear journal description.')
    if (
      createJournal(
        { ...form, reference: form.reference.trim(), description: form.description.trim() },
        status,
      )
    ) {
      setForm({
        date: today(),
        reference: '',
        description: '',
        source: 'Manual',
        lines: [
          { accountId: '', debit: '', credit: '', memo: '' },
          { accountId: '', debit: '', credit: '', memo: '' },
        ],
      })
    }
  }
  return (
    <>
      <PageHeader
        title="Create Journal Entry"
        subtitle="Record a balanced, traceable general-ledger transaction."
        icon={BookOpen}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Draft Entries')}>
            View drafts <ChevronRight size={14} />
          </Button>
        }
      />
      <form className="fa-journal-form" onSubmit={(event) => submit(event, 'Draft')}>
        <div className="fa-form-card">
          <h2>
            <FileText size={18} />
            Journal header
          </h2>
          <div className="fa-form-grid">
            <Field label="Journal date">
              <input
                type="date"
                required
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </Field>
            <Field label="Reference">
              <input
                maxLength="50"
                value={form.reference}
                onChange={(event) => setForm({ ...form, reference: event.target.value })}
                placeholder="Invoice, voucher or source reference"
              />
            </Field>
            <Field label="Description">
              <input
                required
                maxLength="120"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Describe the business purpose"
              />
            </Field>
            <Field label="Source">
              <select
                value={form.source}
                onChange={(event) => setForm({ ...form, source: event.target.value })}
              >
                <option>Manual</option>
                <option>Adjustment</option>
                <option>Accrual</option>
                <option>Opening</option>
              </select>
            </Field>
          </div>
        </div>
        <Card title="Journal lines" icon={ListChecks}>
          <div className="fa-table-wrap">
            <table className="fa-table fa-entry-table">
              <thead>
                <tr>
                  <th>Ledger account</th>
                  <th>Line memo</th>
                  <th>Debit (PKR)</th>
                  <th>Credit (PKR)</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {form.lines.map((line, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        aria-label={`Account line ${index + 1}`}
                        required
                        value={line.accountId}
                        onChange={(event) => updateLine(index, 'accountId', event.target.value)}
                      >
                        <option value="">Select account</option>
                        {data.accounts
                          .filter((item) => item.status === 'Active')
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.code} · {item.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <input
                        aria-label={`Memo line ${index + 1}`}
                        value={line.memo}
                        onChange={(event) => updateLine(index, 'memo', event.target.value)}
                        placeholder="Optional detail"
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Debit line ${index + 1}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.debit}
                        onChange={(event) => updateLine(index, 'debit', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Credit line ${index + 1}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.credit}
                        onChange={(event) => updateLine(index, 'credit', event.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="fa-remove-line"
                        type="button"
                        disabled={form.lines.length <= 2}
                        onClick={() =>
                          setForm({
                            ...form,
                            lines: form.lines.filter((_, rowIndex) => rowIndex !== index),
                          })
                        }
                        aria-label={`Remove line ${index + 1}`}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">
                    <button
                      className="fa-link"
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          lines: [
                            ...form.lines,
                            { accountId: '', debit: '', credit: '', memo: '' },
                          ],
                        })
                      }
                    >
                      <Plus size={14} />
                      Add line
                    </button>
                  </td>
                  <td>{money(debit)}</td>
                  <td>{money(credit)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <div
            className={`fa-balance-check ${Math.abs(debit - credit) < 0.005 && debit > 0 ? 'balanced' : ''}`}
          >
            <span>
              {Math.abs(debit - credit) < 0.005 && debit > 0 ? (
                <CheckCircle2 size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              {Math.abs(debit - credit) < 0.005 && debit > 0
                ? 'Debits equal credits'
                : `Out of balance · ${money(Math.abs(debit - credit))}`}
            </span>
            <b>
              Debits {money(debit)} <i /> Credits {money(credit)}
            </b>
          </div>
        </Card>
        <div className="fa-form-actions">
          <span>Posted entries update the ledger immediately and cannot be edited.</span>
          <div>
            <Button kind="secondary" onClick={(event) => submit(event, 'Draft')}>
              <FileText size={15} />
              Save draft
            </Button>
            <Button
              disabled={!debit || Math.abs(debit - credit) >= 0.005}
              onClick={(event) => submit(event, 'Posted')}
            >
              <Check size={15} />
              Post journal
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default JournalFormPage
