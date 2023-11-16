import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import axios, { setAuthToken } from '../api/axiosService';
import { useNavigate } from 'react-router-dom';
import Table, { ColumnsType } from 'antd/es/table';
import { Button, Flex, Tag } from 'antd';
import useSelectPatient, {
  addAllPatients,
  isOpenModalAtom,
  paginationInfoState,
  patientsState,
  setPaginationInfoState,
} from '../atoms/patient';
import { IPatient } from '../types/patient';
import { PatientFormModal } from '../components/patientFormModal';
import { PlusOutlined } from '@ant-design/icons';
const columns: ColumnsType<IPatient> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id) => <p>{id}</p>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name) => <p>{name}</p>,
  },

  {
    title: 'Gender',
    key: 'gender',
    dataIndex: 'gender',
    render: (gender: string) => (
      <Tag color={gender === 'male' ? '#108ee9' : '#f50'}>
        {gender.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Age',
    key: 'age',
    dataIndex: 'age',
    render: (age) => <p>{age}</p>,
  },
];

export const Patients = () => {
  const [, addPatients] = useAtom(addAllPatients);
  const [patients] = useAtom(patientsState);
  const [, setSelectPatient] = useSelectPatient();
  const navigate = useNavigate();

  const [paginationInfo] = useAtom(paginationInfoState);
  const [, setPaginationInfo] = useAtom(setPaginationInfoState);

  const [, setIsOpenModal] = useAtom(isOpenModalAtom);

  const fetchPatients = useCallback(
    async (page: number) => {
      setAuthToken(localStorage.getItem('token'));
      const response = await axios.get(
        `https://patient-monitoring.site/api/patients?page=${page}&limit=10`,
      );

      const data = await response.data.data;

      addPatients(data.data);
      setPaginationInfo({
        current: data.paging.page,
        total: data.paging.total,
        pageSize: data.paging.limit,
      });
    },
    [addPatients, setPaginationInfo],
  );

  useEffect(() => {
    fetchPatients(paginationInfo.current);
  }, [paginationInfo.current]);

  const rowClassName = (record, index) => {
    return 'cursorPointer'; // Add a class to the rows
  };

  return (
    <Flex vertical gap="large">
      <Flex>
        <Button type="primary" onClick={() => setIsOpenModal(true)}>
          <PlusOutlined />
          Add new patient
        </Button>
      </Flex>
      <Table
        size="small"
        columns={columns}
        rowClassName={rowClassName}
        dataSource={patients}
        pagination={{
          ...paginationInfo,
          onChange(page, pageSize) {
            setPaginationInfo({ ...paginationInfo, current: page });
          },
        }}
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (event) => {
        //       setSelectPatient(record);
        //       navigate(`/patients/${record.id}`);
        //     }, // click row
        //   };
        // }}
      />
      <PatientFormModal />
    </Flex>
  );
};
