import axios from "axios";

const apiURLOffline = "http://localhost:3000/reservation";
const apiURL = "https://piweb-back.onrender.com/reservation";

export async function addReservation(reservationData) {
  try {
    const response = await axios.post(`${apiURL}/add`, reservationData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateReservation(id, newData) {
  try {
    const response = await axios.put(`${apiURL}/update/${id}`, newData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function deleteres(id) {
  try {
    const response = await axios.delete(`${apiURL}/delete/${id}`);
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
export async function getbyplace(nbplace) {
  try {
    const response = await axios.get(`${apiURL}/getbyplace/${nbplace}`);
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