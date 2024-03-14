
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getHotelsByIdTournament } from '../../../../../Services/FrontOffice/apiHotel';
import 'leaflet/dist/leaflet.css';
import { Link, useNavigate } from "react-router-dom";

const DisplayHotels = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [hotels, setHotels] = useState([]);
  const [activeHotel, setActiveHotel] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState([0, 0]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotelsByIdTournament(id);
        const fetchedHotels = response.hotels || [];

        setHotels(fetchedHotels);

        // Set the initial center based on the geocode of the first hotel
        if (fetchedHotels.length > 0) {
          const firstHotel = fetchedHotels[0];
          const initialCenter = [firstHotel.geoCode.latitude, firstHotel.geoCode.longitude];
          setDefaultCenter(initialCenter);
        }
      } catch (error) {
        console.error(error);
        // Handle the error as needed
      }
    };

    // Fetch hotels when the component mounts or when tournamentId changes
    fetchHotels();
  }, [id]);

  const handleHotelClick = (hotel) => {
    setActiveHotel(hotel);

    // Center the map on the selected hotel
    setDefaultCenter([hotel.geoCode.latitude, hotel.geoCode.longitude]);
  };

  
  return (
    <div >
       
       <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white">
             Hotel List
            </h3>
         
    <button
                  onClick={() => navigate(`/hotels/updateHotel/${ id }`) }
                  className="mb-4 -mt-4 mr-4 ease-in-up hidden rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8 ml-auto "
                >
                 Hotels
                </button>
           <div className=' '> 
          
      <div className='flex justify-end'>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel._id} onClick={() => handleHotelClick(hotel)} style={{ cursor: 'pointer' }}>
            <strong>{hotel.name}</strong> - {hotel.location}
          </li>
        ))}
      </ul>
      </div>
      <div className='flex justify-start ml-15 mb-15 '>
        
      <MapContainer center={defaultCenter} zoom={12} style={{ height: '500px', width: '70%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {hotels.map((hotel) => (
          <Marker
            key={hotel._id}
            position={[hotel.geoCode.latitude, hotel.geoCode.longitude]}
          >
            <Popup>
              <div>
                <h2>{hotel.name}</h2>
                <p>{hotel.address && hotel.address.countryCode}</p>
                <p>Geocode: {hotel.geoCode.latitude}, {hotel.geoCode.longitude}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {activeHotel && (
          <Popup
            position={[activeHotel.geoCode.latitude, activeHotel.geoCode.longitude]}
            onClose={() => setActiveHotel(null)}
          >
            <div>
              <h2>{activeHotel.name}</h2>
              <p>{activeHotel.address && activeHotel.address.countryCode}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
      </div>
      </div>
    </div>
  );
};

export default DisplayHotels;
