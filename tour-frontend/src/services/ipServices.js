// src/services/ipService.js
import axios from 'axios';

export const getUserIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP address', error);
    return null;
  }
};

export const getCountryCode = async (ip) => {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching country code', error);
    return null;
  }
};
