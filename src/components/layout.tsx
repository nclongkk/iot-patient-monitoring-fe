import {
  AuditOutlined,
  BellOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import {
  Layout as AntLayout,
  Avatar,
  Badge,
  Button,
  Dropdown,
  Menu,
  MenuProps,
  Typography,
  notification,
  theme,
} from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios, { setAuthToken } from '../api/axiosService';
import Notifications from './notificationList';
import { useEffect, useState } from 'react';
import { fetchNotifications } from '../api/notificationService';
import useSocket from '../hook/useSocket';
import { useAtom } from 'jotai';
import {
  heartbeatState,
  spo2State,
  statusEquipmentState,
} from '../atoms/socketData';
import dayjs from 'dayjs';
import notificationSound from '../assets/notification-sound.mp3';
const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [totalNewNotifications, setTotalNewNotifications] = useState<number>(0);
  const [, setHeartbeatData] = useAtom(heartbeatState);
  const [, setSPO2Data] = useAtom(spo2State);
  const [, setStatusEquipment] = useAtom(statusEquipmentState);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const markReadNotifications = async () => {
    try {
      const response = await axios.patch(
        'https://patient-monitoring.site/api/notifications/read',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      setTotalNewNotifications(0);
      if (!response) {
        throw new Error('Network response was not ok');
      }

      const userData = response.data.data;
      setUser(userData);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching user data:', error);
      throw error;
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        'https://patient-monitoring.site/api/auth/me',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      if (!response) {
        throw new Error('Network response was not ok');
      }

      const userData = response.data.data;
      setUser(userData);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const playSound = () => {
    new Audio(notificationSound).play();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user?.lastReadNotificationAt) return;
    fetchNotifications({ toDate: user.lastReadNotificationAt }).then(
      (newNotifications) => {
        setNotifications(newNotifications);
        setTotalNewNotifications(newNotifications.length);
      },
    );
  }, [user]);

  function getEquipmentIdFromPathname() {
    const pathParts = pathname.split('/');
    if (/equipment-/.test(pathParts[pathParts.length - 1])) {
      return pathParts[pathParts.length - 1];
    }
    return;
  }
  const { onEvent } = useSocket();

  useEffect(() => {
    onEvent('equipment-status', (data: any) => {
      const equipmentId = getEquipmentIdFromPathname();
      if (!equipmentId) return;
      if (data?.id === equipmentId && data?.status === 'ACTIVE') {
        setStatusEquipment('ACTIVE');
      } else if (data?.id !== equipmentId || data?.status !== 'ACTIVE') {
        setStatusEquipment('INACTIVE');
      }
    });
  }, []);

  useEffect(() => {
    const equipmentId = getEquipmentIdFromPathname();
    if (!equipmentId) return;
    onEvent(`sensor-data/${equipmentId}`, (data: any) => {
      const MAX_DATA = 200;
      const time = dayjs(data.timestamp).format('HH:m:ss');
      setHeartbeatData((previousState: any) => [
        ...(previousState.length > MAX_DATA
          ? previousState.slice(previousState.length - MAX_DATA)
          : previousState),
        { heartbeat: data.heartbeat, time },
      ]);
      setSPO2Data((previousState: any) => [
        ...(previousState.length > MAX_DATA
          ? previousState.slice(previousState.length - MAX_DATA)
          : previousState),
        { spo2: data.spo2, time },
      ]);
    });
  }, []);

  useEffect(() => {
    onEvent('notification', (data: any) => {
      notification.warning({
        message: 'Cảnh báo',
        description: data.message,
        onClick: () => {
          navigate(`equipments/${data.equipment?.id}`);
        },
      });
      playSound();
      setNotifications((prev) => [data, ...prev]);
      setTotalNewNotifications((prev) => prev + 1);
    });
  }, []);

  const profileItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: (
        <Button
          type="link"
          onClick={() => {
            localStorage.removeItem('token');
            setAuthToken(null);
            navigate('/login');
          }}
        >
          <LogoutOutlined />
          Đăng xuất
        </Button>
      ),
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      onClick: () => {
        navigate(`/`);
      },
      icon: <HomeOutlined />,
    },
    {
      key: 'equipments',
      label: 'Thiết bị',
      onClick: () => {
        navigate(`/equipments`);
      },
      icon: <AuditOutlined />,
    },
    {
      key: 'patients',
      label: 'Bệnh nhân',
      onClick: () => {
        navigate(`/patients`);
      },
      icon: <UsergroupAddOutlined />,
    },
  ];

  if (!localStorage.getItem('token')) navigate('/login');

  return (
    <AntLayout style={{ minHeight: '100vh', height: '100%' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 10,
          background: colorBgContainer,
          justifyContent: 'space-between',
        }}
        title="Hệ thống giám sát bệnh nhân"
      >
        <Title style={{ marginBottom: 0 }}>Hệ thống giám sát bệnh nhân</Title>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: 10,
            justifyContent: 'space-between',
          }}
        >
          <Dropdown
            overlay={
              <Notifications
                notifications={notifications}
                setNotifications={setNotifications}
                user={user}
              />
            }
            placement="bottomRight"
            trigger={['click']}
            onOpenChange={(open) => {
              if (!open) markReadNotifications();
            }}
          >
            <Badge count={totalNewNotifications}>
              <Button type="default" shape="circle">
                <BellOutlined />
              </Button>
            </Badge>
          </Dropdown>
          <Dropdown menu={{ items: profileItems }}>
            <div style={{ marginLeft: '16px' }}>
              <Avatar size="large" icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </div>
      </Header>
      <AntLayout hasSider style={{ height: '100%' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <Menu
            style={{ padding: '24px 8px' }}
            theme="dark"
            mode="inline"
            selectedKeys={[pathname.split('/')[1] || 'dashboard']}
            items={menuItems}
          />
        </Sider>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: '100%',
              background: pathname === '/' ? 'transparent' : colorBgContainer,
              overflow: 'auto',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
