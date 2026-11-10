import { CalendarDays, Plus } from 'lucide-react'
import * as Shared from '../shared'

const {
  today,
  formatDate,
  daysBetween,
  PageHeader,
  Button,
  Stat,
  Card,
  EmptyState,
  Table,
  MetricBar,
  LeaveRequestTable,
  downloadCsv,
} = Shared

export default function LeaveRequestsPage({ data, employeeName, onNavigate }) {
  return (
    <>
      <PageHeader
        title="Leave Requests"
        subtitle="View submitted leave applications and their current approval status."
        icon={CalendarDays}
        action={
          <Button onClick={() => onNavigate('Apply for Leave')}>
            <Plus size={15} />
            Apply for leave
          </Button>
        }
      />
      <LeaveRequestTable data={data} employeeName={employeeName} />
    </>
  )
}
