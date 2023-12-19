import axios from './axiosService';

export const fetchNotifications = async ({
  lastId, limit, toDate
}: {lastId?: number, limit?: number, toDate?: string}) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/notifications`,
    {
      params: {
        lastId,
        limit,
        toDate
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  return response.data.data;
};

