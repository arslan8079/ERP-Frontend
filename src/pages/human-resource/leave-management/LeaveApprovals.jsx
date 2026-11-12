import { CheckCircle2, Clock3, ShieldCheck, X } from 'lucide-react'
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

export default function LeaveApprovalsPage({ data, employeeName, onApprove }) {
  return (
    <>
      <PageHeader
        title="Leave Approvals"
        subtitle="Approve or decline pending employee leave applications."
        icon={ShieldCheck}
      />
      <div className="hr-stats compact">
        <Stat
          icon={Clock3}
          label="Pending review"
          value={data.leaveRequests.filter((item) => item.status === 'Pending').length}
          tone="amber"
        />
        <Stat
          icon={CheckCircle2}
          label="Approved"
          value={
            data.leaveRequests.filter(
              (item) => item.status === 'Approved' && item.requestType !== 'Withdrawal',
            ).length
          }
        />
        <Stat
          icon={X}
          label="Declined"
          value={data.leaveRequests.filter((item) => item.status === 'Rejected').length}
          tone="red"
        />
      </div>
      <LeaveRequestTable data={data} employeeName={employeeName} onApprove={onApprove} />
    </>
  )
}
