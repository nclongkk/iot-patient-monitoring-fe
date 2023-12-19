import { atom } from 'jotai';

export type HeartBeat = {
  heartbeat: number;
  time: string;
};
export type SPO2 = {
  spo2: number;
  time: string;
};

export type Notification = {
  id: number;
  message: string;
  createdAt: string;
  payload: string;
}

export const heartbeatState = atom<HeartBeat[]>([]);
export const spo2State = atom<SPO2[]>([]);

export const statusEquipmentState = atom<string>('INACTIVE');
