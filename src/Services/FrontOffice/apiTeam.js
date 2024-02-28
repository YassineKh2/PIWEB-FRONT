import axios from "axios";

const apiURL = "http://localhost:3000/team";

export async function addTeam(teamData) {
  try {
    console.log(teamData)
    const response = await axios.post(`${apiURL}/add`, teamData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getAllTeams() {
  try {
    const response = await axios.get(`${apiURL}/getall`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTeamDetails(id) {
  try {
    const response = await axios.get(`${apiURL}/getteamDetail/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTeam(teamData) {
  try {
    const response = await axios.put(`${apiURL}/update`,teamData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTeam(id) {
  try {
    const response = await axios.delete(`${apiURL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getMatchesByTeam(id) {
  try {
    const response = await axios.get(`${apiURL}/matches/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTournaments(tournamentsid) {
  try {
    const response = await axios.post(`${apiURL}/tournament`,tournamentsid);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



