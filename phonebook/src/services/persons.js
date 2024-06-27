import axios from "axios";

const baseUrl = 'http://localhost:3001/api/persons';

const get = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data; // Ensure it returns the data directly
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const post = async (newData) => {
  try {
    const response = await axios.post(baseUrl, newData);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

const deleteItem = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export default { get, post, deleteItem };