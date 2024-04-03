import axios from "axios";

const apiURL = "http://localhost:3000/matchStat";

export async function addMatchStats(matchData) {
  try {
    const response = await axios.post(`${apiURL}/addMatchStat`, matchData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMatchStatsForTournament(idMatch) {
  try {
    const response = await axios.get(`${apiURL}/getMatcheStats/${idMatch}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateMatchStats(idMatch, matchStats) {
  try {
    const response = await axios.put(
      `${apiURL}/updateMatchStats/${idMatch}`,
      matchStats
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
