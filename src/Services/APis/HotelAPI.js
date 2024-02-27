
import axios from 'axios';

let accessToken = null;

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      'grant_type=client_credentials&client_id=j5Dm1TjDX5CJQ4Gui6EgIKXxLtiYQATB&client_secret=81pSxz8JahGDInHz',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
  }
};

// HotelAPI.js

const getHotelsByGeoCode = async (latitude, longitude, radius ) => {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required.');
      if(!radius)
      radius=100
    }
  
    if (!accessToken) {
      await getAccessToken();
    }
  
    try {
      const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode', {
        params: {
          latitude,
          longitude,
          radius,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', error.message);
      throw new Error('Error fetching hotels');
    }
  };
  
  export default {
    getHotelsByGeoCode  };
  