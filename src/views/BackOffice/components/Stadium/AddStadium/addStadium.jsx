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
    const { startDate, endDate } = ranges.selection;
  
    if (!startDate || !endDate) {
      // If either startDate or endDate is null, set status to 'available'
      setStatus('available');
      return;
    }
  
    // Convert today's date to the same format as startDate and endDate
    const today = new Date();
    const formattedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
    endDate.setHours(23, 59, 59, 999);
  
    console.log('Selected Dates:', ranges.selection);
    setSelectedDates([ranges.selection]);
    setMaintenancePeriod({
      startDate: startDate,
      endDate: endDate
    });
  
    // Check if today's date is within the maintenance period
    if (formattedToday >= new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) &&
        formattedToday <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())) {
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
    console.log(Cities)
  }, [SelectedState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStadium({ ...stadium, [name]: value });
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    setSelectedState(value);
  
    // Update the stadium address with the selected state
    setStadium(prevStadium => ({
      ...prevStadium,
      state: value
    }));
  };
  
  const handleCountryChange = (e) => {
    const { value } = e.target;
    setSelectedCountry(value);
  
    // Update the stadium address with the selected country
    setStadium(prevStadium => ({
      ...prevStadium,
      country: value
    }));
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setSelectedCity(value);
  
    // Update the stadium address with the selected city
    setStadium(prevStadium => ({
      ...prevStadium,
      city: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let maintenancePeriod = null; // Initialize maintenance period as null

      // Check if showScheduale is true (maintenance period is enabled)
      if (showScheduale) {
        // Extract start and end dates from selectedDates state
        const startDate = selectedDates[0].startDate.toISOString();
        const endDate = selectedDates[0].endDate.toISOString();
        
        // Set maintenancePeriod object with start and end dates
        maintenancePeriod = {
          startDate,
          endDate
        };
      }

      // Determine which address to use based on whether the map was used or not
    const finalAddress = showMap ? address : {
      country: SelectedCountry,
      state: SelectedState,
      city: SelectedCity
      // Add other address fields as needed
    };

      // Add address fields from the address state to the stadium object
      const addedStadium = await StadiumService.addStadium({
        ...stadium,
        address: finalAddress,
        status:status,
        maintenancePeriod: maintenancePeriod,
      });
  
      alert('Stadium added successfully');
      console.log('Added to database:', addedStadium);
  
      // Clear form fields after successful submission
      setStadium({
        name: '',
        ownership: '',
        capacity: 0,
        maintenancePeriod: {
          startDate: '',
          endDate: '',
        },
        bookingSchedule: '',
      });

      if (!showMap) {
        // Clear selected country, state, and city if dropdowns were used
        setSelectedCountry('');
        setSelectedState('');
        setSelectedCity('');
      }
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
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-6">
  <form onSubmit={handleSubmit} noValidate>
    <div className="mb-6">
      <h4 className="text-xl font-semibold mb-4">Stadium Details</h4>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={stadium.name}
          className={`mt-1 block w-full rounded-md border ${
            errors.city ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary dark:border-gray-600 bg-primary py-2 px-4 text-sm font-semibold capitalize`}
          onChange={handleChange}
          required
        />
        {errors.city && <span className="text-xs text-red-500 mt-1">{errors.city}</span>}
      </div>
      <div className="mb-6">
        <label htmlFor="ownership" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ownership:</label>
        <input
          type="text"
          id="ownership"
          name="ownership"
          value={stadium.ownership}
          className={`mt-1 block w-full rounded-md border ${
            errors.ownership ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary dark:border-gray-600 bg-primary py-2 px-4 text-sm font-semibold capitalize`}
          onChange={handleChange}
          required
        />
        {errors.ownership && <span className="text-xs text-red-500 mt-1">{errors.ownership}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity:</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={stadium.capacity}
          className={`mt-1 block w-full rounded-md border ${
            errors.capacity ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary dark:border-gray-600 bg-primary py-2 px-4 text-sm font-semibold capitalize`}
          onChange={handleChange}
          required
        />
        {errors.capacity && <span className="text-xs text-red-500 mt-1">{errors.capacity}</span>}
      </div>
      <div className="flex items-center mb-4">
        <p className="mr-4 text-blue-500 font-bold">Do you have a Maintenance Period to add?</p>
        <div className="flex items-center">
          <input type="radio" id="yes" name="sponsorOption" value="yes" onClick={() => setShowScheduale(true)} />
          <label htmlFor="yes" className="mr-2">Yes</label>
          <input type="radio" id="no" name="sponsorOption" value="no" onClick={() => setShowScheduale(false)} />
          <label htmlFor="no" className="mr-4">No</label>
        </div>
      </div>
      {showScheduale && (
        <div>
          <DateRangePicker
            ranges={selectedDates}
            onChange={handleDateSelect}
          />
        </div>
      )}
    </div>

    {showMap ? (
      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-4">Map</h4>
        <div ref={mapRef} className="h-64 mb-4 rounded-md overflow-hidden"></div>
        <h4 className="text-xl font-semibold mb-2">Address Details</h4>
        {address.street && <p className="mb-1">Street: {address.street}</p>}
        {address.postcode && <p className="mb-1">Postcode: {address.postcode}</p>}
        {address.city && <p className="mb-1">City: {address.city}</p>}
        {address.state && <p className="mb-1">State: {address.state}</p>}
        {address.country && <p className="mb-1">Country: {address.country}</p>}
      </div>
    ) : (
      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-4">Country, State, and City</h4>
        <div className="flex mb-4">
          <button type="button" onClick={() => setShowMap(!showMap)} className="text-primary font-semibold underline focus:outline-none hover:text-primary-dark">
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country:</label>
            <select
              onChange={handleCountryChange}
              name="country"
              value={SelectedCountry}
              className={`mt-1 block w-full rounded-md border ${
                errors.country ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary dark:border-gray-600 bg-primary py-2 px-4 text-sm font-semibold capitalize`}
            >
              <option disabled value="">Select Country</option>
              {Countries.map((country, index) => (
                <option key={index} value={country.iso2}>{country.name}</option>
              ))}
            </select>
            {errors.country && <span className="text-xs text-red-500 mt-1">{errors.country}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">State:</label>
            <select
              onChange={handleStateChange}
              name="state"
              value={SelectedState}
              className={`mt-1 block w-full rounded-md border ${
                errors.state ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary dark:border-gray-600 bg-primary py-2 px-4 text-sm font-semibold capitalize`}
            >
              <option disabled value="">Select State</option>
              {States.map((state, index) => (
                <option key={index} value={state.iso2}>{state.name}</option>
              ))}
            </select>
            {errors.state && <span className="text-xs text-red-500 mt-1">{errors.state}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City:</label>
            <select
              onChange={handleCityChange}
              name="city"
              value={SelectedCity}
              className={`mt-1 block w-full rounded-md border ${
                errors.city ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary dark:border-gray-600 bg-primary py-2 px-4 text-sm font-semibold capitalize`}
            >
              <option disabled value="">Select City</option>
              {Cities.map((city, index) => (
                <option key={index} value={city.iso2}>{city.name}</option>
              ))}
            </select>
            {errors.city && <span className="text-xs text-red-500 mt-1">{errors.city}</span>}
          </div>
        </div>
      </div>
    )}

    <div className="flex justify-between">
      <button type="button" onClick={() => setShowMap(!showMap)} className="text-primary font-semibold underline focus:outline-none hover:text-primary-dark">
        {showMap ? 'Hide Map' : 'Show Map'}
      </button>
      <button type="submit" className="bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50">
        Submit
      </button>
    </div>
  </form>
</div>

  );
};  

export default AddStadium;




