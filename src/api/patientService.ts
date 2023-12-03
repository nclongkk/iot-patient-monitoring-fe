import { IPatient } from '../types/patient';
import axios from './axiosService';

export const fetchPatients = async (page: number, limit: number = 10) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/patients?page=${page}&limit=${limit}`,
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  const data = response.data.data;
  return { patients: data.data, paging: data.paging };
};

export const fetchPatient = async (id: number | boolean) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/patients/${id}`,
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  const data = response.data.data;
  return data as IPatient;
};
