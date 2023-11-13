import { Card, Col, Row, Tag, Typography } from 'antd';
import useSelectEquipment from '../atoms/equipment';
import { useAtom } from 'jotai';
import {
  heartbeatState,
  spo2State,
  statusEquipmentState,
} from '../atoms/socketData';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import HeartbeatChart from '../components/heartbeatChart';
import SPO2Chart from '../components/SPO2Chart';
const { Title } = Typography;

export const Equipment = () => {
  const [selectedEquipment] = useSelectEquipment();

  const [heartbeatData, setHeartbeatData] = useAtom(heartbeatState);
  const [spo2Data, setSPO2Data] = useAtom(spo2State);

  const [statusEquipment, setStatusEquipment] = useAtom(statusEquipmentState);
  useEffect(() => {
    if (!selectedEquipment?.id) return;
    const socket = io('http://14.225.207.82:3000');

    // Handle connect event
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('equipment-status', (data) => {
      if (data?.id === selectedEquipment.id && data?.status === 'ACTIVE') {
        setStatusEquipment('ACTIVE');

        socket.on(`sensor-data/${selectedEquipment.id}`, (data) => {
          const time = dayjs(data.timestamp).format('HH:mm:ss');

          setHeartbeatData((previousState) => [
            ...previousState,
            { heartbeat: data.heartbeat, time },
          ]);
          setSPO2Data((previousState) => [
            ...previousState,
            { spo2: data.spo2, time },
          ]);
        });
      } else if (
        data?.id !== selectedEquipment.id ||
        data?.status !== 'ACTIVE'
      ) {
        setStatusEquipment('INACTIVE');
        setHeartbeatData([]);
        setSPO2Data([]);
      }
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      setHeartbeatData([]);
      setSPO2Data([]);
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  if (!selectedEquipment) return null;

  return (
    <div>
      <Title level={2}>Equipment Detail</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Equipment Information" type="inner">
            <p>ID:&nbsp;{selectedEquipment.id}</p>
            <p>
              Status:&nbsp;
              <Tag color={statusEquipment === 'INACTIVE' ? 'volcano' : 'green'}>
                {statusEquipment}
              </Tag>
            </p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Patient Information" type="inner">
            <p>ID:&nbsp;{selectedEquipment.patient.id}</p>
            <p>Name:&nbsp;{selectedEquipment.patient.name}</p>
            <p>Gender:&nbsp;{selectedEquipment.patient.gender}</p>
            <p>Age:&nbsp;{selectedEquipment.patient.age}</p>
          </Card>
        </Col>
      </Row>
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
