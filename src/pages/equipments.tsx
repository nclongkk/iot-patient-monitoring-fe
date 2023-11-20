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
import { Spin, Tag } from 'antd';

const columns: ColumnsType<IEquipment> = [
  {
    title: 'Mã thiết bị',
    dataIndex: 'id',
    key: 'id',
    render: (id, record, index) => <p key={index}>{id}</p>,
  },

  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status, record, index) => (
      <Tag key={index} color={status === 'INACTIVE' ? 'volcano' : 'green'}>
        {status === 'INACTIVE' ? 'Đang tắt' : 'Đang hoạt động'}
      </Tag>
    ),
  },
  {
    title: 'Tên bệnh nhân',
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
    const response = await axios.get(
      'https://patient-monitoring.site/api/equipments',
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
    // <Spin spinning>
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
    // </Spin>
  );
};
