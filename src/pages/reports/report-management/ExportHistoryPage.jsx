import { ArrowDownToLine, Download } from 'lucide-react'
import { EmptyState, Status } from '../ReportsComponents'

export default function ExportHistoryPage({ context }) {
  const { pageHeader, settings, onNavigate } = context

  return (
    <div className="reports-page">
      {pageHeader('Review CSV exports created from ERP reporting pages.', Download, {
        export: true,
      })}
      {settings.exports.length ? (
        <section className="reports-card">
          <header>
            <span>
              <ArrowDownToLine size={16} />
              Export log
            </span>
            <small>{settings.exports.length} exports</small>
          </header>
          <div className="reports-table-scroll">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Report</th>
                  <th>Format</th>
                  <th>Rows</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {settings.exports.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>{item.name}</td>
                    <td>{item.format}</td>
                    <td>{item.rows}</td>
                    <td>
                      <Status>{item.status}</Status>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          title="No exports recorded"
          detail="Export any report to create an auditable export-history entry."
          action={() => onNavigate('Executive Overview')}
          actionLabel="Open reports"
        />
      )}
    </div>
  )
}
