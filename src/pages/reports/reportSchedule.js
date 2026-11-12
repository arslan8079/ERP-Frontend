export function buildReportSchedule(values, id, createdAt) {
  return {
    id,
    name: values.name.trim(),
    report: values.report,
    frequency: values.frequency,
    recipient: values.recipient.trim(),
    status: 'Planned (not executed)',
    createdAt,
  }
}
