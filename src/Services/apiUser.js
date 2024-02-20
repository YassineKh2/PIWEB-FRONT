import axios from 'axios';

const BASE_URL = 'http://localhost:3000/user'; 


  export async function signup (userData)  {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  export async function signin(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/signin`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }


  export async function getAllUsers() {
    try {
      const response = await axios.get(`${BASE_URL}/getall`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  export async function updateUser(userData) {
    try {
      const response = await axios.put(`${BASE_URL}/update`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  export async function deleteUser (userId) {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }


