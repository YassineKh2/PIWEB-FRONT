import axios from "axios";

const url = "https://restcountries.com/v3.1/all"

export default async function GetCountries() {
    try {
        const response = await axios.get(`${url}`, {
            // headers: {
            //     'X-CSCAPI-KEY': 'API_KEY'
            // }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}