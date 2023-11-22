import { useNavigate } from 'react-router-dom';
import Table, { ColumnsType } from 'antd/es/table';
import { IEquipment } from '../types/equipment';
import { Spin, Tag } from 'antd';
import { useQuery } from 'react-query';
import { fetchEquipments } from '../api/equipmentService';

const columns: ColumnsType<IEquipment> = [
  {
    title: 'Mã thiết bị',
    dataIndex: 'id',
    key: 'id',
    render: (id, record) => <p key={record.id}>{id}</p>,
  },

  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status, record) => (
      <Tag key={record.id} color={status === 'INACTIVE' ? 'volcano' : 'green'}>
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
  const navigate = useNavigate();

  const { data, isLoading } = useQuery('equipments', fetchEquipments);

  const rowClassName = () => {
    return 'cursorPointer';
  };

  return (
    <Spin spinning={isLoading}>
      <Table
        size="small"
        columns={columns}
        rowClassName={rowClassName}
        dataSource={data}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/equipments/${record.id}`);
            },
          };
        }}
      />
    </Spin>
  );
};
