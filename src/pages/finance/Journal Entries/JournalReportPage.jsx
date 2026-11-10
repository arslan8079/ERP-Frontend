import {
  money,
  dateLabel,
  PageHeader,
  Card,
  Table,
  Status,
  Toolbar,
  sum,
  ExportAction,
  BookOpen,
  FileClock,
} from '../financeShared'

function JournalReportPage({ data, search, setSearch, onNotify }) {
  const rows = data.entries.filter((entry) =>
    `${entry.number} ${entry.description} ${entry.reference} ${entry.source}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )
  return (
    <>
      <PageHeader
        title="Journal Report"
        subtitle="Search journal activity by entry number, reference, description or source."
        icon={FileClock}
        action={
          <ExportAction
            filename="journal-report.csv"
            rows={[
              ['Journal', 'Date', 'Reference', 'Description', 'Status', 'Debit', 'Credit'],
              ...rows.map((entry) => [
                entry.number,
                entry.date,
                entry.reference,
                entry.description,
                entry.status,
                sum(entry.lines, (line) => Number(line.debit)),
                sum(entry.lines, (line) => Number(line.credit)),
              ]),
            ]}
            onNotify={onNotify}
          />
        }
      />
      <Card title={`Journal activity · ${rows.length}`} icon={BookOpen}>
        <div className="fa-toolbar">
          <Toolbar
            query={search}
            setQuery={setSearch}
            placeholder="Search journal, description, source or reference"
          />
        </div>
        <Table
          headers={[
            'Journal',
            'Date',
            'Source',
            'Description',
            'Reference',
            'Debits',
            'Credits',
            'Status',
          ]}
        >
          {rows.map((entry) => (
            <tr key={entry.id}>
              <td>
                <b>{entry.number}</b>
              </td>
              <td>{dateLabel(entry.date)}</td>
              <td>{entry.source}</td>
              <td>{entry.description}</td>
              <td>{entry.reference || '—'}</td>
              <td>{money(sum(entry.lines, (line) => Number(line.debit)))}</td>
              <td>{money(sum(entry.lines, (line) => Number(line.credit)))}</td>
              <td>
                <Status>{entry.status}</Status>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}

export default JournalReportPage
