import { IEquipment } from '../types/equipment';
import axios from './axiosService';

export const fetchEquipment = async (id: string) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/equipments/${id}`,
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  const data = response.data.data;
  return data as IEquipment;
};

export const fetchEquipments = async () => {
  const response = await axios.get(
    'https://patient-monitoring.site/api/equipments',
  );

  const data = await response.data.data;

  return data as IEquipment[];
};

export const fetchEquipmentHistory = async (start?: string, end?: string) => {
  const response = await axios.get(
    `https://patient-monitoring.site/api/equipments/sensor-data-history?start=${start}&end=${end}`,
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  const data = response.data.data;

  return data;
};
