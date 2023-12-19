import { useNavigate } from 'react-router-dom';
import Table, { ColumnsType } from 'antd/es/table';
import { IEquipment } from '../types/equipment';
import { Button, Spin, Tag } from 'antd';
import { useQuery } from 'react-query';
import { fetchEquipments } from '../api/equipmentService';

export const Equipments = () => {
  const navigate = useNavigate();
  const columns: ColumnsType<IEquipment> = [
    {
      title: 'Mã thiết bị',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => <p key={record.id}>{id}</p>,
      onCell: (record) => {
        return {
          onClick: (e) => {
            e.preventDefault();
            navigate(`/equipments/${record.id}`);
          },
        };
      },
    },

    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status, record) => (
        <Tag
          key={record.id}
          color={status === 'INACTIVE' ? 'volcano' : 'green'}
        >
          {status === 'INACTIVE' ? 'Đang tắt' : 'Đang hoạt động'}
        </Tag>
      ),
      onCell: (record) => {
        return {
          onClick: (e) => {
            e.preventDefault();
            navigate(`/equipments/${record.id}`);
          },
        };
      },
    },
    {
      title: 'Tên bệnh nhân',
      key: 'patient',
      dataIndex: 'patient',
      render: (index, { patient }) => <p key={index}>{patient.name}</p>,
      onCell: (record) => {
        return {
          onClick: (e) => {
            e.preventDefault();
            navigate(`/equipments/${record.id}`);
          },
        };
      },
    },
    {
      title: 'Lịch sử dữ liệu',
      key: 'history',
      render: (_index, record) => (
        <Button
          type="link"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/equipments/history/${record.id}`);
          }}
        >
          Xem chi tiết
        </Button>
      ),
      onCell: (record) => {
        return {
          onClick: (e) => {
            e.preventDefault();
            navigate(`/equipments/history/${record.id}`);
          },
        };
      },
    },
  ];
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
      />
    </Spin>
  );
};
