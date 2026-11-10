import { Activity, BadgeCheck, Download, Star, TrendingUp, Users } from 'lucide-react'
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

export default function PerformanceReportsPage({ data, employees, onNotify }) {
  const average = data.reviews.length
    ? (
        data.reviews.reduce((sum, item) => sum + Number(item.rating), 0) / data.reviews.length
      ).toFixed(1)
    : '0.0'
  return (
    <>
      <PageHeader
        title="Performance Reports"
        subtitle="Review-cycle participation, ratings and goal progress."
        icon={Activity}
        action={
          <Button
            kind="secondary"
            onClick={() =>
              downloadCsv(
                'performance-report.csv',
                [
                  ['Employee', 'Review period', 'Rating', 'Status'],
                  ...data.reviews.map((item) => [
                    item.employeeId,
                    item.period,
                    item.rating,
                    item.status,
                  ]),
                ],
                onNotify,
              )
            }
          >
            <Download size={15} />
            Export report
          </Button>
        }
      />
      <div className="hr-stats compact">
        <Stat icon={Star} label="Average rating" value={`${average} / 5`} />
        <Stat icon={BadgeCheck} label="Reviews completed" value={data.reviews.length} tone="blue" />
        <Stat
          icon={TrendingUp}
          label="Goals on track"
          value={data.goals.filter((item) => item.status === 'On track').length}
          tone="purple"
        />
        <Stat icon={Users} label="Workforce" value={employees.length} tone="amber" />
      </div>
      <div className="hr-profile-grid">
        <Card title="Review rating distribution" icon={Star}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <MetricBar
              key={rating}
              label={`${rating} star${rating > 1 ? 's' : ''}`}
              value={data.reviews.filter((item) => Math.round(item.rating) === rating).length}
              max={Math.max(1, data.reviews.length)}
            />
          ))}
        </Card>
        <Card title="Goal progress" icon={TrendingUp}>
          {data.goals.map((goal) => (
            <MetricBar key={goal.id} label={goal.title} value={goal.progress} max={100} />
          ))}
          {!data.goals.length && <EmptyState text="No goals are configured." />}
        </Card>
      </div>
    </>
  )
}
