import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Countries from './components/Countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredList, setFilteredList] = useState([])

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
         .then(response => {
          const countryNames = response.data.map(country => country['name']['common'])
          setCountries(countryNames)
          setFilteredList(countryNames)
         })
  }, [])

  const filterCountry = (e) => {
    setFilter(e.target.value)
    setFilteredList(countries.filter(country => {
      const name = country.toLowerCase();
      const search = e.target.value.toLowerCase();
      return name.includes(search);
    }))
  }
  

  return (
    <>
    <Filter value={filter} onChange={filterCountry}/>
    <Countries countries={filteredList} setFilter={setFilter} setFilterList={filterCountry}/>
    </>
  )
}

export default App
