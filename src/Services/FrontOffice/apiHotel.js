import axios from "axios";

const apiURL = "http://localhost:3000/hotel";


const addHotel = async (hotel)=> {
  try {
    const response = await axios.post(`${apiURL}/addHotel`, hotel);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export async function getHotelIds(idTournament) {
  try {
    const response = await axios.get(`${apiURL}/getHotelIds/${idTournament}`);
    console.log("Response:", response.data); 
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getHotelsByIdTournament(id) {
  try {
    const response = await axios.get(`${apiURL}/getHotelsByIdTournament/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default {addHotel,getHotelIds,getHotelsByIdTournament};
