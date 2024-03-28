import axios from "axios";

const apiURL = "http://localhost:3000/stadium";


const addStadium = async (stadium)=> {
  try {
    const response = await axios.post(`${apiURL}/addStadium`, stadium);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export async function getAllStadiums() {
  try {
    const response = await axios.get(`${apiURL}/getStadiums`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getStadiumDetail(id) {
  try {
    const response = await axios.get(`${apiURL}/getStadiumDetail/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {addStadium,getAllStadiums,getStadiumDetail};
