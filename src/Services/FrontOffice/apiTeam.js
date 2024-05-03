import axios from "axios";

const apiURLOffline = "http://localhost:3000/team";
const apiURLUserOffline = "http://localhost:3000/user";
const apiURL = "https://piweb-back.onrender.com/team";
const apiURLUser = "https://piweb-back.onrender.com/user";

export async function addTeam(teamData) {
    try {
        const response = await axios.post(`${apiURL}/add`, teamData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });


        if (teamData.players.length > 0) {
            let team = response.data;

            const teamId = team.Team._id;
            const players = teamData.players;
            const playersData = {
                teamId,
                players
            }
            await axios.post(`${apiURLUser}/addplayers`, playersData);
        }
        if (teamData.staff.length > 0) {
            let team = response.data;

            const teamId = team.Team._id;
            const staff = teamData.staff;
            const staffData = {
                teamId,
                staff
            }
            await axios.post(`${apiURLUser}/addstaff`, staffData);
        }


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
        console.log(teamData)
        const response = await axios.put(`${apiURL}/update`, teamData);
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
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getTournaments(tournamentsid) {
    try {
        const response = await axios.post(`${apiURL}/tournament`, tournamentsid);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getTeamByUser(userId) {
    try {
        const response = await axios.get(`${apiURL}/getTeamByUser/${userId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getTeam(teamId) {
    try {
        const response = await axios.get(`${apiURL}/getTeam/${teamId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getTeams(teamsId) {
    try {
        const response = await axios.post(`${apiURL}/getTeams`, teamsId);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateLineup(teamData) {
    try {
        const response = await axios.put(`${apiURL}/updateLineup`, teamData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateTeamImage(teamImageData) {
    try {
        const response = await axios.put(`${apiURL}/updateImage`, teamImageData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}





