import axios from "axios";

const url = "https://api.countrystatecity.in/v1"
const apikey = "THlGY0ZBUGdtSHF3Mnd0S0dEc0pnUHZKemRycllhUFFMaU9kRHg2dA=="



export async function GetCountries() {
    try {
        const response = await axios.get(`${url}/countries`, {
            headers: {
                'X-CSCAPI-KEY': apikey
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function GetStateByCountry(countryCode) {
    try {
        const response = await axios.get(`${url}/countries/${countryCode}/states`, {
            headers: {
                'X-CSCAPI-KEY': apikey
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function GetCitybyStateAndCountry(countryCode,stateCode) {
    try {
        const response = await axios.get(`${url}/countries/${countryCode}/states/${stateCode}/cities`, {
            headers: {
                'X-CSCAPI-KEY': apikey
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}