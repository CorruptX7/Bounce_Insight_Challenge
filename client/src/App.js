import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import './styles.css'

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  })

  const [backendData, setBackendData] = useState([])
  const [country, setCountry] = useState('Afghanistan')
  const [errorMessage, setErrorMessage] = useState(null)

  const fetchData = (country) => {
    fetch(`/country?country=${country}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(country)
        }
        return response.json()
      })
      .then((data) => {
        setBackendData(data)
        setErrorMessage(null)
      })
      .catch((error) => {
        setErrorMessage('Error fetching data: ' + country + ' is not a country')
      })
  }

  useEffect(() => {
    fetchData(country)
  }, [])

  function handleSubmit(e) {
    e.preventDefault() // prevent page from refreshing

    if (country === '') return

    fetchData(country)
    setCountry('')
  }

  const renderForm = (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Search by Country</h1>
      <div className="inputContainer">
        <SearchIcon fontSize="small" className="icon" />
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          type="text"
          id="item"
          className="input"
          placeholder="Search country"
        />
      </div>
    </form>
  )

  return (
    <div>
      {errorMessage ? (
        <>
          <div className="container">
            {renderForm}
            <div className="errorContainer">
              <p className="error">{errorMessage}</p>
            </div>
          </div>
        </>
      ) : backendData === null || !isLoaded ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="container">
            {renderForm}

            {backendData.map((country, index) => (
              <div key={index}>
                <div>
                  <h3>COUNTRY INFORMATION</h3>
                  <div className="infoLine"> </div>
                </div>
                <div className="informationContainer">
                  {/* COUNTRY */}
                  <p className="title">COUNTRY</p>
                  <div className="countryContainer">
                    <p>{country.name.common}</p>
                    <img
                      src={country.flags.png}
                      alt={country.name.common}
                      className="countryFlag"
                    />
                  </div>
                  <div className="drawline"> </div>

                  {/* CAPITAL */}
                  <p className="title">CAPITAL</p>
                  <div className="infoContainer">
                    <p>{country.capital}</p>
                  </div>
                  <div className="drawline"> </div>

                  {/* POPULATION */}
                  <p className="title">POPULATION</p>
                  <div className="infoContainer">
                    <p>{country.population}</p>
                  </div>
                  <div className="drawline"> </div>

                  {/* AREA */}
                  <p className="title">AREA</p>
                  <div className="infoContainer">
                    <p>{country.area} km&sup2;</p>
                  </div>
                  <div className="drawline"> </div>

                  {/* REGION */}
                  <p className="title">REGION</p>
                  <div className="infoContainer">
                    <p>{country.region}</p>
                  </div>
                  <div className="drawline"> </div>

                  {/* SUBREGION */}
                  <p className="title">SUBREGION</p>
                  <div className="infoContainer">{country.subregion}</div>
                  <div className="drawline"> </div>

                  {/* LANGUAGES */}
                  <p className="title">LANGUAGES</p>
                  <div className="infoContainer">
                    {Object.values(country.languages).join(', ')}
                  </div>
                  <div className="drawline"> </div>

                  {/* CURRENCY */}
                  <p className="title">CURRENCY</p>
                  <div className="infoContainer">
                    {Object.keys(country.currencies).map(
                      (currencyCode, index) => (
                        <div key={index}>
                          {country.currencies[currencyCode].name} (
                          {country.currencies[currencyCode].symbol})
                        </div>
                      )
                    )}
                  </div>
                  <div className="drawline"> </div>

                  {/* MAP */}
                  <p className="title">MAP (Capital City)</p>
                  <GoogleMap
                    zoom={10}
                    center={{
                      lat: country.capitalInfo.latlng[0],
                      lng: country.capitalInfo.latlng[1],
                    }}
                    mapContainerClassName="mapContainer"
                  ></GoogleMap>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
