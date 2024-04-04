import axios from "axios";

const BASE_URL = "http://localhost:3000/user";

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
    localStorage.setItem("token", response.data.token);
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

  export async function getWaitList() {
    try {
      const response = await axios.get(`${BASE_URL}/getWaitList`);
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

export async function getUserWaiting (userId) {
  try {
    const response = await axios.get(`${BASE_URL}/getUserWaiting/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
export async function finishplayerprofile(userData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/finishplayerprofile`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
    const token = localStorage.getItem("token");
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
    console.error(
      "Erreur lors de la mise à jour :",
      error.response ? error.response.data : error.message
    );
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
    const response = await axios.put(
      `${BASE_URL}/updateFollowedTeams`,
      userData
    );
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
    const response = await axios.post(`${BASE_URL}/declineRequest`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePlayersCurrentTeam(player) {
  try {
    const response = await axios.post(
      `${BASE_URL}/updatePlayersCurrentTeam`,
      player
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePlayerImage(userData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/updateplayerimage`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
export async function updateStaffImage(userData) {
  try {
    const response = await axios.put(`${BASE_URL}/updatestaffimage`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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



export async function finishTRMTMProfile(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/finishTRMTMProfile`, userData,{
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

    // localStorage.setItem('token', response.data.token);
export async function updateFollowedTournaments(userData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/updateFollowedTournaments`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const confirmUser = async (userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/confirm/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const refuseUser = async (userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/refuse/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export async function getUserByEmail(email) {
  try {
    const response = await axios.get(`${BASE_URL}/getuser-by-email/${email}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/*export async function googleAuth(credential) {
  try {
    const response = await axios.post(`${BASE_URL}/google-auth`, { token: credential });
    // Enregistrement du token dans le local storage
    console.log(credential); // Afficher le token reçu de Google
    localStorage.setItem('token', credential); // Utilisez 'credential' au lieu de 'token'
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}*/

export async function googleAuth(credential) {
  try {
    const response = await axios.post(`${BASE_URL}/google-auth`, { token: credential });
    // Enregistrement du token dans le local storage
    console.log(credential); // Afficher le token reçu de Google
    localStorage.setItem('token', response.data.token); // Utilisez response.data.token au lieu de 'credential'
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function updateUserImage(userId, file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const response = await axios.put(`${BASE_URL}/user/profile-image/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // Assuming your backend expects a Bearer token
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function updatePassword(userId, oldPassword, newPassword) {
  if (!userId) throw new Error('UserId is undefined');

  try {
    const response = await axios.put(`${BASE_URL}/update-password/${userId}`, {
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export async function forgotPassword(email) {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const verifyRecoveryCode = async (email, recoveryCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-recovery-code`, { email, recoveryCode });
    return response.data; // Return the response data from the server
  } catch (error) {
    // If there's an error, throw the error data or a default error message
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};

export const updatePasswordAfterRecovery = async (email, newPassword) => {
  try {
    const response = await axios.put(`${BASE_URL}/update-password-recovery`, { email, newPassword });
    return response.data;
  } catch (error) {
    // Gérer les erreurs de la réponse ici
    console.error('Error updating password:', error.response);
    throw error;
  }
}
