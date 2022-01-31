import { useState } from 'react'
import { login, searchCountryByName } from '../api'
import { useDebounce } from '../hooks'

const Search = ({ addCountry }) => {
  const [search, setSearch] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const searchCountry = async (name) => {
    try {
      if (name.length < 3) return setSearchResults([])
      const countries = (await searchCountryByName(name)).data.data.countries
      setSearchResults(countries || [])
    } catch (err) {
      setSearch('')
      if (err?.response?.status === 429) return alert(err.response.data) // Too many requests
      if ([401, 403].includes(err?.response?.status)) return login() // Update auth token
      console.error(err)
    }
  }

  useDebounce(() => searchCountry(search), 700, [search])

  useDebounce(
    () => {
      setShowSearchResults(searchResults.length > 0 && searchActive)
    },
    100,
    [searchResults, searchActive]
  )

  return (
    <div
      className='search'
      tabIndex='0'
      onBlur={() => {
        setSearchActive(false)
      }}
      onFocus={() => {
        setSearchActive(true)
      }}
    >
      <p className='placeholder'>{search && 'Search country by name'}</p>
      <input
        type='text'
        className={`search__input ${!searchActive && 'muted'}`}
        autoComplete='off'
        autoFocus
        value={search}
        placeholder='Search country by name...'
        onChange={({ target }) => setSearch(target.value)}
      />
      {showSearchResults && (
        <div className='search__results'>
          <ul className='search__results__list'>
            {searchResults.map((country, idx) => (
              <li
                key={idx}
                className='search__results__list__item'
                onClick={() => {
                  addCountry(country)
                  setSearchActive(false)
                }}
              >
                {country.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Search
