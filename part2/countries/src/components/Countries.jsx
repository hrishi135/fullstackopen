import CountryDetail from "./CountryDetail"

const Countries = ({countries, setFilter, setFilterList}) => {
    if (countries.length > 10) {
      return (
        <div>Too many matches, specify another filter</div>
      )
    } else if (countries.length === 0) {
      return (
        <div>No match found</div>
      )
    } else if (countries.length === 1) {
        return (
        <CountryDetail countryName={countries[0]}/>
      )
    }

    const buttonClick = (e) => {
        setFilter(e.target.value)
        setFilterList(e)
    }
    
    return (
      countries.map((country) => 
      <div key={country}>
        {country} 
        <button value={country} onClick={buttonClick}>show</button>
      </div>
      )
    )
  }

export default Countries