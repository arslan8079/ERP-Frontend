export default function DealerAssignmentsPage({ context }) {
  const {
    data,
    assignDealer,
    table,
    header,
    territoryOptions,
    officerOptions,
    status,
    Check,
    Users,
    today,
    dealerName,
    territoryName,
    officerName,
  } = context
  const page = 'Dealer Assignments'

  if (page === 'Dealer Assignments' || page === 'Sales Officer Assignments')
    return (
      <div className="dealer-page">
        {header('Assign each verified dealer to a territory and accountable sales officer.', Users)}
        <form className="dealer-inline-form" onSubmit={assignDealer}>
          <select name="dealerId" required defaultValue="">
            <option value="" disabled>
              Select active dealer
            </option>
            {data.dealers
              .filter((dealer) => dealer.status === 'Active')
              .map((dealer) => (
                <option key={dealer.id} value={dealer.id}>
                  {dealer.name}
                </option>
              ))}
          </select>
          <select name="territoryId" required defaultValue="">
            <option value="" disabled>
              Select territory
            </option>
            {territoryOptions}
          </select>
          <select name="officerId" required defaultValue="">
            <option value="" disabled>
              Assign officer
            </option>
            {officerOptions}
          </select>
          <input name="startDate" type="date" defaultValue={today()} />
          <button className="dealer-button">
            <Check size={15} />
            Save assignment
          </button>
        </form>
        {table(
          'Current dealer assignments',
          ['Dealer', 'Territory', 'Sales officer', 'Effective from', 'Status'],
          data.assignments
            .filter((item) => item.status === 'Active')
            .map((item) => (
              <tr key={item.id}>
                <td>
                  {dealerName(data, item.dealerId)}
                  <small>{item.dealerId}</small>
                </td>
                <td>{territoryName(data, item.territoryId)}</td>
                <td>{officerName(data, item.officerId)}</td>
                <td>{item.startDate}</td>
                <td>{status(item.status)}</td>
              </tr>
            )),
        )}
      </div>
    )

  return null
}
