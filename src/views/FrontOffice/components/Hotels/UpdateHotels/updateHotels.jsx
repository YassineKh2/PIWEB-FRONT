import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import hotelService from '../../../../../Services/APis/HotelAPI.js';
import HotelService from '../../../../../Services/FrontOffice/apiHotel.js';
import getGeocodingData from '../../../../../Services/APis/Geocoding.js';
import TournamentService from '../../../../../Services/FrontOffice/apiTournament.js';

const UpdateHotels = () => {
  const { id } = useParams();

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState();
  const [hotelData, setHotelData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(10);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [city, setCity] = useState('');
  const [Tournament, setTournament] = useState({});
  const [hotels, setHotels] = useState([]);

  const hideNotifications = () => {
    setShowErrorNotification(false);
    setShowSuccessNotification(false);
  };

  useEffect(() => {
    const fetchTournamentCity = async () => {
      try {
        const res = await TournamentService.getTournamentDetails(id);
        const tournamentData = res.tournaments;
        setTournament(tournamentData);
        if (tournamentData) {
          setCity(tournamentData.city);
        }
      } catch (error) {
        console.error('Error fetching tournament city:', error);
      }
    };

    fetchTournamentCity();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'radius') {
      setRadius(value);
    }
  };

  const toggleHotelSelection = (hotelId) => {
    setShowSuccessNotification(null);
    setSelectedHotels((prevSelected) =>
      prevSelected.includes(hotelId)
        ? prevSelected.filter((id) => id !== hotelId)
        : [...prevSelected, hotelId]
    );
  };

  const handleConfirmAddition = () => {
    const hotelsToAdd = hotelData.filter((hotel) => selectedHotels.includes(hotel.hotelId));
    hotelsToAdd.forEach((hotel) => {
      addHotelToDatabase(hotel, id);
    });
    const updatedHotelData = hotelData.filter((hotel) => !selectedHotels.includes(hotel.hotelId));
    setHotelData(updatedHotelData);
    setSelectedHotels([]);
  };

  const addHotelToDatabase = async (hotel, id) => {
    try {
      hotel.idTournament = id;
      const addHotelResponse = await HotelService.addHotel([hotel]);
      setShowSuccessNotification(true);
      setTimeout(hideNotifications, 2000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Hotel already exists:', error.response.data.message);
      } else {
        console.error('Error adding hotel to database:', error);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (city) {
        const geocodingData = await getGeocodingData(city);
        const response = await hotelService.getHotelsByGeoCode(
          geocodingData.latitude,
          geocodingData.longitude,
          radius
        );
        if (response) {
          setHotelData(response.data);
          setError(null);
        } else {
          setHotelData([]);
          setError('Invalid response format. Please try again.');
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        setError(`API Error: ${error.response.data.message}`);
      } else if (error.request) {
        setError('Network Error. Please check your internet connection.');
      } else {
        setError('Error fetching hotels. Please try again.');
      }
      setHotelData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city, radius, id]);

  const handleRadiusChange = () => {
    fetchData();
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotelData.slice(indexOfFirstHotel, indexOfLastHotel);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    console.log('ID:', id);
    console.log('City:', city);
  }, [id, city]);

  return (
    <div>
      <div>
        <h1 className="text-center pb-8">Hotel List</h1>
      </div>
      <div className="flex justify-end">
        <ul>
          {hotels.map((hotel) => (
            <li key={hotel._id}>
              <strong>{hotel.name}</strong> - {hotel.location}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-4 ml-10">
        <div className="">
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
        </div>
        <div class="pb-5">
          <button
            onClick={handleRadiusChange}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Change Radius
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleConfirmAddition}
          disabled={selectedHotels.length === 0}
          type="button"
          className={`text-white w-48 bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-3 text-center me-2 mb-4 mr-15 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ${
            selectedHotels.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Confirm Addition
        </button>
      </div>
 
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}


      <div className={`flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 ${showErrorNotification ? 'block' : 'hidden'}`} role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">Hotel already exists!</span> Change a few things up and try submitting again.
        </div>
      </div>

      <div className={`flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-800 dark:text-green-400 ${showSuccessNotification ? 'block' : 'hidden'}`} role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM3 10a7 7 0 1 0 14 0ZM10 12a1 1 0 0 1-1-1V6a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1Z"/>
        </svg>
        <span className="sr-only">Success</span>
        <div>
          <span className="font-medium">Success alert!</span> Hotel successfully added.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4  mx-10">
        {currentHotels.map((hotel, index) => (
           <div key={index} className="border p-4 rounded-md ">
           <label>
             <input className=" mx-2"
               type="checkbox"
               checked={selectedHotels.includes(hotel.hotelId)}
               onChange={() => toggleHotelSelection(hotel.hotelId)}
             />
             {hotel.name}
           </label>
           <h3>chainCode:{hotel.chainCode}</h3>
           <p> Id: {hotel.hotelId}</p>
         </div>
       ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(hotelData.length / hotelsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-2 px-3 py-2 border ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpdateHotels;