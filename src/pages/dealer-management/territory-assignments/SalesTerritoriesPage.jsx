export default function SalesTerritoriesPage({ context }) {
  const { data, addTerritory, table, header, status, MapPin, Plus } = context
  const page = 'Sales Territories'

  if (page === 'Sales Territories')
    return (
      <div className="dealer-page">
        {header(
          'Define geographic sales coverage and the cities served by each territory.',
          MapPin,
        )}
        <form className="dealer-inline-form" onSubmit={addTerritory}>
          <input name="name" required placeholder="Territory name" />
          <input name="region" required placeholder="Province / region" />
          <input name="cities" placeholder="Covered cities" />
          <button className="dealer-button">
            <Plus size={15} />
            Add territory
          </button>
        </form>
        {table(
          'Territory register',
          ['Territory', 'Region', 'Cities covered', 'Assigned dealers', 'Status'],
          data.territories.map((territory) => (
            <tr key={territory.id}>
              <td>
                <b>{territory.name}</b>
                <small>{territory.id}</small>
              </td>
              <td>{territory.region}</td>
              <td>{territory.cities}</td>
              <td>
                {
                  data.assignments.filter(
                    (item) => item.territoryId === territory.id && item.status === 'Active',
                  ).length
                }
              </td>
              <td>{status(territory.status)}</td>
            </tr>
          )),
        )}
      </div>
    )

  return null
}
