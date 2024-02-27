import axios from 'axios';

const city = 'london';
const apiKey = 'o0sNiT8/+BQvfnRlwZi99Q==rCc8wijH2mkTF6GR'; // Replace with your actual API key
const apiUrl = 'https://api.api-ninjas.com/v1/geocoding';

const getGeocodingData = async () => {
    try {
        const response = await axios.get(`${apiUrl}?city=${city}`, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });

        console.log(response.data);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up the request:', error.message);
        }
    }
};


