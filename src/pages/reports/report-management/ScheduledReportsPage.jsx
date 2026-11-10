import { CalendarClock, Check, Plus, Trash2 } from 'lucide-react'
import { reportGroups } from '../reportsNavigation'
import { EmptyState, Status } from '../ReportsComponents'

export default function ScheduledReportsPage({ context }) {
  const {
    pageHeader,
    scheduleFormOpen,
    setScheduleFormOpen,
    createSchedule,
    settings,
    removeItem,
    onNavigate,
  } = context

  return (
    <div className="reports-page">
      {pageHeader(
        'Configure report delivery schedules for your operational, financial, and compliance teams.',
        CalendarClock,
        {
          action: (
            <button
              className="reports-button"
              onClick={() => setScheduleFormOpen((value) => !value)}
            >
              <Plus size={14} />
              New schedule
            </button>
          ),
        },
      )}
      {scheduleFormOpen && (
        <form className="reports-schedule-form" onSubmit={createSchedule}>
          <label>
            <span>Schedule name</span>
            <input name="name" required placeholder="Weekly dealer outstanding report" />
          </label>
          <label>
            <span>Report</span>
            <select name="report">
              {reportGroups
                .flatMap((group) => group.items)
                .map((item) => (
                  <option key={item}>{item}</option>
                ))}
            </select>
          </label>
          <label>
            <span>Frequency</span>
            <select name="frequency">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </label>
          <label>
            <span>Recipient email</span>
            <input name="recipient" type="email" required placeholder="team@company.com" />
          </label>
          <button className="reports-button">
            <Check size={14} />
            Save schedule
          </button>
        </form>
      )}
      {settings.schedules.length ? (
        <section className="reports-card">
          <header>
            <span>
              <CalendarClock size={16} />
              Delivery schedules
            </span>
            <small>{settings.schedules.length} configured</small>
          </header>
          <div className="reports-table-scroll">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Schedule</th>
                  <th>Report</th>
                  <th>Frequency</th>
                  <th>Recipient</th>
                  <th>Next run</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {settings.schedules.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>{item.name}</b>
                    </td>
                    <td>{item.report}</td>
                    <td>{item.frequency}</td>
                    <td>{item.recipient}</td>
                    <td>{item.nextRun}</td>
                    <td>
                      <Status>{item.status}</Status>
                    </td>
                    <td>
                      <button
                        className="reports-icon-button"
                        onClick={() => removeItem('schedules', item.id, 'Schedule')}
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          title="No report schedules configured"
          detail="Create a schedule to record who should receive recurring reports and how often."
          action={() => setScheduleFormOpen(true)}
          actionLabel="Create schedule"
        />
      )}
      <div className="reports-info-note">
        <CalendarClock size={16} />
        Schedules are saved locally in this prototype; automatic email delivery requires a backend
        scheduler.
      </div>
    </div>
  )
}
