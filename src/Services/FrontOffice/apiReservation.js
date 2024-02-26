import axios from "axios";

const apiURL = "http://localhost:3000/reservation";

export async function addReservation(reservationData) {
  try {
    const response = await axios.post(`${apiURL}/add`, reservationData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllReservation() {
  try {
    const response = await axios.get(`${apiURL}/getallReservations`);
    console.log("Response:", response.data); 
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getbyId(id) {
  try {
    const response = await axios.get(`${apiURL}/getbyid/${id}`);
    console.log("Response:", response.data); 
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function triDesc() {
  try {
    const response = await axios.get(`${apiURL}/tridesc`);
    console.log("Response:", response.data); 
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function triAsc() {
  try {
    const response = await axios.get(`${apiURL}/triasc`);
    console.log("Response:", response.data); 
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}