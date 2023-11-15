import { useAtom } from 'jotai';
import useSelectEquipment, {
  addAllEquipments,
  equipmentsState,
} from '../atoms/equipment';
import { useEffect } from 'react';
import axios, { setAuthToken } from '../api/axiosService';
import { useNavigate } from 'react-router-dom';
import Table, { ColumnsType } from 'antd/es/table';
import { IEquipment } from '../types/equipment';
import { Tag } from 'antd';

const columns: ColumnsType<IEquipment> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id, record, index) => <p key={index}>{id}</p>,
  },

  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (status, record, index) => (
      <Tag key={index} color={status === 'INACTIVE' ? 'volcano' : 'green'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Patient',
    key: 'patient',
    dataIndex: 'patient',
    render: (index, { patient }) => <p key={index}>{patient.name}</p>,
  },
];

export const Equipments = () => {
  const [, addEquipments] = useAtom(addAllEquipments);
  const [equipments] = useAtom(equipmentsState);
  const [, setSelectEquipment] = useSelectEquipment();
  const navigate = useNavigate();

  const fetchEquipments = async () => {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(
      'http://14.225.207.82:3000/api/equipments'
    );

    const data = await response.data.data;

    addEquipments(data);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const rowClassName = (record, index) => {
    return 'cursorPointer'; // Add a class to the rows
  };

  return (
    <Table
      size="small"
      columns={columns}
      rowClassName={rowClassName}
      dataSource={equipments}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            setSelectEquipment(record);
            navigate(`/equipments/${record.id}`);
          }, // click row
        };
      }}
    />
  );
};
