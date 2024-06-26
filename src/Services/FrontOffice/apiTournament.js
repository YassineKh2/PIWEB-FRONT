import { config } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";

const apiURLOffline = "http://localhost:3000/tournament";
const apiURL = "https://piweb-back.onrender.com/tournament";

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

export async function getTournamentsByUser(idUser) {
  try {
    const response = await axios.get(`${apiURL}/gettournamentbyuser/${idUser}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default {getTournamentDetails};