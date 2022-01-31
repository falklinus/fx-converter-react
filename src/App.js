import { useEffect, useState } from 'react'
import Search from './components/Search'
import CountryList from './components/CountryList'
import Amount from './components/Amount'
import { getExchangeRates, login } from './api'
import { useLocalStorage } from './hooks'

const App = () => {
  const storedCountries = localStorage.getItem('countries')
  const [countries, setCountries] = useLocalStorage(
    'countries',
    storedCountries ? JSON.parse(localStorage.getItem('countries')) : []
  )
  const [amount, setAmount] = useState('')

  const addCountry = async (country) => {
    const symbol = country.currency.code
    let rate
    let error
    try {
      const rates = (await getExchangeRates([symbol])).data.data.rates
      const matchingRates = rates.filter((r) => r.code == symbol)
      if (matchingRates && matchingRates.length > 0) rate = matchingRates[0].rate
      else {
        rate = 0
        error = 'Rate not available'
      }
    } catch (err) {
      if (err.response.status === 429) return alert(err.response.data) // Too many requests
      if ([401, 403].includes(err.response.status)) return login() // Update auth token
    }
    setCountries((prevCountries) => [
      ...prevCountries,
      { ...country, currency: { ...country.currency, rate, error } },
    ])
  }

  const deleteCountry = (country) => {
    const deleteIndex = countries.findIndex((c) => c.name == country.name)
    setCountries((prevCountries) => [
      ...prevCountries.slice(0, deleteIndex),
      ...prevCountries.slice(deleteIndex + 1, prevCountries.length),
    ])
  }

  useEffect(() => {
    login()
  }, [])
  return (
    <div className='App'>
      <Search addCountry={addCountry} />
      <Amount amount={amount} setAmount={setAmount} />
      <CountryList countries={countries} deleteCountry={deleteCountry} amount={amount} />
    </div>
  )
}

export default App
