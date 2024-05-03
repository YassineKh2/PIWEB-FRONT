import axios from "axios";

const apiURLOffline = "http://localhost:3000/sponsors";
const apiURL = "https://piweb-back.onrender.com/sponsors";

export async function addSponsors(spData) {
  try {
    const response = await axios.post(`${apiURL}/add`, spData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateSp(id, newData) {
  try {
    const response = await axios.put(`${apiURL}/update/${id}`, newData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function deleteSp(id) {
  try {
    const response = await axios.delete(`${apiURL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getAllSponsors() {
  try {
    const response = await axios.get(`${apiURL}/getallsp`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getbyName(name) {
  try {
    const response = await axios.get(`${apiURL}/getbyname/${name}`);
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



