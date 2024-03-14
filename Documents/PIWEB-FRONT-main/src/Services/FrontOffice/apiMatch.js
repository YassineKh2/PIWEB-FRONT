import axios from "axios";

const apiURL = "http://localhost:3000/match";

export async function addMatch(matchData) {
  try {
    const response = await axios.post(`${apiURL}/addMatch`, matchData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getTournamentMatches(id) {
  try {
    const response = await axios.get(`${apiURL}/getMatches/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateMatchScore(matchData) {
  try {
    const response = await axios.put(
      `${apiURL}/updatematch`,
      matchData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
