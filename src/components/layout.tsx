import { Layout as AntLayout, Menu, MenuProps, Typography, theme } from 'antd';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      onClick: () => {
        navigate(`/`);
      },
    },
    {
      key: 'equipments',
      label: 'Equipments',
      onClick: () => {
        navigate(`/equipments`);
      },
    },
    {
      key: 'patients',
      label: 'Patients',
      onClick: () => {
        navigate(`/patients`);
      },
    },
  ];

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []);
  if (!localStorage.getItem('token')) return null;

  return (
    <AntLayout style={{ minHeight: '100vh', height: '100%' }}>
      <Header
        style={{ padding: 10, background: colorBgContainer }}
        title="My App"
      >
        <Title style={{ marginBottom: '24px' }}>My App</Title>
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
              background: colorBgContainer,
              overflow: 'auto',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </AntLayout>

      {/* <Footer style={{ textAlign: 'center' }}>Footer</Footer> */}
    </AntLayout>
  );
};

export default Layout;
