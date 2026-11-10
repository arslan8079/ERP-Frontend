export default function DealerCategoriesPage({ context }) {
  const { data, categoryDraft, setCategoryDraft, addCategory, table, header, Plus, Users } = context
  const page = 'Dealer Categories'

  if (page === 'Dealer Categories')
    return (
      <div className="dealer-page">
        {header(
          'Maintain dealer classifications used for channel coverage and account terms.',
          Users,
        )}
        <form className="dealer-inline-form" onSubmit={addCategory}>
          <input
            value={categoryDraft}
            onChange={(event) => setCategoryDraft(event.target.value)}
            placeholder="New category name"
          />
          <button className="dealer-button">
            <Plus size={15} />
            Add category
          </button>
        </form>
        {table(
          'Dealer categories',
          ['Category', 'Dealers', 'Active accounts'],
          data.categories.map((category) => (
            <tr key={category}>
              <td>
                <b>{category}</b>
              </td>
              <td>{data.dealers.filter((dealer) => dealer.category === category).length}</td>
              <td>
                {
                  data.dealers.filter(
                    (dealer) => dealer.category === category && dealer.status === 'Active',
                  ).length
                }
              </td>
            </tr>
          )),
        )}
      </div>
    )

  return null
}
