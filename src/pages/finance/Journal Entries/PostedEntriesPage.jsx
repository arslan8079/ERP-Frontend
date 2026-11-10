import {
  money,
  dateLabel,
  PageHeader,
  Button,
  Card,
  Table,
  Status,
  Empty,
  sum,
  BookOpen,
  Check,
  ListChecks,
  Plus,
} from '../financeShared'

function PostedEntriesPage({ data, statuses, title, action, postJournal, onNavigate }) {
  const entries = data.entries
    .filter((item) => statuses.includes(item.status))
    .sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          title === 'Draft Entries'
            ? 'Validate and post saved journal drafts to the general ledger.'
            : 'Browse immutable posted entries that form the source of financial statements.'
        }
        icon={BookOpen}
        action={
          <Button onClick={() => onNavigate('Create Journal Entry')}>
            <Plus size={15} />
            New journal
          </Button>
        }
      />
      <Card title={`Journal register · ${entries.length}`} icon={ListChecks}>
        <Table
          headers={[
            'Journal',
            'Date',
            'Description',
            'Reference',
            'Lines',
            'Debit total',
            'Status',
            ...(action ? ['Action'] : []),
          ]}
        >
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>
                <b>{entry.number}</b>
              </td>
              <td>{dateLabel(entry.date)}</td>
              <td>{entry.description}</td>
              <td>{entry.reference || '—'}</td>
              <td>{entry.lines.length}</td>
              <td>
                <b>{money(sum(entry.lines, (line) => Number(line.debit)))}</b>
              </td>
              <td>
                <Status>{entry.status}</Status>
              </td>
              {action && (
                <td>
                  <Button kind="small" onClick={() => postJournal(entry.id)}>
                    <Check size={13} />
                    Post
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </Table>
        {!entries.length && <Empty>No journal entries in this register.</Empty>}
      </Card>
    </>
  )
}

export default PostedEntriesPage
