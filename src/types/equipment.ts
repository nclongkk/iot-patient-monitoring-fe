import { IPatient } from './patient';

export interface IEquipment {
  id: string;
  status: string;
  patient: IPatient;
}
