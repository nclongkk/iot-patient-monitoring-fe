import { useAtom } from 'jotai';
import useSelectEquipment, {
  addAllEquipments,
  equipments as equipmentState,
} from '../atoms/equipment';
import { useEffect } from 'react';
import axios from '../api/axiosService';
import { useNavigate } from 'react-router-dom';
import Table, { ColumnsType } from 'antd/es/table';
import { IEquipment } from '../types/equipment';
import { Tag } from 'antd';

const columns: ColumnsType<IEquipment> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <p>{text}</p>,
  },

  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status }) => (
      <Tag color={status === 'INACTIVE' ? 'volcano' : 'green'} key={status}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Patient',
    key: 'patient',
    dataIndex: 'patient',
    render: (_, { patient }) => <p>{patient.name}</p>,
  },
];

export const Equipments = () => {
  const [, addEquipments] = useAtom(addAllEquipments);
  const [equipments] = useAtom(equipmentState);
  const [, setSelectEquipment] = useSelectEquipment();
  const navigate = useNavigate();

  const fetchEquipments = async () => {
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
    return ':hover cursor-pointer'; // Add a class to the rows
  };

  return (
    <Table
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
