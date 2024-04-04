import React, { useState, useRef, useEffect } from 'react';
import StadiumService from '../../../../../Services/FrontOffice/apiStadium';
import { DateRangePicker } from 'react-date-range';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  GetCitybyStateAndCountry,
  GetCountries,
  GetStateByCountry,
} from '../../../../../Services/APis/CountryAPI';

const UpdateStadiumModal = ({ selectedStadium, handleClose }) => {

  const modalRef = useRef(null);
  
  const [stadium, setStadium] = useState({
    name: selectedStadium?.name || '',
    ownership: selectedStadium?.ownership || '',
    address: selectedStadium?.address || '',
    city: selectedStadium?.address?.city || '',
    state: selectedStadium?.address?.state || '',
    country: selectedStadium?.address?.country || '',
    status: selectedStadium?.status || '',
    capacity: selectedStadium?.capacity || 0,
    maintenancePeriod: selectedStadium?.maintenancePeriod || {
      startDate: new Date(),
      endDate: new Date(),
    },
    bookingSchedule: selectedStadium?.bookingSchedule || '',
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
  const [status, setStatus] = useState('available');

  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: selectedStadium.maintenancePeriod ? new Date(selectedStadium.maintenancePeriod.startDate) : null,
      endDate: selectedStadium.maintenancePeriod ? new Date(selectedStadium.maintenancePeriod.endDate) : null,
      key: 'selection'
    }
  ]);
  const [showScheduale, setShowScheduale] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Implement event handlers for toggling maintenance period and map visibility
  const handleShowScheduale = (e) => {
    const { value } = e.target;
    if (value === "yes") {
      setShowScheduale(true);
    } else {
      setShowScheduale(false);
      // Check if there is data present, if yes, set maintenancePeriod to null
      if (stadium.maintenancePeriod && (stadium.maintenancePeriod.startDate || stadium.maintenancePeriod.endDate)) {
        setStadium(prevStadium => ({
          ...prevStadium,
          maintenancePeriod: null
        }));
      } else {
        setStadium(prevStadium => ({
          ...prevStadium,
          maintenancePeriod: {
            startDate: null,
            endDate: null
          }
        }));
      }
    }
  };
  
  
  
  
  
  

  const handleShowMap = () => {
    setShowMap(!showMap);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStadium({ ...stadium, [name]: value });
  };

  const handleDateSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
  
    if (!startDate || !endDate) {
      // If either startDate or endDate is null, set status to 'available'
      setStatus('available');
      setSelectedDates([ranges.selection]);
      setStadium({
        ...stadium,
        maintenancePeriod: {
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null
        }
      });
      return;
    }
  
    // Convert today's date to the same format as startDate and endDate
    const today = new Date();
    const formattedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
    endDate.setHours(23, 59, 59, 999);
  
    console.log('Selected Dates:', ranges.selection);
    setSelectedDates([ranges.selection]);
    setStadium({
      ...stadium,
      maintenancePeriod: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
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
    // Fetch countries data when the component mounts
    GetCountries().then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    // Fetch states data when SelectedCountry changes
    if (SelectedCountry) {
      GetStateByCountry(SelectedCountry).then((response) => {
        setStates(response);
      });
    }
  }, [SelectedCountry]);

  useEffect(() => {
    // Fetch cities data when SelectedState changes
    if (SelectedState) {
      GetCitybyStateAndCountry(SelectedCountry, SelectedState).then((response) => {
        setCities(response);
      });
    }
  }, [SelectedState]);

  // Implement event handlers to handle changes in country, state, and city selections
  const handleCountryChange = (e) => {
    const { value } = e.target;
    setSelectedCountry(value);
    // Update the stadium address with the selected country
    setStadium((prevStadium) => ({
      ...prevStadium,
      address: { ...prevStadium.address, country: value },
    }));
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    setSelectedState(value);
    // Update the stadium address with the selected state
    setStadium((prevStadium) => ({
      ...prevStadium,
      address: { ...prevStadium.address, state: value },
    }));
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setSelectedCity(value);
    // Update the stadium address with the selected city
    setStadium((prevStadium) => ({
      ...prevStadium,
      address: { ...prevStadium.address, city: value },
    }));
  };

  // Implement handleSubmit function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit the form data using StadiumService
      const response = await StadiumService.updateStadium(selectedStadium._id, stadium);
      console.log('Stadium updated successfully:', response);
      alert('Stadium updated successfully');
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating stadium:', error);
      alert('Error updating stadium');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

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
  
  <div className={`fixed inset-0 z-50 flex justify-center items-center backdrop-filter backdrop-blur-lg bg-opacity-30 overflow-y-auto`}>
  <div className="bg-white p-4 rounded">
        <h1 className="font-semibold text-center text-xl text-gray-700">
          Update Stadium
        </h1>
        <hr className="my-4" />
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
            <div>
              <label htmlFor="status">Status:</label>
              <input
                type="text"
                id="status"
                name="status"
                value={stadium.status}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="bookingSchedule">Booking Schedule:</label>
              <input
                type="text"
                id="bookingSchedule"
                name="bookingSchedule"
                value={stadium.bookingSchedule}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="maintenancePeriod">Maintenance Period:</label>
              <div className="flex items-center">
                <p className="mr-4 text-blue-500 font-bold">Do you have a Maintenance Period to add?</p>
                <div className="flex items-center">
                <input type="radio" id="no" name="maintenancePeriodOption" value="No" onClick={handleShowScheduale} />
                  <label htmlFor="yes" className="mr-2">Yes</label>
                      <input type="radio" id="no" name="maintenancePeriodOption" value="yes" onClick={handleShowScheduale} />
                    <label htmlFor="no" className="mr-4">No</label>

                    </div>

              </div>
              {!showScheduale && (
                <div>
                  <DateRangePicker
                    ranges={selectedDates}
                    onChange={handleDateSelect}
                  />
                </div>
              )}
            </div>
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
              {showMap ? (
  <button type="button" onClick={() => setShowMap(!showMap)}>
    Hide Map
  </button>
) : (
  <button type="button" onClick={() => setShowMap(!showMap)}>
    Show Map
  </button>
)}
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
            </div>
          )}
  <div>
          <button type="button" onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
<div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="ml-2 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              Save changes
            </button>
            <button
              type="button"
              className="inline-block rounded bg-gray-200 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-gray-700 transition duration-150 ease-in-out hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-0 active:bg-gray-400 ml-4"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStadiumModal;