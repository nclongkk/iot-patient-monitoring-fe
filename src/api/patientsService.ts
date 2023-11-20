import axios from './axiosService';

export const fetchPatients = async (page: number) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/patients?page=${page}&limit=10`,
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  const data = response.data.data;
  return { patients: data.data, paging: data.paging };
};
