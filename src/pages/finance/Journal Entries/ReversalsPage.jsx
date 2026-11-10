import { useState } from 'react'
import {
  money,
  dateLabel,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Field,
  Empty,
  sum,
  ListChecks,
  ShieldCheck,
  TrendingDown,
} from '../financeShared'

function ReversalsPage({ data, reverseJournal, onNotify, onNavigate }) {
  const eligible = data.entries.filter(
    (item) =>
      item.status === 'Posted' &&
      !item.reversalOf &&
      !data.entries.some((other) => other.reversalOf === item.id),
  )
  const [entryId, setEntryId] = useState(eligible[0]?.id || '')
  const [reason, setReason] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!reason.trim()) return onNotify('Add the reason for this reversal.')
    reverseJournal(entryId, reason)
    setReason('')
  }
  const reversals = data.entries.filter((item) => item.reversalOf)
  return (
    <>
      <PageHeader
        title="Reversals"
        subtitle="Correct posted accounting errors with a traceable reversing journal; never edit a posted entry."
        icon={TrendingDown}
      />
      <Card title="Create a reversing journal" icon={ShieldCheck}>
        <form className="fa-inline-form" onSubmit={submit}>
          <Field label="Original posted journal">
            <select required value={entryId} onChange={(event) => setEntryId(event.target.value)}>
              {eligible.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.number} · {item.description}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Reason for reversal">
            <input
              required
              maxLength="140"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain the correction"
            />
          </Field>
          <Button type="submit" disabled={!eligible.length}>
            <TrendingDown size={15} />
            Post reversal
          </Button>
        </form>
        {!eligible.length && <Empty>There are no unreversed posted entries available.</Empty>}
      </Card>
      <Card title={`Reversal audit trail · ${reversals.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Reversal journal',
            'Original entry',
            'Date',
            'Reason',
            'Debit / Credit',
            'Status',
          ]}
        >
          {reversals.map((entry) => (
            <tr key={entry.id}>
              <td>
                <b>{entry.number}</b>
              </td>
              <td>
                {data.entries.find((item) => item.id === entry.reversalOf)?.number ||
                  entry.reference}
              </td>
              <td>{dateLabel(entry.date)}</td>
              <td>{entry.description.replace('Reversal: ', '')}</td>
              <td>{money(sum(entry.lines, (line) => Number(line.debit)))}</td>
              <td>
                <Status>{entry.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
        {!reversals.length && (
          <Empty>Reversals remain linked to their original journals for audit review.</Empty>
        )}
      </Card>
    </>
  )
}

export default ReversalsPage
