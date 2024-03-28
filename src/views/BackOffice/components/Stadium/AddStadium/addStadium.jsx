import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  GetCitybyStateAndCountry,
  GetCountries,
  GetStateByCountry,
} from '../../../../../Services/APis/CountryAPI';
import StadiumService from '../../../../../Services/FrontOffice/apiStadium';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
const AddStadium = () => {
  const [showMap, setShowMap] = useState(false);
  const [showScheduale, setShowScheduale] = useState(false);

  const [stadium, setStadium] = useState({
    name: '',
    ownership: '',
    address: '',
    city: '',
    state: '',
    country: '',
    Status:'',
    capacity: 0,
    maintenancePeriod: {
        startDate: '',
        endDate: '',
      },
    bookingSchedule: '',
  });
  const [Countries, setCountries] = useState([]);
  const [SelectedCountry, setSelectedCountry] = useState('');
  const [States, setStates] = useState([]);
  const [SelectedState, setSelectedState] = useState('');
  const [Cities, setCities] = useState([]);
  const [SelectedCity, setSelectedCity] = useState('');
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({});
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [status, setStatus] = useState('available'); // Default status
  const [maintenancePeriod, setMaintenancePeriod] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleDateSelect = (ranges) => {
    const today = new Date();
    const { startDate, endDate } = ranges.selection;
  
    endDate.setHours(23, 59, 59, 999);

    console.log('Selected Dates:', ranges.selection);
    setSelectedDates([ranges.selection]);
    setMaintenancePeriod({
      startDate: startDate,
      endDate: endDate
    });
    
    // Convert today's date to the same format as startDate and endDate
    const formattedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
    // Check if today's date is within the maintenance period
    if (formattedToday >= new Date(startDate) && formattedToday <= new Date(endDate)) {
      setStatus('unavailable');
    } else {
      setStatus('available');
    }
  };
  
  



  useEffect(() => {
    GetCountries().then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    if (SelectedCountry) {
      GetStateByCountry(SelectedCountry).then((response) => {
        setStates(response);
      });
    }
  }, [SelectedCountry]);

  useEffect(() => {
    if (SelectedState) {
      GetCitybyStateAndCountry(SelectedCountry, SelectedState).then(
        (response) => {
          setCities(response);
        }
      );
    }
  }, [SelectedState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStadium({ ...stadium, [name]: value });
  };

  const handleCountryChange = (e) => {
    const { value } = e.target;
    setSelectedCountry(value);
    setStadium({ ...stadium, country: value });
    setSelectedState('');
    setSelectedCity('');
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    setSelectedState(value);
    setStadium({ ...stadium, state: value });
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setSelectedCity(value);
    setStadium({ ...stadium, city: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
const startDate = new Date(selectedDates[0].startDate.getTime() - selectedDates[0].startDate.getTimezoneOffset() * 60000).toISOString();
const endDate = new Date(selectedDates[0].endDate.getTime() - selectedDates[0].endDate.getTimezoneOffset() * 60000).toISOString();

  
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);
      // Add address fields from the address state to the stadium object
      const addedStadium = await StadiumService.addStadium({
        ...stadium,
        address: address,
        status:status,
        maintenancePeriod: {
          startDate: startDate,
          endDate: endDate
        }
      });
  
      alert('Stadium added successfully');
      console.log('Added to database:', addedStadium);
  
      // Clear form fields after successful submission
      setStadium({
        name: '',
        ownership: '',
        address: '',
        capacity: 0,
        maintenancePeriod: {
          startDate: '',
          endDate: '',
        },
        bookingSchedule: '',
      });
      setAddress({}); // Clear the address state
      setSelectedDates([ // Clear the selected dates state
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);
    } catch (error) {
      console.error('Failed to add stadium:', error);
      alert('Failed to add stadium');
    }
  };
  
  
  useEffect(() => {
    if (showMap) {
      const map = L.map(mapRef.current, {
        center: [48.1500327, 11.5753989],
        zoom: 15,
      });

      const myAPIKey = "2e70e222d1f1499bb96973e923141c23";
      const tiles = L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`, {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      });

      tiles.addTo(map);

      map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        const marker = L.marker([lat, lng]).addTo(map);
        markerRef.current = marker;

        const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${myAPIKey}`;

        fetch(reverseGeocodingUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data.features && data.features.length > 0) {
              const addressInfo = data.features[0].properties;
              setAddress({
                country: addressInfo.country,
                state: addressInfo.state,
                city: addressInfo.city,
                street: addressInfo.street,
                postcode: addressInfo.postcode,
              });
              setStadium({ ...stadium, address: addressInfo.formatted });
            } else {
              setAddress({});
              alert('No address found for this location.');
            }
          })
          .catch((error) => {
            console.error('Error during reverse geocoding:', error);
          });
      });

      return () => {
        map.off('click');
        map.remove();
      };
    }
  }, [showMap]);

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <h4>Stadium Details</h4>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={stadium.name}
              className={`rounded-md border ${
                errors.city
                    ? "border-red-500"
                    : "border-body-color border-opacity-10"
                } py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`flex w-full ${errors.capacity ? "border border-red-500" : "border-body-color border-opacity-10"} ${errors.capacity ? "" : "mb-4"}`}>
                        <input
                            type="number"
                            name="capacity"
                            placeholder="Capacity"
                            onChange={handleChange}
                            value={stadium.capacity}
                            className="py-3 px-6 w-full rounded-md text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                        />
                    </div>
                    {errors.capacity && <span className="text-xs text-red-500 mt-1">{errors.capacity}</span>}

              
{/* Maintenance period input fields */}
<div>
          <label htmlFor="maintenancePeriod">Maintenance Period:</label>
          <div className="flex items-center">
  <p className="mr-4 text-blue-500 font-bold">Do you have a Maintenance Period to add?</p>
  <div className="flex items-center">
    <input type="radio" id="yes" name="sponsorOption" value="yes" onClick={() => setShowScheduale(true)} />
    <label htmlFor="yes" className="mr-2">Yes</label>
    <input type="radio" id="no" name="sponsorOption" value="no" onClick={() => setShowScheduale(false)} />
    <label htmlFor="no" className="mr-4">No</label>
  </div>
</div>
         {showScheduale &&(
             <div>
        <DateRangePicker
  ranges={selectedDates}
  onChange={handleDateSelect}
/>
      </div>
      )}
        </div>
          {/* Add other stadium fields here */}
        </div>
  
        {showMap ? (
          <div>
            <h4>Map</h4>
            <div ref={mapRef} style={{ height: '400px', marginBottom: '20px' }}>
              <p>Select a location on the map to set the stadium's address.</p>
            </div>
            <h4>Address Details</h4>
            {address.street && <p>Street: {address.street}</p>}
            {address.postcode && <p>Postcode: {address.postcode}</p>}
            {address.city && <p>City: {address.city}</p>}
            {address.state && <p>State: {address.state}</p>}
            {address.country && <p>Country: {address.country}</p>}
          </div>
        ) : (
          <div>
            <h4>Country, State, and City</h4>
            <div>
          <button type="button" onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
            <div className="flex flex-col w-full mr-4">
                        <select
                            onChange={handleCountryChange}
                            name="country"
                            value={SelectedCountry}
                            className={`rounded-md border ${
                                errors.country
                                    ? "border-red-500"
                                    : "border-body-color border-opacity-10"
                                } py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
                        >
                            <option disabled value="">
                                Select Country
                            </option>
                            {Countries.map((country, index) => (
                                <option key={index} value={country.iso2}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && (
                            <span className="text-xs text-red-500 mt-1">
                                {errors.country}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col w-full mr-4">
                        <select
                            onChange={handleStateChange}
                            name="state"
                            value={SelectedState}
                            className={`rounded-md border ${
                                errors.state
                                    ? "border-red-500"
                                    : "border-body-color border-opacity-10"
                                }
py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
                        >
                            <option disabled value="">
                                Select State
                            </option>
                            {States.map((state, index) => (
                                <option key={index} value={state.iso2}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        {errors.state && (
                            <span className="text-xs text-red-500 mt-1">
                                {errors.state}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col w-full">
                        <select
                            onChange={handleCityChange}
                            name="city"
                            value={SelectedCity}
                            className={`rounded-md border ${
                                errors.city
                                    ? "border-red-500"
                                    : "border-body-color border-opacity-10"
                                } py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
                        >
                            <option disabled value="">
                                Select City
                            </option>
                            {Cities.map((city, index) => (
                                <option key={index} value={city.iso2}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {errors.city && (
                            <span className="text-xs text-red-500 mt-1">
                                {errors.city}
                            </span>
                        )}
                    </div>

                   
            {/* Add State and City selection similarly */}
          </div>
        )}
  
        <div>
          <button type="button" onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
  
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddStadium;





