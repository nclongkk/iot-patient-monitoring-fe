import { atom, useAtom } from 'jotai';
import { IPatient } from '../types/patient';

type SelectPatient = IPatient | undefined;

export const patientsState = atom<IPatient[]>([]);
export const addAllPatients = atom(
  null,
  (_, set, fetchedPatients: IPatient[]) => {
    set(patientsState, fetchedPatients);
  }
);
export const selectPatient = atom<SelectPatient>(undefined);

const useSelectPatient = () => useAtom(selectPatient);

export default useSelectPatient;

type PaginationInfo = {
  current: number;
  total: number;
  pageSize: number;
};

export const paginationInfoState = atom<PaginationInfo>({
  current: 1,
  total: 0,
  pageSize: 10,
});

export const setPaginationInfoState = atom(
  null,
  (_, set, paginationInfo: PaginationInfo) => {
    set(paginationInfoState, paginationInfo);
  }
);

export const isOpenModalAtom = atom(false);
