import { useState } from 'react'
import { SystemSettingsHeader, SystemSettingsCardHeading } from '../../../App.jsx'
import { Hash, FileText, ShieldCheck, Info, Save } from 'lucide-react'

export default function DocumentNumberingPage({ numbering, activeYear, onSave }) {
  const [drafts, setDrafts] = useState(() => numbering.map((item) => ({ ...item })))
  const [error, setError] = useState('')
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(numbering))
  const isDirty = JSON.stringify(drafts) !== savedSnapshot
  const updateDraft = (id, key, value) => {
    setDrafts((current) =>
      current.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    )
    setError('')
  }
  const previewFor = (item) => {
    const sequence = String(item.nextNumber).padStart(Number(item.padding) || 1, '0')
    return item.resetPeriod === 'Never'
      ? `${item.prefix || 'PREFIX'}-${sequence}`
      : `${item.prefix || 'PREFIX'}-${activeYear?.name.replace(/^FY\s*/, '').replace('–', '-') || 'YYYY-YY'}-${sequence}`
  }
  const save = (event) => {
    event.preventDefault()
    const usedPrefixes = drafts.map((item) => item.prefix.trim().toUpperCase())
    if (drafts.some((item) => !/^[A-Z][A-Z0-9-]{0,7}$/.test(item.prefix.trim().toUpperCase())))
      return setError(
        'Prefixes must start with a letter and use up to 8 letters, numbers, or hyphens.',
      )
    if (new Set(usedPrefixes).size !== usedPrefixes.length)
      return setError('Each document type must use a unique prefix.')
    if (
      drafts.some(
        (item) => !Number.isInteger(Number(item.nextNumber)) || Number(item.nextNumber) < 1,
      )
    )
      return setError('Next sequence numbers must be whole numbers greater than zero.')
    if (
      drafts.some(
        (item) =>
          !Number.isInteger(Number(item.padding)) ||
          Number(item.padding) < 3 ||
          Number(item.padding) > 10,
      )
    )
      return setError('Sequence padding must be between 3 and 10 digits.')
    if (
      drafts.some(
        (item) =>
          Number(item.nextNumber) <
          Number(numbering.find((saved) => saved.id === item.id)?.nextNumber || 1),
      )
    )
      return setError(
        'A sequence cannot be moved backwards; choose the current or a higher next number.',
      )
    const normalized = drafts.map((item) => ({
      ...item,
      prefix: item.prefix.trim().toUpperCase(),
      nextNumber: Number(item.nextNumber),
      padding: Number(item.padding),
    }))
    if (onSave(normalized)) {
      setDrafts(normalized)
      setSavedSnapshot(JSON.stringify(normalized))
      setError('')
    }
  }

  return (
    <div className="branch-list-page system-settings-page">
      <SystemSettingsHeader
        title="Document Numbering"
        description="Maintain unique document prefixes, sequence widths, and period-based resets"
        icon={Hash}
      />
      <section className="system-settings-summary">
        <article>
          <span className="system-summary-icon blue">
            <FileText size={19} />
          </span>
          <div>
            <span>Document sequences</span>
            <strong>{numbering.length}</strong>
            <small>Configured document types</small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon green">
            <Hash size={19} />
          </span>
          <div>
            <span>Active financial year</span>
            <strong>{activeYear?.name || 'Not set'}</strong>
            <small>Used in yearly sequence previews</small>
          </div>
        </article>
        <article>
          <span className="system-summary-icon purple">
            <ShieldCheck size={19} />
          </span>
          <div>
            <span>Sequence safeguards</span>
            <strong>On</strong>
            <small>Unique prefix · no backward edits</small>
          </div>
        </article>
      </section>
      <section className="system-settings-card system-numbering-card">
        <SystemSettingsCardHeading
          icon={Hash}
          title="Numbering rules"
          description="Preview shows the next configured number. Sequences only move forward."
          badge={isDirty ? 'Unsaved changes' : 'Saved'}
        />
        <form onSubmit={save}>
          <div className="system-settings-table-wrap">
            <table className="system-settings-table numbering-table">
              <thead>
                <tr>
                  <th>Document type</th>
                  <th>Prefix</th>
                  <th>Next sequence</th>
                  <th>Digits</th>
                  <th>Reset period</th>
                  <th>Next number preview</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="system-primary-cell">
                        <b>{item.documentType}</b>
                        <small>{item.id}</small>
                      </span>
                    </td>
                    <td>
                      <input
                        className="system-table-input prefix-input"
                        aria-label={`${item.documentType} prefix`}
                        maxLength="8"
                        value={item.prefix}
                        onChange={(event) =>
                          updateDraft(item.id, 'prefix', event.target.value.toUpperCase())
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="system-table-input sequence-input"
                        aria-label={`${item.documentType} next sequence`}
                        type="number"
                        min="1"
                        step="1"
                        value={item.nextNumber}
                        onChange={(event) => updateDraft(item.id, 'nextNumber', event.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className="system-table-select"
                        aria-label={`${item.documentType} sequence digits`}
                        value={item.padding}
                        onChange={(event) => updateDraft(item.id, 'padding', event.target.value)}
                      >
                        {[3, 4, 5, 6, 7, 8, 9, 10].map((digits) => (
                          <option key={digits}>{digits}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="system-table-select"
                        aria-label={`${item.documentType} reset period`}
                        value={item.resetPeriod}
                        onChange={(event) =>
                          updateDraft(item.id, 'resetPeriod', event.target.value)
                        }
                      >
                        <option>Financial year</option>
                        <option>Calendar year</option>
                        <option>Never</option>
                      </select>
                    </td>
                    <td>
                      <span className="system-number-preview">
                        <Hash size={14} />
                        {previewFor(item)}
                      </span>
                    </td>
                  </tr>
                ))}
                {!drafts.length && (
                  <tr>
                    <td className="system-empty-cell" colSpan="6">
                      No document sequences are configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="system-numbering-footer">
            <p>
              <Info size={15} />
              This demo stores numbering rules locally. Document IDs are not issued until a
              transaction workflow is connected.
            </p>
            {error && (
              <span className="system-settings-error" role="alert">
                {error}
              </span>
            )}
            <button type="submit" className="branch-save-button" disabled={!isDirty}>
              <Save size={15} />
              Save numbering rules
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
