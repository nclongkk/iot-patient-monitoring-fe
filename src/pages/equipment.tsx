import {
  Breadcrumb,
  Button,
  Descriptions,
  DescriptionsProps,
  Flex,
  Select,
  Tag,
  Typography,
  message,
} from 'antd';
import { useAtom } from 'jotai';
import {
  heartbeatState,
  spo2State,
  statusEquipmentState,
} from '../atoms/socketData';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import HeartbeatChart from '../components/heartbeatChart';
import SPO2Chart from '../components/SPO2Chart';
import { AuditOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import axios from '../api/axiosService';
import { IPatient } from '../types/patient';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchEquipment } from '../api/equipmentService';
import { fetchPatients } from '../api/patientService';
const { Title } = Typography;

export const Equipment = () => {
  const { pathname } = useLocation();

  const { data: equipment } = useQuery('equipment', () =>
    fetchEquipment(pathname.split('/')[2]),
  );

  const [heartbeatData, setHeartbeatData] = useAtom(heartbeatState);
  const [spo2Data, setSPO2Data] = useAtom(spo2State);
  const [isUpdate, setIsUpdate] = useState(false);

  const [updatedPatient, setUpdatedPatient] = useState(equipment?.patient);

  const [statusEquipment, setStatusEquipment] = useAtom(statusEquipmentState);

  const { data: patientsData } = useQuery('patients', () =>
    fetchPatients(1, 100),
  );

  useEffect(() => {
    if (!equipment?.id) return;
    const socket = io('https://patient-monitoring.site/socket.io');

    // Handle connect event
    socket.on('connect', () => {
      console.log(' Connected to the server');
    });

    socket.on('equipment-status', (data) => {
      if (data?.id === equipment.id && data?.status === 'ACTIVE') {
        setStatusEquipment('ACTIVE');

        const MAX_DATA = 200;
        socket.on(`sensor-data/${equipment.id}`, (data) => {
          const time = dayjs(data.timestamp).format('HH:m:ss');
          heartbeatData.slice(heartbeatData.length - 5);
          setHeartbeatData((previousState) => [
            ...(previousState.length > MAX_DATA
              ? previousState.slice(previousState.length - MAX_DATA)
              : previousState),
            { heartbeat: data.heartbeat, time },
          ]);
          setSPO2Data((previousState) => [
            ...(previousState.length > MAX_DATA
              ? previousState.slice(previousState.length - MAX_DATA)
              : previousState),
            { spo2: data.spo2, time },
          ]);
        });
      } else if (data?.id !== equipment.id || data?.status !== 'ACTIVE') {
        setStatusEquipment('INACTIVE');
      }
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log(' Disconnected from the server');
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      console.log(' Cleanup');

      setHeartbeatData([]);
      setSPO2Data([]);
    };
  }, [equipment?.id]);

  if (!equipment) return null;

  const getPatientInfoItems = (
    patient: IPatient,
  ): DescriptionsProps['items'] => [
    {
      key: '1',
      label: 'Mã bệnh nhân',
      children: patient.id,
    },
    {
      key: '2',
      label: 'Giới tính',
      children: (
        <Tag color={patient.gender === 'male' ? '#108ee9' : '#f50'}>
          {patient.gender === 'male' ? 'Nam' : 'Nữ'}
        </Tag>
      ),
    },
    {
      key: '3',
      label: 'Tên bệnh nhân',
      children: patient.name,
    },
    {
      key: '4',
      label: 'Tuổi',
      children: patient.age,
    },
  ];
  const equipmentInfo: DescriptionsProps['items'] = [
    {
      key: '1',
      label: <b>Mã thiết bị</b>,
      children: equipment.id,
    },
    {
      key: '2',

      label: <b>Trạng thái</b>,
      children: (
        <Tag color={statusEquipment === 'INACTIVE' ? 'volcano' : 'green'}>
          {statusEquipment === 'INACTIVE' ? 'Đang tắt' : 'Đang hoạt động'}
        </Tag>
      ),
    },
    {
      key: '3',
      label: (
        <div>
          <b style={{ marginRight: '12px' }}>Thông tin bệnh nhân</b>
          {isUpdate ? (
            <Button
              style={{ backgroundColor: '#52c41a' }}
              type="primary"
              onClick={() => {
                if (
                  equipment.patient &&
                  updatedPatient &&
                  equipment.patient?.id !== updatedPatient.id
                ) {
                  handleUpdatePatientOfEquipment(updatedPatient.id);
                } else {
                  setIsUpdate(false);
                }
              }}
            >
              Lưu
              <SaveOutlined />
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setIsUpdate(true);
              }}
            >
              Cập nhật
              <EditOutlined />
            </Button>
          )}
        </div>
      ),
      span: 2,
      children: (
        <Flex gap={'large'} vertical>
          {isUpdate && (
            <Flex align={'center'} gap={'large'}>
              <Title level={5} style={{ marginBottom: 0 }}>
                Chọn mã bệnh nhân cần cập nhật:
              </Title>
              <Select
                size={'large'}
                defaultValue={updatedPatient?.id}
                onChange={(value) => {
                  setUpdatedPatient(
                    patientsData?.patients.find((item) => item.id === value),
                  );
                }}
                options={patientsData?.patients.map((item) => ({
                  value: item.id,
                  label: `${item.id} - ${item.name}`,
                }))}
                style={{ width: '300px' }}
              />
            </Flex>
          )}
          <Descriptions
            column={2}
            items={getPatientInfoItems(updatedPatient ?? equipment.patient)}
          />
        </Flex>
      ),
    },
  ];

  const handleUpdatePatientOfEquipment = async (patientId: number) => {
    try {
      const response = await axios.post(
        `https://patient-monitoring.site/api/equipments/${equipment.id}/patient/${patientId}`,
      );

      if (response.data.status === 'success') {
        message.success('Cập nhật thành công!!');
        setIsUpdate(false);
      }
    } catch (error) {
      message.error('Cập nhật thất bại!');
    }
  };
  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: (
              <Link to="/equipments">
                <AuditOutlined style={{ marginRight: '6px' }} />
                Danh sách thiết bị
              </Link>
            ),
          },
          {
            title: 'Thông tin thiết bị',
          },
        ]}
      />
      <Descriptions
        bordered
        items={equipmentInfo}
        column={2}
        layout="vertical"
        style={{ marginBottom: '14px' }}
      />
      {heartbeatData.length > 0 && (
        <>
          <Title level={3}>Biểu đồ nhịp tim</Title>
          <HeartbeatChart />
        </>
      )}
      {spo2Data.length > 0 && (
        <>
          <Title level={3}>Biểu đồ nồng độ oxi trong máu</Title>
          <SPO2Chart />
        </>
      )}
    </div>
  );
};
