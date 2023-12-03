import {
  Breadcrumb,
  Col,
  DatePicker,
  Descriptions,
  DescriptionsProps,
  Empty,
  Flex,
  Row,
  Tag,
  Typography,
} from 'antd';
import { useAtom } from 'jotai';
import {
  HeartBeat,
  SPO2,
  heartbeatState,
  spo2State,
} from '../atoms/socketData';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import HeartbeatChart from '../components/heartbeatChart';
import SPO2Chart from '../components/SPO2Chart';
import { AuditOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchEquipment, fetchEquipmentHistory } from '../api/equipmentService';
import { RangePickerProps } from 'antd/es/date-picker';
const { Title } = Typography;
const { RangePicker } = DatePicker;

export const EquipmentHistory = () => {
  const { pathname } = useLocation();
  const [startValue, setStartValue] = useState(dayjs().subtract(3, 'day'));
  const [endValue, setEndValue] = useState(dayjs());

  const { data: equipment } = useQuery('equipment', () =>
    fetchEquipment(pathname.split('/')[3]),
  );
  const { data: equipmentHistory } = useQuery(
    ['equipmentHistory', startValue, endValue],
    () =>
      fetchEquipmentHistory(startValue.toISOString(), endValue.toISOString()),
  );
  console.log(equipmentHistory);

  const [heartbeatData, setHeartbeatData] = useAtom(heartbeatState);
  const [spo2Data, setSPO2Data] = useAtom(spo2State);

  useEffect(() => {
    if (!equipment?.id) return;
    const hearBeatResult: HeartBeat[] = [];
    const spo2Result: SPO2[] = [];
    equipmentHistory?.length &&
      equipmentHistory.forEach((element) => {
        const time = dayjs(element.timestamp).format('HH:mm');
        hearBeatResult.push({ heartbeat: element.heartbeat, time });
        spo2Result.push({ spo2: element.spo2, time });
      });
    setHeartbeatData(hearBeatResult);
    setSPO2Data(spo2Result);
  }, [equipment?.id, equipmentHistory]);

  if (!equipment) return null;

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
        <Tag color={equipment.status === 'INACTIVE' ? 'volcano' : 'green'}>
          {equipment.status === 'INACTIVE' ? 'Đang tắt' : 'Đang hoạt động'}
        </Tag>
      ),
    },
  ];

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
  };

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledRangeTime: RangePickerProps['disabledTime'] = (
    selectedDateTime,
  ) => {
    if (selectedDateTime?.isSame(dayjs(), 'day'))
      return {
        disabledHours: () => range(dayjs().hour() + 1, 24),
        disabledMinutes: () => range(dayjs().minute() + 1, 60),
      };
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
    };
  };

  const handleStartDateChange = (value: dayjs.Dayjs) => {
    setStartValue(value);
  };

  const handleEndDateChange = (value: dayjs.Dayjs) => {
    setEndValue(value);
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
            title: 'Lịch sử dữ liệu của thiết bị',
          },
        ]}
      />

      <Row gutter={16}>
        <Col span={12}>
          <Flex
            gap={'medium'}
            vertical
            style={{ marginTop: 14, marginBottom: 14 }}
          >
            <Title level={5}>Chọn khoảng thời gian:</Title>
            <RangePicker
              placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
              format="DD-MM-YYYY HH:mm"
              disabledDate={disabledDate}
              disabledTime={disabledRangeTime}
              showTime
              defaultValue={[dayjs().subtract(3, 'day'), dayjs()]}
              onChange={(dates) => {
                handleStartDateChange(dates?.[0]);
                handleEndDateChange(dates?.[1]);
              }}
            />
          </Flex>
        </Col>
        <Col span={12}>
          <Descriptions
            bordered
            items={equipmentInfo}
            column={2}
            layout="vertical"
            size="small"
          />
        </Col>
      </Row>

      <Title level={3}>Biểu đồ nhịp tim</Title>
      {heartbeatData.length > 0 ? (
        <HeartbeatChart />
      ) : (
        <Empty description="Không có dữ liệu" />
      )}

      <Title level={3}>Biểu đồ nồng độ oxi trong máu</Title>
      {spo2Data.length > 0 ? (
        <SPO2Chart />
      ) : (
        <Empty description="Không có dữ liệu" />
      )}
    </div>
  );
};
