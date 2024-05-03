import axios from "axios";

const apiURLOffline = "http://localhost:3000/hotel";
const apiURL = "https://piweb-back.onrender.com/hotel";


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


export async function deleteHotelsByTournamentAndCity(tournamentId,city) {
  try {
    const response = await axios.delete(
      `${apiURL}/deleteHotelsByTournamentAndCity/${tournamentId}/${city}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default {addHotel,getHotelIds,getHotelsByIdTournament,deleteHotelsByTournamentAndCity};
