/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HotelList = () => {
  const [hotelData, setHotelData] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('/api/getHotels');
        setHotelData(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error.message);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div>
      <h2>Hotel List</h2>
      <ul>
        {hotelData.map((hotel, index) => (
          <li key={index}>
            <h3>{hotel.name}</h3>
            <p>Type: {hotel.subtype}</p>
            <p>Time Zone: {hotel.timeZoneName}</p>
            <p>IATA Code: {hotel.iataCode}</p>

            {/* Destructure nested properties 
            <div>
              <h4>Address:</h4>
              <p>Country Code: {hotel.address.countryCode}</p>
            </div>

            <div>
              <h4>Geo Code:</h4>
              <p>Latitude: {hotel.geoCode.latitude}</p>
              <p>Longitude: {hotel.geoCode.longitude}</p>
            </div>

            <div>
              <h4>Distance:</h4>
              <p>Unit: {hotel.distance.unit}</p>
              <p>Value: {hotel.distance.value}</p>
              <p>Display Value: {hotel.distance.displayValue}</p>
              <p>Unlimited: {hotel.distance.isUnlimited}</p>
            </div>

            <p>Hotel ID: {hotel.hotelId}</p>
            <p>Chain Code: {hotel.chainCode}</p>
            <p>Last Update: {hotel.last_update}</p>
            {/* Add more information based on your needs 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelList;
*/


import React, { useState } from 'react';
import hotelService from '../../../../../Services/APis/HotelAPI.js';

const HotelList = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState();
  const [hotelData, setHotelData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'latitude') {
      setLatitude(value);
    } else if (name === 'longitude') {
      setLongitude(value);
    } else if (name === 'radius') {
      setRadius(value);
    }
  };

  const fetchHotels = async () => {
    setLoading(true);

    try {
      const response = await hotelService.getHotelsByGeoCode(latitude, longitude, radius);

      console.log('API Response:', response);

      if (response) {
        setHotelData(response.data);
        setError(null);
      } else {
        setHotelData([]);
        setError('Invalid response format. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);

      if (error.response) {
        setError(`API Error: ${error.response.data.message}`);
      } else if (error.request) {
        setError('Network Error. Please check your internet connection.');
      } else {
        setError('Unknown Error. Please try again.');
      }

      setHotelData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Hotel List</h2>
      <label>
        Latitude:
        <input
          type="text"
          name="latitude"
          value={latitude}
          onChange={handleInputChange}
          placeholder="Enter Latitude"
        />
      </label>
      <label>
        Longitude:
        <input
          type="text"
          name="longitude"
          value={longitude}
          onChange={handleInputChange}
          placeholder="Enter Longitude"
        />
      </label>
      <label>
        Radius (in km):
        <input
          type="number"
          name="radius"
          value={radius}
          onChange={handleInputChange}
          placeholder="Enter Radius"
        />
      </label>
      <button onClick={fetchHotels} disabled={loading}>
        Fetch Hotels
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {hotelData.map((hotel, index) => (
          <li key={index}>
            <h3>{hotel.name}</h3>
            <h3>chainCode:{hotel.chainCode}</h3>
            <p> Id: {hotel.hotelId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelList;
