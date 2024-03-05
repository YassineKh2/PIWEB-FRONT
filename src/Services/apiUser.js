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


  export async function addAdmin (userData)  {
    try {
      const response = await axios.post(`${BASE_URL}/addAdmin`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }


 /* export async function signin(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/signin`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }*/

  export async function signin(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/signin`, userData);
      // Stockage du token JWT dans le localStorage
      localStorage.setItem('token', response.data.token);
      console.log(localStorage.getItem('token'));
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

  export async function blockUser(userId) {
    try {
      const response = await axios.patch(`${BASE_URL}/block/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  export async function unBlockUser(userId) {
    try {
      const response = await axios.patch(`${BASE_URL}/unblock/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  export async function getUserProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }


