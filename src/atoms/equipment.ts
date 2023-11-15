import { IEquipment } from '../types/equipment';
import { atom, useAtom } from 'jotai';

export type SelectEquipment = IEquipment | undefined;

export const equipmentsState = atom<IEquipment[]>([]);
export const addAllEquipments = atom(
  null,
  (_, set, fetchedEquipments: IEquipment[]) => {
    set(equipmentsState, fetchedEquipments);
  }
);
export const selectEquipment = atom<SelectEquipment>(undefined);

const useSelectEquipment = () => useAtom(selectEquipment);
export default useSelectEquipment;
