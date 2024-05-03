import axios from "axios";

const apiURLOffline = "http://localhost:3000/stadium";
const apiURL = "https://piweb-back.onrender.com/stadium";


const addStadium = async (stadium)=> {
  try {
    const response = await axios.post(`${apiURL}/addStadium`, stadium);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export async function getAllStadiums() {
  try {
    const response = await axios.get(`${apiURL}/getStadiums`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getStadiumDetail(id) {
  try {
    const response = await axios.get(`${apiURL}/getStadiumDetail/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function addStadiumsToTournament(tournamentId, stadiumIds) {
  try {
    const response = await axios.post(`${apiURL}/addStadiumsToTournament`, {
      tournamentId,
      stadiumIds
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function checkStadiumAvailability(stadiumId, startDate, endDate) {
  try {
    const response = await axios.post(`${apiURL}/checkStadiumAvailability`, {
      stadiumId,
      startDate, // Ensure startDate and endDate are sent directly
      endDate,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking stadium availability:', error);
    throw error;
  }
}

export async function updateStadium(id, stadiumData) {
  try {
    const response = await axios.put(
      `${apiURL}/updateStadium/${id}`,
      stadiumData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function deleteStadium(id) {
  try {
    const response = await axios.delete(`${apiURL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getStadiumsByTournamentId(tournamentId) {
  try {
    const response = await axios.get(`${apiURL}/getStadiumsByTournamentId/${tournamentId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default {addStadium,
  getAllStadiums,
  getStadiumDetail,
  addStadiumsToTournament,
  checkStadiumAvailability,
  updateStadium,
  deleteStadium,
  getStadiumsByTournamentId};
