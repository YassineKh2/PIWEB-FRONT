import axios from "axios";

const apiURL = "http://localhost:3000/sponsors";

export async function addSponsors(spData) {
  try {
    const response = await axios.post(`${apiURL}/add`, spData);
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
export async function getbyteam(nameteam) {
  try {
    const response = await axios.get(`${apiURL}/getbyteam/${nameteam}`);
    console.log("Response:", response.data); 
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



