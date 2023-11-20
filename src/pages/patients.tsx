import { useAtom } from 'jotai';
import { useEffect } from 'react';
import axios from '../api/axiosService';
import Table, { ColumnsType } from 'antd/es/table';
import { Button, Flex, Space, Spin, Tag, message } from 'antd';
import useSelectPatient, {
  isOpenModalAtom,
  paginationInfoState,
  setPaginationInfoState,
} from '../atoms/patient';
import { IPatient } from '../types/patient';
import { PatientFormModal } from '../components/patientFormModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { fetchPatients } from '../api/patientsService';

export const Patients = () => {
  const [, setSelectedPatient] = useSelectPatient();

  const [paginationInfo] = useAtom(paginationInfoState);
  const [, setPaginationInfo] = useAtom(setPaginationInfoState);

  const [, setIsOpenModal] = useAtom(isOpenModalAtom);

  const { data, isLoading, isError, refetch } = useQuery(
    ['patients', paginationInfo.current],
    () => fetchPatients(paginationInfo.current),
  );
  useEffect(() => {
    return setPaginationInfo({ current: 1, total: 0, pageSize: 10 });
  }, []);

  const handleDeletePatient = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://patient-monitoring.site/api/patients/${id}`,
      );

      if (response.data.status === 'success') {
        message.success('Xoá bệnh nhân thành công!');
        refetch();
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error('Xoá bệnh nhân thất bại!');
    }
  };

  const columns: ColumnsType<IPatient> = [
    {
      title: 'Mã bệnh nhân',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <p>{id}</p>,
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <p>{name}</p>,
    },

    {
      title: 'Giới tính',
      key: 'gender',
      dataIndex: 'gender',
      render: (gender: string) => (
        <Tag color={gender === 'male' ? '#108ee9' : '#f50'}>
          {gender === 'male' ? 'Nam' : 'Nữ'}
        </Tag>
      ),
    },
    {
      title: 'Tuổi',
      key: 'age',
      dataIndex: 'age',
      render: (age) => <p>{age}</p>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: '#0976c4' }}
            onClick={() => {
              setSelectedPatient(record);
              setIsOpenModal(true);
            }}
          />
          <DeleteOutlined
            style={{ color: '#f5222d' }}
            onClick={() => handleDeletePatient(record.id)}
          />
        </Space>
      ),
    },
  ];
  return (
    <Flex vertical gap="large">
      <Flex>
        <Button
          type="primary"
          onClick={() => {
            setIsOpenModal(true);
            setSelectedPatient(undefined);
          }}
        >
          <PlusOutlined />
          Thêm bệnh nhân
        </Button>
      </Flex>
      <Spin spinning={isLoading}>
        <Table
          size="small"
          columns={columns}
          dataSource={data?.patients}
          pagination={{
            ...{
              current: data?.paging.page,
              defaultCurrent: data?.paging.limit,
              total: data?.paging.total,
            },
            onChange(page, pageSize) {
              setPaginationInfo({ ...paginationInfo, current: page });
            },
          }}
        />
        <PatientFormModal />
      </Spin>
    </Flex>
  );
};
