import axios from "axios";

const apiURL = "http://localhost:3000/reclamation";

export async function addReclamation(reclamationData) {
  try {
    const response = await axios.post(`${apiURL}`, reclamationData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllReclamations() {
  try {
    const response = await axios.get(`${apiURL}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateReclamation(id, reclamationData) {
  try {
    const response = await axios.put(`${apiURL}/${id}`, reclamationData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteReclamation(id) {
  try {
    const response = await axios.delete(`${apiURL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}