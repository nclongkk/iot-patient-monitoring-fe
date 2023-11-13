import { atom } from 'jotai';

type HeartBeat = {
  heartbeat: number;
  time: string;
};
type SPO2 = {
  spo2: number;
  time: string;
};
export const heartbeatState = atom<HeartBeat[]>([]);
export const spo2State = atom<SPO2[]>([]);

export const statusEquipmentState = atom<string>('INACTIVE');
