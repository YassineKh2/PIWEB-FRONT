import axios from "axios";

const apiURL = "http://localhost:3000/avis"; // Assuming your backend endpoint for avis is at this URL

export async function addAvis(avisData) {
  try {
    const response = await axios.post(apiURL, avisData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllAvis() {
  try {
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAvisByTournament(id) {
  try {
    const response = await axios.get(`${apiURL}/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateAvis(id, avisData) {
  try {
    const response = await axios.put(`${apiURL}/${id}`, avisData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAvis(id) {
  try {
    const response = await axios.delete(`${apiURL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
