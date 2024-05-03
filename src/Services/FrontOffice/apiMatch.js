import axios from "axios";

const apiURLOffline = "http://localhost:3000/match";
const apiURL = "https://piweb-back.onrender.com/match";

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
export async function getEmptyMatche(id, idTournament) {
  try {
    const response = await axios.get(
      `${apiURL}/getemptymatch/${id}/${idTournament}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getTournamentMatchesDraw(idTournament) {
  try {
    const response = await axios.get(
      `${apiURL}/getMatchesbydraw/${idTournament}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function deleteMatcheByTournament(id) {
  try {
    const response = await axios.delete(`${apiURL}/deleteMatches/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMatchInfo(id) {
  try {
    const response = await axios.get(`${apiURL}/getmatchinfo/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}