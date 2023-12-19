import { IEquipment } from '../types/equipment';
import axios from './axiosService';

export const fetchEquipment = async (id: string) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/equipments/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  const data = response.data.data;
  console.log("equipment",data);
  return data as IEquipment;
};

export const fetchEquipments = async () => {
  const response = await axios.get(
    'https://patient-monitoring.site/api/equipments',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }
  );

  const data = await response.data.data;

  return data as IEquipment[];
};

export const fetchEquipmentHistory = async (start?: string, end?: string) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/equipments/sensor-data-history?start=${start}&end=${end}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    } 
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  const data = response.data.data;

  return data;
};
