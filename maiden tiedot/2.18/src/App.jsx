import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    Find countries: <input value={filter} onChange={handleFilterChange} />
  </div>
)

const CountryList = ({ countries }) => (
  <ul>
    {countries.map(country => (
      <li key={country.name.common}>{country.name.common}</li>
    ))}
  </ul>
)

const CountryDetail = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <div>Capital: {country.capital?.[0]}</div>
    <div>Population: {country.population}</div>
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages || {}).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width={150} />
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    const value = event.target.value
    setFilter(value)

    const filteredCountries = countries.filter(country =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    )
    setFiltered(filteredCountries)
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      {filtered.length > 10 && <div>Too many matches, specify another filter</div>}
      {filtered.length > 1 && filtered.length <= 10 && (
        <CountryList countries={filtered} />
      )}
      {filtered.length === 1 && <CountryDetail country={filtered[0]} />}
    </div>
  )
}

export default App