import axios from './axiosService';

export const fetchUserData = async () => {
  try {
    const response = await axios.get('https://patient-monitoring.site/api/auth/me',
        {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (!response) {
      throw new Error('Network response was not ok');
    }

    const userData = response.data.data;
    return userData;
  } catch (error) {
    // Handle errors here
    console.error('Error fetching user data:', error);
    throw error;
  }
};
