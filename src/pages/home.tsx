import { AuditOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Steps,
  Typography,
  message,
  theme,
} from 'antd';
import axios, { setAuthToken } from '../api/axiosService';
import { useEffect, useState } from 'react';
import {
  StatisticType,
  addStatisticState,
  statisticState,
} from '../atoms/statistics';
const { Title } = Typography;

import { useAtom } from 'jotai';
import step1 from '../assets/step1.png';
import step2 from '../assets/step2.png';
import step3 from '../assets/step3.png';
import step4 from '../assets/step4.png';

const steps = [
  {
    title: 'Bật công tắc khởi động thiết bị',
    content: (
      <img
        height={'100%'}
        width={'60%'}
        style={{
          borderRadius: 8,
          borderColor: '##001529',
          borderStyle: 'solid',
        }}
        alt="Bật công tắc khởi động thiết bị"
        src={step1}
      />
    ),
  },
  {
    title: 'Sử dụng điện thoại kết nối với thiết bị',
    content: (
      <img
        height={'100%'}
        style={{
          borderRadius: 8,
          borderColor: '##001529',
          borderStyle: 'solid',
        }}
        alt="Bật công tắc khởi động thiết bị"
        src={step2}
      />
    ),
  },
  {
    title: 'Thiết lập wifi cho thiết bị',
    content: (
      <img
        height={'100%'}
        style={{
          borderRadius: 8,
          borderColor: '##001529',
          borderStyle: 'solid',
        }}
        alt="Bật công tắc khởi động thiết bị"
        src={step3}
      />
    ),
  },
  {
    title: 'Gắn thiết bị vào đầu ngón tay',
    content: (
      <img
        height={'100%'}
        width={'60%'}
        style={{
          borderRadius: 8,
          borderColor: '##001529',
          borderStyle: 'solid',
        }}
        alt="Bật công tắc khởi động thiết bị"
        src={step4}
      />
    ),
  },
];
export const Home = () => {
  const { token } = theme.useToken();
  const [statisticData] = useAtom(statisticState);
  const [, setStatisticData] = useAtom(addStatisticState);

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    padding: 16,
    marginTop: 16,
    height: 'calc(100vh / 2)',
  };

  const fetchEquipments = async () => {
    const response = await axios.get(
      'https://patient-monitoring.site/api/statistics',
    );

    const data = (await response.data.data) as StatisticType;
    setStatisticData(data);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px', marginTop: '-24px' }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Số lượng thiết bị đang hoạt động"
              value={statisticData.totalActiveEquipments}
              valueStyle={{ color: '#3f8600' }}
              prefix={<AuditOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng số thiết bị"
              value={statisticData.totalEquipments}
              valueStyle={{ color: '#1326cf' }}
              prefix={<AuditOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng số bệnh nhân"
              value={statisticData.totalPatients}
              valueStyle={{ color: '#1326cf' }}
              prefix={<UsergroupAddOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <>
        <Title level={3} style={{ marginBottom: '16px' }}>
          Hướng dẫn thiết lập thiết bị
        </Title>
        <Steps
          current={current}
          items={items}
          onChange={(e) => {
            setCurrent(e);
          }}
        />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Bước tiếp theo
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success('Hoàn thành hướng dẫn!')}
            >
              Hoàn thành việc thiết lập
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Quay lại bước trước
            </Button>
          )}
        </div>
      </>
    </div>
  );
};
