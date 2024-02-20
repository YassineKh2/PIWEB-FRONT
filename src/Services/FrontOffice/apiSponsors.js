import axios from "axios";

const apiURL = "http://localhost:3000/sponsors";

export async function addReservation(spData) {
  try {
    const response = await axios.post(`${apiURL}/add`, spData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllSponsors() {
  try {
    const response = await axios.get(`${apiURL}/getallsp`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
