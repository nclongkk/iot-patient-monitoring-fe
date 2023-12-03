import {
  AuditOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import {
  Layout as AntLayout,
  Avatar,
  Button,
  Dropdown,
  Menu,
  MenuProps,
  Typography,
  theme,
} from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api/axiosService';
const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
