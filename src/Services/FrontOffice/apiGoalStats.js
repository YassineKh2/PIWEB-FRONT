import axios from "axios";

const apiURL = "http://localhost:3000/goal";

export async function addPlayerStatsForTournament(playerStats) {
  try {
    const response = await axios.post(
      `${apiURL}/addPlayerStatsForTournament`,
      playerStats
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getPlayerStatsForTournament(
  scorer,
  forTournament,
  matchId,
  forTeam
) {
  try {
    const response = await axios.get(
      `${apiURL}/getPlayerStatsForTournament/${scorer}/${forTournament}/${matchId}/${forTeam}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getMatchGoalsForTournament(
  forTeam,
  forTournament,
  matchId
) {
  try {
    const response = await axios.get(
      `${apiURL}/getPlayerStatsgoals/${forTeam}/${forTournament}/${matchId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getMatchGoalsForTournamentwithInfo(
  forTeam,
  forTournament,
  matchId
) {
  try {
    const response = await axios.get(
      `${apiURL}/getPlayerStatsgoalswithinfo/${forTeam}/${forTournament}/${matchId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updatePlayerStatsForTournament(idGoal, playerStats) {
  try {
    console.log(idGoal);
    const response = await axios.put(
      `${apiURL}/updateGoal/${idGoal}`,
      playerStats
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getStatsForTournamentwithInfo(forTournament) {
  try {
    console.log(forTournament);
    const response = await axios.get(
      `${apiURL}/getTournamentwithinfo/${forTournament}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
