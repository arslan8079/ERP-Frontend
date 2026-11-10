import { Clock3, ListChecks, Plus, Star, TrendingUp } from 'lucide-react'
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

export default function PerformanceReviewsPage({ data, employeeName, onNavigate }) {
  return (
    <>
      <PageHeader
        title="Performance Reviews"
        subtitle="Track review-cycle completion and employee performance outcomes."
        icon={Star}
        action={
          <Button onClick={() => onNavigate('Employee Evaluations')}>
            <Plus size={15} />
            New evaluation
          </Button>
        }
      />
      <div className="hr-stats compact">
        <Stat icon={Star} label="Completed reviews" value={data.reviews.length} />
        <Stat
          icon={Clock3}
          label="Pending reviews"
          value={Math.max(0, data.employees.length - data.reviews.length)}
          tone="amber"
        />
        <Stat
          icon={TrendingUp}
          label="Average rating"
          value={`${data.reviews.length ? (data.reviews.reduce((sum, item) => sum + Number(item.rating), 0) / data.reviews.length).toFixed(1) : '—'} / 5`}
          tone="blue"
        />
      </div>
      <Card title="Review cycle register" icon={ListChecks}>
        <Table headers={['Review', 'Employee', 'Period', 'Rating', 'Summary', 'Status']}>
          {data.reviews.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{employeeName(item.employeeId)}</td>
              <td>{item.period}</td>
              <td>
                <span className="hr-rating">
                  <Star size={13} fill="currentColor" />
                  {Number(item.rating).toFixed(1)}
                </span>
              </td>
              <td>{item.notes}</td>
              <td>
                <span className={`hr-status ${item.status.toLowerCase()}`}>{item.status}</span>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
