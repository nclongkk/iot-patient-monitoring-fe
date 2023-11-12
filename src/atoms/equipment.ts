import { IEquipment } from '../types/equipment';
import { atom, useAtom } from 'jotai';

type SelectEquipment = IEquipment | undefined;

export const equipments = atom<IEquipment[]>([]);
export const addAllEquipments = atom(
  null,
  (_, set, fetchedEquipments: IEquipment[]) => {
    set(equipments, fetchedEquipments);
  }
);
export const selectEquipment = atom<SelectEquipment>(undefined);

const useSelectEquipment = () => useAtom(selectEquipment);
export default useSelectEquipment;
