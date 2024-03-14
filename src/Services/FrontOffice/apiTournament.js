import axios from "axios";

const apiURL = "http://localhost:3000/tournament";

export async function addTournament(tournamentData) {
  try {
    const response = await axios.post(`${apiURL}/add`, tournamentData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateTournament(tournamentData) {
  try {
    const response = await axios.put(
      `${apiURL}/updatetournament`,
      tournamentData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getAllTournaments() {
  try {
    const response = await axios.get(`${apiURL}/getTournaments`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getLatestTournamentId() {
  try {
    const response = await axios.get(`${apiURL}/latestTournamentId`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTournamentDetails(id) {
  try {
    const response = await axios.get(`${apiURL}/getTournamentDetail/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default {getTournamentDetails};
