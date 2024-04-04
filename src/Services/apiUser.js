import axios from 'axios';

const BASE_URL = 'http://localhost:3000/user';


export async function signup(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export async function addTRM(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/addTRM`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export async function addTM(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/addTM`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export async function addAdmin(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/addAdmin`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


/* export async function signin(userData) {
   try {
     const response = await axios.post(`${BASE_URL}/signin`, userData);
     return response.data;
   } catch (error) {
     throw error.response.data;
   }
 }*/

export async function signin(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/signin`, userData);
        // Stockage du token JWT dans le localStorage
        localStorage.setItem('token', response.data.token);
        //console.log(localStorage.getItem('token'));
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export async function getAllUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/getall`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function updateUser(userData) {
    try {
        const response = await axios.put(`${BASE_URL}/update`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function deleteUser(userId) {
    try {
        const response = await axios.delete(`${BASE_URL}/delete/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getUserData(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/getuser/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function finishplayerprofile(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/finishplayerprofile`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        // localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function finishstaffprofile(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/finishstaffprofile`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        // localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getAllPlayers() {
    try {
        const response = await axios.get(`${BASE_URL}/getAllPlayers`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function getAllStaff() {
    try {
        const response = await axios.get(`${BASE_URL}/getAllStaff`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export async function blockUser(userId) {
    try {
        const response = await axios.patch(`${BASE_URL}/block/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function unBlockUser(userId) {
    try {
        const response = await axios.patch(`${BASE_URL}/unblock/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getUserProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function update(id, newData) {
    try {
        const response = await axios.put(`${BASE_URL}/update/${id}`, newData);
        console.log("Mise à jour réussie :", response.data);
        return response.data; // Retourne les données de réponse pour une utilisation ultérieure si nécessaire
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error.response ? error.response.data : error.message);
        throw error; // Propager l'erreur pour une gestion ultérieure
    }
}

export async function sendinvitationtomembers(data) {
    try {
        const response = await axios.post(`${BASE_URL}/sendinvitationmember`, data);
        return response.data;
    } catch (error) {
        return error.message
    }
}
export async function updateFollowedTeams(userData) {
    try {
        const response = await axios.put(`${BASE_URL}/updateFollowedTeams`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function getTopPlayers(teamId) {
    try {
        const response = await axios.get(`${BASE_URL}/getTopPlayers/${teamId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function declineTeamRequest(data) {
    try {
        const response = await axios.post(`${BASE_URL}/declineRequest`,data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updatePlayersCurrentTeam(player) {
    try {
        const response = await axios.post(`${BASE_URL}/updatePlayersCurrentTeam`,player);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updatePlayerImage(userData) {
    try {
        const response = await axios.put(`${BASE_URL}/updateplayerimage`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function updateStaffImage(userData) {
    try {
        const response = await axios.put(`${BASE_URL}/updatestaffimage`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function getplayersbyteam(idteam) {
    try {
        const response = await axios.get(`${BASE_URL}/getplayersbyteam/${idteam}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function getstaffbyteam(idteam) {
    try {
        const response = await axios.get(`${BASE_URL}/getstaffbyteam/${idteam}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function getTeamMembers(idteam) {
    try {
        const response = await axios.get(`${BASE_URL}/getTeamMembers/${idteam}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function addplayers(players) {
    try {
        const response = await axios.post(`${BASE_URL}/addplayers`,players);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function addstaff(staff) {
    try {
        const response = await axios.post(`${BASE_URL}/addstaff`,staff);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function updateTeamMember(userData) {
    try {
        const response = await axios.put(`${BASE_URL}/updateTeamMember`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export async function getInvitationsByTeam(idTeam) {
    try {
        const response = await axios.get(`${BASE_URL}/getInvitationsByTeam/${idTeam}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}



