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
import useSelectEquipment, { equipmentsState } from '../atoms/equipment';
import { useAtom } from 'jotai';
import {
  heartbeatState,
  spo2State,
  statusEquipmentState,
} from '../atoms/socketData';
import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import HeartbeatChart from '../components/heartbeatChart';
import SPO2Chart from '../components/SPO2Chart';
import { AuditOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import useSelectPatient, {
  addAllPatients,
  patientsState,
  selectPatient,
} from '../atoms/patient';
import axios, { setAuthToken } from '../api/axiosService';
import { IPatient } from '../types/patient';
import { Link } from 'react-router-dom';
const { Title } = Typography;

export const Equipment = () => {
  const [selectedEquipment] = useSelectEquipment();
  const [equipments] = useAtom(equipmentsState);
  console.log({ equipments });

  const [heartbeatData, setHeartbeatData] = useAtom(heartbeatState);
  const [spo2Data, setSPO2Data] = useAtom(spo2State);
  const [isUpdate, setIsUpdate] = useState(false);

  const [statusEquipment, setStatusEquipment] = useAtom(statusEquipmentState);

  const [, addPatients] = useAtom(addAllPatients);
  const [patients] = useAtom(patientsState);
  const [selectedPatient] = useAtom(selectPatient);
  const [, setSelectPatient] = useSelectPatient();

  useEffect(() => {
    if (!selectedEquipment?.id) return;
    const socket = io('http://14.225.207.82:3000/api/socket');

    // Handle connect event
    socket.on('connect', () => {
      console.log(' Connected to the server');
    });

    socket.on('equipment-status', (data) => {
      if (data?.id === selectedEquipment.id && data?.status === 'ACTIVE') {
        setStatusEquipment('ACTIVE');

        const MAX_DATA = 100;
        socket.on(`sensor-data/${selectedEquipment.id}`, (data) => {
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
      } else if (
        data?.id !== selectedEquipment.id ||
        data?.status !== 'ACTIVE'
      ) {
        setStatusEquipment('INACTIVE');
        // setHeartbeatData([]);
        // setSPO2Data([]);
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
  }, []); // Empty dependency array ensures that this effect runs only once

  const fetchPatients = useCallback(async () => {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(
      `http://14.225.207.82:3000/api/patients?limit=100`,
    );

    const data = await response.data.data;

    addPatients(data.data);
  }, [addPatients]);

  useEffect(() => {
    fetchPatients();
    return () => {
      setSelectPatient(undefined);
    };
  }, []);

  if (!selectedEquipment) return null;
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
      label: (
        <p>
          <b>Mã thiết bị</b>
        </p>
      ),
      children: selectedEquipment.id,
    },
    {
      key: '2',

      label: (
        <p>
          <b>Trạng thái</b>
        </p>
      ),
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
                  selectedPatient &&
                  selectedPatient?.id !== selectedEquipment?.patient.id
                ) {
                  handleUpdatePatientOfEquipment(selectedPatient.id);
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
                defaultValue={selectedEquipment.patient.id}
                onChange={(value) => {
                  setSelectPatient(patients.find((item) => item.id === value));
                }}
                options={patients.map((item) => ({
                  value: item.id,
                  label: `${item.id} - ${item.name}`,
                }))}
                style={{ width: '300px' }}
              />
            </Flex>
          )}
          <Descriptions
            column={2}
            items={getPatientInfoItems(
              selectedPatient ? selectedPatient : selectedEquipment.patient,
            )}
          />
        </Flex>
      ),
    },
  ];

  const handleUpdatePatientOfEquipment = async (patientId: number) => {
    try {
      const response = await axios.post(
        `http://14.225.207.82:3000/api/equipments/${selectedEquipment.id}/patient/${patientId}`,
      );

      // Handle the response as needed
      console.log('API Response:', patientId, response.data);
      if (response.data.status === 'success') {
        console.log('here');

        message.success('Cập nhật thành công!!');
        setIsUpdate(false);
      }
    } catch (error) {
      console.error('API Error:', error);
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
          <Title level={3}> Heartbeat Chart</Title>
          <HeartbeatChart />
        </>
      )}
      {spo2Data.length > 0 && (
        <>
          <Title level={3}> SPO2 Chart</Title>
          <SPO2Chart />
        </>
      )}
    </div>
  );
};
