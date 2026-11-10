export default function AddDealerPage({ context }) {
  const { data, createDealer, territoryOptions, formPage, field, Users } = context
  const page = 'Add Dealer'

  if (page === 'Add Dealer')
    return formPage(
      'New dealer registration',
      'Capture dealer identity and business details. New accounts remain pending until verification is complete.',
      Users,
      [
        field('Legal / trading name', 'name', {
          required: true,
          placeholder: 'Dealer business name',
        }),
        field('Dealer category', 'category', {
          required: true,
          options: data.categories.map((item) => <option key={item}>{item}</option>),
        }),
        field('Owner / contact person', 'owner', { required: true, placeholder: 'Full name' }),
        field('Phone number', 'phone', { required: true, placeholder: '+92 300 000 0000' }),
        field('Email address', 'email', { type: 'email', placeholder: 'dealer@business.com' }),
        field('City', 'city', { required: true, placeholder: 'City / district' }),
        field('Sales territory', 'territoryId', {
          options: territoryOptions,
          placeholder: 'Select territory',
        }),
        field('Requested credit limit (PKR)', 'creditLimit', {
          type: 'number',
          min: 0,
          step: 1000,
          value: 0,
        }),
        field('Business address', 'address', {
          wide: true,
          textarea: true,
          placeholder: 'Registered business address',
        }),
      ],
      createDealer,
      'Register dealer',
    )

  return null
}
