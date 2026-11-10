export default function AssignmentHistoryPage({ context }) {
  const { data, table, header, Clock3, dealerName } = context
  const page = 'Assignment History'

  if (page === 'Assignment History')
    return (
      <div className="dealer-page">
        {header('Audit trail of dealer territory, officer, and assignment changes.', Clock3)}
        {table(
          'Assignment history',
          ['Date', 'Dealer', 'Change', 'Details'],
          data.history
            .filter((item) => item.type.includes('assign') || item.type.includes('reassign'))
            .map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{dealerName(data, item.dealerId)}</td>
                <td>{item.type}</td>
                <td>{item.details}</td>
              </tr>
            )),
        )}
      </div>
    )

  return null
}
