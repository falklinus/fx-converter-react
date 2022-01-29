import Delete from './Delete'

const CountryList = ({ countries, deleteCountry, amount }) => {
  return (
    <div className='countryList'>
      <div className='countryList__header'>
        <span className='country'>Country</span>
        <span>Population</span>
        <span>Currency</span>
        <span>Amount</span>
        <span></span>
      </div>
      {countries && (
        <ul className='countryList__list'>
          {countries.map((country, idx) => (
            <li key={idx} className='countryList__list__item'>
              <span>{country.name}</span>
              <span>{parseFloat(country.population).toLocaleString()}</span>
              <span>{country.currency.code}</span>
              <span
                className={`${country.currency.error && 'error'}`}
                data-errormsg={country.currency.error}
              >
                {country.currency.symbol}{' '}
                {amount ? `${parseFloat(amount * country.currency.rate).toLocaleString()}` : 0}
              </span>
              <Delete deleteFunction={() => deleteCountry(country)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CountryList
