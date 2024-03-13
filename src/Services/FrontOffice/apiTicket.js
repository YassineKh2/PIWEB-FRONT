import axios from "axios";

const apiURL = "http://localhost:3000/ticket";

export async function getTicket() {
    try {
      const response = await axios.get(`${apiURL}/getall`);
      console.log("Response:", response.data); 
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  export async function getAllTicket() {
    try {
      const response = await axios.get(`${apiURL}/getallticket`);
      console.log("Response:", response.data); 
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }