import { atom } from 'jotai';
export type StatisticType = {
  totalActiveEquipments: number;
  totalEquipments: number;
  totalPatients: number;
};
export const statisticState = atom<StatisticType>({
  totalActiveEquipments: 0,
  totalEquipments: 0,
  totalPatients: 0,
});
export const addStatisticState = atom(
  null,
  (_, set, fetchedEquipments: StatisticType) => {
    set(statisticState, fetchedEquipments);
  },
);
