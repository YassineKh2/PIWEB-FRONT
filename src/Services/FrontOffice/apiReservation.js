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

export async function getAllReservations() {
  try {
    const response = await axios.get(`${apiURL}/getallReservations`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
