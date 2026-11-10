import { ArrowRight, FileText, Plus, Trash2 } from 'lucide-react'
import { EmptyState } from '../ReportsComponents'

export default function SavedReportsPage({ context }) {
  const { pageHeader, settings, onNavigate, removeItem, table, moduleRows } = context

  return (
    <div className="reports-page">
      {pageHeader('Save frequently used report views and reopen them for export.', FileText, {
        action: (
          <button className="reports-button" onClick={() => onNavigate('Report Filters')}>
            <Plus size={14} />
            Build a report
          </button>
        ),
      })}
      {settings.savedReports.length ? (
        <div className="reports-saved-grid">
          {settings.savedReports.map((item) => (
            <article className="reports-saved-card" key={item.id}>
              <span>
                <FileText size={18} />
              </span>
              <div>
                <b>{item.name}</b>
                <small>
                  {item.page} · saved {new Date(item.createdAt).toLocaleDateString()}
                </small>
                <small>
                  {item.filters?.module || 'All modules'} · {item.filters?.status || 'All statuses'}
                </small>
              </div>
              <button title="Open report filters" onClick={() => onNavigate(item.page)}>
                <ArrowRight size={15} />
              </button>
              <button
                title="Delete saved report"
                onClick={() => removeItem('savedReports', item.id, 'Saved report')}
              >
                <Trash2 size={15} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved reports yet"
          detail="Open any report and choose Save report to keep its current view here."
          action={() => onNavigate('Executive Overview')}
          actionLabel="Open executive overview"
        />
      )}
      {table('Current report data', moduleRows.slice(0, 10))}
    </div>
  )
}
