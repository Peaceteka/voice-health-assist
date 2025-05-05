import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const processVoiceInput = async (text) => {
  try {
    const response = await axios.post(`${API_URL}/voice/process`, { text });
    return response.data;
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw error;
  }
};
