import axios from 'axios';

const apiKey = 'o0sNiT8/+BQvfnRlwZi99Q==rCc8wijH2mkTF6GR'; // Replace with your actual API key
const apiUrl = 'https://api.api-ninjas.com/v1/geocoding';

export const getGeocodingData = async (city) => {
    try {
      const response = await axios.get(`${apiUrl}?city=${city}`, {
        headers: {
          'X-Api-Key': apiKey,
        },
      });
  
      // Ensure that only one result is considered
      const [firstResult] = response.data;
  
      return {
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
      };
    } catch (error) {
      // Handle errors
      console.error('Error:', error.message);
      throw new Error('Error getting geocoding data');
    }
  };
  
export default getGeocodingData;