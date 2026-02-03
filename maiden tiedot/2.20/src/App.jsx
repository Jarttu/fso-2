import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => (
    <div>
        Find countries: <input value={filter} onChange={handleFilterChange} />
    </div>
)

const CountryList = ({ countries, handleShowClick }) => (
    <ul>
        {countries.map(country => (
            <li key={country.name.common}>
                {country.name.common}{' '}
                <button onClick={() => handleShowClick(country.name.common)}>show</button>
            </li>
        ))}
    </ul>
)

const CountryDetail = ({ country }) => {
    const [weather, setWeather] = useState(null)
    const apiKey = import.meta.env.VITE_SOME_KEY

    useEffect(() => {
        if (country.capital?.[0] && apiKey) {
            const capital = country.capital[0]
            axios
                .get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                        capital
                    )}&units=metric&appid=${apiKey}`
                )
                .then(response => setWeather(response.data))
                .catch(error => console.error('Weather fetch error:', error))
        }
    }, [country, apiKey])

    return (
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

            {weather && (
                <div>
                    <h3>Weather in {country.capital[0]}</h3>
                    <div>Temperature: {weather.main.temp} °C</div>
                    <div>Wind: {weather.wind.speed} m/s</div>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                </div>
            )}
        </div>
    )
}

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

    const handleShowClick = (name) => {
        setFiltered(countries.filter(c => c.name.common === name))
    }

    return (
        <div>
            <Filter filter={filter} handleFilterChange={handleFilterChange} />

            {filtered.length > 10 && <div>Too many matches, specify another filter</div>}
            {filtered.length > 1 && filtered.length <= 10 && (
                <CountryList countries={filtered} handleShowClick={handleShowClick} />
            )}
            {filtered.length === 1 && <CountryDetail country={filtered[0]} />}
        </div>
    )
}

export default App