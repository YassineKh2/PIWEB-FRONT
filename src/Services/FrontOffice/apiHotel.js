import axios from "axios";

const apiURL = "http://localhost:3000/hotel";


const addHotel = async (hotel)=> {
  try {
    const response = await axios.post(`${apiURL}/addHotel`, hotel);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default {addHotel};
