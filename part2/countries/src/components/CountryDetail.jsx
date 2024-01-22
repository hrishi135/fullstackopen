import axios from "axios"
import { useEffect, useState } from "react"

const CountryDetail = ({countryName}) => {
    const [country, setCountry ] = useState(null)
    
    useEffect(() => {
        axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
        .then(response => {
            setCountry(response.data)
        })
    }, [countryName])
    
    console.log(country);

    if (country) {
        return (
            <>
            <h2>{country.name.common}</h2>
            <div>capital {country.capital}</div>
            <div>area {country.area}</div>
            <h3>languages:</h3>
            <ul>
                {Object.entries(country.languages).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    return (
                        <li key={key}>{value}</li>
                    )
                })}
            </ul>
            <br />
            <img src={`${country.flags.png}`} alt={`${country.flags.alt}`} />
            </>
        )
    }
    

}

export default CountryDetail